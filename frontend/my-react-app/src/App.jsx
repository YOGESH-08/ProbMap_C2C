import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./assets/components/Navbar";
import Home from "./assets/components/Home";
import Upload from "./assets/components/Upload";
import UserIssues from "./assets/components/UserIssues";
import VolunteerIssues from "./assets/components/VolunteerIssues";
import AuthForms from "./assets/components/Authforms";
import Footer from "./assets/components/Footer";
import ProtectedRoute from "./assets/components/ProtectedRoute";
import { auth } from "./assets/components/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function App() {
  const [user, setUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthChecking(false);
      if (currentUser) {
        try {
          const idToken = await currentUser.getIdToken();
          const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
          const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              idToken,
              fullName: currentUser.displayName || currentUser.email?.split("@")[0],
              isAdmin: false,
            }),
          });
          const data = await res.json();
          if (data.token) {
            localStorage.setItem("token", data.token);
          }
        } catch (e) {
          console.warn("Session token sync:", e);
        }
      } else {
        localStorage.removeItem("token");
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#131927",
              color: "#f8fafc",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
              fontSize: "0.9rem",
            },
          }}
        />
        <Navbar user={user} />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route
              path="/login"
              element={user ? <Navigate to="/" replace /> : <AuthForms initialRegister={false} />}
            />
            <Route
              path="/register"
              element={user ? <Navigate to="/" replace /> : <AuthForms initialRegister={true} />}
            />
            <Route
              path="/report"
              element={
                <ProtectedRoute user={user}>
                  <Upload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pending"
              element={
                <ProtectedRoute user={user}>
                  <UserIssues filterStatus="pending" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute user={user}>
                  <UserIssues filterStatus="history" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/volunteer"
              element={
                <ProtectedRoute user={user}>
                  <VolunteerIssues />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
