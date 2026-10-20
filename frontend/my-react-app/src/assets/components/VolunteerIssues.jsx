import React, { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { 
  Users, 
  Award, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Upload as UploadIcon, 
  ShieldCheck, 
  XCircle, 
  Loader2, 
  ExternalLink,
  Calendar
} from "lucide-react";
import "./VolunteerIssues.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function VolunteerIssues() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [districtIssues, setDistrictIssues] = useState([]);
  const [district, setDistrict] = useState("");
  const [registering, setRegistering] = useState(false);
  const [submittingClaimId, setSubmittingClaimId] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const [activeClaimIssueId, setActiveClaimIssueId] = useState(null);

  const fetchStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/volunteer/status`, {
        headers,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get volunteer status");
      setStatus(data);
      if (data.volunteerDistrict) setDistrict(data.volunteerDistrict);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDistrictIssues = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/volunteer/district-issues`, {
        headers,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load district issues");
      setDistrictIssues(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      toast.error(e.message);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  useEffect(() => {
    if (status?.volunteerStatus === "approved") {
      fetchDistrictIssues();
    }
  }, [status?.volunteerStatus]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!district.trim()) {
      toast.error("Please specify your district");
      return;
    }
    setRegistering(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/volunteer/request`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({ district: district.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit volunteer application");
      toast.success("Volunteer application submitted for administrator review!");
      fetchStatus();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setRegistering(false);
    }
  };

  const handleInitiateClaim = (issueId) => {
    setActiveClaimIssueId(issueId);
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeClaimIssueId) return;

    setSubmittingClaimId(activeClaimIssueId);
    toast.loading("Submitting repair proof photo...", { id: "claim" });

    try {
      const form = new FormData();
      form.append("issueId", activeClaimIssueId);
      form.append("proof", file);

      const token = localStorage.getItem("token");
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/volunteer/submit-claim`, {
        method: "POST",
        headers,
        credentials: "include",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit repair proof");

      toast.success("Resolution claim submitted! Points will be awarded upon admin approval.", { id: "claim" });
      fetchDistrictIssues();
      fetchStatus();
    } catch (e) {
      toast.error(e.message, { id: "claim" });
    } finally {
      setSubmittingClaimId(null);
      setActiveClaimIssueId(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (loading) {
    return (
      <div className="volunteer-page-container">
        <div className="volunteer-state-card glass-card">
          <Loader2 className="spinner" size={36} />
          <p>Loading volunteer status...</p>
        </div>
      </div>
    );
  }

  // Hidden file input for claim photo uploads
  const hiddenFileInput = (
    <input
      type="file"
      ref={fileInputRef}
      accept="image/*"
      style={{ display: "none" }}
      onChange={handleFileSelected}
    />
  );

  // Status: NOT REGISTERED
  if (!status || status.volunteerStatus === "none") {
    return (
      <div className="volunteer-page-container">
        {hiddenFileInput}
        <div className="volunteer-hero-card glass-card">
          <div className="volunteer-icon-bubble">
            <Users size={36} />
          </div>
          <h1>Civic Volunteer Network</h1>
          <p className="volunteer-hero-subtitle">
            Join local neighborhood volunteers to inspect, verify, and resolve public infrastructure issues.
            Earn verified social service points and community recognition.
          </p>

          <form onSubmit={handleRegister} className="volunteer-register-form">
            <div className="volunteer-input-group">
              <MapPin className="input-group-icon" size={18} />
              <input
                type="text"
                placeholder="Enter your district / municipality (e.g. Downtown, North Zone)"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                disabled={registering}
              />
            </div>
            <button type="submit" className="btn-primary volunteer-submit-btn" disabled={registering}>
              {registering ? (
                <>
                  <Loader2 className="spinner" size={16} />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Register as Volunteer</span>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Status: PENDING REVIEW
  if (status.volunteerStatus === "pending") {
    return (
      <div className="volunteer-page-container">
        {hiddenFileInput}
        <div className="volunteer-state-card glass-card">
          <div className="status-bubble amber">
            <Clock size={36} />
          </div>
          <h2>Application Pending Review</h2>
          <p>
            Your application for <strong>{status.volunteerDistrict || "your district"}</strong> is currently being reviewed by municipal administrators.
          </p>
          <div className="volunteer-info-pill">
            <span>You will receive access to district dispatch tasks once verified.</span>
          </div>
        </div>
      </div>
    );
  }

  // Status: REJECTED
  if (status.volunteerStatus === "rejected") {
    return (
      <div className="volunteer-page-container">
        {hiddenFileInput}
        <div className="volunteer-state-card glass-card">
          <div className="status-bubble rose">
            <XCircle size={36} />
          </div>
          <h2>Application Not Approved</h2>
          <p>Your volunteer application was not accepted at this time.</p>
          {status.volunteerRejectionReason && (
            <p className="reason-text">Reason: {status.volunteerRejectionReason}</p>
          )}
          <button type="button" className="btn-secondary" onClick={() => handleRegister({ preventDefault: () => {} })}>
            Re-apply for District
          </button>
        </div>
      </div>
    );
  }

  // Status: APPROVED (Full Volunteer Hub)
  return (
    <div className="volunteer-page-container">
      {hiddenFileInput}

      {/* Volunteer Profile Header */}
      <div className="volunteer-dash-header glass-card">
        <div className="volunteer-dash-info">
          <div className="volunteer-avatar-box">
            <ShieldCheck size={28} />
          </div>
          <div>
            <div className="volunteer-badge-row">
              <span className="badge badge-resolved">Certified Volunteer</span>
              <span className="district-tag">District: {status.volunteerDistrict}</span>
            </div>
            <h2>Volunteer Action Center</h2>
          </div>
        </div>

        <div className="volunteer-stats-pills">
          <div className="stat-pill">
            <Award className="pill-icon text-amber" size={20} />
            <div>
              <span className="pill-val">{status.volunteerPoints || 0}</span>
              <span className="pill-lbl">Social Points</span>
            </div>
          </div>
          <div className="stat-pill">
            <CheckCircle2 className="pill-icon text-emerald" size={20} />
            <div>
              <span className="pill-val">{districtIssues.length}</span>
              <span className="pill-lbl">District Tasks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section Title */}
      <div className="volunteer-section-head">
        <div>
          <h3>Active Issues in {status.volunteerDistrict}</h3>
          <p>Review damage reports, perform on-ground fixes, and submit resolution photo proof for credit.</p>
        </div>
      </div>

      {/* Issues Grid */}
      {districtIssues.length === 0 ? (
        <div className="volunteer-state-card glass-card">
          <CheckCircle2 className="text-emerald" size={40} />
          <h3>No open issues in your district!</h3>
          <p>Great job! All reported problems in {status.volunteerDistrict} have been addressed.</p>
        </div>
      ) : (
        <div className="volunteer-issues-grid">
          {districtIssues.map((issue) => {
            const hasSubmittedClaim = issue.volunteerClaim?.status === "submitted";
            const isResolved = issue.status === "resolved";
            const isSubmittingThis = submittingClaimId === issue._id;

            return (
              <div key={issue._id} className="volunteer-issue-card glass-card">
                <div className="issue-img-wrapper">
                  <img
                    src={issue.imageUrl || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80"}
                    alt={issue.title}
                    className="issue-img"
                  />
                  <span className={`badge badge-${issue.status === "resolved" ? "resolved" : "pending"} issue-status-floating`}>
                    {issue.status}
                  </span>
                </div>

                <div className="issue-card-content">
                  <h4 className="issue-title">{issue.title}</h4>
                  <p className="issue-desc">{issue.description}</p>

                  <div className="issue-meta-row">
                    <span className="meta-sub">
                      <MapPin size={13} /> {issue.district}
                    </span>
                    <span className="meta-sub">
                      <Calendar size={13} /> {new Date(issue.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="claim-action-area">
                    {hasSubmittedClaim ? (
                      <div className="claim-status-alert alert-pending">
                        <Clock size={16} />
                        <span>Resolution proof submitted — Awaiting admin verification</span>
                      </div>
                    ) : isResolved ? (
                      <div className="claim-status-alert alert-resolved">
                        <CheckCircle2 size={16} />
                        <span>Issue successfully resolved</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="btn-primary claim-btn"
                        onClick={() => handleInitiateClaim(issue._id)}
                        disabled={isSubmittingThis}
                      >
                        {isSubmittingThis ? (
                          <>
                            <Loader2 className="spinner" size={16} />
                            <span>Uploading Proof...</span>
                          </>
                        ) : (
                          <>
                            <UploadIcon size={16} />
                            <span>Submit Resolution Proof</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
