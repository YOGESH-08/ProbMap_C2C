import React, { useState } from "react";
import "./Admin_page.css";
import MyChart from "./Chart";
import { signOut } from "firebase/auth";
import { auth } from "../../components/firebase/firebaseConfig.js";
import { useNavigate } from "react-router-dom";
import Img from "../photo/dog.jpg"

export default function Dashboard() {
  const [activeView, setActiveView] = useState("dashboard");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth); 
      console.log("Admin logged out");
      navigate("/"); 
    } catch (error) {
      console.error("Logout failed:", error);
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
                imageUrl="https://via.placeholder.com/80x80.png?text=Photo"
                problem="Broken Traffic Signal"
                description="Traffic light not working at intersection."
                severity="High"
                type="Traffic"
                city="Delhi"
                state="Delhi"
              />
              <IssueCard
                imageUrl="https://via.placeholder.com/80x80.png?text=Photo"
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
                imageUrl="https://via.placeholder.com/80x80.png?text=Photo"
                problem="New Park Proposal"
                description="Request for new community park."
                severity="Low"
                type="Development"
                city="Hyderabad"
                state="Telangana"
              />
              <IssueCard
                imageUrl="https://via.placeholder.com/80x80.png?text=Photo"
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
                    <div className="reward-name">Amazon Voucher</div><br/>
                    <div className="reward-points">1000 pts</div><br/>
                  </div>
                  <div className="reward-item">
                    <div className="reward-name">Movie Tickets</div><br/>
                    <div className="reward-points">750 pts</div><br/>
                  </div>
                  <div className="reward-item">
                    <div className="reward-name">Coffee Shop Coupon</div><br/>
                    <div className="reward-points">500 pts</div><br/>
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
                    <img src={Img} alt="User" className="img1"/>
                    Neha Singh
                  </span>
                  <span className="type">Issue Reported</span><br/>
                  <span className="date">12 Oct 2023</span><br/>
                  <span className="points">+50</span><br/>
                </div>
                <div className="table-row">
                  <span className="user">
                    <img src={Img} alt="User" className="img1" />
                    Vikram Mehta
                  </span>
                  <span className="type">Issue Resolved</span><br/>
                  <span className="date">11 Oct 2023</span><br/>
                  <span className="points">+100</span><br/>
                </div>
                <div className="table-row">
                  <span className="user">
                    <img src={Img} alt="User" className="img1"/>
                    Anjali Desai
                  </span>
                  <span className="type">Verified Report</span><br/>
                  <span className="date">10 Oct 2023</span><br/>
                  <span className="points">+25</span><br/>
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
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="company">ProbMap</div>
        <nav>
          <ul>
            <li>
              <a 
                className={`nav-link ${activeView === "dashboard" ? "active" : ""}`} 
                href="#"
                onClick={() => setActiveView("dashboard")}
              >
                <i className="fa-solid fa-chart-line"></i>
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a
                className={`nav-link ${activeView === "issues" ? "active" : ""}`}
                href="#"
                onClick={() => setActiveView("issues")}
              >
                <i className="fa-regular fa-file-lines"></i>
                <span>Issues</span>
              </a>
            </li>
            <li>
              <a 
                className={`nav-link ${activeView === "pending" ? "active" : ""}`}
                onClick={() => setActiveView("pending")}
              >
                <i className="fa-solid fa-box"></i>
                <span>Pending</span>
              </a>
            </li>
            <li>
              <a 
                className={`nav-link ${activeView === "public" ? "active" : ""}`}
                onClick={() => setActiveView("public")}
              >
                <i className="fa-regular fa-user"></i>
                <span>Public</span>
              </a>
            </li>
            <li>
              <a 
                className={`nav-link ${activeView === "reports" ? "active" : ""}`}
                onClick={() => setActiveView("reports")}
              >
                <i className="fa-regular fa-flag"></i>
                <span>Reports</span>
              </a>
            </li>
            <li>
              <a className="nav-link" href="#">
                <i className="fa-solid fa-plug"></i>
                <span>Integrations</span>
              </a>
            </li>
          </ul>

          <div className="section-title">
            SAVED REPORTS <i className="fa-solid fa-plus add-report"></i>
          </div>
          <ul>
            <li>
              <a className="nav-link" href="#">
                <i className="fa-regular fa-calendar"></i>
                <span>Current month</span>
              </a>
            </li>
            <li>
              <a className="nav-link" href="#">
                <i className="fa-regular fa-calendar"></i>
                <span>Last quarter</span>
              </a>
            </li>
            <li>
              <a className="nav-link" href="#">
                <i className="fa-regular fa-thumbs-up"></i>
                <span>Social engagement</span>
              </a>
            </li>
            <li>
              <a className="nav-link" href="#">
                <i className="fa-regular fa-calendar-check"></i>
                <span>Year-end sale</span>
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