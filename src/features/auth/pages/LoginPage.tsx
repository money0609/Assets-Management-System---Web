import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/LoginForm/LoginForm';

const LoginPage: React.FC = () => {
    const { user, loading } = useAuth();

    // Redirect to home if already logged in
    if (!loading && user) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full">
                <LoginForm />
            </div>
        </div>
    );
};

export default LoginPage;

