import { AppError, NetworkError, TimeoutError, ValidationError } from '../types/errors';

export class ErrorHandler {
  private static logError(error: Error, context?: string) {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      error: error.message,
      name: error.name,
      stack: error.stack,
      context,
      ...(error instanceof AppError && {
        status: error.status,
        code: error.code,
        details: error.details
      })
    };
    
    console.error('[ErrorHandler]', logData);
    
    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry, LogRocket, etc.
      // errorTrackingService.captureException(error, logData);
    }
  }

  static handleApiError(error: any, context?: string): AppError {
    this.logError(error, context);

    if (error instanceof AppError) {
      return error;
    }

    // Network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return new NetworkError('Network connection failed. Please check your internet connection.');
    }

    // Timeout errors
    if (error.name === 'AbortError' || error.code === 'TIMEOUT') {
      return new TimeoutError('Request timed out. Please try again.', 30000);
    }

    // HTTP errors
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.message;
      
      switch (status) {
        case 400:
          return new ValidationError('Invalid request data', error.response.data?.errors || []);
        case 401:
          return new AppError('Authentication required', 401, 'UNAUTHORIZED');
        case 403:
          return new AppError('Access denied', 403, 'FORBIDDEN');
        case 404:
          return new AppError('Resource not found', 404, 'NOT_FOUND');
        case 429:
          return new AppError('Too many requests. Please try again later.', 429, 'RATE_LIMIT', null, true);
        case 500:
          return new AppError('Server error. Please try again.', 500, 'SERVER_ERROR', null, true);
        case 502:
        case 503:
        case 504:
          return new AppError('Service temporarily unavailable', status, 'SERVICE_UNAVAILABLE', null, true);
        default:
          return new AppError(message || 'An unexpected error occurred', status, 'UNKNOWN_ERROR');
      }
    }

    // Generic error fallback
    return new AppError(error.message || 'An unexpected error occurred', 500, 'UNKNOWN_ERROR');
  }

  static getUserFriendlyMessage(error: AppError): string {
    switch (error.code) {
      case 'NETWORK_ERROR':
        return 'Connection problem. Please check your internet and try again.';
      case 'TIMEOUT_ERROR':
        return 'Request is taking too long. Please try again.';
      case 'VALIDATION_ERROR':
        return 'Please check your input and try again.';
      case 'UNAUTHORIZED':
        return 'Please log in to continue.';
      case 'FORBIDDEN':
        return 'You don\'t have permission to perform this action.';
      case 'NOT_FOUND':
        return 'The requested resource was not found.';
      case 'RATE_LIMIT':
        return 'Too many requests. Please wait a moment and try again.';
      case 'SERVER_ERROR':
        return 'Server is experiencing issues. Please try again.';
      case 'SERVICE_UNAVAILABLE':
        return 'Service is temporarily unavailable. Please try again later.';
      default:
        return error.message || 'Something went wrong. Please try again.';
    }
  }

  static shouldRetry(error: AppError): boolean {
    return error.retryable || [
      'NETWORK_ERROR',
      'TIMEOUT_ERROR',
      'RATE_LIMIT',
      'SERVER_ERROR',
      'SERVICE_UNAVAILABLE'
    ].includes(error.code || '');
  }
}