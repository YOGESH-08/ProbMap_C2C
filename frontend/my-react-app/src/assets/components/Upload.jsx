import React, { useState, useRef } from "react";
import "../Styles/upload.css";
import TextField from "@mui/material/TextField";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import Webcam from "react-webcam";

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
  const [showCamera, setShowCamera] = useState(false);

  const [formData, setFormData] = useState({
    problemType: "",
    description: "",
    photo: null,
  });

  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const webcamRef = useRef(null);

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

  const handleSelectOnMap = () => {
    setShowMap(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
      setPreview(URL.createObjectURL(file));
      setAnalysisResult(null);
    }
  };

  const handleCameraClick = () => {
    setShowCamera(true);
  };

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      // Convert base64 to file
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
          setFormData((prev) => ({ ...prev, photo: file }));
          setPreview(imageSrc);
          setAnalysisResult(null);
          setShowCamera(false);
        });
    }
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
  };

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
      data.append("location", JSON.stringify({
        latitude: location.lat,
        longitude: location.lng,
      }));
      data.append("image", formData.photo);

      const res = await fetch(`${BACKEND_URL}/issue`, {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        throw newError("Failed to create issue");
      }

      const result = await res.json();

      // Reset form
      setFormData({ problemType: "", description: "", photo: null });
      setPreview(null);
      setLocation(null);
      setAddress("");
      setShowMap(false);
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
    } catch (error) {
      console.error("Error in quick analysis:", error);
      alert("Error analyzing image: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "environment" // Use back camera by default
  };

  return (
    <div className="body123 ">
      <div className="container">
        <h1>REPORT PUBLIC PROPERTY DAMAGE</h1>

        <label>Description:</label>
        <br />
        <br />
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
            "& .MuiInput-underline:after": {
              borderBottomColor: "white",
            },
          }}
        />

        {/* Camera Modal */}
        {showCamera && (
          <div style={{
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
            justifyContent: "center"
          }}>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              style={{ width: "100%", maxWidth: "500px", borderRadius: "10px" }}
            />
            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              <button onClick={handleCapture} style={{ padding: "10px 20px", backgroundColor: "#4CAF50", color: "black", border: "none", borderRadius: "5px" }}>
                📸 Capture
              </button>
              <button onClick={handleCloseCamera} style={{ padding: "10px 20px", backgroundColor: "#f44336", color: "black", border: "none", borderRadius: "5px" }}>
                ❌ Close
              </button>
            </div>
          </div>
        )}

        {/* Image Upload/Capture Section */}
        <div style={{ marginTop: "20px" }}>
          <label style={{ display: "block", marginBottom: "10px", color: "white" }}>Upload or Capture Photo:</label>
          
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <button 
              type="button" 
              onClick={() => fileInputRef.current.click()}
              style={{ 
                padding: "10px 15px", 
                backgroundColor: "#2196F3", 
                color: "black", 
                border: "none", 
                borderRadius: "5px",
                cursor: "pointer"
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
                color: "black", 
                border: "none", 
                borderRadius: "5px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}
            >
              <CameraAltIcon style={{ fontSize: "18px" ,color:"black"}} />
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

        {preview && (
          <div style={{ marginTop: "15px", textAlign: "center" }}>
            <img
              src={preview}
              alt="Preview"
              style={{
                width: "100%",
                maxWidth: "300px",
                maxHeight: "200px",
                objectFit: "cover",
                borderRadius: "10px",
                border: "2px solid #ddd"
              }}
            />
            <button 
              onClick={() => {
                setPreview(null);
                setFormData(prev => ({ ...prev, photo: null }));
                setAnalysisResult(null);
              }}
              style={{ 
                marginTop: "10px", 
                padding: "5px 10px", 
                backgroundColor: "#f44336", 
                color: "black", 
                border: "none", 
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Remove Image
            </button>
          </div>
        )}

        {formData.photo && (
          <button 
            type="button" 
            onClick={handleQuickAnalyze}
            style={{ 
              marginTop: "15px", 
              padding: "10px 15px", 
              backgroundColor: "#4CAF50", 
              color: "black", 
              border: "none", 
              borderRadius: "5px",
              cursor: "pointer",
              width: "100%"
            }}
          >
            🔍 Analyze Image
          </button>
        )}

        {analysisResult && (
          <div style={{ 
            marginTop: "15px", 
            padding: "15px", 
            border: "1px solid #ccc",
            borderRadius: "5px",
            color: "black",
            backgroundColor: "#f9f9f9"
          }}>
            <h4 style={{ color: "black", marginBottom: "10px" }}>Image Analysis:</h4>
            <p><strong>Category:</strong> {analysisResult.category}</p>
            <p><strong>Importance:</strong> {analysisResult.importance || "N/A"}</p>
            <p><strong>Cost Estimate:</strong> ${analysisResult.cost_estimate}</p>
            <p><strong>Confidence:</strong> {(analysisResult.confidence * 100).toFixed(1)}%</p>
            <p><strong>Public Property:</strong> {analysisResult.is_public_property ? "Yes" : "No"}</p>
          </div>
        )}

        <div style={{ marginTop: "15px" }}>
          <button type="button" onClick={handleUseCurrentLocation}>
            📍 Use My Current Location
          </button>
          <button type="button" onClick={handleSelectOnMap}>
            🗺️ Select on Map
          </button>
        </div>

        {showMap && (
          <div style={{ height: "300px", marginTop: "15px" }}>
            <MapContainer
              center={[20.5937, 78.9629]} 
              zoom={5}
              style={{ height: "100%", width: "100%" }}
            >
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
      </div>
    </div>
  );
}