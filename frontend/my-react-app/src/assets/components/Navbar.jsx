import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { auth } from "./firebase/firebase";
import { signOut } from "firebase/auth";
import { 
  MapPin, 
  Home, 
  PlusCircle, 
  Clock, 
  History, 
  Users, 
  LogOut, 
  LogIn, 
  User, 
  Menu, 
  X,
  ChevronDown,
  ShieldCheck
} from "lucide-react";
import "./Navbar.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function Navbar({ user }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch backend profile data when user is authenticated
  useEffect(() => {
    if (!user) {
      setUserProfile(null);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`${API_URL}/issue/profile`, {
          method: "GET",
          headers,
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUserProfile(data);
        } else {
          // Fallback to Firebase user data if backend endpoint fails
          setUserProfile({
            fullName: user.displayName || user.email?.split("@")[0] || "User",
            email: user.email,
            numIssueRaised: 0
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUserProfile({
          fullName: user.displayName || user.email?.split("@")[0] || "User",
          email: user.email,
          numIssueRaised: 0
        });
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleLogout = async () => {
    try {
      setShowDropdown(false);
      setIsMenuOpen(false);
      await signOut(auth);
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      }).catch(() => {});
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
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
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" onClick={() => setIsMenuOpen(false)}>
          <div className="brand-logo">
            <MapPin className="brand-icon" />
          </div>
          <div className="brand-text">
            <span>Prob</span>Map
            <span className="brand-badge">C2C</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="navbar-links">
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <Home className="nav-icon" />
            <span>Home</span>
          </NavLink>
          
          <NavLink to="/report" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <PlusCircle className="nav-icon" />
            <span>Report Issue</span>
          </NavLink>

          <NavLink to="/pending" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <Clock className="nav-icon" />
            <span>Pending</span>
          </NavLink>

          <NavLink to="/history" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <History className="nav-icon" />
            <span>History</span>
          </NavLink>

          <NavLink to="/volunteer" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <Users className="nav-icon" />
            <span>Volunteer</span>
          </NavLink>
        </nav>

        {/* User / Auth Actions */}
        <div className="navbar-actions">
          {user ? (
            <div className="profile-wrapper" ref={dropdownRef}>
              <button 
                className="profile-chip" 
                onClick={() => setShowDropdown(!showDropdown)}
                aria-expanded={showDropdown}
              >
                <div className="profile-avatar">
                  {getInitials(userProfile?.fullName || user.displayName || user.email)}
                </div>
                <span className="profile-chip-name">
                  {userProfile?.fullName || user.displayName || user.email?.split("@")[0]}
                </span>
                <ChevronDown className={`chevron-icon ${showDropdown ? "open" : ""}`} />
              </button>

              {showDropdown && (
                <div className="profile-menu">
                  <div className="profile-menu-header">
                    <p className="user-name">{userProfile?.fullName || "User"}</p>
                    <p className="user-email">{user.email}</p>
                    {userProfile?.numIssueRaised !== undefined && (
                      <div className="user-stat-badge">
                        <ShieldCheck className="stat-icon" />
                        <span>{userProfile.numIssueRaised} Reported Issues</span>
                      </div>
                    )}
                  </div>
                  <div className="profile-menu-divider" />
                  <button className="menu-item logout-btn" onClick={handleLogout}>
                    <LogOut className="menu-icon" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-primary login-btn">
              <LogIn className="btn-icon" />
              <span>Sign In</span>
            </Link>
          )}

          {/* Mobile Hamburger Button */}
          <button 
            className="mobile-toggle" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {isMenuOpen ? <X className="toggle-icon" /> : <Menu className="toggle-icon" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="mobile-drawer">
          <div className="mobile-drawer-links">
            <NavLink to="/" className="mobile-nav-item" onClick={() => setIsMenuOpen(false)}>
              <Home className="nav-icon" />
              <span>Home</span>
            </NavLink>
            <NavLink to="/report" className="mobile-nav-item" onClick={() => setIsMenuOpen(false)}>
              <PlusCircle className="nav-icon" />
              <span>Report Issue</span>
            </NavLink>
            <NavLink to="/pending" className="mobile-nav-item" onClick={() => setIsMenuOpen(false)}>
              <Clock className="nav-icon" />
              <span>Pending Issues</span>
            </NavLink>
            <NavLink to="/history" className="mobile-nav-item" onClick={() => setIsMenuOpen(false)}>
              <History className="nav-icon" />
              <span>History</span>
            </NavLink>
            <NavLink to="/volunteer" className="mobile-nav-item" onClick={() => setIsMenuOpen(false)}>
              <Users className="nav-icon" />
              <span>Volunteer Portal</span>
            </NavLink>
            
            {!user ? (
              <Link to="/login" className="mobile-nav-item login-mobile" onClick={() => setIsMenuOpen(false)}>
                <LogIn className="nav-icon" />
                <span>Sign In / Register</span>
              </Link>
            ) : (
              <button className="mobile-nav-item logout-mobile" onClick={handleLogout}>
                <LogOut className="nav-icon" />
                <span>Sign Out ({user.email?.split("@")[0]})</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
