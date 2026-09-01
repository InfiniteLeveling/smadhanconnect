import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const RoleGuard = ({ children, allowedRoles }) => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  // If there's no profile, redirect to login
  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  // If the user's role is not in the allowed list, redirect to home
  if (!allowedRoles.includes(profile.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};
