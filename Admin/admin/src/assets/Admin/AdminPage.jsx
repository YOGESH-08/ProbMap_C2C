import React from "react";
import "./Admin_page.css"; // move your CSS into this file
import MyChart from "./Chart"

export default function Dashboard() {
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
              <a className="nav-link" href="#">
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

          <div className="bottom-links">
            <a className="nav-link" href="#">
              <i className="fa-solid fa-gear"></i>
              <span>Settings</span>
            </a>
            <a className="nav-link" href="#">
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              <span>Sign out</span>
            </a>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main">
        <header className="navbar">
          <div className="company">ProbMap</div>
        </header>
        <div className="my-4 w-100">
            <MyChart />
        </div>
        {/* Put your main dashboard content here */}
      </main>
    </div>
  );
}
