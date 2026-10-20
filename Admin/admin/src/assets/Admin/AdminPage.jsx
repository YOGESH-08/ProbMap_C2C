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

import Sidebar from "./Sidebar.jsx";
import DashboardLanding from "./DashboardLanding.jsx";
import IssuesView from "./IssuesView.jsx";
import VolunteerRequestsView from "./VolunteerRequestsView.jsx";
import VolunteersView from "./VolunteersView.jsx";
import ClaimsView from "./ClaimsView.jsx";
import PublicView from "./PublicView.jsx";
import ReportsView from "./ReportsView.jsx";

const BACKEND_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

export default function Dashboard() {
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
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
  const [volunteerRequests, setVolunteerRequests] = useState([]);
  const [claims, setClaims] = useState([]);
  const [volLoading, setVolLoading] = useState(false);
  const [users, setUsers] = useState([]);

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
    if (activeView === "claims") fetchClaims();
  }, [activeView]);

  const handleUpdateStatus = async (id, status, message = "") => {
    try {
      const res = await fetch(`${BACKEND_URL}/admin/update-issue/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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
    } catch (err) {
      console.error("Error fetching admin profile:", err);
    }
  };

  useEffect(() => {
    fetchAdminProfile();
  }, []);

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
      const status = action === "approve" ? "approved" : "rejected";
      const res = await fetch(
        `${BACKEND_URL}/volunteer/admin/requests/${userId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");
      fetchVolunteerRequests();
      showToast(`Request ${status}`, "success");
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const updateVolunteerStatusWithReason = async (userId, action, reason) => {
    try {
      const status = action === "approve" ? "approved" : "rejected";
      const res = await fetch(
        `${BACKEND_URL}/volunteer/admin/requests/${userId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status, reason }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");
      fetchVolunteerRequests();
      showToast(`Request ${status}`, "success");
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
      const status = action === "approve" ? "approved" : "rejected";
      const body = { status };
      const res = await fetch(
        `${BACKEND_URL}/volunteer/admin/claims/${issueId}/review`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to review claim");
      fetchClaims();
      fetchCityIssues();
      showToast(`Claim ${status}`, "success");
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
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/admin/users`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
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
    if (isMobile) setSidebarOpen(false);
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

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <DashboardLanding
            adminProfile={adminProfile}
            handleNavClick={handleNavClick}
          />
        );
      case "issues":
        return (
          <IssuesView
            issues={issues}
            title="Reported Issues - Resolved and Acknowledged"
            onUpdateStatus={handleUpdateStatus}
            onShowOnMap={handleShowOnMap}
          />
        );
      case "pending":
        return (
          <IssuesView
            issues={issues}
            title="Pending Approvals"
            onUpdateStatus={handleUpdateStatus}
            onShowOnMap={handleShowOnMap}
          />
        );
      case "rejected":
        return (
          <IssuesView
            issues={issues}
            title="Rejected Issues"
            onUpdateStatus={handleUpdateStatus}
            onShowOnMap={handleShowOnMap}
          />
        );
      case "volunteerRequests":
        return (
          <VolunteerRequestsView
            volunteerRequests={volunteerRequests}
            volLoading={volLoading}
            fetchVolunteerRequests={fetchVolunteerRequests}
            updateVolunteerStatus={updateVolunteerStatus}
            updateVolunteerStatusWithReason={updateVolunteerStatusWithReason}
            showToast={showToast}
          />
        );
      case "volunteers":
        return (
          <VolunteersView BACKEND_URL={BACKEND_URL} showToast={showToast} />
        );
      case "claims":
        return (
          <ClaimsView
            claims={claims}
            volLoading={volLoading}
            fetchClaims={fetchClaims}
            reviewClaim={reviewClaim}
            fetchCityIssues={fetchCityIssues}
            showToast={showToast}
          />
        );
      case "public":
        return (
          <PublicView
            users={users}
            showFullLeaderboard={showFullLeaderboard}
            setShowFullLeaderboard={setShowFullLeaderboard}
          />
        );
      case "reports":
        return (
          <ReportsView
            reportFilters={reportFilters}
            setReportFilters={setReportFilters}
            reportData={reportData}
            reportLoading={reportLoading}
            generateReport={generateReport}
            exportReportCSV={exportReportCSV}
          />
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

  const generateReport = async () => {
    setReportLoading(true);
    try {
      const bodyPayload = {
        ...reportFilters,
        startDate: reportFilters.startDate
          ? new Date(reportFilters.startDate)
          : null,
        endDate: reportFilters.endDate ? new Date(reportFilters.endDate) : null,
      };

      const res = await fetch(`${BACKEND_URL}/admin/reports/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(bodyPayload),
      });

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
      <Sidebar
        adminProfile={adminProfile}
        activeView={activeView}
        showProfileDropdown={showProfileDropdown}
        toggleProfileDropdown={toggleProfileDropdown}
        handleNavClick={handleNavClick}
        handleLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
        getInitials={getInitials}
      />

      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      <main className="main">
        <div className="content-area">{renderContent()}</div>
      </main>

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