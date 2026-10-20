import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { 
  Clock, 
  CheckCircle2, 
  PlusCircle, 
  Search, 
  Filter, 
  Loader2, 
  AlertCircle,
  Inbox
} from "lucide-react";
import EnhancedAcard from "./EnhancedAcard";
import "./UserIssues.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function UserIssues({ filterStatus = "pending" }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState(filterStatus);

  useEffect(() => {
    setCurrentTab(filterStatus);
  }, [filterStatus]);

  const fetchIssues = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/issue/myissues`, {
        method: "GET",
        headers,
        credentials: "include",
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to fetch issues");
      }
      const data = await res.json();
      setIssues(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const deleteIssue = async (id) => {
    if (!window.confirm("Are you sure you want to delete this issue report?")) return;
    try {
      const token = localStorage.getItem("token");
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/issue/myissues/${id}`, {
        method: "DELETE",
        headers,
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to delete issue");
      setIssues((prev) => prev.filter((issue) => issue._id !== id));
      toast.success("Issue report deleted successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Filter issues based on tab & search
  const filteredIssues = issues.filter((issue) => {
    const isPending = issue.status?.toLowerCase() === "pending";
    const matchesTab = currentTab === "pending" ? isPending : !isPending;

    if (!matchesTab) return false;

    if (!searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase();
    return (
      issue.title?.toLowerCase().includes(query) ||
      issue.description?.toLowerCase().includes(query) ||
      issue.district?.toLowerCase().includes(query) ||
      issue.category?.toLowerCase().includes(query)
    );
  });

  const pendingCount = issues.filter((i) => i.status?.toLowerCase() === "pending").length;
  const historyCount = issues.filter((i) => i.status?.toLowerCase() !== "pending").length;

  return (
    <div className="issues-page-container">
      {/* Header */}
      <div className="issues-header-section">
        <div>
          <span className="upload-tag">Citizen Activity</span>
          <h1 className="issues-page-title">My Reported Issues</h1>
          <p className="issues-page-subtitle">
            Track live dispatch status, review municipality responses, and manage your civic damage reports.
          </p>
        </div>

        <Link to="/report" className="btn-primary report-cta-btn">
          <PlusCircle size={18} />
          <span>Report New Damage</span>
        </Link>
      </div>

      {/* Control Bar: Tabs & Search */}
      <div className="issues-controls-bar glass-card">
        <div className="issues-tabs-group">
          <button
            type="button"
            className={`issues-tab-pill ${currentTab === "pending" ? "active" : ""}`}
            onClick={() => setCurrentTab("pending")}
          >
            <Clock size={16} />
            <span>Pending Review</span>
            <span className="count-badge">{pendingCount}</span>
          </button>

          <button
            type="button"
            className={`issues-tab-pill ${currentTab === "history" ? "active" : ""}`}
            onClick={() => setCurrentTab("history")}
          >
            <CheckCircle2 size={16} />
            <span>Resolved & History</span>
            <span className="count-badge">{historyCount}</span>
          </button>
        </div>

        <div className="issues-search-box">
          <Search className="search-icon" size={16} />
          <input
            type="text"
            placeholder="Search by title, category, or district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="issues-loading-state glass-card">
          <Loader2 className="spinner" size={36} />
          <p>Fetching your reported issues...</p>
        </div>
      ) : error ? (
        <div className="issues-error-state glass-card">
          <AlertCircle size={32} className="text-rose" />
          <p>{error}</p>
          <button type="button" className="btn-secondary" onClick={fetchIssues}>
            Try Again
          </button>
        </div>
      ) : filteredIssues.length === 0 ? (
        <div className="issues-empty-state glass-card">
          <div className="empty-icon-box">
            <Inbox size={42} />
          </div>
          <h3>No {currentTab === "pending" ? "pending" : "historical"} issues found</h3>
          <p>
            {searchTerm
              ? "No reports match your search query. Try clearing the filter."
              : currentTab === "pending"
              ? "You do not have any pending issues awaiting administrator review."
              : "No resolved, acknowledged, or closed issues found in your history yet."}
          </p>
          <Link to="/report" className="btn-primary empty-cta-btn">
            <PlusCircle size={18} />
            <span>Submit a Report</span>
          </Link>
        </div>
      ) : (
        <div className="issues-grid">
          {filteredIssues.map((issue) => (
            <EnhancedAcard
              key={issue._id}
              details={{
                id: issue._id,
                name: issue.title,
                location: issue.location,
                description: issue.description,
                adminDescription: issue.adminResponse?.message || "Pending",
                severity: issue.importance,
                status: issue.status,
                imageUrl: issue.imageUrl,
                district: issue.district || "",
                createdAt: issue.createdAt,
                respondedAt: issue.adminResponse?.respondedAt,
                category: issue.category,
                userInfo: issue.userInfo,
              }}
              onDelete={() => deleteIssue(issue._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
