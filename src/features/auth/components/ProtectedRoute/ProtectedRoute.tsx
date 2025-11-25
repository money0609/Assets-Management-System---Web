import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { UserRole } from '../../types/auth.types';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredUserRole?: UserRole;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredUserRole }) => {
    const { user, loading, hasPermission } = useAuth();
    console.log('protectedroute user: ', user);
    console.log('loading: ', loading)
    console.log('Permission: ',requiredUserRole, ' - ', hasPermission(requiredUserRole as UserRole));
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    if (!user || (requiredUserRole && !hasPermission(requiredUserRole as UserRole))) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;

