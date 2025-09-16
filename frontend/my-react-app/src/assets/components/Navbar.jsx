import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../components/firebase/firebase";
import { signOut } from "firebase/auth";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [userProfile, setUserProfile] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/issue/profile", {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUserProfile(data);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
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

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="container-nav">
      <div className="left-nav">ProbMap</div>

      {/* Hamburger menu for mobile */}
      <div className="hamburger-menu" onClick={toggleMenu}>
        <div className={`hamburger-line ${isMenuOpen ? "line1" : ""}`}></div>
        <div className={`hamburger-line ${isMenuOpen ? "line2" : ""}`}></div>
        <div className={`hamburger-line ${isMenuOpen ? "line3" : ""}`}></div>
      </div>

      <div className={`nav-content ${isMenuOpen ? "active" : ""}`}>
        <div className="mid-nav">
          <Link
            to="/"
            className="nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/report"
            className="nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Report
          </Link>
          <Link
            to="/pending"
            className="nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Pending
          </Link>
          <Link
            to="/history"
            className="nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            History
          </Link>
          <Link
            to="/volunteer"
            className="nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Volunteer
          </Link>
        </div>

        <div className="right-nav">
          {/* User Profile Section */}
          {userProfile && (
            <div className="user-profile-section">
              <div className="profile-avatar" onClick={toggleProfileDropdown}>
                <span className="avatar-initials">
                  {getInitials(userProfile.fullName)}
                </span>
              </div>

              {showProfileDropdown && (
                <div className="profile-dropdown">
                  <div className="profile-info">
                    <div className="profile-name">{userProfile.fullName}</div>
                    <div className="profile-email">{userProfile.email}</div>
                    <div className="profile-stats">
                      <span className="stat-item">
                        <i className="fa-solid fa-bug"></i>
                        {userProfile.numIssueRaised || 0} Issues Reported
                      </span>
                    </div>
                  </div>
                  <div className="profile-actions">
                    <button
                      className="profile-action-btn"
                      onClick={handleLogout}
                    >
                      <i className="fa-solid fa-sign-out-alt"></i>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {!userProfile && (
            <div className="contact-button" id="Logout" onClick={handleLogout}>
              Logout
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
