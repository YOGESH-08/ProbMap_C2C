import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers - use ES modules import instead of require
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

// Set up the default icon
let DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons using inline SVG approach (no external dependencies)
const createCustomIcon = (color) => {
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color}; 
        width: 24px; 
        height: 24px; 
        border-radius: 50% 50% 50% 0; 
        transform: rotate(-45deg);
        border: 2px solid white;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-size: 12px;
          font-weight: bold;
        "></div>
      </div>
    `,
    iconSize: [24, 24],
    className: 'custom-marker-icon'
  });
};

const highSeverityIcon = createCustomIcon('#d32f2f'); // Red
const mediumSeverityIcon = createCustomIcon('#ff8f00'); // Orange
const lowSeverityIcon = createCustomIcon('#388e3c'); // Green

const MapSection = () => {
  const [issues] = useState([
    {
      id: 1,
      position: [12.9716, 77.5946], // Bangalore
      problem: "Pothole on Main Street",
      description: "Large pothole causing traffic issues",
      severity: "High",
      type: "Road",
      date: "2023-10-15"
    },
    {
      id: 2,
      position: [19.0760, 72.8777], // Mumbai
      problem: "Street Light Not Working",
      description: "Light has been out for 5 days",
      severity: "Medium",
      type: "Electricity",
      date: "2023-10-14"
    },
    {
      id: 3,
      position: [28.7041, 77.1025], // Delhi
      problem: "Garbage Pile Up",
      description: "Garbage not collected for a week",
      severity: "High",
      type: "Sanitation",
      date: "2023-10-13"
    },
    {
      id: 4,
      position: [13.0827, 80.2707], // Chennai
      problem: "Water Logging",
      description: "Area flooded after rain",
      severity: "Medium",
      type: "Drainage",
      date: "2023-10-12"
    },
    {
      id: 5,
      position: [17.3850, 78.4867], // Hyderabad
      problem: "Broken Footpath",
      description: "Footpath tiles broken, dangerous for pedestrians",
      severity: "Low",
      type: "Infrastructure",
      date: "2023-10-11"
    }
  ]);

  const [selectedSeverity, setSelectedSeverity] = useState("All");

  const getIcon = (severity) => {
    switch(severity) {
      case "High": return highSeverityIcon;
      case "Medium": return mediumSeverityIcon;
      case "Low": return lowSeverityIcon;
      default: return DefaultIcon;
    }
  };

  const filteredIssues = selectedSeverity === "All" 
    ? issues 
    : issues.filter(issue => issue.severity === selectedSeverity);

  const severityCounts = {
    All: issues.length,
    High: issues.filter(i => i.severity === "High").length,
    Medium: issues.filter(i => i.severity === "Medium").length,
    Low: issues.filter(i => i.severity === "Low").length
  };

  return (
    <div className="map-content">
      <div className="content-header">
        <h2>Issue Map</h2>
        <p>View and manage reported issues on the map</p>
      </div>

      <div className="map-controls">
        <div className="map-filters">
          <h3>Filter by Severity</h3>
          <div className="severity-filters">
            {["All", "High", "Medium", "Low"].map(severity => (
              <button
                key={severity}
                className={`severity-filter ${selectedSeverity === severity ? 'active' : ''} ${severity.toLowerCase()}`}
                onClick={() => setSelectedSeverity(severity)}
              >
                {severity} ({severityCounts[severity]})
              </button>
            ))}
          </div>
        </div>

        <div className="map-stats">
          <div className="stat-card">
            <i className="fa-solid fa-map-marker-alt"></i>
            <div className="stat-details">
              <h4>{issues.length}</h4>
              <p>Total Issues</p>
            </div>
          </div>
          <div className="stat-card">
            <i className="fa-solid fa-triangle-exclamation"></i>
            <div className="stat-details">
              <h4>{severityCounts.High}</h4>
              <p>High Priority</p>
            </div>
          </div>
        </div>
      </div>

      <div className="map-container">
        <MapContainer
          center={[20.5937, 78.9629]} // Center of India
          zoom={5}
          style={{ height: "500px", width: "100%", borderRadius: "10px" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredIssues.map(issue => (
            <Marker
              key={issue.id}
              position={issue.position}
              icon={getIcon(issue.severity)}
            >
              <Popup>
                <div className="map-popup">
                  <h3>{issue.problem}</h3>
                  <p>{issue.description}</p>
                  <div className="popup-details">
                    <span className={`severity severity-${issue.severity.toLowerCase()}`}>
                      {issue.severity}
                    </span>
                    <span className="issue-type">{issue.type}</span>
                  </div>
                  <p className="popup-date">Reported: {issue.date}</p>
                  <div className="popup-actions">
                    <button className="btn-view">View Details</button>
                    <button className="btn-resolve">Mark Resolved</button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="recent-issues">
        <h3>Recent Issues</h3>
        <div className="issues-list">
          {issues.slice(0, 5).map(issue => (
            <div key={issue.id} className="issue-item">
              <div className="issue-marker">
                <div className={`marker-dot ${issue.severity.toLowerCase()}`}></div>
              </div>
              <div className="issue-info">
                <h4>{issue.problem}</h4>
                <p>{issue.type} • {issue.date}</p>
              </div>
              <div className="issue-severity">
                <span className={`severity severity-${issue.severity.toLowerCase()}`}>
                  {issue.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapSection;