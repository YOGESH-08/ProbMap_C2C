import React, { useState, useRef, useEffect } from "react";
import "../Styles/upload.css";
import TextField from "@mui/material/TextField";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Configure backend URL based on environment
const BACKEND_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-app.railway.app' 
  : 'http://localhost:8000';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
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
      } catch (err) {
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

  const [formData, setFormData] = useState({
    problemType: "",
    description: "",
    photo: null,
  });

  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Webcam state
  const [showWebcam, setShowWebcam] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Webcam setup
  useEffect(() => {
    if (showWebcam) {
      (async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (err) {
          alert("Cannot access webcam: " + err.message);
          setShowWebcam(false);
        }
      })();
    } else {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    }
  }, [showWebcam]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setLocation(coords);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`
        );
        const data = await res.json();
        setAddress(data.display_name || "Unknown location");
      } catch (err) {
        setAddress("Unable to fetch address");
      }
      setShowMap(false);
    });
  };

  const handleSelectOnMap = () => setShowMap(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }));
      setPreview(URL.createObjectURL(file));
      setAnalysisResult(null);
    }
  };

  const handleMobileCameraClick = () => {
    fileInputRef.current.click();
  };

<<<<<<< Updated upstream
  const analyzeImage = async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      
      const response = await fetch(`${BACKEND_URL}/analyze-image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Image analysis failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Error analyzing image:", error);
      return {
        category: "Others",
        importance: null,
        cost_estimate: "0",
        confidence: 0.7,
        is_public_property: false
      };
    }
=======
  const handleCaptureWebcam = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
      const file = new File([blob], "webcam-photo.jpg", { type: "image/jpeg" });
      setFormData(prev => ({ ...prev, photo: file }));
      setPreview(URL.createObjectURL(file));
      setShowWebcam(false);
    }, "image/jpeg");
