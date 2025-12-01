import axios, { type AxiosInstance, type AxiosError } from 'axios';
import type { ApiError, FastAPIValidationError } from '../types/common.types';

// Validate environment variable
const apiUrl = import.meta.env.VITE_API_URL;
if (!apiUrl) {
    console.error('VITE_API_URL is not defined. Please set it in your .env file.');
    throw new Error('VITE_API_URL environment variable is required');
}

const apiClient: AxiosInstance = axios.create({
    baseURL: apiUrl,
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
        const responseData = error.response?.data;
        
        // Handle FastAPI validation errors (422) - detail can be string or array
        let message = error.message;
        if (responseData) {
            if (responseData.detail) {
                if (Array.isArray(responseData.detail)) {
                    // Format validation errors: "field: error message"
                    message = responseData.detail
                        .map((err: FastAPIValidationError) => {
                            const field = err.loc[err.loc.length - 1];
                            return `${field}: ${err.msg}`;
                        })
                        .join(', ');
                } else {
                    message = responseData.detail as string;
                }
            } else if (responseData.message) {
                message = responseData.message;
            }
        }
        
        const apiError: ApiError = {
            message,
            code: responseData?.code || error.response?.status?.toString(),
            field: responseData?.field,
            detail: responseData?.detail,
            status: error.response?.status,
        };
        return Promise.reject(apiError);
    }
);

export { apiClient };