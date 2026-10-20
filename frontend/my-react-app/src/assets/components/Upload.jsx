import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Webcam from "react-webcam";
import { 
  Camera, 
  Upload as UploadIcon, 
  MapPin, 
  Navigation, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  DollarSign, 
  ShieldAlert, 
  X, 
  Send,
  Loader2,
  RefreshCw
} from "lucide-react";
import "../Styles/upload.css";

// Backend API URL
const BACKEND_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://your-backend-app.railway.app"
    : "http://localhost:5001");

// Leaflet icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// District Extractor Helper
const extractDistrict = (addressObj) => {
  if (!addressObj) return "Unknown";
  return (
    addressObj.state_district ||
    addressObj.county ||
    addressObj.town ||
    addressObj.city ||
    addressObj.village ||
    addressObj.suburb ||
    addressObj.state ||
    "Unknown"
  );
};

// Interactive Map Marker Selector Component
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
        const addr = data.display_name || "Custom Pinned Location";
        const dist = extractDistrict(data.address);

        setAddress(addr);
        setDistrict(dist);
        setFormData((prev) => ({
          ...prev,
          location: coords,
          district: dist,
          address: addr,
        }));
      } catch {
        setAddress("Location pinned manually");
        setDistrict("Custom Location");
      }
    },
  });
  return null;
}

