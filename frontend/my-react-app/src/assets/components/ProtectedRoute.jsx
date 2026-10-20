import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ user, children }) {
  const location = useLocation();

  if (!user) {
    // Redirect to login page and preserve intended location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
