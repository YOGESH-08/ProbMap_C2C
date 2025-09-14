import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom SVG marker creator
const createCustomIcon = (color) =>
  L.divIcon({
    html: `<div style="
        background-color: ${color}; 
        width: 24px; 
        height: 24px; 
        border-radius: 50% 50% 50% 0; 
        transform: rotate(-45deg);
        border: 2px solid white;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
      "></div>`,
    iconSize: [24, 24],
    className: "custom-marker-icon",
  });

const highSeverityIcon = createCustomIcon("#d32f2f");
const mediumSeverityIcon = createCustomIcon("#ff8f00");
const lowSeverityIcon = createCustomIcon("#388e3c");

const MapSection = ({ selectedIssue }) => {
  const [issues, setIssues] = useState([]);
  const [selectedSeverity, setSelectedSeverity] = useState("All");
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);
  const [mapZoom, setMapZoom] = useState(5);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await fetch(`http://localhost:5000/admin/map-issues`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch issues");
        const data = await res.json();
        console.log("MapPoints: ", data);
        setIssues(data);
      } catch (err) {
        console.error("Error fetching issues:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  // Handle selected issue - focus map on it
  useEffect(() => {
    if (selectedIssue && selectedIssue.location) {
      let coords = null;

      if (
        selectedIssue.location?.coordinates &&
        selectedIssue.location.coordinates.length === 2
      ) {
        // GeoJSON case
        coords = [
          selectedIssue.location.coordinates[1],
          selectedIssue.location.coordinates[0],
        ];
      } else if (
        selectedIssue.location?.lat !== undefined &&
        selectedIssue.location?.lng !== undefined
      ) {
        // Plain lat/lng object
        coords = [selectedIssue.location.lat, selectedIssue.location.lng];
      }

      if (coords) {
        setMapCenter(coords);
        setMapZoom(15); // Zoom in on the selected issue
      }
    }
  }, [selectedIssue]);

  const getIcon = (importance) => {
    switch (importance) {
      case "High":
        return highSeverityIcon;
      case "Medium":
        return mediumSeverityIcon;
      case "Low":
        return lowSeverityIcon;
      default:
        return DefaultIcon;
    }
  };

  const filteredIssues =
    selectedSeverity === "All"
      ? issues
      : issues.filter((i) => i.importance === selectedSeverity);
  console.log("Filtered Issues:", filteredIssues);

  const severityCounts = {
    All: issues.length,
    High: issues.filter((i) => i.importance === "High").length,
    Medium: issues.filter((i) => i.importance === "Medium").length,
    Low: issues.filter((i) => i.importance === "Low").length,
  };

  return (
    <div className="map-content">
      <div className="content-header">
        <h2>Issue Map</h2>
        <p>View and manage reported issues on the map</p>
      </div>

      {/* FILTER BUTTONS */}
      <div className="map-controls">
        <div className="map-filters">
          <h3>Filter by Severity</h3>
          <div className="severity-filters">
            {["All", "High", "Medium", "Low"].map((s) => (
              <button
                key={s}
                className={`severity-filter ${
                  selectedSeverity === s ? "active" : ""
                }`}
                onClick={() => setSelectedSeverity(s)}
              >
                {s} ({severityCounts[s]})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAP */}
      <div className="map-container">
        {loading ? (
          <p>Loading issues...</p>
        ) : (
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: "500px", width: "100%", borderRadius: "10px" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredIssues.map((issue) => {
              // ✅ FIX: Handle both formats (GeoJSON & plain lat/lng)
              let coords = null;

              if (
                issue.location?.coordinates &&
                issue.location.coordinates.length === 2
              ) {
                // GeoJSON case
                coords = [
                  issue.location.coordinates[1],
                  issue.location.coordinates[0],
                ];
              } else if (
                issue.location?.lat !== undefined &&
                issue.location?.lng !== undefined
              ) {
                // Plain lat/lng object
                coords = [issue.location.lat, issue.location.lng];
              }

              if (!coords) return null; // Skip if still no coordinates

              // Highlight selected issue with a different icon
              const isSelected =
                selectedIssue && selectedIssue._id === issue._id;
              const markerIcon = isSelected
                ? createCustomIcon("#ff0000") // Red for selected
                : getIcon(issue.importance);

              return (
                <Marker key={issue._id} position={coords} icon={markerIcon}>
                  <Popup maxWidth={300} className="enhanced-popup">
                    <div className="popup-content">
                      <div className="popup-header">
                        <h3>{issue.title}</h3>
                        <span className={`status-badge status-${issue.status}`}>
                          {issue.status.charAt(0).toUpperCase() +
                            issue.status.slice(1)}
                        </span>
                      </div>

                      <div className="popup-body">
                        <p className="description">{issue.description}</p>

                        <div className="popup-details">
                          <div className="detail-row">
                            <i className="fa-solid fa-layer-group"></i>
                            <span>
                              <strong>Category:</strong> {issue.category}
                            </span>
                          </div>

                          <div className="detail-row">
                            <i className="fa-solid fa-exclamation-triangle"></i>
                            <span>
                              <strong>Importance:</strong> {issue.importance}
                            </span>
                          </div>

                          <div className="detail-row">
                            <i className="fa-solid fa-map-marker-alt"></i>
                            <span>
                              <strong>District:</strong> {issue.district}
                            </span>
                          </div>

                          {issue.cost_estimate && (
                            <div className="detail-row">
                              <i className="fa-solid fa-coins"></i>
                              <span>
                                <strong>Cost:</strong> ₹{issue.cost_estimate}
                              </span>
                            </div>
                          )}

                          <div className="detail-row">
                            <i className="fa-solid fa-calendar"></i>
                            <span>
                              <strong>Reported:</strong>{" "}
                              {new Date(issue.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          {issue.userInfo && (
                            <div className="detail-row">
                              <i className="fa-solid fa-user"></i>
                              <span>
                                <strong>Reported by:</strong>{" "}
                                {issue.userInfo.fullName}
                              </span>
                            </div>
                          )}

                          {issue.adminResponse && (
                            <div className="admin-response">
                              <i className="fa-solid fa-shield-halved"></i>
                              <div>
                                <strong>Admin Response:</strong>
                                <p>{issue.adminResponse.message}</p>
                                <small>
                                  Responded:{" "}
                                  {new Date(
                                    issue.adminResponse.respondedAt
                                  ).toLocaleDateString()}
                                </small>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default MapSection;
