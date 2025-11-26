import type { User, UserRole } from './auth.types';

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    user: User;
    token: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    role: UserRole;
}

export interface RegisterResponse {
    user: User;
    token: string;
}

export interface UpdateUserRequest {
    username: string;
    password: string;
    first_name: string;
    last_name: string;
    role: UserRole;
    is_active: boolean;
}

export interface UpdateUserResponse {
    user: User;
    token: string;
}