import axios, { type AxiosInstance, type AxiosError } from 'axios';
import type { ApiError } from '../types/common.types';

const apiClient: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => response?.data,
    (error: AxiosError<ApiError>) => {
        const apiError: ApiError = {
            message: error.response?.data?.message || error.message,
            code: error.response?.data?.code || error.response?.status?.toString(),
            field: error.response?.data?.field,
        };
        // Add status code to error for better error handling
        (apiError as ApiError & { status?: number }).status = error.response?.status;
        return Promise.reject(apiError);
    }
);

export { apiClient };