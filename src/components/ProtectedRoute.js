import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Retrieve token from localStorage (adjust key as needed)
  const token = localStorage.getItem("accessToken");

  // If no token is found, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the protected component
  return children;
};

export default ProtectedRoute;
