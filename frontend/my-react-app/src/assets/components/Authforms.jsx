import React, { useState } from "react";
import "../Styles/authform.css";

export default function AuthCarousel() {
  const [activePanel, setActivePanel] = useState("login"); // "login" | "register" | "admin"

  return (
    <div className={`wrapper ${activePanel}-active`}>
      {/* USER LOGIN */}
      <div className="form-box login">
        <h2>User Login</h2>
        <form>
          <div className="input-box">
            <input type="text" placeholder=" " required />
            <label>Username</label>
            <i className="bx bxs-user"></i>
          </div>
          <div className="input-box">
            <input type="password" placeholder=" " required />
            <label>Password</label>
            <i className="bx bxs-lock-alt"></i>
          </div>
          <button type="submit" className="btn">Login</button>
          <div className="logreg-link">
            <p>
              Don’t have an account?{" "}
              <a href="#" onClick={() => setActivePanel("register")}>Register</a>
            </p>
            <p>
              Admin?{" "}
              <a href="#" onClick={() => setActivePanel("admin")}>Login here</a>
            </p>
          </div>
        </form>
      </div>

      {/* REGISTER */}
      <div className="form-box register">
        <h2>Register</h2>
        <form>
          <div className="input-box">
            <input type="text" placeholder=" " required />
            <label>Username</label>
            <i className="bx bxs-user"></i>
          </div>
          <div className="input-box">
            <input type="email" placeholder=" " required />
            <label>Email</label>
            <i className="bx bxs-envelope"></i>
          </div>
          <div className="input-box">
            <input type="password" placeholder=" " required />
            <label>Password</label>
            <i className="bx bxs-lock-alt"></i>
          </div>
          <button type="submit" className="btn">Register</button>
          <div className="logreg-link">
            <p>
              Already have an account?{" "}
              <a href="#" onClick={() => setActivePanel("login")}>Login</a>
            </p>
          </div>
        </form>
      </div>

      {/* ADMIN LOGIN */}
      <div className="form-box admin">
        <h2>Admin Login</h2>
        <form>
          <div className="input-box">
            <input type="text" placeholder=" " required />
            <label>Admin ID</label>
            <i className="bx bxs-id-card"></i>
          </div>
          <div className="input-box">
            <input type="password" placeholder=" " required />
            <label>Password</label>
            <i className="bx bxs-lock-alt"></i>
          </div>
          <button type="submit" className="btn">Login as Admin</button>
          <div className="logreg-link">
            <p>
              Back to{" "}
              <a href="#" onClick={() => setActivePanel("login")}>User Login</a>
            </p>
          </div>
        </form>
      </div>

      {/* INFO TEXTS */}
      <div className="info-text login">
        <h2>Welcome Back!</h2>
        <p>Login with your personal account to continue.</p>
      </div>
      <div className="info-text register">
        <h2>Hello, Friend!</h2>
        <p>Create your account and join us today.</p>
      </div>
      <div className="info-text admin">
        <h2>Admin Panel</h2>
        <p>Restricted access — please login with admin credentials.</p>
      </div>

      {/* Backgrounds */}
      <div className="bg-animate"></div>
      <div className="bg-animate2"></div>
    </div>
  );
}
