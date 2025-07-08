import { useState, useCallback } from 'react';
import { AppError } from '../types/errors';
import { ErrorHandler } from '../utils/errorHandler';
import { useToast } from './use-toast';

export interface ErrorState {
  error: AppError | null;
  isLoading: boolean;
  retryCount: number;
}

export const useErrorHandler = () => {
  const { toast } = useToast();
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    isLoading: false,
    retryCount: 0
  });

  const handleError = useCallback((error: any, context?: string) => {
    const appError = ErrorHandler.handleApiError(error, context);
    
    setErrorState(prev => ({
      ...prev,
      error: appError,
      isLoading: false
    }));

    // Show toast notification
    toast({
      title: 'Error',
      description: ErrorHandler.getUserFriendlyMessage(appError),
      variant: 'destructive',
    });

    return appError;
  }, [toast]);

  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      isLoading: false,
      retryCount: 0
    });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setErrorState(prev => ({
      ...prev,
      isLoading: loading
    }));
  }, []);

  const retry = useCallback(async (retryFn: () => Promise<any>) => {
    if (!errorState.error || !ErrorHandler.shouldRetry(errorState.error)) {
      return;
    }

    setErrorState(prev => ({
      ...prev,
      isLoading: true,
      retryCount: prev.retryCount + 1
    }));

    try {
      const result = await retryFn();
      clearError();
      return result;
    } catch (error) {
      handleError(error, 'Retry attempt');
      throw error;
    }
  }, [errorState.error, handleError, clearError]);

  const executeWithErrorHandling = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    context?: string
  ): Promise<T | null> => {
    setLoading(true);
    clearError();

    try {
      const result = await asyncFn();
      setLoading(false);
      return result;
    } catch (error) {
      handleError(error, context);
      return null;
    }
  }, [handleError, clearError, setLoading]);

  return {
    error: errorState.error,
    isLoading: errorState.isLoading,
    retryCount: errorState.retryCount,
    handleError,
    clearError,
    setLoading,
    retry,
    executeWithErrorHandling,
    canRetry: errorState.error ? ErrorHandler.shouldRetry(errorState.error) : false,
    userMessage: errorState.error ? ErrorHandler.getUserFriendlyMessage(errorState.error) : null
  };
};

export default useErrorHandler;