>>>>>>> Stashed changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.problemType || !formData.description || !formData.photo) {
      alert("Please fill all fields and take/upload a photo!");
      setLoading(false);
      return;
    }
    if (!location) {
      alert("Please select or use your location!");
      setLoading(false);
      return;
    }

    try {
      const analysis = await analyzeImage(formData.photo);
      setAnalysisResult(analysis);

      if (!analysis.is_public_property) {
        const shouldContinue = window.confirm(
          "This image doesn't appear to show public property damage. Do you want to continue with submission?"
        );
        if (!shouldContinue) {
          setLoading(false);
          return;
        }
      }

      const data = new FormData();
      data.append("title", formData.problemType);
      data.append("description", formData.description);
<<<<<<< Updated upstream
      data.append("location", JSON.stringify({
        latitude: location.lat,
        longitude: location.lng,
      }));
=======
      data.append("category", formData.problemType);
      data.append("district", formData.district); 
      data.append(
        "location",
        JSON.stringify({ latitude: location.lat, longitude: location.lng })
      );
>>>>>>> Stashed changes
      data.append("image", formData.photo);

      const res = await fetch(`${BACKEND_URL}/issue`, {
        method: "POST",
        body: data,
<<<<<<< Updated upstream
=======
        credentials: "include",
>>>>>>> Stashed changes
      });

      if (!res.ok) throw new Error("Failed to create issue");

      const result = await res.json();
      alert(`Issue submitted successfully!\n\nAnalysis Results:\n${JSON.stringify(analysis, null, 2)}`);

      // Reset form
      setFormData({ problemType: "", description: "", photo: null });
      setPreview(null);
      setLocation(null);
      setAddress("");
      setShowMap(false);
<<<<<<< Updated upstream
      setAnalysisResult(null);

    } catch (error) {
      console.error(error);
      alert("Error submitting issue: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAnalyze = async () => {
    if (!formData.photo) {
      alert("Please upload an image first!");
      return;
    }

    setLoading(true);
    try {
      const analysis = await analyzeImage(formData.photo);
      setAnalysisResult(analysis);
      alert(`Image Analysis Results:\n${JSON.stringify(analysis, null, 2)}`);
    } catch (error) {
      console.error("Error in quick analysis:", error);
      alert("Error analyzing image: " + error.message);
    } finally {
      setLoading(false);
=======
      setShowWebcam(false);
    } catch (error) {
      console.error(error);
      alert("Error submitting issue: " + error.message);
>>>>>>> Stashed changes
    }
  };

  return (
    <div className="body123">
      <div className="container">
        <h1>REPORT PUBLIC PROPERTY DAMAGE</h1>

        <label>Problem Type:</label>
        <select name="problemType" value={formData.problemType} onChange={handleChange}>
          <option value="">Select Problem</option>
          <option>Pothole</option>
          <option>Traffic Signals</option>
          <option>Pipelines</option>
          <option>Drainage</option>
          <option>Street Light</option>
          <option>Public Tap</option>
          <option>Others</option>
        </select>

        <label>Description:</label>
        <br /><br />
        <TextField
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the problem..."
          multiline
          variant="standard"
          sx={{ width: "90%" }}
        />

        {/* Photo Preview / Upload */}
        <div className="upload-box" onClick={handleMobileCameraClick}>
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}
            />
          ) : (
            <span style={{ color: "rgb(136, 129, 129)", textDecoration: "underline" }}>
              📸 Take a Photo / Upload
            </span>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          capture="camera"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

<<<<<<< Updated upstream
        {formData.photo && (
          <button 
            type="button" 
            onClick={handleQuickAnalyze}
            style={{ marginTop: "10px", backgroundColor: "#4CAF50" }}
          >
            🔍 Analyze Image
          </button>
        )}

        {analysisResult && (
          <div style={{ 
            marginTop: "15px", 
            padding: "10px", 
            border: "1px solid #ccc",
            borderRadius: "5px",
            color:"black",
            backgroundColor: "#f9f9f9"
          }}>
            <h4 style={{ color:"black",}}>Image Analysis:</h4>
            <p><strong>Category:</strong> {analysisResult.category}</p>
            <p><strong>Importance:</strong> {analysisResult.importance || "N/A"}</p>
            <p><strong>Cost Estimate:</strong> ${analysisResult.cost_estimate}</p>
            <p><strong>Confidence:</strong> {(analysisResult.confidence * 100).toFixed(1)}%</p>
            <p><strong>Public Property:</strong> {analysisResult.is_public_property ? "Yes" : "No"}</p>
=======
        {/* Webcam buttons */}
        <div style={{ marginTop: "10px" }}>
          <button type="button" onClick={() => setShowWebcam(true)}>💻 Open Webcam</button>
        </div>

        {showWebcam && (
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <video ref={videoRef} autoPlay style={{ width: "100%", maxHeight: "300px" }} />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <button onClick={handleCaptureWebcam}>📸 Capture</button>
            <button onClick={() => setShowWebcam(false)}>❌ Close</button>
>>>>>>> Stashed changes
          </div>
        )}

        <div style={{ marginTop: "15px" }}>
          <button type="button" onClick={handleUseCurrentLocation}>📍 Use My Current Location</button>
          <button type="button" onClick={handleSelectOnMap}>🗺️ Select on Map</button>
        </div>

        {showMap && (
          <div style={{ height: "300px", marginTop: "15px" }}>
            <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
              />
              <LocationPicker setLocation={setLocation} setAddress={setAddress} />
              {location && <Marker position={[location.lat, location.lng]} />}
            </MapContainer>
          </div>
        )}

        {address && (
          <p style={{ marginTop: "10px", fontStyle: "italic", color: "green" }}>
            📍 Location: {address}
          </p>
        )}

        <br />
<<<<<<< Updated upstream
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "⏳ Processing..." : "✅ Submit"}
        </button>
        <button
          type="reset"
          onClick={() => {
            setFormData({ problemType: "", description: "", photo: null });
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
=======
        <button onClick={handleSubmit}>✅ Submit</button>
        <button type="reset" onClick={() => {
          setFormData({ problemType: "", description: "", photo: null });
          setPreview(null);
          setLocation(null);
          setAddress("");
          setShowMap(false);
          setShowWebcam(false);
        }}>🔄 Reset</button>
>>>>>>> Stashed changes
      </div>
    </div>
  );
}