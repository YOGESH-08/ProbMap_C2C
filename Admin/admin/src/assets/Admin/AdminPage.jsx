import React, { useState, useEffect } from "react";
import "./Admin_page.css";
import "./PublicSection.css";
import "./ReportsSection.css";
import MyChart from "./Chart";
import { signOut } from "firebase/auth";
import { auth } from "../../components/firebase/firebaseConfig.js";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import MapSection from "./Leaf.jsx";
import Img from "../photo/dog.jpg";

export default function Dashboard() {
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const [issues, setIssues] = useState();
  const [showFullLeaderboard, setShowFullLeaderboard] = useState(false);
  const [selectedIssueForMap, setSelectedIssueForMap] = useState(null);
  const [reportFilters, setReportFilters] = useState({
    timePeriod: "30days",
    category: "",
    status: "",
    district: "",
  });
  const [reportData, setReportData] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [adminProfile, setAdminProfile] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const BACKEND_URL = "http://localhost:5000";

  const [volunteerRequests, setVolunteerRequests] = useState([]);
  const [claims, setClaims] = useState([]);
  const [volLoading, setVolLoading] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);
  const showToast = (message, type = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const fetchCityIssues = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/admin/city-issues`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch issues");
      const data = await res.json();
      const filteredIssues = data.filter(
        (issue) =>
          issue.status?.toLowerCase() === "acknowledged" ||
          issue.status?.toLowerCase() === "resolved"
      );

      setIssues(filteredIssues);
      console.log("Acknowledged + Resolved issues:", filteredIssues);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFetchIssuesByType = async (type) => {
    try {
      const res = await fetch(`${BACKEND_URL}/admin/${type}Issues`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("failed to fetch issues");
      const data = await res.json();
      setIssues(data);
    } catch (err) {
      console.log("Error in fetching issues : ", err.message);
    }
  };

  useEffect(() => {
    if (activeView === "pending") handleFetchIssuesByType("pending");
    if (activeView === "rejected") handleFetchIssuesByType("rejected");
    if (activeView === "acknowledged") handleFetchIssuesByType("acknowledged");
    if (activeView === "resolved") handleFetchIssuesByType("resolved");
    if (activeView === "issues") fetchCityIssues();
    if (activeView === "volunteerRequests") fetchVolunteerRequests();
    if (activeView === "volunteers") {
      /* no fetch needed, handled in ApprovedVolunteers */
    }
    if (activeView === "claims") fetchClaims();
  }, [activeView]);

  const handleUpdateStatus = async (id, status, message = "") => {
    try {
      const res = await fetch(`${BACKEND_URL}/admin/update-issue/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // cookies
        body: JSON.stringify({ status, message }),
      });
      if (!res.ok) throw new Error("Failed to update issue");
      const updatedIssue = await res.json();
      setIssues((prev) =>
        prev.map((issue) => (issue._id === id ? updatedIssue : issue))
      );
      showToast(`Issue ${status} successfully`, "success");
    } catch (err) {
      console.error(err);
      showToast("Error updating issue: " + err.message, "error");
    }
  };

  const handleShowOnMap = (issue) => {
    setSelectedIssueForMap(issue);
    setActiveView("map");
  };

  const fetchAdminProfile = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/admin/profile`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch admin profile");
      const data = await res.json();
      setAdminProfile(data);
      console.log("Fetched Admin Profile:", data);
    } catch (err) {
      console.error("Error fetching admin profile:", err);
    }
  };

  // Volunteers admin
  const fetchVolunteerRequests = async () => {
    try {
      setVolLoading(true);
      const res = await fetch(`${BACKEND_URL}/volunteer/admin/requests`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load requests");
      setVolunteerRequests(data);
    } catch (e) {
      console.error(e);
      showToast(e.message, "error");
    } finally {
      setVolLoading(false);
    }
  };

  const updateVolunteerStatus = async (userId, action) => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/volunteer/admin/requests/${userId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ action }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");
      fetchVolunteerRequests();
      showToast(`Request ${action}d`, "success");
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const updateVolunteerStatusWithReason = async (userId, action, reason) => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/volunteer/admin/requests/${userId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ action, reason }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");
      fetchVolunteerRequests();
      showToast(`Request ${action}ed`, "success");
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const fetchClaims = async () => {
    try {
      setVolLoading(true);
      const res = await fetch(`${BACKEND_URL}/volunteer/admin/claims`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load claims");
      setClaims(data);
    } catch (e) {
      console.error(e);
      showToast(e.message, "error");
    } finally {
      setVolLoading(false);
    }
  };

  const reviewClaim = async (issueId, action) => {
    try {
      const form = new FormData();
      form.append("action", action);
      const res = await fetch(
        `${BACKEND_URL}/volunteer/admin/claims/${issueId}/review`,
        {
          method: "POST",
          credentials: "include",
          body: form,
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to review claim");
      fetchClaims();
      // Refresh issues so resolved appears immediately in Issues view
      fetchCityIssues();
      showToast(`Claim ${action}d`, "success");
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/admin/users`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
      console.log("Fetched Users:", data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeView === "public") fetchUsers();
  }, [activeView]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Admin logged out");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavClick = (view) => {
    setActiveView(view);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const getInitials = (name) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const sortedUsers = [...users].sort(
    (a, b) => (b.numIssueRaised || 0) - (a.numIssueRaised || 0)
  );

  const displayedUsers = showFullLeaderboard
    ? sortedUsers
    : sortedUsers.slice(0, 5);

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <div className="dashboard-content">
            <MyChart />
          </div>
        );
      case "issues":
        return (
          <div className="issues-content">
            <h2>Reported Issues - Resolved and Acknowledeged</h2>
            <div className="issues-list">
              {issues && issues.length > 0 ? (
                issues.map((issue) => (
                  <IssueCard
                    key={issue._id}
                    issue={issue}
                    onUpdateStatus={handleUpdateStatus}
                    onShowOnMap={handleShowOnMap}
                  />
                ))
              ) : (
                <p>No issues reported yet.</p>
              )}
            </div>
          </div>
        );
      case "pending":
        return (
          <div className="pending-content">
            <h2>Pending Approvals</h2>
            <div className="issues-list">
              {issues && issues.length > 0 ? (
                issues.map((issue) => (
                  <IssueCard
                    key={issue._id}
                    issue={issue}
                    onUpdateStatus={handleUpdateStatus}
                    onShowOnMap={handleShowOnMap}
                  />
                ))
              ) : (
                <p>No issues reported yet.</p>
              )}
            </div>
          </div>
        );

      case "rejected":
        return (
          <div className="pending-content">
            <h2>Rejected issues</h2>
            <div className="issues-list">
              {issues && issues.length > 0 ? (
                issues.map((issue) => (
                  <IssueCard
                    key={issue._id}
                    issue={issue}
                    onUpdateStatus={handleUpdateStatus}
                    onShowOnMap={handleShowOnMap}
                  />
                ))
              ) : (
                <p>No issues reported yet.</p>
              )}
            </div>
          </div>
        );
      case "volunteerRequests":
        return (
          <div className="pending-content volunteer-requests">
            <div className="section-header">
              <h2>
                <i className="fa-solid fa-user-plus"></i> Volunteer Requests
              </h2>
              <div className="section-actions">
                <button
                  className="btn-refresh"
                  onClick={fetchVolunteerRequests}
                >
                  <i className="fa-solid fa-rotate"></i> Refresh
                </button>
              </div>
            </div>
            {volLoading ? (
              <p>Loading...</p>
            ) : volunteerRequests.length === 0 ? (
              <div className="empty-state">
                <i className="fa-regular fa-circle-check"></i>
                <p>No pending requests.</p>
              </div>
            ) : (
              <div className="issues-list">
                {volunteerRequests.map((u) => (
                  <div key={u._id} className="issue-card volunteer-card">
                    <div className="volunteer-head">
                      <div>
                        <strong>{u.fullName}</strong>
                        <div className="muted">{u.email}</div>
                        <div className="muted">
                          District: {u.volunteerDistrict}
                        </div>
                      </div>
                      <div className="request-actions">
                        <button
                          className="btn btn-approve"
                          onClick={() =>
                            updateVolunteerStatus(u._id, "approve")
                          }
                        >
                          <i className="fa-solid fa-check"></i> Approve
                        </button>
                        <button
                          className="btn btn-reject-outline"
                          onClick={() => {
                            const reason =
                              prompt("Reason for rejection?") || "";
                            updateVolunteerStatusWithReason(
                              u._id,
                              "reject",
                              reason
                            );
                          }}
                        >
                          <i className="fa-solid fa-xmark"></i> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "volunteers":
        return (
          <div className="pending-content approved-volunteers">
            <div className="section-header">
              <h2>
                <i className="fa-solid fa-people-carry-box"></i> Approved
                Volunteers
              </h2>
            </div>
            <ApprovedVolunteers
              BACKEND_URL={BACKEND_URL}
              showToast={showToast}
            />
          </div>
        );
      case "claims":
        return (
          <div className="pending-content">
            <h2>Volunteer Claims</h2>
            {volLoading ? (
              <p>Loading...</p>
            ) : claims.length === 0 ? (
              <p>No submitted claims.</p>
            ) : (
              <div className="issues-list">
                {claims.map((c) => (
                  <div key={c._id} className="issue-card">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <strong>{c.title}</strong>
                        <div style={{ fontSize: 12 }}>{c.district}</div>
                        <div style={{ fontSize: 12 }}>
                          Submitted:{" "}
                          {new Date(
                            c.volunteerClaim?.submittedAt
                          ).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <button
                          className="btn-ack"
                          onClick={() => reviewClaim(c._id, "approve")}
                        >
                          Approve
                        </button>
                        <button
                          className="btn-reject"
                          onClick={() => reviewClaim(c._id, "reject")}
                          style={{ marginLeft: 8 }}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                    {c.volunteerClaim?.proofImageUrl && (
                      <img
                        src={c.volunteerClaim.proofImageUrl}
                        alt="proof"
                        style={{ maxWidth: 220, borderRadius: 8, marginTop: 8 }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "public":
        return (
          <div className="public-content">
            <div className="content-header">
              <h2>Public Engagement</h2>
              <p>
                Manage user rewards, contributions, and community engagement
              </p>
            </div>

            {/* Stats Overview */}
            <div className="engagement-stats">
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fa-solid fa-users"></i>
                </div>
                <div className="stat-content">
                  <h3>{users.length}</h3>
                  <p>Total Users</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fa-solid fa-trophy"></i>
                </div>
                <div className="stat-content">
                  <h3>
                    {sortedUsers.length > 0 ? sortedUsers[0].numIssueRaised : 0}
                  </h3>
                  <p>Top Contributor</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fa-solid fa-chart-line"></i>
                </div>
                <div className="stat-content">
                  <h3>
                    {users.reduce(
                      (sum, user) => sum + (user.numIssueRaised || 0),
                      0
                    )}
                  </h3>
                  <p>Total Issues Raised</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fa-solid fa-star"></i>
                </div>
                <div className="stat-content">
                  <h3>
                    {Math.round(
                      (users.reduce(
                        (sum, user) => sum + (user.numIssueRaised || 0),
                        0
                      ) /
                        Math.max(users.length, 1)) *
                        10
                    ) / 10}
                  </h3>
                  <p>Avg Issues/User</p>
                </div>
              </div>
            </div>

            {/* Top Contributors Section */}
            <div className="rewards-section">
              <div className="section-header">
                <h3 className="section-title">
                  <i className="fa-solid fa-trophy"></i>
                  Top Contributors
                </h3>
                <div className="section-actions">
                  <button
                    className="btn-refresh"
                    onClick={() => window.location.reload()}
                  >
                    <i className="fa-solid fa-refresh"></i>
                    Refresh
                  </button>
                </div>
              </div>

              <div className="contributors-grid">
                {displayedUsers.length > 0 ? (
                  displayedUsers.map((u, i) => (
                    <div key={i} className={`contributor-card rank-${i + 1}`}>
                      <div className="rank-badge">
                        {i === 0 && <i className="fa-solid fa-crown"></i>}
                        {i === 1 && <i className="fa-solid fa-medal"></i>}
                        {i === 2 && <i className="fa-solid fa-award"></i>}
                        {i > 2 && <span className="rank-number">#{i + 1}</span>}
                      </div>
                      <div className="contributor-avatar">
                        <span className="avatar-initials">
                          {u.fullName
                            ? u.fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                            : "U"}
                        </span>
                      </div>
                      <div className="contributor-info">
                        <h4>{u.fullName || "Unknown User"}</h4>
                        <p className="email">{u.email}</p>
                        <div className="points-section">
                          <span className="points-badge">
                            <i className="fa-solid fa-star"></i>
                            {u.numIssueRaised || 0} pts
                          </span>
                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{
                                width: `${Math.min(
                                  ((u.numIssueRaised || 0) /
                                    Math.max(
                                      sortedUsers[0]?.numIssueRaised || 1,
                                      1
                                    )) *
                                    100,
                                  100
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="contributor-stats">
                          <span className="stat-item">
                            <i className="fa-solid fa-calendar"></i>
                            Joined:{" "}
                            {u.createdAt
                              ? new Date(u.createdAt).toLocaleDateString()
                              : "Unknown"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-contributors">
                    <i className="fa-solid fa-users-slash"></i>
                    <p>No contributors yet.</p>
                    <small>
                      Users will appear here once they start reporting issues.
                    </small>
                  </div>
                )}
              </div>
            </div>

            {/* Community Insights */}
            <div className="community-insights">
              <h3 className="section-title">
                <i className="fa-solid fa-chart-pie"></i>
                Community Insights
              </h3>
              <div className="insights-grid">
                <div className="insight-card">
                  <h4>Most Active Users</h4>
                  <div className="active-users">
                    {sortedUsers.slice(0, 3).map((user, index) => (
                      <div key={index} className="active-user">
                        <span className="user-rank">#{index + 1}</span>
                        <span className="user-name">
                          {user.fullName || "Unknown"}
                        </span>
                        <span className="user-points">
                          {user.numIssueRaised || 0} pts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="insight-card">
                  <h4>Engagement Level</h4>
                  <div className="engagement-level">
                    {users.filter((u) => (u.numIssueRaised || 0) > 5).length >
                    0 ? (
                      <>
                        <div className="level-high">
                          <i className="fa-solid fa-fire"></i>
                          <span>
                            High:{" "}
                            {
                              users.filter((u) => (u.numIssueRaised || 0) > 5)
                                .length
                            }{" "}
                            users
                          </span>
                        </div>
                        <div className="level-medium">
                          <i className="fa-solid fa-bolt"></i>
                          <span>
                            Medium:{" "}
                            {
                              users.filter(
                                (u) =>
                                  (u.numIssueRaised || 0) > 0 &&
                                  (u.numIssueRaised || 0) <= 5
                              ).length
                            }{" "}
                            users
                          </span>
                        </div>
                        <div className="level-low">
                          <i className="fa-solid fa-leaf"></i>
                          <span>
                            Low:{" "}
                            {
                              users.filter((u) => (u.numIssueRaised || 0) === 0)
                                .length
                            }{" "}
                            users
                          </span>
                        </div>
                      </>
                    ) : (
                      <p>No engagement data available yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {sortedUsers.length > 5 && (
              <div className="leaderboard-footer">
                <button
                  className="btn-view-all"
                  onClick={() => setShowFullLeaderboard((prev) => !prev)}
                >
                  <i className="fa-solid fa-users"></i>
                  {showFullLeaderboard ? "Show Less" : "View Full Leaderboard"}
                </button>
              </div>
            )}
          </div>
        );
      case "reports":
        return (
          <div className="reports-content">
            <div className="content-header">
              <h2>Reports & Analytics</h2>
              <p>Generate comprehensive reports and view detailed analytics</p>
            </div>

            {/* Report Generation Section */}
            <div className="report-generation-section">
              <h3>
                <i className="fa-solid fa-chart-line"></i>
                Generate New Report
              </h3>

              <div className="report-filters">
                <div className="filter-row">
                  <div className="filter-group">
                    <label>Time Period</label>
                    <select
                      value={reportFilters.timePeriod}
                      onChange={(e) =>
                        setReportFilters({
                          ...reportFilters,
                          timePeriod: e.target.value,
                        })
                      }
                    >
                      <option value="7days">Last 7 days</option>
                      <option value="30days">Last 30 days</option>
                      <option value="3months">Last 3 months</option>
                      <option value="1year">Last year</option>
                      <option value="custom">Custom range</option>
                    </select>
                  </div>

                  <div className="filter-group">
                    <label>Category</label>
                    <select
                      value={reportFilters.category}
                      onChange={(e) =>
                        setReportFilters({
                          ...reportFilters,
                          category: e.target.value,
                        })
                      }
                    >
                      <option value="">All Categories</option>
                      <option value="Pothole">Pothole</option>
                      <option value="Street Light">Street Light</option>
                      <option value="Garbage">Garbage</option>
                      <option value="Water">Water</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="filter-group">
                    <label>Status</label>
                    <select
                      value={reportFilters.status}
                      onChange={(e) =>
                        setReportFilters({
                          ...reportFilters,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="acknowledged">Acknowledged</option>
                      <option value="resolved">Resolved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="filter-group">
                    <label>District</label>
                    <select
                      value={reportFilters.district}
                      onChange={(e) =>
                        setReportFilters({
                          ...reportFilters,
                          district: e.target.value,
                        })
                      }
                    >
                      <option value="">All Districts</option>
                      <option value="Vellore">Vellore</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Coimbatore">Coimbatore</option>
                      <option value="Madurai">Madurai</option>
                    </select>
                  </div>
                </div>

                <div className="report-actions">
                  <button
                    className="btn-generate-report"
                    onClick={generateReport}
                    disabled={reportLoading}
                  >
                    <i className="fa-solid fa-file-export"></i>
                    {reportLoading ? "Generating..." : "Generate Report"}
                  </button>

                  <button
                    className="btn-export-csv"
                    onClick={exportReportCSV}
                    disabled={reportLoading}
                  >
                    <i className="fa-solid fa-download"></i>
                    Export CSV
                  </button>
                </div>
              </div>
            </div>

            {/* Report Results */}
            {reportData && (
              <div className="report-results">
                <div className="report-summary">
                  <h3>
                    <i className="fa-solid fa-chart-bar"></i>
                    Report Summary
                  </h3>

                  <div className="summary-stats">
                    <div className="summary-card">
                      <div className="summary-icon total">
                        <i className="fa-solid fa-list"></i>
                      </div>
                      <div className="summary-content">
                        <h4>{reportData.statistics.total}</h4>
                        <p>Total Issues</p>
                      </div>
                    </div>

                    <div className="summary-card">
                      <div className="summary-icon pending">
                        <i className="fa-solid fa-clock"></i>
                      </div>
                      <div className="summary-content">
                        <h4>{reportData.statistics.pending}</h4>
                        <p>Pending</p>
                      </div>
                    </div>

                    <div className="summary-card">
                      <div className="summary-icon resolved">
                        <i className="fa-solid fa-check-circle"></i>
                      </div>
                      <div className="summary-content">
                        <h4>{reportData.statistics.resolved}</h4>
                        <p>Resolved</p>
                      </div>
                    </div>

                    <div className="summary-card">
                      <div className="summary-icon rate">
                        <i className="fa-solid fa-percentage"></i>
                      </div>
                      <div className="summary-content">
                        <h4>{reportData.statistics.resolutionRate}%</h4>
                        <p>Resolution Rate</p>
                      </div>
                    </div>
                  </div>

                  <div className="breakdown-charts">
                    <div className="chart-section">
                      <h4>Category Breakdown</h4>
                      <div className="category-breakdown">
                        {Object.entries(reportData.breakdowns.category).map(
                          ([category, count]) => (
                            <div key={category} className="breakdown-item">
                              <span className="category-name">{category}</span>
                              <div className="breakdown-bar">
                                <div
                                  className="breakdown-fill"
                                  style={{
                                    width: `${
                                      (count / reportData.statistics.total) *
                                      100
                                    }%`,
                                  }}
                                ></div>
                              </div>
                              <span className="category-count">{count}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div className="chart-section">
                      <h4>District Breakdown</h4>
                      <div className="district-breakdown">
                        {Object.entries(reportData.breakdowns.district).map(
                          ([district, count]) => (
                            <div key={district} className="breakdown-item">
                              <span className="district-name">{district}</span>
                              <div className="breakdown-bar">
                                <div
                                  className="breakdown-fill"
                                  style={{
                                    width: `${
                                      (count / reportData.statistics.total) *
                                      100
                                    }%`,
                                  }}
                                ></div>
                              </div>
                              <span className="district-count">{count}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="response-time-analysis">
                    <h4>Response Time Analysis</h4>
                    <div className="response-stats">
                      <div className="response-card">
                        <i className="fa-solid fa-clock"></i>
                        <span>Average Response Time</span>
                        <strong>
                          {reportData.analysis.averageResponseTime} hours
                        </strong>
                      </div>
                      <div className="response-card">
                        <i className="fa-solid fa-chart-line"></i>
                        <span>Issues Analyzed</span>
                        <strong>
                          {reportData.analysis.responseTime.length} issues
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="top-contributors">
                    <h4>Top Contributors</h4>
                    <div className="contributors-list">
                      {reportData.contributors
                        .slice(0, 5)
                        .map((contributor, index) => (
                          <div
                            key={contributor.userId}
                            className="contributor-item"
                          >
                            <div className="contributor-rank">#{index + 1}</div>
                            <div className="contributor-info">
                              <span className="contributor-name">
                                {contributor.fullName}
                              </span>
                              <span className="contributor-email">
                                {contributor.email}
                              </span>
                            </div>
                            <div className="contributor-issues">
                              <span className="issue-count">
                                {contributor.issueCount}
                              </span>
                              <span className="issue-label">issues</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* <div className="reports-history">
              <h3>Report History</h3>
              <div className="reports-list">
                <div className="report-item">
                  <div className="report-icon">
                    <i className="fa-solid fa-chart-column"></i>
                  </div>
                  <div className="report-details">
                    <h4>Monthly Issues Report - September 2023</h4>
                    <p>Generated on: 01 Oct 2023 • PDF • 2.4 MB</p>
                  </div>
                  <div className="report-actions">
                    <button className="action-btn view">
                      <i className="fa-solid fa-eye"></i>
                    </button>
                    <button className="action-btn download">
                      <i className="fa-solid fa-download"></i>
                    </button>
                  </div>
                </div>

                <div className="report-item">
                  <div className="report-icon">
                    <i className="fa-solid fa-users"></i>
                  </div>
                  <div className="report-details">
                    <h4>User Activity Summary - Q3 2023</h4>
                    <p>Generated on: 28 Sep 2023 • Excel • 3.1 MB</p>
                  </div>
                  <div className="report-actions">
                    <button className="action-btn view">
                      <i className="fa-solid fa-eye"></i>
                    </button>
                    <button className="action-btn download">
                      <i className="fa-solid fa-download"></i>
                    </button>
                  </div>
                </div>

                <div className="report-item">
                  <div className="report-icon">
                    <i className="fa-solid fa-money-bill-trend-up"></i>
                  </div>
                  <div className="report-details">
                    <h4>Financial Overview - August 2023</h4>
                    <p>Generated on: 05 Sep 2023 • PDF • 1.8 MB</p>
                  </div>
                  <div className="report-actions">
                    <button className="action-btn view">
                      <i className="fa-solid fa-eye"></i>
                    </button>
                    <button className="action-btn download">
                      <i className="fa-solid fa-download"></i>
                    </button>
                  </div>
                </div>

                <div className="report-item">
                  <div className="report-icon">
                    <i className="fa-solid fa-bug"></i>
                  </div>
                  <div className="report-details">
                    <h4>System Performance & Issues - July 2023</h4>
                    <p>Generated on: 01 Aug 2023 • PDF • 4.2 MB</p>
                  </div>
                  <div className="report-actions">
                    <button className="action-btn view">
                      <i className="fa-solid fa-eye"></i>
                    </button>
                    <button className="action-btn download">
                      <i className="fa-solid fa-download"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        );
      // case "integrations":
      //   return (
      //     <div className="integrations-content">
      //       <div className="content-header">
      //         <h2>Integrations</h2>
      //         <p>Connect with third-party services and APIs</p>
      //       </div>

      //       <div className="integrations-grid">
      //         <div className="integration-card">
      //           <div className="integration-header">
      //             <div className="integration-icon">
      //               <i className="fa-brands fa-google"></i>
      //             </div>
      //             <div className="integration-status">
      //               <span className="status-badge connected">Connected</span>
      //             </div>
      //           </div>
      //           <h3>Google Maps API</h3>
      //           <p>Access to mapping services and location data</p>
      //           <div className="integration-meta">
      //             <span className="meta-item">
      //               <i className="fa-solid fa-database"></i>
      //               Location Services
      //             </span>
      //             <span className="meta-item">
      //               <i className="fa-solid fa-shield-alt"></i>
      //               OAuth 2.0
      //             </span>
      //           </div>
      //           <div className="integration-actions">
      //             <button className="btn-secondary">Configure</button>
      //             <button className="btn-primary">Manage</button>
      //           </div>
      //         </div>

      //         <div className="integration-card">
      //           <div className="integration-header">
      //             <div className="integration-icon">
      //               <i className="fa-brands fa-twitter"></i>
      //             </div>
      //             <div className="integration-status">
      //               <span className="status-badge disconnected">Disconnected</span>
      //             </div>
      //           </div>
      //           <h3>Twitter API</h3>
      //           <p>Share reports and engage with the community</p>
      //           <div className="integration-meta">
      //             <span className="meta-item">
      //               <i className="fa-solid fa-share-nodes"></i>
      //               Social Media
      //             </span>
      //             <span className="meta-item">
      //               <i className="fa-solid fa-shield-alt"></i>
      //               OAuth 1.0a
      //             </span>
      //           </div>
      //           <div className="integration-actions">
      //             <button className="btn-secondary">Configure</button>
      //             <button className="btn-connect">Connect</button>
      //           </div>
      //         </div>

      //         <div className="integration-card">
      //           <div className="integration-header">
      //             <div className="integration-icon">
      //               <i className="fa-solid fa-envelope"></i>
      //             </div>
      //             <div className="integration-status">
      //               <span className="status-badge connected">Connected</span>
      //             </div>
      //           </div>
      //           <h3>Email Service</h3>
      //           <p>Send notifications and alerts via email</p>
      //           <div className="integration-meta">
      //             <span className="meta-item">
      //               <i className="fa-solid fa-bell"></i>
      //               Notifications
      //             </span>
      //             <span className="meta-item">
      //               <i className="fa-solid fa-shield-alt"></i>
      //               SMTP
      //             </span>
      //           </div>
      //           <div className="integration-actions">
      //             <button className="btn-secondary">Configure</button>
      //             <button className="btn-primary">Manage</button>
      //           </div>
      //         </div>

      //         <div className="integration-card">
      //           <div className="integration-header">
      //             <div className="integration-icon">
      //               <i className="fa-brands fa-aws"></i>
      //             </div>
      //             <div className="integration-status">
      //               <span className="status-badge pending">Pending</span>
      //             </div>
      //           </div>
      //           <h3>AWS S3 Storage</h3>
      //           <p>Store and manage images and documents</p>
      //           <div className="integration-meta">
      //             <span className="meta-item">
      //               <i className="fa-solid fa-cloud"></i>
      //               Cloud Storage
      //             </span>
      //             <span className="meta-item">
      //               <i className="fa-solid fa-shield-alt"></i>
      //               IAM
      //             </span>
      //           </div>
      //           <div className="integration-actions">
      //             <button className="btn-secondary">Configure</button>
      //             <button className="btn-connect">Complete Setup</button>
      //           </div>
      //         </div>

      //         <div className="integration-card">
      //           <div className="integration-header">
      //             <div className="integration-icon">
      //               <i className="fa-brands fa-stripe"></i>
      //             </div>
      //             <div className="integration-status">
      //               <span className="status-badge disconnected">Disconnected</span>
      //             </div>
      //           </div>
      //           <h3>Stripe Payments</h3>
      //           <p>Process payments for premium features</p>
      //           <div className="integration-meta">
      //             <span className="meta-item">
      //               <i className="fa-solid fa-credit-card"></i>
      //               Payments
      //             </span>
      //             <span className="meta-item">
      //               <i className="fa-solid fa-shield-alt"></i>
      //               PCI DSS
      //             </span>
      //           </div>
      //           <div className="integration-actions">
      //             <button className="btn-secondary">Configure</button>
      //             <button className="btn-connect">Connect</button>
      //           </div>
      //         </div>

      //         <div className="integration-card">
      //           <div className="integration-header">
      //             <div className="integration-icon">
      //               <i className="fa-solid fa-sliders"></i>
      //             </div>
      //             <div className="integration-status">
      //               <span className="status-badge available">Available</span>
      //             </div>
      //           </div>
      //           <h3>Add New Integration</h3>
      //           <p>Browse our marketplace for more integrations</p>
      //           <div className="integration-actions">
      //             <button className="btn-primary">Explore</button>
      //           </div>
      //         </div>
      //       </div>
      //     </div>
      //   );
      // case "monthly":
      //   return (
      //     <div className="monthly-content">
      //       <div className="content-header">
      //         <h2>Monthly Reports</h2>
      //         <p>Comprehensive analysis of monthly performance metrics</p>
      //       </div>

      //       <div className="reports-overview">
      //         <div className="overview-card">
      //           <div className="overview-icon">
      //             <i className="fa-solid fa-bug"></i>
      //           </div>
      //           <div className="overview-details">
      //             <h3>1,247</h3>
      //             <p>Total Issues Reported</p>
      //           </div>
      //           <div className="overview-trend up">
      //             <i className="fa-solid fa-arrow-up"></i>
      //             <span>12%</span>
      //           </div>
      //         </div>

      //         <div className="overview-card">
      //           <div className="overview-icon">
      //             <i className="fa-solid fa-check-circle"></i>
      //           </div>
      //           <div className="overview-details">
      //             <h3>894</h3>
      //             <p>Issues Resolved</p>
      //           </div>
      //           <div className="overview-trend up">
      //             <i className="fa-solid fa-arrow-up"></i>
      //             <span>8%</span>
      //           </div>
      //         </div>

      //         <div className="overview-card">
      //           <div className="overview-icon">
      //             <i className="fa-solid fa-clock"></i>
      //           </div>
      //           <div className="overview-details">
      //             <h3>353</h3>
      //             <p>Pending Issues</p>
      //           </div>
      //           <div className="overview-trend down">
      //             <i className="fa-solid fa-arrow-down"></i>
      //             <span>5%</span>
      //           </div>
      //         </div>

      //         <div className="overview-card">
      //           <div className="overview-icon">
      //             <i className="fa-solid fa-users"></i>
      //           </div>
      //           <div className="overview-details">
      //             <h3>562</h3>
      //             <p>Active Users</p>
      //           </div>
      //           <div className="overview-trend up">
      //             <i className="fa-solid fa-arrow-up"></i>
      //             <span>15%</span>
      //           </div>
      //         </div>
      //       </div>

      //       <div className="monthly-reports">
      //         <div className="reports-header">
      //           <h3>Monthly Reports Archive</h3>
      //           <div className="time-filter">
      //             <select>
      //               <option>All Time</option>
      //               <option>2023</option>
      //               <option>2022</option>
      //               <option>2021</option>
      //             </select>
      //           </div>
      //         </div>

      //         <div className="reports-list">
      //           <div className="monthly-report-item">
      //             <div className="report-date">
      //               <span className="month">September</span>
      //               <span className="year">2023</span>
      //             </div>
      //             <div className="report-info">
      //               <h4>September 2023 Performance Report</h4>
      //               <div className="report-stats">
      //                 <span className="stat">
      //                   <i className="fa-solid fa-bug"></i>
      //                   324 issues
      //                 </span>
      //                 <span className="stat">
      //                   <i className="fa-solid fa-check"></i>
      //                   72% resolved
      //                 </span>
      //                 <span className="stat">
      //                   <i className="fa-solid fa-user"></i>
      //                   128 new users
      //                 </span>
      //               </div>
      //             </div>
      //             <div className="report-actions">
      //               <button className="action-btn view">
      //                 <i className="fa-solid fa-eye"></i>
      //               </button>
      //               <button className="action-btn download">
      //                 <i className="fa-solid fa-download"></i>
      //               </button>
      //               <button className="action-btn share">
      //                 <i className="fa-solid fa-share-nodes"></i>
      //               </button>
      //             </div>
      //           </div>

      //           <div className="monthly-report-item">
      //             <div className="report-date">
      //               <span className="month">August</span>
      //               <span className="year">2023</span>
      //             </div>
      //             <div className="report-info">
      //               <h4>August 2023 Performance Report</h4>
      //               <div className="report-stats">
      //                 <span className="stat">
      //                   <i className="fa-solid fa-bug"></i>
      //                   298 issues
      //                 </span>
      //                 <span className="stat">
      //                   <i className="fa-solid fa-check"></i>
      //                   68% resolved
      //                 </span>
      //                 <span className="stat">
      //                   <i className="fa-solid fa-user"></i>
      //                   94 new users
      //                 </span>
      //               </div>
      //             </div>
      //             <div className="report-actions">
      //               <button className="action-btn view">
      //                 <i className="fa-solid fa-eye"></i>
      //               </button>
      //               <button className="action-btn download">
      //                 <i className="fa-solid fa-download"></i>
      //               </button>
      //               <button className="action-btn share">
      //                 <i className="fa-solid fa-share-nodes"></i>
      //               </button>
      //             </div>
      //           </div>

      //           <div className="monthly-report-item">
      //             <div className="report-date">
      //               <span className="month">July</span>
      //               <span className="year">2023</span>
      //             </div>
      //             <div className="report-info">
      //               <h4>July 2023 Performance Report</h4>
      //               <div className="report-stats">
      //                 <span className="stat">
      //                   <i className="fa-solid fa-bug"></i>
      //                   275 issues
      //                 </span>
      //                 <span className="stat">
      //                   <i className="fa-solid fa-check"></i>
      //                   65% resolved
      //                 </span>
      //                 <span className="stat">
      //                   <i className="fa-solid fa-user"></i>
      //                   87 new users
      //                 </span>
      //               </div>
      //             </div>
      //             <div className="report-actions">
      //               <button className="action-btn view">
      //                 <i className="fa-solid fa-eye"></i>
      //               </button>
      //               <button className="action-btn download">
      //                 <i className="fa-solid fa-download"></i>
      //               </button>
      //               <button className="action-btn share">
      //                 <i className="fa-solid fa-share-nodes"></i>
      //               </button>
      //             </div>
      //           </div>

      //           <div className="monthly-report-item">
      //             <div className="report-date">
      //               <span className="month">June</span>
      //               <span className="year">2023</span>
      //             </div>
      //             <div className="report-info">
      //               <h4>Q2 2023 Summary Report</h4>
      //               <div className="report-stats">
      //                 <span className="stat">
      //                   <i className="fa-solid fa-bug"></i>
      //                   842 issues
      //                 </span>
      //                 <span className="stat">
      //                   <i className="fa-solid fa-check"></i>
      //                   68% resolved
      //                 </span>
      //                 <span className="stat">
      //                   <i className="fa-solid fa-user"></i>
      //                   289 new users
      //                 </span>
      //               </div>
      //             </div>
      //             <div className="report-actions">
      //               <button className="action-btn view">
      //                 <i className="fa-solid fa-eye"></i>
      //               </button>
      //               <button className="action-btn download">
      //                 <i className="fa-solid fa-download"></i>
      //               </button>
      //               <button className="action-btn share">
      //                 <i className="fa-solid fa-share-nodes"></i>
      //               </button>
      //             </div>
      //           </div>
      //         </div>
      //       </div>

      //       <div className="report-generation">
      //         <h3>Generate New Report</h3>
      //         <div className="generation-options">
      //           <div className="generation-card">
      //             <div className="generation-icon">
      //               <i className="fa-solid fa-calendar"></i>
      //             </div>
      //             <h4>Monthly Report</h4>
      //             <p>Generate a comprehensive monthly performance report</p>
      //             <button className="btn-generate">Generate</button>
      //           </div>

      //           <div className="generation-card">
      //             <div className="generation-icon">
      //               <i className="fa-solid fa-chart-pie"></i>
      //             </div>
      //             <h4>Custom Report</h4>
      //             <p>
      //               Create a custom report with specific metrics and time range
      //             </p>
      //             <button className="btn-generate">Create</button>
      //           </div>

      //           <div className="generation-card">
      //             <div className="generation-icon">
      //               <i className="fa-solid fa-download"></i>
      //             </div>
      //             <h4>Export Data</h4>
      //             <p>Export raw data for analysis in external tools</p>
      //             <button className="btn-generate">Export</button>
      //           </div>
      //         </div>
      //       </div>
      //     </div>
      //   );
      case "map":
        return <MapSection selectedIssue={selectedIssueForMap} />;
      default:
        return (
          <div className="dashboard-content">
            <MyChart />
          </div>
        );
    }
  };

  const generateReport = async () => {
    setReportLoading(true);
    try {
      const params = new URLSearchParams(reportFilters).toString();
      const res = await fetch(
        `${BACKEND_URL}/admin/generate-report?${params}`,
        {
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to generate report");
      const data = await res.json();
      setReportData(data);
      showToast("Report generated", "success");
    } catch (err) {
      showToast("Error generating report: " + err.message, "error");
    } finally {
      setReportLoading(false);
    }
  };

  const exportReportCSV = () => {
    showToast("CSV export not implemented yet.", "info");
  };

  return (
    <div className="app-container">
      {isMobile && (
        <button className="mobile-menu-toggle" onClick={toggleSidebar}>
          <i className={`fa-solid ${sidebarOpen ? "fa-xmark" : "fa-bars"}`}></i>
        </button>
      )}
      <aside
        className={`sidebar ${sidebarOpen ? "open" : "closed"} ${
          isMobile ? "mobile" : ""
        }`}
      >
        <div className="company">ProbMap</div>

        {/* Admin Profile Section */}
        {adminProfile && (
          <div className="admin-profile-section">
            <div className="profile-avatar" onClick={toggleProfileDropdown}>
              <span className="avatar-initials">
                {getInitials(adminProfile.fullName)}
              </span>
            </div>
            <div className="profile-info">
              <div className="profile-name">{adminProfile.fullName}</div>
              <div className="profile-role">{adminProfile.role}</div>
              <div className="profile-city">{adminProfile.city}</div>
            </div>

            {showProfileDropdown && (
              <div className="profile-dropdown">
                <div className="dropdown-info">
                  <div className="info-item">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{adminProfile.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">City:</span>
                    <span className="info-value">{adminProfile.city}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Role:</span>
                    <span className="info-value">{adminProfile.role}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Joined:</span>
                    <span className="info-value">
                      {new Date(adminProfile.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <nav>
          <ul>
            <li>
              <a
                className={`nav-link ${
                  activeView === "dashboard" ? "active" : ""
                }`}
                href="#"
                onClick={() => handleNavClick("dashboard")}
              >
                <i className="fa-solid fa-chart-line"></i>
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a
                className={`nav-link ${
                  activeView === "issues" ? "active" : ""
                }`}
                href="#"
                onClick={() => handleNavClick("issues")}
              >
                <i className="fa-regular fa-file-lines"></i>
                <span>Issues</span>
              </a>
            </li>
            <li>
              <a
                className={`nav-link ${
                  activeView === "pending" ? "active" : ""
                }`}
                onClick={() => handleNavClick("pending")}
              >
                <i className="fa-solid fa-box"></i>
                <span>Pending</span>
              </a>
            </li>
            <li>
              <a
                className={`nav-link ${
                  activeView === "rejected" ? "active" : ""
                }`}
                onClick={() => handleNavClick("rejected")}
              >
                <i className="fa-solid fa-box"></i>
                <span>Rejected Issue</span>
              </a>
            </li>
            <li>
              <a
                className={`nav-link ${
                  activeView === "volunteerRequests" ? "active" : ""
                }`}
                onClick={() => handleNavClick("volunteerRequests")}
              >
                <i className="fa-solid fa-user-plus"></i>
                <span>Volunteer Requests</span>
              </a>
            </li>
            <li>
              <a
                className={`nav-link ${
                  activeView === "volunteers" ? "active" : ""
                }`}
                onClick={() => handleNavClick("volunteers")}
              >
                <i className="fa-solid fa-people-carry-box"></i>
                <span>Volunteers</span>
              </a>
            </li>
            <li>
              <a
                className={`nav-link ${
                  activeView === "claims" ? "active" : ""
                }`}
                onClick={() => handleNavClick("claims")}
              >
                <i className="fa-solid fa-clipboard-check"></i>
                <span>Claims</span>
              </a>
            </li>
            <li>
              <a
                className={`nav-link ${
                  activeView === "public" ? "active" : ""
                }`}
                onClick={() => handleNavClick("public")}
              >
                <i className="fa-regular fa-user"></i>
                <span>Public</span>
              </a>
            </li>
            <li>
              <a
                className={`nav-link ${
                  activeView === "reports" ? "active" : ""
                }`}
                onClick={() => handleNavClick("reports")}
              >
                <i className="fa-regular fa-flag"></i>
                <span>Reports</span>
              </a>
            </li>
            <li>
              <a
                className={`nav-link ${activeView === "map" ? "active" : ""}`}
                onClick={() => handleNavClick("map")}
              >
                <i className="fa-solid fa-map"></i>
                <span>Map View</span>
              </a>
            </li>
          </ul>

          {/* Logout Button */}
          <div className="bottom-links">
            <a className="nav-link" href="#" onClick={handleLogout}>
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              <span>Sign out</span>
            </a>
          </div>
        </nav>
      </aside>

      {isMobile && sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <main className="main">
        <div className="content-area">{renderContent()}</div>
      </main>
      {/* Toasts */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}

function IssueCard({ issue, onUpdateStatus, onShowOnMap }) {
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [message, setMessage] = useState("");
  const [localStatus, setLocalStatus] = useState(issue.status || "pending");

  // Use populated user info from backend, fallback to window.users if needed
  let userInfo = issue.userInfo;
  if (!userInfo && window && window.users && Array.isArray(window.users)) {
    userInfo = window.users.find((u) => u._id === issue.userId);
  }

  // Status badge color
  const statusColors = {
    pending: "#ff9800",
    acknowledged: "#2196f3",
    resolved: "#4caf50",
    rejected: "#f44336",
  };
  const statusLabel =
    localStatus.charAt(0).toUpperCase() + localStatus.slice(1);

  // Avatar (initials)
  const getInitials = (name) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "U";

  // Admin response
  const showAdminResponse =
    ["rejected", "acknowledged", "resolved"].includes(localStatus) &&
    issue.adminResponse &&
    issue.adminResponse.message;

  const handleButtonClick = (status) => {
    setSelectedStatus(status.toLowerCase());
    setShowMessageBox(true);
  };

  const handleSubmit = () => {
    if (!selectedStatus) return;
    setLocalStatus(selectedStatus);
    onUpdateStatus(issue._id, selectedStatus, message);
    setShowMessageBox(false);
    setMessage("");
    setSelectedStatus("");
  };

  const statusClass = localStatus.toLowerCase();

  // Format date and time
  const formatDateTime = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
    };
  };

  const reportDateTime = formatDateTime(issue.createdAt);

  return (
    <div
      className={`issue-card ${statusClass} enhanced-card-ui horizontal-card`}
    >
      {/* Status badge */}
      <div
        className="status-badge"
        style={{ background: statusColors[statusClass] || "#888" }}
      >
        {statusLabel}
      </div>

      {/* Card Content - Horizontal Layout */}
      <div className="horizontal-card-content">
        {/* Left side - Image */}
        <div className="card-image-section">
          <img
            src={issue.imageUrl || Img}
            alt={issue.description}
            className="issue-thumb"
          />
        </div>

        {/* Right side - Details */}
        <div className="card-details-section">
          {/* User info */}
          <div className="user-info-row">
            <div className="user-avatar">
              <span>{getInitials(userInfo?.fullName || "Unknown User")}</span>
            </div>
            <div className="user-details">
              <div className="user-name">
                {userInfo?.fullName || "Unknown User"}
              </div>
              <div className="user-email">
                {userInfo?.email || issue.userId}
              </div>
              {userInfo?.phone && (
                <div className="user-phone">
                  <i className="fa-solid fa-phone"></i>
                  {userInfo.phone}
                </div>
              )}
              {userInfo?.joinedDate && (
                <div className="user-joined">
                  <i className="fa-solid fa-calendar-plus"></i>
                  Joined: {new Date(userInfo.joinedDate).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>

          {/* Issue title and description */}
          <div className="issue-title-section">
            <h3 className="issue-title">{issue.title}</h3>
            <p className="issue-desc">{issue.description}</p>
          </div>

          {/* Date and time info */}
          <div className="date-time-info">
            <div className="date-time-row">
              <i className="fa-solid fa-calendar-alt"></i>
              <span className="report-date">
                Reported: {reportDateTime.date}
              </span>
              <i className="fa-solid fa-clock"></i>
              <span className="report-time">{reportDateTime.time}</span>
            </div>
          </div>

          {/* Address info */}
          <div className="address-info">
            <i className="fa-solid fa-map-marker-alt"></i>
            <span className="issue-address">
              {issue.location?.district || issue.district || "Unknown Location"}
            </span>
          </div>

          {/* Cost estimate */}
          {issue.cost_estimate !== undefined &&
            issue.cost_estimate !== null && (
              <div className="cost-estimate">
                <i
                  className="fa-solid fa-coins"
                  style={{ color: "#FFD700" }}
                ></i>
                <span className="cost-label">Estimated Cost:</span>
                <span className="cost-value">
                  ₹
                  {issue.cost_estimate.toLocaleString?.() ??
                    issue.cost_estimate}
                </span>
              </div>
            )}

          {/* Admin response */}
          {showAdminResponse && (
            <div className="admin-response">
              <i className="fa-solid fa-shield-halved"></i>
              <div className="admin-response-content">
                <span className="admin-response-label">Admin Response:</span>
                <span className="admin-response-msg">
                  {issue.adminResponse.message}
                </span>
                <span className="admin-response-date">
                  {issue.adminResponse.respondedAt
                    ? new Date(issue.adminResponse.respondedAt).toLocaleString()
                    : ""}
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="issue-actions">
            <button
              className="btn-show-map"
              onClick={() => onShowOnMap && onShowOnMap(issue)}
            >
              <i className="fa-solid fa-map"></i>
              Show on Map
            </button>
            {localStatus !== "rejected" && (
              <>
                <button
                  className="btn-ack"
                  onClick={() => handleButtonClick("Acknowledged")}
                >
                  Acknowledge
                </button>
                <button
                  className="btn-reject"
                  onClick={() => handleButtonClick("Rejected")}
                >
                  Reject
                </button>
                <button
                  className="btn-resolve"
                  onClick={() => handleButtonClick("Resolved")}
                >
                  Resolve
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {showMessageBox && (
        <div className="message-box">
          <textarea
            placeholder="Enter a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="btn-submit" onClick={handleSubmit}>
            Submit
          </button>
          <button
            className="btn-cancel"
            onClick={() => setShowMessageBox(false)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

function ApprovedVolunteers({ BACKEND_URL, showToast }) {
  const [list, setList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/volunteer/admin/volunteers`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load volunteers");
      setList(data);
    } catch (e) {
      console.error(e);
      showToast && showToast(e.message, "error");
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    load();
  }, []);

  const removeVolunteer = async (userId) => {
    const reason = prompt("Reason for removal?") || "";
    try {
      const res = await fetch(
        `${BACKEND_URL}/volunteer/admin/volunteers/${userId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ reason }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove volunteer");
      load();
      showToast && showToast("Volunteer removed", "success");
    } catch (e) {
      showToast && showToast(e.message, "error");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (list.length === 0) return <p>No approved volunteers.</p>;
  return (
    <div className="issues-list">
      {list.map((v) => (
        <div key={v._id} className="issue-card volunteer-card">
          <div className="volunteer-head">
            <div>
              <strong>{v.fullName}</strong>
              <div className="muted">{v.email}</div>
              <div className="muted">District: {v.volunteerDistrict}</div>
              <span className="badge points">
                <i className="fa-solid fa-star"></i> {v.volunteerPoints} pts
              </span>
            </div>
            <div className="request-actions">
              <button
                className="btn btn-danger-outline"
                onClick={() => removeVolunteer(v._id)}
              >
                <i className="fa-solid fa-trash"></i> Remove
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
