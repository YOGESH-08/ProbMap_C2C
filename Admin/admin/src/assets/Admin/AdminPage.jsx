import React, { useState, useEffect } from "react";
import "./Admin_page.css";
import MyChart from "./Chart";
import { signOut } from "firebase/auth";
import { auth } from "../../components/firebase/firebaseConfig.js";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MapSection from "./Leaf.jsx"
import Img from "../photo/dog.jpg"

export default function Dashboard() {
  
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

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
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

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

  const renderContent = () => {
    switch(activeView) {
      case "dashboard":
        return (
          <div className="dashboard-content">
            <MyChart />
          </div>
        );
      case "issues":
        return (
          <div className="issues-content">
            <h2>Reported Issues</h2>
            <div className="issues-list">
              <IssueCard
                imageUrl={Img}
                problem="Broken Traffic Signal"
                description="Traffic light not working at intersection."
                severity="High"
                type="Traffic"
                city="Delhi"
                state="Delhi"
              />
              <IssueCard
                imageUrl={Img}
                problem="Garbage Pile Up"
                description="Garbage not collected for 10 days."
                severity="Medium"
                type="Sanitation"
                city="Chennai"
                state="Tamil Nadu"
              />
            </div>
          </div>
        );
      case "pending":
        return (
          <div className="pending-content">
            <h2>Pending Approvals</h2>
            <div className="pending-list">
              <IssueCard
                imageUrl={Img}
                problem="New Park Proposal"
                description="Request for new community park."
                severity="Low"
                type="Development"
                city="Hyderabad"
                state="Telangana"
              />
              <IssueCard
                imageUrl={Img}
                problem="Road Widening Project"
                description="Proposal to widen congested road."
                severity="Medium"
                type="Infrastructure"
                city="Pune"
                state="Maharashtra"
              />
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
              <h3>Rewards Program</h3>
              <div className="cards-container">
                <div className="info-card">
                  <div className="card-icon">
                    <i className="fa-solid fa-trophy"></i>
                  </div>
                  <h4>Top Contributors</h4>
                  <ul className="contributors-list">
                    <li>
                      <span className="rank">1</span>
                      <span className="name">Rahul Sharma</span>
                      <span className="points">1,240 pts</span>
                    </li>
                    <li>
                      <span className="rank">2</span>
                      <span className="name">Priya Patel</span>
                      <span className="points">980 pts</span>
                    </li>
                    <li>
                      <span className="rank">3</span>
                      <span className="name">Amit Kumar</span>
                      <span className="points">875 pts</span>
                    </li>
                  </ul>
                </div>
                
                <div className="info-card">
                  <div className="card-icon">
                    <i className="fa-solid fa-gift"></i>
                  </div>
                  <h4>Available Rewards</h4>
                  <div className="reward-item">
                    <div className="reward-name">Amazon Voucher</div>
                    <div className="reward-points">1000 pts</div>
                  </div>
                  <div className="reward-item">
                    <div className="reward-name">Movie Tickets</div>
                    <div className="reward-points">750 pts</div>
                  </div>
                  <div className="reward-item">
                    <div className="reward-name">Coffee Shop Coupon</div>
                    <div className="reward-points">500 pts</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="contributions-section">
              <h3>Recent Contributions</h3>
              <div className="contributions-table">
                <div className="table-header">
                  <span>User</span>
                  <span>Type</span>
                  <span>Date</span>
                  <span>Points</span>
                </div>
                <div className="table-row">
                  <span className="user">
                    <img src={Img} className="img1" alt="User" />
                    Neha Singh
                  </span>
                  <span className="type">Issue Reported</span>
                  <span className="date">12 Oct 2023</span>
                  <span className="points">+50</span>
                </div>
                <div className="table-row">
                  <span className="user">
                    <img src={Img} className="img1" alt="User" />
                    Vikram Mehta
                  </span>
                  <span className="type">Issue Resolved</span>
                  <span className="date">11 Oct 2023</span>
                  <span className="points">+100</span>
                </div>
                <div className="table-row">
                  <span className="user">
                    <img src={Img} className="img1" alt="User" />
                    Anjali Desai
                  </span>
                  <span className="type">Verified Report</span>
                  <span className="date">10 Oct 2023</span>
                  <span className="points">+25</span>
                </div>
              </div>
            </div>
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
      case "integrations":
        return (
          <div className="integrations-content">
            <div className="content-header">
              <h2>Integrations</h2>
              <p>Connect with third-party services and APIs</p>
            </div>
            
            <div className="integrations-grid">
              <div className="integration-card">
                <div className="integration-header">
                  <div className="integration-icon">
                    <i className="fa-brands fa-google"></i>
                  </div>
                  <div className="integration-status">
                    <span className="status-badge connected">Connected</span>
                  </div>
                </div>
                <h3>Google Maps API</h3>
                <p>Access to mapping services and location data</p>
                <div className="integration-meta">
                  <span className="meta-item">
                    <i className="fa-solid fa-database"></i>
                    Location Services
                  </span>
                  <span className="meta-item">
                    <i className="fa-solid fa-shield-alt"></i>
                    OAuth 2.0
                  </span>
                </div>
                <div className="integration-actions">
                  <button className="btn-secondary">Configure</button>
                  <button className="btn-primary">Manage</button>
                </div>
              </div>
              
              <div className="integration-card">
                <div className="integration-header">
                  <div className="integration-icon">
                    <i className="fa-brands fa-twitter"></i>
                  </div>
                  <div className="integration-status">
                    <span className="status-badge disconnected">Disconnected</span>
                  </div>
                </div>
                <h3>Twitter API</h3>
                <p>Share reports and engage with the community</p>
                <div className="integration-meta">
                  <span className="meta-item">
                    <i className="fa-solid fa-share-nodes"></i>
                    Social Media
                  </span>
                  <span className="meta-item">
                    <i className="fa-solid fa-shield-alt"></i>
                    OAuth 1.0a
                  </span>
                </div>
                <div className="integration-actions">
                  <button className="btn-secondary">Configure</button>
                  <button className="btn-connect">Connect</button>
                </div>
              </div>
              
              <div className="integration-card">
                <div className="integration-header">
                  <div className="integration-icon">
                    <i className="fa-solid fa-envelope"></i>
                  </div>
                  <div className="integration-status">
                    <span className="status-badge connected">Connected</span>
                  </div>
                </div>
                <h3>Email Service</h3>
                <p>Send notifications and alerts via email</p>
                <div className="integration-meta">
                  <span className="meta-item">
                    <i className="fa-solid fa-bell"></i>
                    Notifications
                  </span>
                  <span className="meta-item">
                    <i className="fa-solid fa-shield-alt"></i>
                    SMTP
                  </span>
                </div>
                <div className="integration-actions">
                  <button className="btn-secondary">Configure</button>
                  <button className="btn-primary">Manage</button>
                </div>
              </div>
              
              <div className="integration-card">
                <div className="integration-header">
                  <div className="integration-icon">
                    <i className="fa-brands fa-aws"></i>
                  </div>
                  <div className="integration-status">
                    <span className="status-badge pending">Pending</span>
                  </div>
                </div>
                <h3>AWS S3 Storage</h3>
                <p>Store and manage images and documents</p>
                <div className="integration-meta">
                  <span className="meta-item">
                    <i className="fa-solid fa-cloud"></i>
                    Cloud Storage
                  </span>
                  <span className="meta-item">
                    <i className="fa-solid fa-shield-alt"></i>
                    IAM
                  </span>
                </div>
                <div className="integration-actions">
                  <button className="btn-secondary">Configure</button>
                  <button className="btn-connect">Complete Setup</button>
                </div>
              </div>
              
              <div className="integration-card">
                <div className="integration-header">
                  <div className="integration-icon">
                    <i className="fa-brands fa-stripe"></i>
                  </div>
                  <div className="integration-status">
                    <span className="status-badge disconnected">Disconnected</span>
                  </div>
                </div>
                <h3>Stripe Payments</h3>
                <p>Process payments for premium features</p>
                <div className="integration-meta">
                  <span className="meta-item">
                    <i className="fa-solid fa-credit-card"></i>
                    Payments
                  </span>
                  <span className="meta-item">
                    <i className="fa-solid fa-shield-alt"></i>
                    PCI DSS
                  </span>
                </div>
                <div className="integration-actions">
                  <button className="btn-secondary">Configure</button>
                  <button className="btn-connect">Connect</button>
                </div>
              </div>
              
              <div className="integration-card">
                <div className="integration-header">
                  <div className="integration-icon">
                    <i className="fa-solid fa-sliders"></i>
                  </div>
                  <div className="integration-status">
                    <span className="status-badge available">Available</span>
                  </div>
                </div>
                <h3>Add New Integration</h3>
                <p>Browse our marketplace for more integrations</p>
                <div className="integration-actions">
                  <button className="btn-primary">Explore</button>
                </div>
              </div>
            </div>
          </div>
        );
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
                  <p>Create a custom report with specific metrics and time range</p>
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
        return <MapSection />;
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
      {/* Mobile menu toggle button */}
      {isMobile && (
        <button className="mobile-menu-toggle" onClick={toggleSidebar}>
          <i className={`fa-solid ${sidebarOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>
      )}

      {/* Sidebar with responsive classes */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'} ${isMobile ? 'mobile' : ''}`}>
        <div className="company">ProbMap</div>
        <nav>
          <ul>
            <li>
              <a 
                className={`nav-link ${activeView === "dashboard" ? "active" : ""}`} 
                href="#"
                onClick={() => handleNavClick("dashboard")}
              >
                <i className="fa-solid fa-chart-line"></i>
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a
                className={`nav-link ${activeView === "issues" ? "active" : ""}`}
                href="#"
                onClick={() => handleNavClick("issues")}
              >
                <i className="fa-regular fa-file-lines"></i>
                <span>Issues</span>
              </a>
            </li>
            <li>
              <a 
                className={`nav-link ${activeView === "pending" ? "active" : ""}`}
                onClick={() => handleNavClick("pending")}
              >
                <i className="fa-solid fa-box"></i>
                <span>Pending</span>
              </a>
            </li>
            <li>
              <a 
                className={`nav-link ${activeView === "public" ? "active" : ""}`}
                onClick={() => handleNavClick("public")}
              >
                <i className="fa-regular fa-user"></i>
                <span>Public</span>
              </a>
            </li>
            <li>
              <a 
                className={`nav-link ${activeView === "reports" ? "active" : ""}`}
                onClick={() => handleNavClick("reports")}
              >
                <i className="fa-regular fa-flag"></i>
                <span>Reports</span>
              </a>
            </li>
            <li>
              <a 
                className={`nav-link ${activeView === "integrations" ? "active" : ""}`}
                onClick={() => handleNavClick("integrations")}
              >
                <i className="fa-solid fa-plug"></i>
                <span>Integrations</span>
              </a>
            </li>
            <li>
              <a 
                className={`nav-link ${activeView === "monthly" ? "active" : ""}`}
                onClick={() => handleNavClick("monthly")}
              >
                <i className="fa-solid fa-chart-column"></i>
                <span>Monthly Reports</span>
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
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      <main className="main">
        <header className="navbar">
          <div className="company">ProbMap</div>
        </header>

        <div className="content-area">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

function IssueCard({ imageUrl, problem, description, severity, type, city, state }) {
  return (
    <div className="issue-card">
      <img src={imageUrl} alt={problem} className="issue-thumb" />
      <div className="issue-details">
        <div className="issue-header">
          <h3>{problem}</h3>
          <span className={`severity severity-${severity.toLowerCase()}`}>{severity}</span>
        </div>
        <p className="issue-desc">{description}</p>
        <div className="issue-meta">
          <span className="issue-type">{type}</span>
          <span className="issue-location">{city}, {state}</span>
        </div>
        <div className="issue-actions">
          <button className="btn-view">View Details</button>
          <button className="btn-resolve">Resolve</button>
        </div>
      </div>
    </div>
  );
}