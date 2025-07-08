import { AppError, NetworkError, TimeoutError } from '../types/errors';
import { ErrorHandler } from '../utils/errorHandler';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const DEFAULT_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}, retryCount = 0): Promise<any> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
    
    try {
      const url = `${API_BASE}${endpoint}`;
      
      // Validate URL
      if (!this.isValidUrl(url)) {
        throw new AppError('Invalid API endpoint', 400, 'INVALID_URL');
      }

      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle HTTP errors
      if (!response.ok) {
        const errorData = await this.safeJsonParse(response);
        throw new AppError(
          errorData?.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          this.getErrorCode(response.status),
          errorData,
          this.isRetryableStatus(response.status)
        );
      }

      // Parse response safely
      const data = await this.safeJsonParse(response);
      return data;

    } catch (error: any) {
      clearTimeout(timeoutId);
      
      // Handle abort/timeout
      if (error.name === 'AbortError') {
        throw new TimeoutError('Request timed out', DEFAULT_TIMEOUT);
      }

      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new NetworkError('Network connection failed');
      }

      // Handle other AppErrors
      if (error instanceof AppError) {
        // Retry logic for retryable errors
        if (error.retryable && retryCount < MAX_RETRIES) {
          await this.delay(RETRY_DELAY * Math.pow(2, retryCount)); // Exponential backoff
          return this.request(endpoint, options, retryCount + 1);
        }
        throw error;
      }

      // Handle unknown errors
      const handledError = ErrorHandler.handleApiError(error, `API Request: ${endpoint}`);
      
      // Retry logic for retryable errors
      if (handledError.retryable && retryCount < MAX_RETRIES) {
        await this.delay(RETRY_DELAY * Math.pow(2, retryCount));
        return this.request(endpoint, options, retryCount + 1);
      }
      
      throw handledError;
    }
  }

  private async safeJsonParse(response: Response): Promise<any> {
    try {
      const text = await response.text();
      return text ? JSON.parse(text) : {};
    } catch (error) {
      console.warn('Failed to parse JSON response:', error);
      return {};
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private getErrorCode(status: number): string {
    const codes: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      429: 'RATE_LIMIT',
      500: 'SERVER_ERROR',
      502: 'BAD_GATEWAY',
      503: 'SERVICE_UNAVAILABLE',
      504: 'GATEWAY_TIMEOUT'
    };
    return codes[status] || 'UNKNOWN_ERROR';
  }

  private isRetryableStatus(status: number): boolean {
    return [408, 429, 500, 502, 503, 504].includes(status);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private validateRequired(data: any, fields: string[]): void {
    const missing = fields.filter(field => !data[field]);
    if (missing.length > 0) {
      throw new AppError(
        `Missing required fields: ${missing.join(', ')}`,
        400,
        'VALIDATION_ERROR',
        { missingFields: missing }
      );
    }
  }

  // Health & System
  async getHealth() {
    return this.request('/health');
  }

  async getAutomationStatus() {
    return this.request('/api/automation/status');
  }

  async getDemoData() {
    return this.request('/api/automation/demo');
  }

  // Two-Question Automation
  async startTwoQuestionAutomation(data: {
    businessIdea?: string;
    feelingLucky: boolean;
    automationType: string;
    creditsUsed: number;
    stages?: string[];
  }) {
    this.validateRequired(data, ['feelingLucky', 'automationType', 'creditsUsed']);
    
    if (!data.feelingLucky && !data.businessIdea?.trim()) {
      throw new AppError('Business idea is required when not feeling lucky', 400, 'VALIDATION_ERROR');
    }

    return this.request('/api/automation/two-question-start', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSessionStatus(sessionId: string) {
    if (!sessionId?.trim()) {
      throw new AppError('Session ID is required', 400, 'VALIDATION_ERROR');
    }
    return this.request(`/api/automation/session/${sessionId}`);
  }

  // Server-Sent Events with error handling
  createEventSource(sessionId: string): EventSource {
    if (!sessionId?.trim()) {
      throw new AppError('Session ID is required', 400, 'VALIDATION_ERROR');
    }
    
    const eventSource = new EventSource(`${API_BASE}/api/automation/stream/${sessionId}`);
    
    eventSource.onerror = (event) => {
      console.error('EventSource error:', event);
      ErrorHandler.handleApiError(new Error('EventSource connection failed'), 'SSE Connection');
    };
    
    return eventSource;
  }

  // Niche Research
  async analyzeNiche(data: { niche: string; includeCompetitors?: boolean }) {
    this.validateRequired(data, ['niche']);
    return this.request('/api/niche/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTrends() {
    return this.request('/api/niche/trends');
  }

  async researchMarket(data: { businessData: { idea: string; industry: string } }) {
    this.validateRequired(data, ['businessData']);
    this.validateRequired(data.businessData, ['idea', 'industry']);
    return this.request('/api/niche/research', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Additional methods with validation...
  async findCompetitors(data: { niche: string }) {
    this.validateRequired(data, ['niche']);
    return this.request('/api/competitor/find', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async analyzeCompetitors(data: { competitors: string[]; niche: string }) {
    this.validateRequired(data, ['competitors', 'niche']);
    return this.request('/api/competitor/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async registerBusiness(data: { businessInfo: any }) {
    this.validateRequired(data, ['businessInfo']);
    return this.request('/api/registration/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getRegistrationStatus(registrationId: string) {
    if (!registrationId?.trim()) {
      throw new AppError('Registration ID is required', 400, 'VALIDATION_ERROR');
    }
    return this.request(`/api/registration/status/${registrationId}`);
  }

  async createPitchDeck(data: { businessData: any; marketAnalysis: any }) {
    this.validateRequired(data, ['businessData', 'marketAnalysis']);
    return this.request('/api/pitch-deck/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getFundingSources(params: { businessType: string; amount: number }) {
    this.validateRequired(params, ['businessType', 'amount']);
    const queryString = new URLSearchParams(params as any).toString();
    return this.request(`/api/funding/sources?${queryString}`);
  }

  async getSessionProgress(sessionId: string) {
    if (!sessionId?.trim()) {
      throw new AppError('Session ID is required', 400, 'VALIDATION_ERROR');
    }
    return this.request(`/api/progress/session/${sessionId}`);
  }

  async getAutomationHistory() {
    return this.request('/api/progress/history');
  }

  // Export Functions
  async getExportInfo(sessionId: string) {
    if (!sessionId?.trim()) {
      throw new AppError('Session ID is required', 400, 'VALIDATION_ERROR');
    }
    return this.request(`/api/automation/export-info/${sessionId}`);
  }

  async downloadExport(sessionId: string, format: string) {
    if (!sessionId?.trim() || !format?.trim()) {
      throw new AppError('Session ID and format are required', 400, 'VALIDATION_ERROR');
    }
    
    const url = `${API_BASE}/api/automation/export/${sessionId}/${format}`;
    
    // Create a temporary link to trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = ''; // Let browser determine filename from headers
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async getExportUrl(sessionId: string, format: string) {
    if (!sessionId?.trim() || !format?.trim()) {
      throw new AppError('Session ID and format are required', 400, 'VALIDATION_ERROR');
    }
    return `${API_BASE}/api/automation/export/${sessionId}/${format}`;
  }
}

export const apiService = new ApiService();
export default apiService;
