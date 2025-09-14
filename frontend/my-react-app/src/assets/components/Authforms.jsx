import React, { useState } from "react";
import "../Styles/authform.css";

import { auth } from "./firebase/firebase"; 
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function AuthForms() {
  const [isRegister, setIsRegister] = useState(false);
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
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateInput = (id, value) => {
    if (!value.trim()) return "This field is required.";

    if (id === "regEmail" || id === "loginEmail") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return "Please enter a valid email.";
    }

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
      ? ["loginEmail", "loginPassword"]
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
        formData.loginEmail,
        formData.loginPassword
      );

      const idToken = await userCred.user.getIdToken();
      console.log("Sending request to backend...");
console.log("Payload:", {
  idToken,
  fullName: formData.regUsername,
  isAdmin: false,
});

      const res = await fetch("http://localhost:5000/auth/login", {
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
      if (!res.ok) throw new Error(data.error || "Backend login failed");

      console.log("Backend login success:", data);
      alert("Login successful!");
    } else {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        formData.regEmail,
        formData.regPassword
      );

      const idToken = await userCred.user.getIdToken();

      const res = await fetch("http://localhost:5000/auth/login", {
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
      if (!res.ok) throw new Error(data.error || "Backend registration failed");

      console.log("Backend registration success:", data);
      alert("Registration successful!");
    }
  } catch (err) {
    console.error("Auth Error:", err);
    alert(err.message);
  }
};


  return (
    <div className={`wrapper ${isRegister ? "active" : ""} black-white-theme`}>

      <div className="form-box login">
        <h2 className="animation">Login</h2>
        <form onSubmit={(e) => handleSubmit(e, "login")} className="animation">
          <div className="input-box">
            <input
              id="loginEmail"
              type="email"
              placeholder=" "
              value={formData.loginEmail}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <label htmlFor="loginEmail">Email</label>
            <i className="bx bxs-envelope"></i>
            <span className="error-message">{errors.loginEmail}</span>
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
              <i
                className={`bx ${
                  showPassword.login ? "bx-hide" : "bx-show"
                }`}
              ></i>
            </button>
            <span className="error-message">{errors.loginPassword}</span>
          </div>

          <button type="submit" className="btn">
            Login
          </button>
          <div className="logreg-link">
            <p>
              Don&apos;t have an account?{" "}
              <a href="#" onClick={() => setIsRegister(true)}>
                Register
              </a>
            </p>
          </div>
        </form>
      </div>

      <div className="form-box register">
        <h2 className="animation">Register</h2>
        <form
          onSubmit={(e) => handleSubmit(e, "register")}
          className="animation"
        >
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
                setShowPassword((prev) => ({
                  ...prev,
                  register: !prev.register,
                }))
              }
            >
              <i
                className={`bx ${
                  showPassword.register ? "bx-hide" : "bx-show"
                }`}
              ></i>
            </button>
            <span className="error-message">{errors.regPassword}</span>
          </div>

          <button type="submit" className="btn">
            Register
          </button>
          <div className="logreg-link">
            <p>
              Already have an account?{" "}
              <a href="#" onClick={() => setIsRegister(false)}>
                Login
              </a>
            </p>
          </div>
        </form>
      </div>

      <div className="info-text login">
        <h2 className="animation">Welcome Back!</h2>
        <p className="animation">
          To keep connected with us please login with your personal info.
        </p>
      </div>
      <div className="info-text register">
        <h2 className="animation">Hello, Friend!</h2>
        <p className="animation">
          Enter your personal details and start your journey with us.
        </p>
      </div>

      <div className="bg-animate"></div>
      <div className="bg-animate2"></div>
    </div>
  );
}
