import React, { useState, useRef } from "react";
import "../Styles/upload.css";
import TextField from "@mui/material/TextField";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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

  const [formData, setFormData] = useState({
    problemType: "",
    description: "",
    photo: null,
  });

  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

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
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current.click();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.problemType || !formData.description || !formData.photo) {
      alert("Please fill all fields and take/upload a photo!");
      return;
    }

    if (!location) {
      alert("Please select or use your location!");
      return;
    }

    try {
      const data = new FormData();
      data.append("title", formData.problemType);
      data.append("description", formData.description);
      data.append("category", formData.problemType);
 data.append(
      "location",
      JSON.stringify({
        latitude: location.lat,
        longitude: location.lng,
      })
    );
      data.append("image", formData.photo);

      const res = await fetch("http://localhost:5000/issue", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        throw new Error("Failed to create issue");
      }

      const result = await res.json();
      console.log("Issue Created:", result);
      alert("Problem uploaded successfully!");

      // Reset form
      setFormData({ problemType: "", description: "", photo: null });
      setPreview(null);
      setLocation(null);
      setAddress("");
      setShowMap(false);
    } catch (error) {
      console.error(error);
      alert(" Error submitting issue: " + error.message);
    }
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
        >
          <option value="">Select Problem</option>
          <option>Pothole</option>
          <option>Traffic Signals</option>
          <option>Dividers</option>
          <option>Pipelines</option>
          <option>Drainage</option>
          <option>Street Light</option>
          <option>Public Tap</option>
          <option>Others</option>
        </select>

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

        <div className="upload-box" onClick={handleCameraClick}>
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              style={{
                width: "100%",
                maxHeight: "200px",
                objectFit: "cover",
              }}
            />
          ) : (
            <span
              style={{
                color: "rgb(136, 129, 129)",
                textDecoration: "underline",
              }}
            >
              📸 Take a Photo / Upload
            </span>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
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
        <button onClick={handleSubmit}>✅ Submit</button>
        <button
          type="reset"
          onClick={() => {
            setFormData({ problemType: "", description: "", photo: null });
            setPreview(null);
            setLocation(null);
            setAddress("");
            setShowMap(false);
          }}
        >
          🔄 Reset
        </button>
      </div>
    </div>
  );
}
