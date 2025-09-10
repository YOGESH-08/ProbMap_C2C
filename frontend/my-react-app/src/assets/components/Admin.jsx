import React, { useState } from "react";
import "../Styles/authform.css";

export default function Admin() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateInput = (id, value) => {
    if (!value.trim()) return "This field is required.";
    if (id === "password" && value.length < 6) return "Password must be at least 6 characters.";
    return "";
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    const msg = validateInput(id, value);
    setErrors((prev) => ({ ...prev, [id]: msg }));
  };

  const handleSubmit = (e) => {
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

    // Here you can verify admin credentials
    alert("Admin signed in! Check console.");
    console.log("Admin credentials:", formData);
  };

  return (
    <div className="wrapper black-white-theme">
      {/* ADMIN LOGIN */}
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

          <button type="submit" className="btn">
            Sign In
          </button>
        </form>
      </div>

      {/* SIDE INFO */}
      <div className="info-text login">
        <h2 className="animation">Welcome Admin</h2>
        <p className="animation">
          Please enter your credentials to access the admin dashboard.
        </p>
      </div>

      {/* Decorative Background */}
      <div className="bg-animate"></div>
      <div className="bg-animate2"></div>
    </div>
  );
}
