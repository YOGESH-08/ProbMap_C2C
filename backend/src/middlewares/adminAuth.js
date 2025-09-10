import React, { useState } from "react";
import "../Styles/authform.css";
import { auth } from "../firebase/firebase"; 
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

export default function AuthForms() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    loginUsername: "",
    loginPassword: "",
    regUsername: "",
    regMobile: "",
    regEmail: "",
    regPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState({ login: false, register: false });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateInput = (id, value) => {
    if (!value.trim()) return "This field is required.";

    if (id === "regEmail" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Please enter a valid email.";

    if (id === "regMobile" && !/^\d{10}$/.test(value))
      return "Please enter a valid 10-digit mobile number.";

    if ((id === "loginPassword" || id === "regPassword") && value.length < 6)
      return "Password must be at least 6 characters.";

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
        ? ["loginUsername", "loginPassword"]
        : ["regUsername", "regMobile", "regEmail", "regPassword"];

    ids.forEach((id) => {
      const msg = validateInput(id, formData[id]);
      if (msg) valid = false;
      newErrors[id] = msg;
    });

    setErrors(newErrors);
    if (!valid) return;

    try {
      if (type === "login") {
        const userCred = await signInWithEmailAndPassword(
          auth,
          formData.loginUsername,
          formData.loginPassword
        );
        const idToken = await userCred.user.getIdToken();
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idToken,
            fullName: userCred.user.displayName || formData.loginUsername,
          }),
          credentials: "include", 
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        alert("Login successful!");
        console.log("User:", data.user);

      } else {
        const userCred = await createUserWithEmailAndPassword(
          auth,
          formData.regEmail,
          formData.regPassword
        );

        const idToken = await userCred.user.getIdToken();

        const res = await fetch("/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idToken,
            fullName: formData.regUsername,
            phone: `+91${formData.regMobile}`, 
          }),
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        alert("Registration successful!");
        console.log("User created:", data.user);
      }
    } catch (error) {
      console.error("Auth error:", error);
      alert(error.message);
    }
  };

  return (
    <div className={`wrapper ${isRegister ? "active" : ""} black-white-theme`}>

      <div className="form-box login">
        <h2 className="animation">Login</h2>
        <form onSubmit={(e) => handleSubmit(e, "login")} className="animation">
          <div className="input-box">
            <input
              id="loginUsername"
              type="email"
              placeholder=" "
              value={formData.loginUsername}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <label htmlFor="loginUsername">Email</label>
            <i className="bx bxs-user"></i>
            <span className="error-message">{errors.loginUsername}</span>
          </div>

          <div className="input-box">
            <input
              id="loginPassword"
              type={showPassword.login ? "text" : "password"}
              placeholder=" "
              value={formData.loginPassword}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <label htmlFor="loginPassword">Password</label>
            <i className="bx bxs-lock-alt"></i>
            <button
              type="button"
              className="toggle-password"
              onClick={() =>
                setShowPassword((prev) => ({ ...prev, login: !prev.login }))
              }
            >
              <i className={`bx ${showPassword.login ? "bx-hide" : "bx-show"}`}></i>
            </button>
            <span className="error-message">{errors.loginPassword}</span>
          </div>

          <button type="submit" className="btn">Login</button>
          <div className="logreg-link">
            <p>
              Don't have an account?{" "}
              <a href="#" onClick={() => setIsRegister(true)}>Register</a>
            </p>
          </div>
        </form>
      </div>

      <div className="form-box register">
        <h2 className="animation">Register</h2>
        <form onSubmit={(e) => handleSubmit(e, "register")} className="animation">
          <div className="input-box">
            <input
              id="regUsername"
              type="text"
              placeholder=" "
              value={formData.regUsername}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <label htmlFor="regUsername">Username</label>
            <i className="bx bxs-user"></i>
            <span className="error-message">{errors.regUsername}</span>
          </div>

          <div className="input-box">
            <input
              id="regMobile"
              type="text"
              placeholder=" "
              value={formData.regMobile}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <label htmlFor="regMobile">Mobile Number</label>
            <i className="bx bxs-phone"></i>
            <span className="error-message">{errors.regMobile}</span>
          </div>

          <div className="input-box">
            <input
              id="regEmail"
              type="email"
              placeholder=" "
              value={formData.regEmail}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <label htmlFor="regEmail">Email</label>
            <i className="bx bxs-envelope"></i>
            <span className="error-message">{errors.regEmail}</span>
          </div>

          <div className="input-box">
            <input
              id="regPassword"
              type={showPassword.register ? "text" : "password"}
              placeholder=" "
              value={formData.regPassword}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <label htmlFor="regPassword">Password</label>
            <i className="bx bxs-lock-alt"></i>
            <button
              type="button"
              className="toggle-password"
              onClick={() =>
                setShowPassword((prev) => ({ ...prev, register: !prev.register }))
              }
            >
              <i className={`bx ${showPassword.register ? "bx-hide" : "bx-show"}`}></i>
            </button>
            <span className="error-message">{errors.regPassword}</span>
          </div>

          <button type="submit" className="btn">Register</button>
          <div className="logreg-link">
            <p>
              Already have an account?{" "}
              <a href="#" onClick={() => setIsRegister(false)}>Login</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
