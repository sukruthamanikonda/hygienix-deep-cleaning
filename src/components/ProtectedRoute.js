import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
    // Get user from localStorage (since we're not using AuthContext anymore)
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    // If no user is logged in
    if (!user) {
        // Redirect to appropriate login page based on required role
        return <Navigate to={allowedRole === 'admin' ? '/admin/login' : '/login'} replace />;
    }

    // If user role doesn't match required role
    if (allowedRole && user.role !== allowedRole) {
        // Redirect to appropriate page based on their actual role
        if (user.role === 'admin') {
            return <Navigate to="/admin-dashboard" replace />;
        } else {
            return <Navigate to="/customer-dashboard" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
