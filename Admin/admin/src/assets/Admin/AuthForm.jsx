import React, { useState } from "react";
import "./AuthForm.css";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../components/firebase/firebaseConfig.js";
import { useNavigate } from "react-router-dom";

export default function AuthForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isAdminVerified, setIsAdminVerified] = useState(false);
const [verificationDone, setVerificationDone] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" })); 
  };

  const validateInput = (id, value) => {
    if (!value.trim()) return "This field is required.";
    if (id === "password" && value.length < 6)
      return "Password must be at least 6 characters.";
    return "";
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    setErrors((prev) => ({ ...prev, [id]: validateInput(id, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    let valid = true;

    ["email", "password"].forEach((id) => {
      const msg = validateInput(id, formData[id]);
      if (msg) valid = false;
      newErrors[id] = msg;
    });

    setErrors(newErrors);
    if (!valid) return;

    setLoading(true);
    setServerError("");

    try {
      const userCred = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const idToken = await userCred.user.getIdToken();
     const res = await fetch(`http://localhost:5000/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ idToken }),
      });
if (!res.ok) {
  await signOut(auth);
  const data = await res.json().catch(() => ({}));
  throw new Error(data.error || "Login failed. You are not an admin.");
}
      const data = await res.json();
      
      if(res.ok){
      console.log("Admin logged in:", data);
      navigate("/admin"); 
       setIsAdminVerified(true);
      }
    } catch (err) {
      console.error("Login failed:", err);
      setServerError(err.message);
    } finally {
      setLoading(false);
      setVerificationDone(true);
    }
  };

  return (
    <div className="wrapper black-white-theme">
      <div className="form-box login">
        <h2 className="animation">Admin Sign In</h2>
        <form onSubmit={handleSubmit} className="animation">
          {/* Email */}
          <div className="input-box">
            <input
              id="email"
              type="email"
              placeholder=" "
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            <label htmlFor="email">Email</label>
            <i className="bx bxs-user"></i>
            <span className="error-message">{errors.email}</span>
          </div>

          {/* Password */}
          <div className="input-box">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder=" "
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            <label htmlFor="password">Password</label>
            <i className="bx bxs-lock-alt"></i>
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={`bx ${showPassword ? "bx-hide" : "bx-show"}`}></i>
            </button>
            <span className="error-message">{errors.password}</span>
          </div>

          {/* Error Message */}
          {serverError && (
            <p className="error-message" style={{ marginBottom: "10px" }}>
              {serverError}
            </p>
          )}

          {/* Submit Button */}
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>

      <div className="info-text login">
        <h2 className="animation">Welcome Admin</h2>
        <p className="animation">
          Please enter your credentials to access the admin dashboard.
        </p>
      </div>

      <div className="bg-animate"></div>
      <div className="bg-animate2"></div>
    </div>
  );
}
