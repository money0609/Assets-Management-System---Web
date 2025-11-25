import { apiClient as api } from '../../../services/apiClient';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types/auth-api.types';
import type { User } from '../types/auth.types';

class AuthService {

    async login(credentials: LoginRequest): Promise<LoginResponse> {
        // Backend expects form data (application/x-www-form-urlencoded) for OAuth2PasswordRequestForm
        const formData = new URLSearchParams();
        formData.append('username', credentials.username);
        formData.append('password', credentials.password);
        formData.append('grant_type', 'password');
        
        // Backend returns { access_token, token_type }, not { user, token }
        // Send form data with proper content-type
        // Note: apiClient interceptor returns response.data, so response is already the data object
        const response = await api.post<{ access_token: string; token_type: string }>(
            '/auth/login',
            formData.toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        ) as unknown as { access_token: string; token_type: string };
        
        // Extract token from response
        const token = response.access_token;
        
        // Store token temporarily to fetch user
        localStorage.setItem('token', token);
        
        // Get user info using the token
        const user = await this.getCurrentUser();
        
        return {
            user,
            token,
        };
    }

    async register(data: RegisterRequest, token?: string): Promise<RegisterResponse> {
        const config = token ? {
            headers: {
                Authorization: `Bearer ${token}`
            }
        } : undefined;
        const response = await api.post<RegisterResponse>('/auth/register', data, config);
        return response as unknown as RegisterResponse;
    }

    async getCurrentUser(): Promise<User> {
        const response = await api.get<User>('/auth/me');
        return response as unknown as User;
    }

    async getAllUsers(): Promise<User[]> {
        const response = await api.get<User[]>('/auth/users');
        return response as unknown as User[];
    }
};

export const authService = new AuthService();