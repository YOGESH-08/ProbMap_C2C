import React from "react";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaExclamationTriangle,
} from "react-icons/fa";
import "./EnhancedDetails.css";
import img from "../photo/zoro.jpg";

const EnhancedAcard = ({ details, onDelete }) => {
  const handleViewOnMap = () => {
    if (!details.location?.lat || !details.location?.lng) return;
    const { lat, lng } = details.location;
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, "_blank");
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return "#4caf50";
      case "acknowledged":
        return "#2196f3";
      case "pending":
        return "#ff9800";
      case "rejected":
        return "#f44336";
      default:
        return "#9e9e9e";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return "fa-check-circle";
      case "acknowledged":
        return "fa-info-circle";
      case "pending":
        return "fa-clock";
      case "rejected":
        return "fa-times-circle";
      default:
        return "fa-question-circle";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const reportDateTime = formatDate(details.createdAt || details.reportedAt);

  return (
    <div className="enhanced-issue-card">
      {/* Status Badge */}
      <div
        className="status-badge"
        style={{ backgroundColor: getStatusColor(details.status) }}
      >
        <i className={`fa-solid ${getStatusIcon(details.status)}`}></i>
        <span>{details.status || "Pending"}</span>
      </div>

      <div className="card-content">
        {/* Image Section */}
        <div className="image-section">
          <img src={details.imageUrl || img} alt={details.name} />
          <div className="image-overlay">
            <h2 className="issue-title">{details.name}</h2>
            <div className="location-info">
              <FaMapMarkerAlt className="location-icon" />
              <span>
                {details.district || details.location
                  ? `${details.district || "Unknown District"}`
                  : "No location"}
              </span>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="details-section">
          {/* Issue Description */}
          <div className="description-section">
            <h3>
              <i className="fa-solid fa-align-left"></i>
              Issue Description
            </h3>
            <p>{details.description}</p>
          </div>

          {/* Admin Response */}
          <div className="admin-response-section">
            <h3>
              <i className="fa-solid fa-shield-halved"></i>
              Admin Response
            </h3>
            <div
              className={`response-content ${
                details.status === "pending" ? "pending" : "responded"
              }`}
            >
              <p>{details.adminDescription || "No response yet"}</p>
              {details.respondedAt && (
                <span className="response-date">
                  Responded: {formatDate(details.respondedAt).date}
                </span>
              )}
            </div>
          </div>

          {/* Issue Metadata */}
          <div className="metadata-section">
            <div className="metadata-grid">
              <div className="metadata-item">
                <FaCalendarAlt className="metadata-icon" />
                <div className="metadata-content">
                  <span className="metadata-label">Reported Date</span>
                  <span className="metadata-value">{reportDateTime.date}</span>
                </div>
              </div>

              <div className="metadata-item">
                <FaClock className="metadata-icon" />
                <div className="metadata-content">
                  <span className="metadata-label">Reported Time</span>
                  <span className="metadata-value">{reportDateTime.time}</span>
                </div>
              </div>

              {details.severity && (
                <div className="metadata-item">
                  <FaExclamationTriangle className="metadata-icon" />
                  <div className="metadata-content">
                    <span className="metadata-label">Priority</span>
                    <span
                      className={`priority-badge priority-${details.severity.toLowerCase()}`}
                    >
                      {details.severity}
                    </span>
                  </div>
                </div>
              )}

              {details.district && (
                <div className="metadata-item">
                  <FaMapMarkerAlt className="metadata-icon" />
                  <div className="metadata-content">
                    <span className="metadata-label">District</span>
                    <span className="metadata-value">{details.district}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="actions-section">
            <button
              onClick={handleViewOnMap}
              className="action-btn primary"
              disabled={!details.location?.lat || !details.location?.lng}
            >
              <i className="fa-solid fa-map"></i>
              View on Map
            </button>

            {onDelete && (
              <button onClick={onDelete} className="action-btn danger">
                <i className="fa-solid fa-trash"></i>
                Delete Issue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAcard;
