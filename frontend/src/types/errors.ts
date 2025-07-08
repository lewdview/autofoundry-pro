export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
  timestamp?: string;
}

export interface ValidationErrorField {
  field: string;
  message: string;
  value?: any;
}

export interface NetworkError {
  message: string;
  isNetworkError: true;
  retryable: boolean;
}

export interface TimeoutError {
  message: string;
  isTimeout: true;
  duration: number;
}

export class AppError extends Error {
  public status?: number;
  public code?: string;
  public details?: any;
  public timestamp: string;
  public retryable: boolean;

  constructor(message: string, status?: number, code?: string, details?: any, retryable = false) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.retryable = retryable;
  }
}

export class ValidationError extends AppError {
  public validationErrors: ValidationErrorField[];

  constructor(message: string, errors: ValidationErrorField[]) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
    this.validationErrors = errors;
  }
}

export class NetworkError extends AppError {
  constructor(message: string, originalError?: Error) {
    super(message, 0, 'NETWORK_ERROR', originalError, true);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends AppError {
  public duration: number;

  constructor(message: string, duration: number) {
    super(message, 408, 'TIMEOUT_ERROR', { duration }, true);
    this.name = 'TimeoutError';
    this.duration = duration;
  }
}