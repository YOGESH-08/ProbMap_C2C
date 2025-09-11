import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../components/firebase/firebase"; 
import { signOut } from "firebase/auth";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="container-nav">
      <div className="left-nav">ProbMap</div>

      {/* Hamburger menu for mobile */}
      <div className="hamburger-menu" onClick={toggleMenu}>
        <div className={`hamburger-line ${isMenuOpen ? 'line1' : ''}`}></div>
        <div className={`hamburger-line ${isMenuOpen ? 'line2' : ''}`}></div>
        <div className={`hamburger-line ${isMenuOpen ? 'line3' : ''}`}></div>
      </div>

      <div className={`nav-content ${isMenuOpen ? 'active' : ''}`}>
        <div className="mid-nav">
          <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/report" className="nav-link" onClick={() => setIsMenuOpen(false)}>Report</Link>
          <Link to="/pending" className="nav-link" onClick={() => setIsMenuOpen(false)}>Pending</Link>
          <Link to="/history" className="nav-link" onClick={() => setIsMenuOpen(false)}>History</Link>
        </div>
                  
        <div className="right-nav">
          <div className="contact-button" id="Logout" onClick={handleLogout}>
            Logout
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;