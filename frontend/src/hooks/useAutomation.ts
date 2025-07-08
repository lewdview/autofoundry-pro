import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api';
import { useErrorHandler } from './useErrorHandler';
import { AppError } from '../types/errors';

interface AutomationSession {
  sessionId: string;
  status: 'running' | 'completed' | 'paused' | 'failed';
  progress: number;
  currentStage: number;
  estimatedTime: number;
  results?: any;
  error?: string;
}

interface AutomationData {
  businessIdea?: string;
  feelingLucky: boolean;
  automationType: string;
  creditsUsed: number;
  industry?: string;
}

export const useAutomation = () => {
  const [session, setSession] = useState<AutomationSession | null>(null);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const maxReconnectAttempts = 5;
  
  const { 
    error, 
    isLoading, 
    handleError, 
    clearError, 
    setLoading, 
    executeWithErrorHandling,
    retry
  } = useErrorHandler();

  const startAutomation = useCallback(async (data: AutomationData) => {
    return executeWithErrorHandling(async () => {
      // Validate input data
      if (!data.feelingLucky && !data.businessIdea?.trim()) {
        throw new AppError('Business idea is required when not feeling lucky', 400, 'VALIDATION_ERROR');
      }

      if (!data.automationType) {
        throw new AppError('Automation type is required', 400, 'VALIDATION_ERROR');
      }

      if (!data.creditsUsed || data.creditsUsed <= 0) {
        throw new AppError('Valid credit amount is required', 400, 'VALIDATION_ERROR');
      }

      const response = await apiService.startTwoQuestionAutomation({
        businessIdea: data.businessIdea,
        feelingLucky: data.feelingLucky,
        automationType: data.automationType,
        creditsUsed: data.creditsUsed,
        stages: 6
      });
      
      if (!response.sessionId) {
        throw new AppError('Invalid response: missing session ID', 500, 'SERVER_ERROR');
      }
      
      const newSession: AutomationSession = {
        sessionId: response.sessionId,
        status: 'running',
        progress: 0,
        currentStage: 1,
        estimatedTime: response.estimatedTime || 3600
      };
      
      setSession(newSession);
      setupEventSource(response.sessionId);
      
      return newSession;
    }, 'Start Automation');
  }, [executeWithErrorHandling]);

  const setupEventSource = useCallback((sessionId: string) => {
    try {
      // Close existing connection
      if (eventSource) {
        eventSource.close();
      }

      const es = apiService.createEventSource(sessionId);
      setEventSource(es);
      
      es.onopen = () => {
        console.log('EventSource connected');
        setReconnectAttempts(0);
        clearError();
      };
      
      es.onmessage = (event) => {
        try {
          const update = JSON.parse(event.data);
          
          // Validate update data
          if (!update || typeof update !== 'object') {
            console.warn('Invalid update data received:', update);
            return;
          }

          setSession(prev => {
            if (!prev) return null;
            // Handle nested data structure from backend SSE
            if (update.data) {
              return { ...prev, ...update.data };
            }
            return { ...prev, ...update };
          });
        } catch (parseError) {
          console.error('Failed to parse EventSource message:', parseError);
          handleError(new AppError('Failed to parse real-time update', 500, 'PARSE_ERROR'), 'EventSource Message');
        }
      };
      
      es.onerror = (event) => {
        console.error('EventSource error:', event);
        
        // Attempt reconnection with exponential backoff
        if (reconnectAttempts < maxReconnectAttempts) {
          const delay = Math.pow(2, reconnectAttempts) * 1000; // 1s, 2s, 4s, 8s, 16s
          
          setTimeout(() => {
            console.log(`Attempting to reconnect (${reconnectAttempts + 1}/${maxReconnectAttempts})...`);
            setReconnectAttempts(prev => prev + 1);
            setupEventSource(sessionId);
          }, delay);
        } else {
          handleError(
            new AppError('Connection lost and max reconnection attempts reached', 500, 'CONNECTION_FAILED'),
            'EventSource Connection'
          );
          setSession(prev => prev ? { ...prev, status: 'failed', error: 'Connection lost' } : null);
        }
      };
      
    } catch (setupError) {
      handleError(setupError, 'EventSource Setup');
    }
  }, [eventSource, reconnectAttempts, maxReconnectAttempts, handleError, clearError]);

  const pauseAutomation = useCallback(() => {
    if (session) {
      setSession(prev => prev ? { ...prev, status: 'paused' } : null);
    }
  }, [session]);

  const resumeAutomation = useCallback(() => {
    if (session) {
      setSession(prev => prev ? { ...prev, status: 'running' } : null);
    }
  }, [session]);

  const cancelAutomation = useCallback(() => {
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
    }
    setSession(null);
    setReconnectAttempts(0);
    clearError();
  }, [eventSource, clearError]);

  const getSessionStatus = useCallback(async (sessionId: string) => {
    if (!sessionId?.trim()) {
      handleError(new AppError('Session ID is required', 400, 'VALIDATION_ERROR'), 'Get Session Status');
      return null;
    }

    return executeWithErrorHandling(async () => {
      const response = await apiService.getSessionStatus(sessionId);
      
      if (!response || !response.session) {
        throw new AppError('Invalid session status response', 500, 'SERVER_ERROR');
      }
      
      // Backend returns { success: true, session: {...} }
      const sessionData = {
        sessionId: response.session.id,
        status: response.session.status,
        progress: response.session.progress,
        currentStage: response.session.currentStage,
        estimatedTime: response.session.estimatedCompletionTime,
        results: response.session.results,
        logs: response.session.logs
      };
      
      setSession(sessionData);
      return sessionData;
    }, 'Get Session Status');
  }, [executeWithErrorHandling, handleError]);

  const retryConnection = useCallback(() => {
    if (session?.sessionId) {
      setReconnectAttempts(0);
      setupEventSource(session.sessionId);
    }
  }, [session?.sessionId, setupEventSource]);

  const retryAutomation = useCallback(async () => {
    if (!session) return;
    
    return executeWithErrorHandling(async () => {
      const response = await apiService.getSessionStatus(session.sessionId);
      
      if (!response || !response.session) {
        throw new AppError('Invalid session status response', 500, 'SERVER_ERROR');
      }
      
      const sessionData = {
        sessionId: response.session.id,
        status: response.session.status,
        progress: response.session.progress,
        currentStage: response.session.currentStage,
        estimatedTime: response.session.estimatedCompletionTime,
        results: response.session.results,
        logs: response.session.logs
      };
      
      setSession(sessionData);
      
      if (sessionData.status === 'running') {
        setupEventSource(session.sessionId);
      }
      
      return sessionData;
    }, 'Retry Automation');
  }, [session, executeWithErrorHandling, setupEventSource]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [eventSource]);

  return {
    session,
    loading: isLoading,
    error,
    reconnectAttempts,
    maxReconnectAttempts,
    startAutomation,
    pauseAutomation,
    resumeAutomation,
    cancelAutomation,
    getSessionStatus,
    retryConnection,
    retryAutomation,
    clearError,
    canRetry: error ? error.retryable : false
  };
};

export default useAutomation;