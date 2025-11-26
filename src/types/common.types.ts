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

/**
 * FastAPI validation error structure (422 Unprocessable Entity)
 * FastAPI returns validation errors in this format:
 * {
 *   "detail": [
 *     { "loc": ["body", "field_name"], "msg": "error message", "type": "error_type" }
 *   ]
 * }
 * 
 * For other frameworks, this may need to be adapted.
 */
export interface FastAPIValidationError {
    loc: (string | number)[];
    msg: string;
    type: string;
}

export interface ApiError {
    code?: string;
    message?: string;
    field?: string;
    /** FastAPI-specific: validation errors array or error message string */
    detail?: string | FastAPIValidationError[];
    status?: number;
}