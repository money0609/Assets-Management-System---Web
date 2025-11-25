export type ID = number | string;

export interface FormErrors {
    [key: string]: string;
}

export interface BaseEntity {
    id: ID;
    createdAt: string;
    updatedAt: string;
}

export interface PaginationParams {
    page: number;
    limit: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    totalPages: number;
}

export interface ApiError {
    code?: string;
    message?: string;
    field?: string;
}