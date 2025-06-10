// src/components/PublicOnlyRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const PublicOnlyRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/" replace />; // Redirect to home or dashboard
  }

  return children;
};

export default PublicOnlyRoute;
