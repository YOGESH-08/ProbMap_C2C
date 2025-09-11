import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../components/firebase/firebaseConfig.js";
import { useNavigate } from "react-router-dom";


export default function AdminPage() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth); 
      console.log("Logged out successfully");
      navigate("/"); 
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="admin-page">
      <h1>Welcome Admin</h1>
      <p>You are logged in.</p>
      <button onClick={handleLogout} className="btn logout-btn">
        Logout
      </button>
    </div>
  );
}
