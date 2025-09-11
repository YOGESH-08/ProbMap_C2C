import React, { useState } from "react";
import "../Styles/authform.css";

export default function Admin() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateInput = (id, value) => {
    if (!value.trim()) return "This field is required.";
    if (id === "password" && value.length < 6)
      return "Password must be at least 6 characters.";
    return "";
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    const msg = validateInput(id, value);
    setErrors((prev) => ({ ...prev, [id]: msg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ids = ["username", "password"];
    let valid = true;
    let newErrors = {};

    ids.forEach((id) => {
      const msg = validateInput(id, formData[id]);
      if (msg) valid = false;
      newErrors[id] = msg;
    });

    setErrors(newErrors);
    if (!valid) return;

    setLoading(true);
    setServerError("");

    try {
      const res = await fetch("http://localhost:5000/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Login failed");

      console.log("Admin logged in:", data);
      alert("Admin successfully signed in!");
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper black-white-theme">
      <div className="form-box login">
        <h2 className="animation">Admin Sign In</h2>
        <form onSubmit={handleSubmit} className="animation">
          <div className="input-box">
            <input
              id="username"
              type="text"
              placeholder=" "
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <label htmlFor="username">Username</label>
            <i className="bx bxs-user"></i>
            <span className="error-message">{errors.username}</span>
          </div>

          <div className="input-box">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder=" "
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
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

          {serverError && (
            <p className="error-message" style={{ marginBottom: "10px" }}>
              {serverError}
            </p>
          )}

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
