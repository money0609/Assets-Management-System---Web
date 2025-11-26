export type UserRole = 'admin' | 'manager' | 'viewer' | 'unknown';
export interface User {
    is_active: boolean;
    password: string;
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    role: UserRole;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}

