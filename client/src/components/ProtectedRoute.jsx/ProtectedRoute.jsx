import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // If user is not logged in, redirect to login
    return <Navigate to="/ask" replace />;
  }

  return children; // User is logged in, render the page
};

export default ProtectedRoute;
