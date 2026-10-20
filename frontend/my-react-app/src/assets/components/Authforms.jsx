import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  MapPin, 
  ShieldCheck, 
  Loader2 
} from "lucide-react";
import { auth } from "./firebase/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import "../Styles/authform.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function AuthForms({ initialRegister = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [isRegister, setIsRegister] = useState(initialRegister);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    loginEmail: "",
    loginPassword: "",
    regUsername: "",
    regMobile: "",
    regEmail: "",
    regPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    login: false,
    register: false,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const validateInput = (id, value) => {
    if (!value || !value.trim()) return "This field is required.";

    if (id === "regEmail" || id === "loginEmail") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return "Please enter a valid email address.";
      }
    }

    if (id === "regMobile" && !/^\d{10}$/.test(value.trim())) {
      return "Please enter a valid 10-digit mobile number.";
    }

    if ((id === "loginPassword" || id === "regPassword") && value.length < 6) {
      return "Password must be at least 6 characters.";
    }

    return "";
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    const msg = validateInput(id, value);
    setErrors((prev) => ({ ...prev, [id]: msg }));
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    let valid = true;
    let newErrors = {};

    const ids =
      type === "login"
        ? ["loginEmail", "loginPassword"]
        : ["regUsername", "regMobile", "regEmail", "regPassword"];

    ids.forEach((id) => {
      const msg = validateInput(id, formData[id]);
      if (msg) valid = false;
      newErrors[id] = msg;
    });

    setErrors(newErrors);
    if (!valid) return;

    setLoading(true);
    try {
      if (type === "login") {
        const userCred = await signInWithEmailAndPassword(
          auth,
          formData.loginEmail,
          formData.loginPassword
        );

        const idToken = await userCred.user.getIdToken();

        const res = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            idToken,
            fullName: userCred.user.displayName || formData.loginEmail.split("@")[0],
            isAdmin: false,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Backend authentication failed");

        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        toast.success("Welcome back to ProbMap!");
        navigate(from, { replace: true });
      } else {
        const userCred = await createUserWithEmailAndPassword(
          auth,
          formData.regEmail,
          formData.regPassword
        );

        const idToken = await userCred.user.getIdToken();

        const res = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            idToken,
            fullName: formData.regUsername,
            phone: formData.regMobile,
            isAdmin: false,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Registration sync failed");

        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        toast.success("Account created successfully!");
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error("Auth Error:", err);
      const msg = err.code?.replace("auth/", "").replace(/-/g, " ") || err.message;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card glass-card">
        {/* Brand Banner */}
        <div className="auth-brand-header">
          <div className="auth-brand-icon-box">
            <MapPin className="auth-brand-icon" />
          </div>
          <h2>ProbMap Civic Portal</h2>
          <p>Sign in to report infrastructure damage or volunteer in your community.</p>
        </div>

        {/* Tab Toggle */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab-btn ${!isRegister ? "active" : ""}`}
            onClick={() => {
              setIsRegister(false);
              setErrors({});
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${isRegister ? "active" : ""}`}
            onClick={() => {
              setIsRegister(true);
              setErrors({});
            }}
          >
            Create Account
          </button>
        </div>

        {/* LOGIN FORM */}
        {!isRegister ? (
          <form onSubmit={(e) => handleSubmit(e, "login")} className="auth-form" noValidate>
            <div className="auth-field-group">
              <label htmlFor="loginEmail">Email Address</label>
              <div className="auth-input-wrapper">
                <Mail className="auth-field-icon" />
                <input
                  id="loginEmail"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.loginEmail}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                />
              </div>
              {errors.loginEmail && <span className="auth-error-text">{errors.loginEmail}</span>}
            </div>

            <div className="auth-field-group">
              <label htmlFor="loginPassword">Password</label>
              <div className="auth-input-wrapper">
                <Lock className="auth-field-icon" />
                <input
                  id="loginPassword"
                  type={showPassword.login ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.loginPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword((prev) => ({ ...prev, login: !prev.login }))}
                  tabIndex={-1}
                >
                  {showPassword.login ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.loginPassword && <span className="auth-error-text">{errors.loginPassword}</span>}
            </div>

            <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="auth-spin" size={18} />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={(e) => handleSubmit(e, "register")} className="auth-form" noValidate>
            <div className="auth-field-group">
              <label htmlFor="regUsername">Full Name</label>
              <div className="auth-input-wrapper">
                <User className="auth-field-icon" />
                <input
                  id="regUsername"
                  type="text"
                  placeholder="Alex Rivera"
                  value={formData.regUsername}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                />
              </div>
              {errors.regUsername && <span className="auth-error-text">{errors.regUsername}</span>}
            </div>

            <div className="auth-field-group">
              <label htmlFor="regMobile">Mobile Number</label>
              <div className="auth-input-wrapper">
                <Phone className="auth-field-icon" />
                <input
                  id="regMobile"
                  type="tel"
                  placeholder="10-digit number"
                  value={formData.regMobile}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                />
              </div>
              {errors.regMobile && <span className="auth-error-text">{errors.regMobile}</span>}
            </div>

            <div className="auth-field-group">
              <label htmlFor="regEmail">Email Address</label>
              <div className="auth-input-wrapper">
                <Mail className="auth-field-icon" />
                <input
                  id="regEmail"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.regEmail}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                />
              </div>
              {errors.regEmail && <span className="auth-error-text">{errors.regEmail}</span>}
            </div>

            <div className="auth-field-group">
              <label htmlFor="regPassword">Password</label>
              <div className="auth-input-wrapper">
                <Lock className="auth-field-icon" />
                <input
                  id="regPassword"
                  type={showPassword.register ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={formData.regPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword((prev) => ({ ...prev, register: !prev.register }))}
                  tabIndex={-1}
                >
                  {showPassword.register ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.regPassword && <span className="auth-error-text">{errors.regPassword}</span>}
            </div>

            <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="auth-spin" size={18} />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        )}

        <div className="auth-trust-footer">
          <ShieldCheck size={14} className="text-teal" />
          <span>Secure authentication backed by Firebase & MongoDB</span>
        </div>
      </div>
    </div>
  );
}
