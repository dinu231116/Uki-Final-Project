import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken'); // ✅ same key as AdminLogin.jsx

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default PrivateRoute;
