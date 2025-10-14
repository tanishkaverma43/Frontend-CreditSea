import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/UserContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'verifier' | 'borrower' | null;
  allowedRoles?: ('admin' | 'verifier' | 'borrower')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole = null, allowedRoles = null }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    const redirectPath = user?.role === 'borrower' ? '/user-dashboard' : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role as any)) {
    const redirectPath = user?.role === 'borrower' ? '/user-dashboard' : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
