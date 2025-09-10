import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <div className="container-nav">
      <div className="left-nav">ProbMap</div>

      <div className="mid-nav">
        <Link to="/" className="home">Home</Link>
        <Link to="/report" className="report">Report</Link>
        <Link to="/history" className="solution">History</Link>
      </div>

      <div className="contact-button" id="Login">Logout</div>
    </div>
  );
}

export default Navbar;
