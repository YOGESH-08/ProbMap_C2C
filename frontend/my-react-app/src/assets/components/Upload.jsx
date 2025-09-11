// src/assets/components/Upload.jsx
import React, { useState, useRef, useEffect} from "react";
import "../Styles/upload.css";
import TextField from "@mui/material/TextField";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Webcam from "react-webcam";

// Configure backend URL based on environment
const BACKEND_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-backend-app.railway.app"
    : "http://localhost:8000";

// Fix leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function LocationPicker({ setLocation, setAddress }) {
  useMapEvents({
    async click(e) {
      const coords = { lat: e.latlng.lat, lng: e.latlng.lng };
      setLocation(coords);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`
        );
        const data = await res.json();
        setAddress(data.display_name || "Unknown location");
      } catch {
        setAddress("Unable to fetch address");
      }
    },
  });
  return null;
}

export default function Upload() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  const [formData, setFormData] = useState({
    problemType: "",
    description: "",
    photo: null,
  });

  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const webcamRef = useRef(null);

  // cleanup preview blob URL when it changes/unmounts
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(preview);
        } catch (e) {}
      }
    };
  }, [preview]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(coords);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`
          );
          const data = await res.json();
          setAddress(data.display_name || "Unknown location");
        } catch {
          setAddress("Unable to fetch address");
        }
        setShowMap(false);
      },
      (err) => {
        alert("Could not get location: " + err.message);
      }
    );
  };

  const handleSelectOnMap = () => {
    setShowMap(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // revoke previous blob to avoid leaks
    if (preview && preview.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(preview);
      } catch {}
    }
    const blobUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, photo: file }));
    setPreview(blobUrl);
    setAnalysisResult(null);
  };

  const handleCameraClick = () => setShowCamera(true);

  const handleCapture = async () => {
    try {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (!imageSrc) return;
      // convert base64 data URL to blob, then File
      const res = await fetch(imageSrc);
      const blob = await res.blob();
      const file = new File([blob], "camera-capture.jpg", {
        type: "image/jpeg",
      });

      if (preview && preview.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(preview);
        } catch {}
      }
      const blobUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, photo: file }));
      setPreview(blobUrl);
      setAnalysisResult(null);
      setShowCamera(false);
    } catch (err) {
      console.error("capture error:", err);
      alert("Could not capture photo: " + err.message);
    }
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
  };

  // NOTE: renamed localPayload to avoid shadowing state.formData
  const analyzeImage = async (imageFile) => {
    try {
      const payload = new FormData();
      payload.append("image", imageFile);

      const response = await fetch(`${BACKEND_URL}/analyze-image`, {
        method: "POST",
        body: payload,
      });

      if (!response.ok) {
        throw new Error("Image analysis failed");
      }
      return await response.json();
    } catch (error) {
      console.error("Error analyzing image:", error);
      // return fallback so UI doesn't break
      return {
        category: "Others",
        importance: null,
        cost_estimate: "0",
        confidence: 0.7,
        is_public_property: false,
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.problemType || !formData.description || !formData.photo) {
        alert("Please fill all fields and take/upload a photo!");
        return;
      }
      if (!location) {
        alert("Please select or use your location!");
        return;
      }

      const analysis = await analyzeImage(formData.photo);
      setAnalysisResult(analysis);

      if (!analysis.is_public_property) {
        const shouldContinue = window.confirm(
          "This image doesn't appear to show public property damage. Continue?"
        );
        if (!shouldContinue) return;
      }

      const payload = new FormData();
      payload.append("title", formData.problemType);
      payload.append("description", formData.description);
      payload.append(
        "location",
        JSON.stringify({ latitude: location.lat, longitude: location.lng })
      );
      payload.append("image", formData.photo);

      const res = await fetch(`${BACKEND_URL}/issue`, {
        method: "POST",
        body: payload,
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error("Failed to create issue. " + errText);
      }

      await res.json();

      // reset
      setFormData({ problemType: "", description: "", photo: null });
      if (preview && preview.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(preview);
        } catch {}
      }
      setPreview(null);
      setLocation(null);
      setAddress("");
      setShowMap(false);
      setAnalysisResult(null);
      alert("Issue submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error submitting issue: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAnalyze = async () => {
    if (!formData.photo) return alert("Please upload an image first!");
    setLoading(true);
    try {
      const analysis = await analyzeImage(formData.photo);
      setAnalysisResult(analysis);
    } catch (error) {
      console.error(error);
      alert("Error analyzing image: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "environment",
  };

  return (
    <div className="body123">
      <div className="container">
        <h1>REPORT PUBLIC PROPERTY DAMAGE</h1>

        <label>Problem Type:</label>
        <select
          name="problemType"
          value={formData.problemType}
          onChange={handleChange}
          style={{ width: "90%", padding: "8px", marginTop: "6px" }}
        >
          <option value="">Select Problem</option>
          <option>Pothole</option>
          <option>Traffic Signals</option>
          <option>Pipelines</option>
          <option>Drainage</option>
          <option>Street Light</option>
          <option>Public Tap</option>
          <option>Others</option>
        </select>

        <label style={{ marginTop: 12 }}>Description:</label>
        <TextField
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the problem..."
          multiline
          variant="standard"
          sx={{
            width: "90%",
            "& .MuiInputBase-root": { color: "grey" },
            "& .MuiInput-underline:before": { borderBottomColor: "gray" },
            "& .MuiInput-underline:hover:before": {
              borderBottomColor: "white",
            },
            "& .MuiInput-underline:after": { borderBottomColor: "white" },
            marginTop: 1,
          }}
        />

        {/* Camera Modal */}
        {showCamera && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.9)",
              zIndex: 1000,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              style={{ width: "100%", maxWidth: 500, borderRadius: 10 }}
            />
            <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
              <button
                onClick={handleCapture}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#4CAF50",
                  border: "none",
                  borderRadius: 5,
                }}
              >
                📸 Capture
              </button>
              <button
                onClick={handleCloseCamera}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#f44336",
                  border: "none",
                  borderRadius: 5,
                }}
              >
                ❌ Close
              </button>
            </div>
          </div>
        )}

        {/* Upload / Camera Controls */}
        <div style={{ marginTop: 20 }}>
          <label style={{ display: "block", marginBottom: 10, color: "white" }}>
            Upload or Capture Photo:
          </label>

          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: "10px 15px",
                backgroundColor: "#2196F3",
                border: "none",
                borderRadius: 5,
              }}
            >
              📁 Upload Image
            </button>

            <button
              type="button"
              onClick={handleCameraClick}
              style={{
                padding: "10px 15px",
                backgroundColor: "#FF9800",
                border: "none",
                borderRadius: 5,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <CameraAltIcon style={{ fontSize: 18, color: "black" }} />
              Open Camera
            </button>
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>

        {/* Preview */}
        {preview && (
          <div style={{ marginTop: 15, textAlign: "center" }}>
            <img
              src={preview}
              alt="Preview"
              style={{
                width: "100%",
                maxWidth: 300,
                maxHeight: 200,
                objectFit: "cover",
                borderRadius: 10,
                border: "2px solid #ddd",
              }}
            />
            <button
              onClick={() => {
                if (preview && preview.startsWith("blob:")) {
                  try {
                    URL.revokeObjectURL(preview);
                  } catch {}
                }
                setPreview(null);
                setFormData((prev) => ({ ...prev, photo: null }));
                setAnalysisResult(null);
              }}
              style={{
                marginTop: 10,
                padding: "5px 10px",
                backgroundColor: "#f44336",
                border: "none",
                borderRadius: 5,
              }}
            >
              Remove Image
            </button>
          </div>
        )}

        {/* Quick analyze */}
        {formData.photo && (
          <button
            type="button"
            onClick={handleQuickAnalyze}
            style={{
              marginTop: 15,
              padding: "10px 15px",
              backgroundColor: "#4CAF50",
              border: "none",
              borderRadius: 5,
              width: "100%",
            }}
          >
            🔍 Analyze Image
          </button>
        )}

        {/* Analysis results */}
        {analysisResult && (
          <div
            style={{
              marginTop: 15,
              padding: 15,
              border: "1px solid #ccc",
              borderRadius: 5,
              color: "black",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h4 style={{ marginBottom: 10 }}>Image Analysis:</h4>
            <p>
              <strong>Category:</strong> {analysisResult.category}
            </p>
            <p>
              <strong>Importance:</strong> {analysisResult.importance || "N/A"}
            </p>
            <p>
              <strong>Cost Estimate:</strong> ${analysisResult.cost_estimate}
            </p>
            <p>
              <strong>Confidence:</strong>{" "}
              {((analysisResult.confidence ?? 0) * 100).toFixed(1)}%
            </p>
            <p>
              <strong>Public Property:</strong>{" "}
              {analysisResult.is_public_property ? "Yes" : "No"}
            </p>
          </div>
        )}

        <div style={{ marginTop: 15 }}>
          <button type="button" onClick={handleUseCurrentLocation}>
            📍 Use My Current Location
          </button>
          <button type="button" onClick={handleSelectOnMap}>
            🗺 Select on Map
          </button>
        </div>

        {showMap && (
          <div style={{ height: 300, marginTop: 15 }}>
            <MapContainer
              center={[20.5937, 78.9629]}
              zoom={5}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap"
              />
              <LocationPicker
                setLocation={setLocation}
                setAddress={setAddress}
              />
              {location && <Marker position={[location.lat, location.lng]} />}
            </MapContainer>
          </div>
        )}

        {address && (
          <p style={{ marginTop: 10, fontStyle: "italic", color: "green" }}>
            📍 Location: {address}
          </p>
        )}

        <br />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "⏳ Processing..." : "✅ Submit"}
        </button>
        <button
          type="reset"
          onClick={() => {
            setFormData({ problemType: "", description: "", photo: null });
            if (preview && preview.startsWith("blob:")) {
              try {
                URL.revokeObjectURL(preview);
              } catch {}
            }
            setPreview(null);
            setLocation(null);
            setAddress("");
            setShowMap(false);
            setAnalysisResult(null);
          }}
          disabled={loading}
        >
          🔄 Reset
        </button>
      </div>
    </div>
  );
}
