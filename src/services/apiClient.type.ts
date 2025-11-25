import type { AxiosInstance, AxiosRequestConfig } from 'axios';

// Most common: Just use AxiosInstance directly
export type ApiClient = AxiosInstance;

// Optional: Configuration interface
export interface ApiClientConfig extends AxiosRequestConfig {
  baseURL: string;
}

// Optional: Standard API response wrapper (if your backend uses this format)
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: number;
}
