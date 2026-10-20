import React from "react";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  ExternalLink, 
  Trash2, 
  ShieldAlert, 
  MessageSquare, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle
} from "lucide-react";
import "./EnhancedDetails.css";

const fallbackImg = "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80";

export default function EnhancedAcard({ details, onDelete }) {
  const handleViewOnMap = () => {
    if (!details.location?.lat || !details.location?.lng) return;
    const { lat, lng } = details.location;
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || "pending";
    switch (s) {
      case "resolved":
        return { label: "Resolved", class: "badge-resolved", icon: CheckCircle2 };
      case "acknowledged":
        return { label: "Acknowledged", class: "badge-acknowledged", icon: AlertCircle };
      case "rejected":
        return { label: "Rejected", class: "badge-rejected", icon: XCircle };
      default:
        return { label: "Pending Review", class: "badge-pending", icon: Clock };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return { date: "Recent", time: "" };
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return { date: "Recent", time: "" };
    return {
      date: d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
      time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const statusInfo = getStatusBadge(details.status);
  const StatusIcon = statusInfo.icon;
  const createdDate = formatDate(details.createdAt || details.reportedAt);

  return (
    <div className="enhanced-card glass-card">
      {/* CARD HEADER / IMAGE */}
      <div className="card-image-wrapper">
        <img
          src={details.imageUrl || fallbackImg}
          alt={details.name || details.title || "Reported Issue"}
          className="card-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackImg;
          }}
        />
        
        {/* Floating Status Badge */}
        <div className={`card-status-badge ${statusInfo.class}`}>
          <StatusIcon className="badge-status-icon" />
          <span>{statusInfo.label}</span>
        </div>

        {/* Priority Badge */}
        {details.severity && (
          <div className={`card-priority-badge priority-${details.severity.toLowerCase()}`}>
            <ShieldAlert className="priority-icon" />
            <span>{details.severity} Priority</span>
          </div>
        )}
      </div>

      {/* CARD BODY */}
      <div className="card-body">
        <div className="card-title-row">
          <h3 className="card-issue-title">{details.name || details.title || "Property Damage"}</h3>
          {details.category && <span className="category-pill">{details.category}</span>}
        </div>

        {/* Location Subtitle */}
        <div className="card-location-row">
          <MapPin className="card-loc-icon" />
          <span>{details.district || "Unknown District"}</span>
        </div>

        {/* Description */}
        <p className="card-description">{details.description}</p>

        {/* Official Admin Response Section */}
        <div className={`admin-response-box ${details.status === "pending" ? "is-pending" : "is-responded"}`}>
          <div className="admin-box-header">
            <MessageSquare className="admin-msg-icon" />
            <span>Authority Response</span>
          </div>
          <p className="admin-msg-text">
            {details.adminDescription || "Your report is under review by local city administrators."}
          </p>
          {details.respondedAt && (
            <span className="admin-msg-time">
              Responded {formatDate(details.respondedAt).date}
            </span>
          )}
        </div>

        {/* Metadata Footer Bar */}
        <div className="card-meta-bar">
          <div className="meta-item">
            <Calendar className="meta-icon" />
            <span>{createdDate.date}</span>
          </div>

          <div className="meta-item">
            <Clock className="meta-icon" />
            <span>{createdDate.time}</span>
          </div>
        </div>

        {/* Card Actions */}
        <div className="card-actions">
          <button
            onClick={handleViewOnMap}
            disabled={!details.location?.lat || !details.location?.lng}
            className="btn-secondary card-action-btn flex-1"
          >
            <ExternalLink className="btn-icon" />
            <span>View on Map</span>
          </button>

          {onDelete && (
            <button
              onClick={onDelete}
              className="btn-danger-outline card-action-btn"
              title="Delete Issue Report"
            >
              <Trash2 className="btn-icon text-rose" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
