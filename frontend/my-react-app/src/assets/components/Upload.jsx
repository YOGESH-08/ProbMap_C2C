// src/assets/components/Upload.jsx
import React, { useState, useRef, useEffect } from "react";
import "../Styles/upload.css";
import TextField from "@mui/material/TextField";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Webcam from "react-webcam";

// Backend URL
const BACKEND_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-backend-app.railway.app"
    : "http://localhost:8000"; 

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Helper to extract district
const extractDistrict = (addressObj) => {
  if (!addressObj) return "Unknown";
  console.log(addressObj);
  return (
    addressObj.state_district ||
    addressObj.county ||
    addressObj.town ||
    addressObj.village ||
    addressObj.hamlet ||
    addressObj.suburb ||  
    addressObj.city || 
    addressObj.state ||
    "Unknown"
  );
};


// Map click handler
// ...imports remain the same

// Map click handler (now receives setFormData)
function LocationPicker({ setLocation, setAddress, setDistrict, setFormData }) {
  useMapEvents({
    async click(e) {
      const coords = { lat: e.latlng.lat, lng: e.latlng.lng };
      setLocation(coords);

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&accept-language=en`
        );
        const data = await res.json();

        const addr = data.display_name || "Unknown location";
        const dist = extractDistrict(data.address);

        setAddress(addr);
        setDistrict(dist);

        // ✅ Also store directly in formData
        setFormData((prev) => ({
          ...prev,
          location: coords,
          district: dist,
          address: addr,
        }));
      } catch {
        setAddress("Unable to fetch address");
        setDistrict("Unknown");
      }
    },
  });
  return null;
}

export default function Upload() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

const [formData, setFormData] = useState({
  problemType: "",
  description: "",
  photo: null,
  location: null,
  district: "",
  address: "",
  adminMessage:"",
});


  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const webcamRef = useRef(null);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(preview);
        } catch {}
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
setFormData((prev) => ({
  ...prev,
  location: coords,
}));
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&accept-language=en`
          );
          const data = await res.json();
          console.log("Addressssss",data.display_name);
          setAddress(data.display_name);
          setDistrict(extractDistrict(data.address));
        } catch {
          setAddress("Unable to fetch address");
          setDistrict("Unknown");
        }
        setShowMap(false);
      },
      (err) => {
        alert("Could not get location: " + err.message);
      }
    );
  };

  const handleSelectOnMap = () => setShowMap(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleFileChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Revoke old preview if exists
  if (preview) URL.revokeObjectURL(preview);

  const blobUrl = URL.createObjectURL(file);
  setFormData(prev => ({ ...prev, photo: file }));
  setPreview(blobUrl);
  setAnalysisResult(null);
};


  const handleCameraClick = () => setShowCamera(true);

  const handleCapture = async () => {
    try {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (!imageSrc) return;
      const res = await fetch(imageSrc);
      const blob = await res.blob();
      const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });

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

  const handleCloseCamera = () => setShowCamera(false);

  const analyzeImage = async (imageFile) => {
    try {
      const payload = new FormData();
      payload.append("image", imageFile);

      const response = await fetch(`${BACKEND_URL}/analyze-image`, {
        method: "POST",
        body: payload,
      });

      if (!response.ok) throw new Error("Image analysis failed");
      return await response.json();
      console.log("analysis: ",)
    } catch (error) {
      console.error("Error analyzing image:", error);
      return {
        category: "Others",
        importance: "Medium",
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
      if (!formData.description || !formData.photo) {
        alert("Please fill all fields and take/upload a photo!");
        return;
      }
      if (!formData.location) {
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
      payload.append("title", analysis.category || "Issue");
      payload.append("description", formData.description);
      payload.append("category", analysis.category || "Others");
      payload.append(
        "location",
        JSON.stringify({ lat: formData.location.lat, lng: formData.location.lng })
      );
      payload.append("district", district || "Unknown");
      payload.append("importance", analysis.importance || "Medium");
      payload.append("cost_estimate", analysis.cost_estimate || "0");
      payload.append("is_public_property", analysis.is_public_property ? "yes" : "no");
      payload.append("image", formData.photo);
      const res = await fetch(`http://localhost:5000/issue`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: payload,
        credentials:"include",
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error("Failed to create issue. " + errText);
      }

      const data = await res.json();
      console.log("Issue Created:", data);

      setFormData({ problemType: "", description: "", photo: null });
      if (preview && preview.startsWith("blob:")) {
        try { URL.revokeObjectURL(preview); } catch {}
      }
      setPreview(null);
      setLocation(null);
      setAddress("");
      setDistrict("");
      setShowMap(false);
      setAnalysisResult(null);
      alert("✅ Issue submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Error submitting issue: " + (err.message || err));
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

  const videoConstraints = { width: 1280, height: 720, facingMode: "environment" };

  return (
    <div className="body123">
      <div className="container">
        <h1>REPORT PUBLIC PROPERTY <span >DAMAGE</span></h1>

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
            "& .MuiInput-underline:hover:before": { borderBottomColor: "white" },
            "& .MuiInput-underline:after": { borderBottomColor: "white" },
            marginTop: 1,
          }}
        />

        {/* Camera */}
        {showCamera && (
          <div
            style={{
              position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: "rgba(0,0,0,0.9)", zIndex: 1000,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
            }}
          >
            <Webcam
              audio={false} ref={webcamRef} screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints} style={{ width: "100%", maxWidth: 500, borderRadius: 10 }}
            />
            <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
              <button
                onClick={handleCapture}
                style={{ padding: "10px 20px", backgroundColor: "#4CAF50", border: "none", borderRadius: 5 }}
              >
                📸 Capture
              </button>
              <button
                onClick={handleCloseCamera}
                style={{ padding: "10px 20px", backgroundColor: "#f44336", border: "none", borderRadius: 5 }}
              >
                ❌ Close
              </button>
            </div>
          </div>
        )}

        {/* Upload / Camera */}
        <div style={{ marginTop: 20 }}>
          <label style={{ display: "block", marginBottom: 10, color: "white" }}>
            Upload or Capture Photo:
          </label>
          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{ padding: "10px 15px", backgroundColor: "#2196F3", border: "none", borderRadius: 5 }}
            >
              📁 Upload Image
            </button>
            <button
              type="button"
              onClick={handleCameraClick}
              style={{ padding: "10px 15px", backgroundColor: "#FF9800", border: "none", borderRadius: 5, display: "flex", alignItems: "center", gap: 5 }}
            >
              <CameraAltIcon style={{ fontSize: 18, color: "black" }} /> Open Camera
            </button>
          </div>
          <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />
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
        border: "2px solid #ddd"
      }}
    />
    <button
      onClick={() => {
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
        setFormData(prev => ({ ...prev, photo: null }));
        setAnalysisResult(null);
      }}
      style={{
        marginTop: 10,
        padding: "5px 10px",
        backgroundColor: "#f44336",
        border: "none",
        borderRadius: 5
      }}
    >
      Remove Image
    </button>
  </div>
)}


        {/* Quick analyze */}
        {formData.photo && (
          <button type="button" onClick={handleQuickAnalyze} style={{ marginTop: 15, padding: "10px 15px", backgroundColor: "#4CAF50", border: "none", borderRadius: 5, width: "100%" }}>
            🔍 Analyze Image
          </button>
        )}

        {/* Analysis result */}
        {analysisResult && (
          <div style={{ marginTop: 15, padding: 15, border: "1px solid #ccc", borderRadius: 5, color: "black", backgroundColor: "#f9f9f9" }}>
            <h4 style={{ marginBottom: 10 }}>Image Analysis:</h4>
            <p><strong>Category:</strong> {analysisResult.category}</p>
            <p><strong>Importance:</strong> {analysisResult.importance || "N/A"}</p>
            <p><strong>Cost Estimate:</strong> ${analysisResult.cost_estimate}</p>
            <p><strong>Confidence:</strong> {((analysisResult.confidence ?? 0) * 100).toFixed(1)}%</p>
            <p><strong>Public Property:</strong> {analysisResult.is_public_property ? "Yes" : "No"}</p>
          </div>
        )}

        {/* Location buttons */}
        <div style={{ marginTop: 15 }}>
          <button type="button" onClick={handleUseCurrentLocation}>📍 Use My Current Location</button>
          <button type="button" onClick={handleSelectOnMap}>🗺 Select on Map</button>
        </div>

        {/* Leaflet Map */}
        {showMap && (
          <div style={{ height: 300, marginTop: 15 }}>
            <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100%", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
              <LocationPicker 
  setLocation={setLocation} 
  setAddress={setAddress} 
  setDistrict={setDistrict} 
  setFormData={setFormData}
/>{formData.location && (
  <Marker position={[formData.location.lat, formData.location.lng]} />
)}


            </MapContainer>
          </div>
        )}

        {/* Show address & district */}
        {address && <p style={{ marginTop: 10, fontStyle: "italic", color: "green" }}>📍 Location: {address}</p>}
        {district && <p style={{ fontStyle: "italic", color: "white" }}>🏢 District: {district}</p>}

        <br />
        <button onClick={handleSubmit} disabled={loading}>{loading ? "⏳ Processing..." : "✅ Submit"}</button>
        <button
          type="reset"
          onClick={() => { setFormData({ problemType: "", description: "", photo: null }); if (preview && preview.startsWith("blob:")) try { URL.revokeObjectURL(preview) } catch {}; setPreview(null); setLocation(null); setAddress(""); setDistrict(""); setShowMap(false); setAnalysisResult(null); }}
          disabled={loading}
        >
          🔄 Reset
        </button>
      </div>
    </div>
  );
}
