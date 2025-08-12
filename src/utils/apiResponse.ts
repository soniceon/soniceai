export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode: number;
}

export function createSuccessResponse<T>(data: T, message: string = 'Success'): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
    statusCode: 200,
  };
}

export function createErrorResponse(
  message: string,
  statusCode: number = 500,
  error?: string
): ApiResponse {
  return {
    success: false,
    message,
    error,
    statusCode,
  };
}

export function createValidationErrorResponse(message: string): ApiResponse {
  return createErrorResponse(message, 400);
}

export function createNotFoundResponse(message: string = 'Resource not found'): ApiResponse {
  return createErrorResponse(message, 404);
}

export function createUnauthorizedResponse(message: string = 'Unauthorized'): ApiResponse {
  return createErrorResponse(message, 401);
}

export function createForbiddenResponse(message: string = 'Forbidden'): ApiResponse {
  return createErrorResponse(message, 403);
}

export function createConflictResponse(message: string = 'Conflict'): ApiResponse {
  return createErrorResponse(message, 409);
}

export function createInternalErrorResponse(message: string = 'Internal server error'): ApiResponse {
  return createErrorResponse(message, 500);
} 