import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { auth } from "../components/firebase/firebase"; 
import { signOut } from "firebase/auth";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="container-nav">
      <div className="left-nav">ProbMap</div>

      <div className="mid-nav">
        <Link to="/" className="home">Home</Link>
        <Link to="/report" className="report">Report</Link>
        <Link to="/history" className="solution">History</Link>
      </div>

      <div className="contact-button" id="Logout" onClick={handleLogout}>
        Logout
      </div>
    </div>
  );
}

export default Navbar;
