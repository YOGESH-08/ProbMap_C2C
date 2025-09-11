import React, { useState } from "react";
import "./Admin_page.css";
import MyChart from "./Chart";
import { signOut } from "firebase/auth";
import { auth } from "../../components/firebase/firebaseConfig.js";
import { useNavigate, Route, Routes } from "react-router-dom";
import PendingPage from "./PendingPage";

export default function Dashboard() {
  const [showChart, setShowChart] = useState(true);
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

  return (
    <>
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="company">ProbMap</div>
        <nav>
          <ul>
            <li>
              <a className="nav-link active" href="#">
                <i className="fa-solid fa-chart-line"></i>
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a
                className="nav-link"
                href="#"
                onClick={() => setShowChart(false)} 
              >
                <i className="fa-regular fa-file-lines"></i>
                <span>Issues</span>
              </a>
            </li>
            <li>
              <a className="nav-link" onClick={() => navigate("/pending")}>
                <i className="fa-solid fa-box"></i>
                <span>Pending</span>
              </a>
            </li>
            <li>
              <a className="nav-link" href="#">
                <i className="fa-regular fa-user"></i>
                <span>Public</span>
              </a>
            </li>
            <li>
              <a className="nav-link" href="#">
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

          {/* ✅ Logout Button */}
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

        <div className={`my-4 w-100 ${showChart ? "" : "hidden"}`}>
          <MyChart />
        </div>

        <div className="kanban-board">
          {/* Column 1 - Open */}
          <div className="kanban-column">
            <h2>Open</h2>
            <IssueCard
              imageUrl="https://via.placeholder.com/80x80.png?text=Photo"
              problem="Pothole on Main Street"
              description="Huge pothole near bus stop."
              severity="High"
              type="Road"
              city="Bengaluru"
              state="Karnataka"
            />
            <IssueCard
              imageUrl="https://via.placeholder.com/80x80.png?text=Photo"
              problem="Street Light Not Working"
              description="Street light has been off for 5 nights."
              severity="Low"
              type="Electricity"
              city="Mumbai"
              state="Maharashtra"
            />
          </div>
        </div>

      </main>
    </div>

    <Routes>
      {/* Other routes */}
      <Route path="/pending" element={<PendingPage />} />
    </Routes>
    </>
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
      </div>
    </div>
  );
}
