import type { User } from './auth.types';

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
}

export interface RegisterResponse {
    user: User;
    token: string;
}

