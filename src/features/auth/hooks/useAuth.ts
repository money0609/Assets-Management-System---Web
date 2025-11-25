import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import type { User, UserRole } from '../types/auth.types';
import type { LoginRequest, LoginResponse } from '../types/auth-api.types';

interface UseAuthReturn {
    user: User | null;
    loading: boolean;
    login: (credentials: LoginRequest) => Promise<LoginResponse>;
    logout: () => void;
    hasPermission: (userRole: UserRole) => boolean;
}

export const useAuth = (): UseAuthReturn => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