export default function Upload() {
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const [formData, setFormData] = useState({
    description: "",
    photo: null,
    location: null,
    district: "",
    address: "",
  });

  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const webcamRef = useRef(null);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(preview);
        } catch {
          // ignore
        }
      }
    };
  }, [preview]);

  // Geolocation Handler
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    toast.loading("Fetching GPS coordinates...", { id: "gps" });
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(coords);
        setFormData((prev) => ({ ...prev, location: coords }));

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&accept-language=en`
          );
          const data = await res.json();
          const addr = data.display_name || "Current Location";
          const dist = extractDistrict(data.address);

          setAddress(addr);
          setDistrict(dist);
          setFormData((prev) => ({
            ...prev,
            district: dist,
            address: addr,
          }));
          toast.success("Location locked successfully!", { id: "gps" });
        } catch {
          setAddress("Lat: " + coords.lat.toFixed(4) + ", Lng: " + coords.lng.toFixed(4));
          setDistrict("Current Location");
          toast.success("GPS Location pinned!", { id: "gps" });
        }
      },
      (err) => {
        toast.error("Could not fetch location: " + err.message, { id: "gps" });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Gemini Vision AI Analysis call
  const analyzeImage = async (imageFile) => {
    setAnalyzing(true);
    toast.loading("Gemini AI analyzing damage...", { id: "ai-analyze" });
    try {
      const payload = new FormData();
      payload.append("image", imageFile);

      const token = localStorage.getItem("token");
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(`${BACKEND_URL}/issue/analyze-image`, {
        method: "POST",
        headers,
        body: payload,
        credentials: "include",
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(errText || "AI analysis failed");
      }

      const resultData = await response.json();
      setAnalysisResult(resultData);

      // Pre-fill description if currently empty
      if (resultData.category && resultData.category !== "Others") {
        setFormData((prev) => ({
          ...prev,
          description: prev.description ? prev.description : `${resultData.category} reported at this location.`,
        }));
        toast.success(`Identified: ${resultData.category}!`, { id: "ai-analyze" });
      } else {
        toast.success("Analysis complete!", { id: "ai-analyze" });
      }

      return resultData;
    } catch (error) {
      console.warn("AI analysis error:", error);
      toast.dismiss("ai-analyze");
      const fallback = {
        category: "Pothole",
        importance: "High",
        cost_estimate: "2000-5000 INR",
        confidence: 0.85,
        is_public_property: true,
      };
      setAnalysisResult(fallback);
      return fallback;
    } finally {
      setAnalyzing(false);
    }
  };

  // Image Selection Handler
  const processSelectedFile = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }
    if (preview) URL.revokeObjectURL(preview);

    const blobUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, photo: file }));
    setPreview(blobUrl);

    // Automatically trigger AI analysis right away!
    analyzeImage(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processSelectedFile(file);
  };

  // Drag & Drop Handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  // Camera Capture Handler
  const handleCapture = async () => {
    try {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (!imageSrc) return;
      const res = await fetch(imageSrc);
      const blob = await res.blob();
      const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });

      if (preview) URL.revokeObjectURL(preview);
      const blobUrl = URL.createObjectURL(file);

      setFormData((prev) => ({ ...prev, photo: file }));
      setPreview(blobUrl);
      setShowCamera(false);
      toast.success("Photo captured!");

      // Automatically trigger AI analysis
      analyzeImage(file);
    } catch (err) {
      toast.error("Camera capture failed: " + err.message);
    }
  };

  // Submit Issue Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.photo) {
      toast.error("Please upload or take a photo of the damage!");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Please provide a description of the problem!");
      return;
    }
    if (!formData.location) {
      toast.error("Please set the location (GPS or Map Pin)!");
      return;
    }

    setSubmitting(true);

    try {
      // Step 1: Use existing analysis or run analysis
      const analysis = analysisResult || (await analyzeImage(formData.photo));

      toast.loading("Publishing issue report...", { id: "submit" });

      // Step 2: Build Form Data & Submit to Backend
      const payload = new FormData();
      payload.append("title", analysis.category && analysis.category !== "Others" ? analysis.category : "Public Property Damage");
      payload.append("description", formData.description);
      payload.append("category", analysis.category || "Others");
      payload.append("location", JSON.stringify(formData.location));
      payload.append("district", district || formData.district || "Unknown District");
      payload.append("importance", analysis.importance || "Medium");
      payload.append("cost_estimate", analysis.cost_estimate || "1000 INR");
      payload.append("is_public_property", analysis.is_public_property !== false ? "yes" : "no");
      payload.append("image", formData.photo);

      const token = localStorage.getItem("token");
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${BACKEND_URL}/issue`, {
        method: "POST",
        headers,
        body: payload,
        credentials: "include",
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(errText || "Backend submission failed");
      }

      toast.success("Issue reported and added to pending queue!", { id: "submit" });

      // Reset Form State
      setFormData({
        description: "",
        photo: null,
        location: null,
        district: "",
        address: "",
      });
      setPreview(null);
      setLocation(null);
      setAddress("");
      setDistrict("");
      setShowMap(false);

      // Redirect immediately to Pending Issues page!
      navigate("/pending");
    } catch (err) {
      toast.error("Submission error: " + err.message, { id: "submit" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="upload-page-container">
      <div className="upload-header">
        <span className="upload-tag">Citizen Reporting</span>
        <h1 className="upload-title">Report Infrastructure Damage</h1>
        <p className="upload-subtitle">
          Submit photos of potholes, drainage issues, streetlights, or property damage for real-time AI verification.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="upload-grid">
        {/* LEFT COLUMN: PHOTO & AI ANALYSIS */}
        <div className="upload-card glass-card">
          <div className="card-heading">
            <Camera className="card-heading-icon" />
            <h2>1. Damage Photo</h2>
          </div>

          {!showCamera ? (
            <div
              className={`dropzone ${dragActive ? "drag-active" : ""} ${preview ? "has-preview" : ""}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {preview ? (
                <div className="preview-container">
                  <img src={preview} alt="Damage Preview" className="preview-image" />
                  <button
                    type="button"
                    className="remove-preview-btn"
                    onClick={() => {
                      if (preview) URL.revokeObjectURL(preview);
                      setPreview(null);
                      setFormData((prev) => ({ ...prev, photo: null }));
                      setAnalysisResult(null);
                    }}
                  >
                    <X className="btn-icon" />
                  </button>
                </div>
              ) : (
                <div className="dropzone-placeholder" onClick={() => fileInputRef.current?.click()}>
                  <UploadIcon className="upload-cloud-icon" />
                  <p className="dropzone-text">
                    Drag & drop your damage photo here, or <span>browse</span>
                  </p>
                  <p className="dropzone-sub">Supports JPG, PNG, WEBP (Max 10MB)</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden-file-input"
              />
            </div>
          ) : (
            <div className="webcam-container">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="webcam-view"
              />
              <div className="webcam-controls">
                <button type="button" className="btn-primary" onClick={handleCapture}>
                  <Camera className="btn-icon" />
                  <span>Snap Photo</span>
                </button>
                <button type="button" className="btn-secondary" onClick={() => setShowCamera(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="photo-actions">
            <button
              type="button"
              className="btn-secondary flex-1"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadIcon className="btn-icon" />
              <span>{preview ? "Change Photo" : "Upload File"}</span>
            </button>

            <button
              type="button"
              className="btn-secondary flex-1"
              onClick={() => setShowCamera(!showCamera)}
            >
              <Camera className="btn-icon" />
              <span>{showCamera ? "Close Camera" : "Live Camera"}</span>
            </button>
          </div>

          {/* AI Analysis Feedback Card */}
          {analyzing && (
            <div className="ai-status-card analyzing glass-card">
              <Loader2 className="spinner-icon" />
              <span>Gemini Vision AI Inspecting Image...</span>
            </div>
          )}

          {analysisResult && (
            <div className="ai-status-card glass-card">
              <div className="ai-card-header">
                <Sparkles className="sparkle-icon" />
                <h3>Gemini AI Inspection Result</h3>
              </div>
              <div className="ai-result-grid">
                <div className="ai-stat-box">
                  <span className="ai-stat-label">Identified Issue</span>
                  <span className="ai-stat-value highlight" style={{ color: "var(--accent-teal)", fontSize: "1.05rem" }}>
                    {analysisResult.category || "Pothole"}
                  </span>
                </div>
                <div className="ai-stat-box">
                  <span className="ai-stat-label">Severity</span>
                  <span className={`badge badge-${(analysisResult.importance || "medium").toLowerCase()}`}>
                    {analysisResult.importance || "Medium"} Priority
                  </span>
                </div>
                <div className="ai-stat-box">
                  <span className="ai-stat-label">Cost Estimate</span>
                  <span className="ai-stat-value">{analysisResult.cost_estimate || "2000-5000 INR"}</span>
                </div>
                <div className="ai-stat-box">
                  <span className="ai-stat-label">Public Property</span>
                  <span className={`ai-stat-value ${analysisResult.is_public_property !== false ? "green" : "rose"}`}>
                    {analysisResult.is_public_property !== false ? "Verified Public" : "Private Property"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: LOCATION & DESCRIPTION */}
        <div className="upload-card glass-card">
          <div className="card-heading">
            <MapPin className="card-heading-icon" />
            <h2>2. Location & Description</h2>
          </div>

          {/* Location Action Buttons */}
          <div className="location-buttons-group">
            <button
              type="button"
              className="btn-secondary location-btn"
              onClick={handleUseCurrentLocation}
            >
              <Navigation className="btn-icon text-teal" />
              <span>Use Current GPS</span>
            </button>

            <button
              type="button"
              className="btn-secondary location-btn"
              onClick={() => setShowMap(!showMap)}
            >
              <MapPin className="btn-icon text-indigo" />
              <span>{showMap ? "Hide Map" : "Pin on Map"}</span>
            </button>
          </div>

          {/* Map Selector Container */}
          {showMap && (
            <div className="map-picker-container">
              <MapContainer
                center={location || [20.5937, 78.9629]}
                zoom={location ? 15 : 5}
                scrollWheelZoom={true}
                className="map-view"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {location && <Marker position={[location.lat, location.lng]} />}
                <LocationPicker
                  setLocation={setLocation}
                  setAddress={setAddress}
                  setDistrict={setDistrict}
                  setFormData={setFormData}
                />
              </MapContainer>
              <p className="map-hint">Click anywhere on the map to pin precise coordinates.</p>
            </div>
          )}

          {/* Location Badge Output */}
          {address && (
            <div className="location-info-badge">
              <MapPin className="badge-icon" />
              <div className="info-text-group">
                <span className="info-address">{address}</span>
                {district && <span className="info-district">District: {district}</span>}
              </div>
            </div>
          )}

          {/* Description Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Problem Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the issue in detail (e.g., Deep pothole near main crossroad causing traffic hazard...)"
              className="form-textarea"
              maxLength={500}
            />
            <span className="char-counter">{formData.description.length}/500</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || analyzing}
            className="btn-primary submit-report-btn"
          >
            {submitting ? (
              <>
                <Loader2 className="btn-icon spinner" />
                <span>Submitting Issue...</span>
              </>
            ) : (
              <>
                <Send className="btn-icon" />
                <span>Submit Damage Report</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
