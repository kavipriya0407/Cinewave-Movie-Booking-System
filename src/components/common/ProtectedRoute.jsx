// Role-based Route Guard
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function ProtectedRoute({ children, allowedRole }) {
  const { isAuthenticated, user, role } = useAuth();
  const location = useLocation();
  const { showToast } = useToast();

  // If not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role does not match
  if (allowedRole && role !== allowedRole) {
    if (role === 'customer' && allowedRole === 'staff') {
      return <Navigate to="/customer/dashboard" replace />;
    }
    if (role === 'staff' && allowedRole === 'customer') {
      return <Navigate to="/staff/dashboard" replace />;
    }
  }

  return children;
}
