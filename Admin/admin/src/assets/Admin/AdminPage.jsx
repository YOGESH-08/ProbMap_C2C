import React, { useState } from "react";
import "./Admin_page.css";
import MyChart from "./Chart";
import { signOut } from "firebase/auth";
import { auth } from "../../components/firebase/firebaseConfig.js";
import { useNavigate } from "react-router-dom";

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
              <a className="nav-link" href="#">
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
        <div className="kanban-card high">
          <h3>Pothole near bus stop</h3>
          <p>Large pothole causing traffic issues.</p>
          <span className="meta">Priority: High</span>
        </div>
        <div className="kanban-card medium">
          <h3>Streetlight not working</h3>
          <p>Streetlight is off near main junction.</p>
          <span className="meta">Priority: Medium</span>
        </div>
      </div>

      {/* Column 2 - In Progress */}
      <div className="kanban-column">
        <h2>In Progress</h2>
        <div className="kanban-card low">
          <h3>Garbage collection delay</h3>
          <p>Garbage not collected in sector 12.</p>
          <span className="meta">Priority: Low</span>
        </div>
      </div>

      {/* Column 3 - Resolved */}
      <div className="kanban-column">
        <h2>Resolved</h2>
        <div className="kanban-card medium">
          <h3>Broken water pipe</h3>
          <p>Water pipe fixed near market area.</p>
          <span className="meta">Priority: Medium</span>
        </div>
      </div>
    </div>
    

    
      </main>
    </div>
  );
}
