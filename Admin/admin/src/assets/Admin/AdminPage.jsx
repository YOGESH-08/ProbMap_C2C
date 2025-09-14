import React, { useState, useEffect } from "react";
import "./Admin_page.css";
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
  const BACKEND_URL = "http://localhost:5000";

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
      const res = await fetch(`http://localhost:5000/admin/${type}Issues`, {
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
    } catch (err) {
      console.error(err);
      // alert("Error updating issue: " + err.message);
    }
  };

  const handleShowOnMap = (issue) => {
    setSelectedIssueForMap(issue);
    setActiveView("map");
  };

  // Check if device is mobile
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

      case "public":
        return (
          <div className="public-content">
            <div className="content-header">
              <h2>Public Engagement</h2>
              <p>Manage user rewards and contributions</p>
            </div>

            <div className="rewards-section">
              <h3 className="section-title">Top Contributors</h3>
              <div className="contributors-grid">
                {displayedUsers.length > 0 ? (
                  displayedUsers.map((u, i) => (
                    <div key={i} className="contributor-card">
                      <div className="contributor-avatar">
                        <i className="fa-solid fa-user-circle"></i>
                      </div>
                      <div className="contributor-info">
                        <h4>{u.fullName}</h4>
                        <p className="email">{u.email}</p>
                        <span className="points-badge">
                          <i className="fa-solid fa-star"></i>{" "}
                          {u.numIssueRaised} pts
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-users">No contributors yet.</p>
                )}
              </div>
            </div>

            {sortedUsers.length > 5 && (
              <div className="leaderboard-footer">
                <button
                  className="btn-view-all"
                  onClick={() => setShowFullLeaderboard((prev) => !prev)}
                >
                  <i className="fa-solid fa-users"></i>{" "}
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
              <h2>Reports History</h2>
              <p>View and manage all generated reports</p>
            </div>

            <div className="filters-section">
              <h3>Filter Reports</h3>
              <div className="filter-options">
                <div className="filter-group">
                  <label>Time Period</label>
                  <select>
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 3 months</option>
                    <option>Last year</option>
                    <option>Custom range</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Report Type</label>
                  <select>
                    <option>All Reports</option>
                    <option>Issue Reports</option>
                    <option>User Activity</option>
                    <option>System Performance</option>
                    <option>Financial</option>
                  </select>
                </div>

                <button className="generate-btn">
                  <i className="fa-solid fa-file-export"></i>
                  Generate Report
                </button>
              </div>
            </div>

            <div className="reports-history">
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
            </div>
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
      case "monthly":
        return (
          <div className="monthly-content">
            <div className="content-header">
              <h2>Monthly Reports</h2>
              <p>Comprehensive analysis of monthly performance metrics</p>
            </div>

            <div className="reports-overview">
              <div className="overview-card">
                <div className="overview-icon">
                  <i className="fa-solid fa-bug"></i>
                </div>
                <div className="overview-details">
                  <h3>1,247</h3>
                  <p>Total Issues Reported</p>
                </div>
                <div className="overview-trend up">
                  <i className="fa-solid fa-arrow-up"></i>
                  <span>12%</span>
                </div>
              </div>

              <div className="overview-card">
                <div className="overview-icon">
                  <i className="fa-solid fa-check-circle"></i>
                </div>
                <div className="overview-details">
                  <h3>894</h3>
                  <p>Issues Resolved</p>
                </div>
                <div className="overview-trend up">
                  <i className="fa-solid fa-arrow-up"></i>
                  <span>8%</span>
                </div>
              </div>

              <div className="overview-card">
                <div className="overview-icon">
                  <i className="fa-solid fa-clock"></i>
                </div>
                <div className="overview-details">
                  <h3>353</h3>
                  <p>Pending Issues</p>
                </div>
                <div className="overview-trend down">
                  <i className="fa-solid fa-arrow-down"></i>
                  <span>5%</span>
                </div>
              </div>

              <div className="overview-card">
                <div className="overview-icon">
                  <i className="fa-solid fa-users"></i>
                </div>
                <div className="overview-details">
                  <h3>562</h3>
                  <p>Active Users</p>
                </div>
                <div className="overview-trend up">
                  <i className="fa-solid fa-arrow-up"></i>
                  <span>15%</span>
                </div>
              </div>
            </div>

            <div className="monthly-reports">
              <div className="reports-header">
                <h3>Monthly Reports Archive</h3>
                <div className="time-filter">
                  <select>
                    <option>All Time</option>
                    <option>2023</option>
                    <option>2022</option>
                    <option>2021</option>
                  </select>
                </div>
              </div>

              <div className="reports-list">
                <div className="monthly-report-item">
                  <div className="report-date">
                    <span className="month">September</span>
                    <span className="year">2023</span>
                  </div>
                  <div className="report-info">
                    <h4>September 2023 Performance Report</h4>
                    <div className="report-stats">
                      <span className="stat">
                        <i className="fa-solid fa-bug"></i>
                        324 issues
                      </span>
                      <span className="stat">
                        <i className="fa-solid fa-check"></i>
                        72% resolved
                      </span>
                      <span className="stat">
                        <i className="fa-solid fa-user"></i>
                        128 new users
                      </span>
                    </div>
                  </div>
                  <div className="report-actions">
                    <button className="action-btn view">
                      <i className="fa-solid fa-eye"></i>
                    </button>
                    <button className="action-btn download">
                      <i className="fa-solid fa-download"></i>
                    </button>
                    <button className="action-btn share">
                      <i className="fa-solid fa-share-nodes"></i>
                    </button>
                  </div>
                </div>

                <div className="monthly-report-item">
                  <div className="report-date">
                    <span className="month">August</span>
                    <span className="year">2023</span>
                  </div>
                  <div className="report-info">
                    <h4>August 2023 Performance Report</h4>
                    <div className="report-stats">
                      <span className="stat">
                        <i className="fa-solid fa-bug"></i>
                        298 issues
                      </span>
                      <span className="stat">
                        <i className="fa-solid fa-check"></i>
                        68% resolved
                      </span>
                      <span className="stat">
                        <i className="fa-solid fa-user"></i>
                        94 new users
                      </span>
                    </div>
                  </div>
                  <div className="report-actions">
                    <button className="action-btn view">
                      <i className="fa-solid fa-eye"></i>
                    </button>
                    <button className="action-btn download">
                      <i className="fa-solid fa-download"></i>
                    </button>
                    <button className="action-btn share">
                      <i className="fa-solid fa-share-nodes"></i>
                    </button>
                  </div>
                </div>

                <div className="monthly-report-item">
                  <div className="report-date">
                    <span className="month">July</span>
                    <span className="year">2023</span>
                  </div>
                  <div className="report-info">
                    <h4>July 2023 Performance Report</h4>
                    <div className="report-stats">
                      <span className="stat">
                        <i className="fa-solid fa-bug"></i>
                        275 issues
                      </span>
                      <span className="stat">
                        <i className="fa-solid fa-check"></i>
                        65% resolved
                      </span>
                      <span className="stat">
                        <i className="fa-solid fa-user"></i>
                        87 new users
                      </span>
                    </div>
                  </div>
                  <div className="report-actions">
                    <button className="action-btn view">
                      <i className="fa-solid fa-eye"></i>
                    </button>
                    <button className="action-btn download">
                      <i className="fa-solid fa-download"></i>
                    </button>
                    <button className="action-btn share">
                      <i className="fa-solid fa-share-nodes"></i>
                    </button>
                  </div>
                </div>

                <div className="monthly-report-item">
                  <div className="report-date">
                    <span className="month">June</span>
                    <span className="year">2023</span>
                  </div>
                  <div className="report-info">
                    <h4>Q2 2023 Summary Report</h4>
                    <div className="report-stats">
                      <span className="stat">
                        <i className="fa-solid fa-bug"></i>
                        842 issues
                      </span>
                      <span className="stat">
                        <i className="fa-solid fa-check"></i>
                        68% resolved
                      </span>
                      <span className="stat">
                        <i className="fa-solid fa-user"></i>
                        289 new users
                      </span>
                    </div>
                  </div>
                  <div className="report-actions">
                    <button className="action-btn view">
                      <i className="fa-solid fa-eye"></i>
                    </button>
                    <button className="action-btn download">
                      <i className="fa-solid fa-download"></i>
                    </button>
                    <button className="action-btn share">
                      <i className="fa-solid fa-share-nodes"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="report-generation">
              <h3>Generate New Report</h3>
              <div className="generation-options">
                <div className="generation-card">
                  <div className="generation-icon">
                    <i className="fa-solid fa-calendar"></i>
                  </div>
                  <h4>Monthly Report</h4>
                  <p>Generate a comprehensive monthly performance report</p>
                  <button className="btn-generate">Generate</button>
                </div>

                <div className="generation-card">
                  <div className="generation-icon">
                    <i className="fa-solid fa-chart-pie"></i>
                  </div>
                  <h4>Custom Report</h4>
                  <p>
                    Create a custom report with specific metrics and time range
                  </p>
                  <button className="btn-generate">Create</button>
                </div>

                <div className="generation-card">
                  <div className="generation-icon">
                    <i className="fa-solid fa-download"></i>
                  </div>
                  <h4>Export Data</h4>
                  <p>Export raw data for analysis in external tools</p>
                  <button className="btn-generate">Export</button>
                </div>
              </div>
            </div>
          </div>
        );
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
            {/* <li>
              <a
                className={`nav-link ${
                  activeView === "integrations" ? "active" : ""
                }`}
                onClick={() => handleNavClick("integrations")}
              >
                <i className="fa-solid fa-plug"></i>
                <span>Integrations</span>
              </a>
            </li> */}
            {/* <li>
              <a
                className={`nav-link ${
                  activeView === "monthly" ? "active" : ""
                }`}
                onClick={() => handleNavClick("monthly")}
              >
                <i className="fa-solid fa-chart-column"></i>
                <span>Monthly Reports</span>
              </a>
            </li> */}
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
            <a className="nav-link" href="#">
              <i className="fa-solid fa-gear"></i>
              <span>Settings</span>
            </a>
            <a className="nav-link" href="#" onClick={handleLogout}>
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              <span>Sign out</span>
            </a>
          </div>
        </nav>
      </aside>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <main className="main">
        <header className="navbar">
          <div className="company">ProbMap</div>
        </header>

        <div className="content-area">{renderContent()}</div>
      </main>
    </div>
  );
}

function IssueCard({ issue, onUpdateStatus, onShowOnMap }) {
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [message, setMessage] = useState("");
  const [localStatus, setLocalStatus] = useState(issue.status || "pending");

  // Find user info from Dashboard users array (window.users is a hack, ideally pass as prop)
  let userInfo = null;
  if (window && window.users && Array.isArray(window.users)) {
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
