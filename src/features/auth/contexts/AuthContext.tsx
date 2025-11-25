import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { User, UserRole } from '../types/auth.types';
import { authService } from '../services/authService';
import type { LoginRequest, LoginResponse } from '../types/auth-api.types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: LoginRequest) => Promise<LoginResponse>;
    logout: () => void;
    hasPermission: (requiredUserRole: UserRole) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const loadUser = useCallback(async (): Promise<void> => {
        try {
            const userData = await authService.getCurrentUser();
            setUser(userData);
        } catch (err: unknown) {
            // Only remove token on 401 (Unauthorized) errors
            // Network errors, 500 errors, etc. should not clear the token
            const error = err as { code?: string; message?: string; status?: number };
            const statusCode = error.status || (error.code ? parseInt(error.code) : null);
            
            if (statusCode === 401) {
                console.warn('Token invalid or expired (401), clearing localStorage');
                localStorage.removeItem('token');
                setUser(null);
            } else {
                // For other errors (network, 500, etc.), keep the token but log the error
                console.error('Failed to load user (non-401 error):', {
                    error: err,
                    status: statusCode,
                    message: error.message,
                });
                // Don't clear token for network errors or server errors
                // User might still be valid, just having temporary issues
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        console.log('AuthContext: Checking for token on mount:', token ? 'Token found' : 'No token');
        if (token) {
            console.log('AuthContext: Loading user with token');
            loadUser();
        } else {
            console.log('AuthContext: No token found, skipping user load');
            setLoading(false);
        }
    }, [loadUser]);

    const login = useCallback(async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await authService.login(credentials);
        console.log('login authcontext', response);
        localStorage.setItem('token', response.token);
        setUser(response.user);
        return response;
    }, []);

    const logout = useCallback((): void => {
        localStorage.removeItem('token');
        setUser(null);
    }, []);

    const hasPermission = useCallback((requiredUserRole: UserRole): boolean => {
        return user?.role === requiredUserRole;
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, hasPermission }}>
            {children}
        </AuthContext.Provider>
    );
};