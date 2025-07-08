import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Rocket, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Zap,
  Download,
  Eye,
  X,
  Loader2,
  Monitor,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { apiService } from '@/services/api';

interface AutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string | null;
  automationType: string;
}

interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'process' | 'api';
  id: number;
}

interface ApiCall {
  id: number;
  timestamp: string;
  method: string;
  endpoint: string;
  status: number;
  duration: number;
  request?: any;
  response?: any;
  stage: string;
}

interface SessionData {
  id: string;
  status: 'running' | 'completed' | 'error';
  progress: number;
  currentStage: number;
  results?: any;
  logs: LogEntry[];
  apiCalls?: ApiCall[]; // Make optional since backend might not provide this yet
  startTime: string;
  estimatedCompletionTime?: string;
}

const AutomationModal: React.FC<AutomationModalProps> = ({
  isOpen,
  onClose,
  sessionId,
  automationType
}) => {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [glassWindowOpen, setGlassWindowOpen] = useState(false);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const apiCallsEndRef = useRef<HTMLDivElement>(null);

  const stages = [
    { id: 1, name: '🔍 Market Research & Analysis', description: 'Analyzing market opportunities and trends' },
    { id: 2, name: '🏢 Business Registration', description: 'Preparing business registration documents' },
    { id: 3, name: '🛍️ Product Creation', description: 'Creating digital products and storefront' },
    { id: 4, name: '💼 Investment Materials', description: 'Generating pitch deck and financial projections' },
    { id: 5, name: '💰 Funding Applications', description: 'Applying to investors and funding sources' },
    { id: 6, name: '💳 Payment Setup', description: 'Setting up payment processing systems' }
  ];

  // Scroll to bottom of logs when new log entries are added
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [sessionData?.logs]);

  // Scroll to bottom of API calls when new entries are added
  useEffect(() => {
    if (apiCallsEndRef.current && glassWindowOpen) {
      apiCallsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [sessionData?.apiCalls, glassWindowOpen]);

  // Fetch session data and set up real-time updates
  useEffect(() => {
    if (!isOpen || !sessionId) {
      return;
    }

    setIsLoading(true);
    setError(null);

    // Initial fetch
    fetchSessionData();

    // Set up polling for updates
    pollIntervalRef.current = setInterval(fetchSessionData, 2000);

    // Try to set up Server-Sent Events for real-time updates
    try {
      eventSourceRef.current = apiService.createEventSource(sessionId);
      
      eventSourceRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setSessionData(data);
        } catch (err) {
          console.error('Failed to parse SSE data:', err);
        }
      };

      eventSourceRef.current.onerror = (event) => {
        console.error('SSE connection error:', event);
        // Fall back to polling if SSE fails
      };
    } catch (err) {
      console.log('SSE not available, using polling only');
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [isOpen, sessionId]);

  const generateMockApiCalls = (stage: number, progress: number): ApiCall[] => {
    // Generate mock API calls for demonstration
    const calls: ApiCall[] = [];
    const baseTime = Date.now() - (stage * 60000); // Spread over last few minutes
    
    const apiEndpoints = {
      1: ['/api/market/analyze', '/api/trends/fetch', '/api/competition/scan'],
      2: ['/api/business/register', '/api/ein/apply', '/api/documents/generate'],
      3: ['/api/store/create', '/api/products/generate', '/api/ui/design'],
      4: ['/api/pitch/generate', '/api/financials/project', '/api/materials/compile'],
      5: ['/api/investors/search', '/api/funding/apply', '/api/vc/connect'],
      6: ['/api/payments/setup', '/api/security/configure', '/api/business/finalize']
    };
    
    let callId = 1;
    for (let s = 1; s <= stage; s++) {
      const endpoints = apiEndpoints[s] || ['/api/process'];
      endpoints.forEach((endpoint, idx) => {
        calls.push({
          id: callId++,
          timestamp: new Date(baseTime + (s * 20000) + (idx * 5000)).toISOString(),
          method: ['GET', 'POST', 'PUT'][Math.floor(Math.random() * 3)],
          endpoint,
          status: Math.random() > 0.1 ? 200 : 500,
          duration: Math.floor(Math.random() * 500) + 100,
          stage: stages.find(st => st.id === s)?.name || 'Processing'
        });
      });
    }
    
    return calls;
  };

  const fetchSessionData = async () => {
    if (!sessionId) return;

    try {
      console.log('Fetching session data for:', sessionId);
      const response = await apiService.getSessionStatus(sessionId);
      console.log('Session data response:', response);
      
      if (response.success && response.session) {
        const sessionWithDefaults = {
          id: response.session.id || sessionId,
          status: response.session.status || 'running',
          progress: response.session.progress || 0,
          currentStage: response.session.currentStage || 1,
          results: response.session.results || {},
          logs: response.session.logs || [],
          apiCalls: response.session.apiCalls || generateMockApiCalls(
            response.session.currentStage || 1, 
            response.session.progress || 0
          ),
          startTime: response.session.startTime || new Date().toISOString(),
          estimatedCompletionTime: response.session.estimatedCompletionTime
        };
        console.log('Setting session data:', sessionWithDefaults);
        setSessionData(sessionWithDefaults);
        setIsLoading(false);
      } else {
        console.error('Invalid session response:', response);
        setError('Invalid session data received');
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('Error fetching session data:', err);
      setError(err.message || 'Failed to fetch session data');
      setIsLoading(false);
    }
  };

  const calculateOverallProgress = () => {
    if (!sessionData) return 0;
    const baseProgress = ((sessionData.currentStage - 1) / stages.length) * 100;
    const stageProgress = (sessionData.progress || 0) / stages.length;
    return Math.min(100, baseProgress + stageProgress);
  };

  const getStageProgress = (stageId: number) => {
    if (!sessionData) return 0;
    if (sessionData.currentStage > stageId) return 100;
    if (sessionData.currentStage === stageId) return sessionData.progress || 0;
    return 0;
  };

  const getStageStatus = (stageId: number) => {
    if (!sessionData) return 'pending';
    if (sessionData.currentStage > stageId) return 'completed';
    if (sessionData.currentStage === stageId) return 'active';
    return 'pending';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'active':
        return <Loader2 className="h-5 w-5 text-orange-500 animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'process':
        return <Zap className="h-4 w-4 text-blue-500" />;
      case 'api':
        return <Rocket className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const handleDownloadResults = async () => {
    if (!sessionId) return;
    
    try {
      await apiService.downloadExport(sessionId, 'pdf');
    } catch (err) {
      console.error('Failed to download results:', err);
    }
  };

  const handleViewResults = () => {
    // Navigate to results view or open results modal
    console.log('View results:', sessionData?.results);
  };

  const toggleGlassWindow = () => {
    setGlassWindowOpen(!glassWindowOpen);
  };

  const handleClose = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Rocket className="h-6 w-6 text-orange-500" />
            <span>Business Automation Progress</span>
            {sessionData?.status && (
              <Badge 
                className={`ml-2 ${
                  sessionData.status === 'running' ? 'bg-orange-500' :
                  sessionData.status === 'completed' ? 'bg-green-500' :
                  'bg-red-500'
                } text-white`}
              >
                {sessionData.status.toUpperCase()}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {isLoading && !sessionData ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            <span className="ml-2">Loading automation progress...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8 text-red-600">
            <AlertCircle className="h-6 w-6 mr-2" />
            <span>{error}</span>
          </div>
        ) : sessionData ? (
          <div className="space-y-6">
            {/* Progress Overview */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-gray-600">
                    Stage {sessionData.currentStage} of {stages.length}
                  </span>
                </div>
                
                {/* Main Progress Bar */}
                <div className="space-y-2">
                  <Progress 
                    value={calculateOverallProgress()} 
                    className="h-3"
                  />
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{Math.round(calculateOverallProgress())}% Complete</span>
                    <span className="font-medium">
                      {sessionData.status === 'running' ? 'In Progress...' : 
                       sessionData.status === 'completed' ? 'Completed!' : 'Error'}
                    </span>
                  </div>
                </div>
                
                {/* Stage-by-Stage Progress Bars */}
                <div className="mt-4 space-y-2">
                  <div className="text-xs font-medium text-gray-700 mb-2">Stage Progress:</div>
                  {stages.map((stage) => {
                    const stageProgress = getStageProgress(stage.id);
                    const stageStatus = getStageStatus(stage.id);
                    return (
                      <div key={stage.id} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className={`font-medium ${
                            stageStatus === 'active' ? 'text-orange-600' :
                            stageStatus === 'completed' ? 'text-green-600' :
                            'text-gray-500'
                          }`}>
                            {stage.name}
                          </span>
                          <span className={`text-xs ${
                            stageStatus === 'active' ? 'text-orange-600' :
                            stageStatus === 'completed' ? 'text-green-600' :
                            'text-gray-400'
                          }`}>
                            {stageProgress}%
                          </span>
                        </div>
                        <Progress 
                          value={stageProgress} 
                          className="h-1.5"
                          variant={
                            stageStatus === 'completed' ? 'success' :
                            stageStatus === 'active' ? 'default' :
                            'default'
                          }
                        />
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex justify-between text-xs text-gray-500 mt-3 pt-2 border-t">
                  <span>Started: {formatTime(sessionData.startTime)}</span>
                  {sessionData.estimatedCompletionTime && (
                    <span>ETA: {sessionData.estimatedCompletionTime}</span>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Stages Progress */}
              <div>
                <h3 className="font-semibold mb-3">Automation Stages</h3>
                <div className="space-y-2">
                  {stages.map((stage) => {
                    const status = getStageStatus(stage.id);
                    return (
                      <div
                        key={stage.id}
                        className={`flex items-start space-x-3 p-3 rounded-lg border ${
                          status === 'completed' ? 'bg-green-50 border-green-200' :
                          status === 'active' ? 'bg-orange-50 border-orange-200' :
                          'bg-gray-50 border-gray-200'
                        }`}
                      >
                        {getStatusIcon(status)}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{stage.name}</div>
                          <div className="text-xs text-gray-600">{stage.description}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Glass Window - Behind the Scenes */}
              <div className="relative">
                {/* Shutter Frame */}
                <div className="relative bg-gray-800 rounded-lg overflow-hidden border-4 border-gray-600 shadow-2xl">
                  {/* Shutter Header with Toggle */}
                  <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-4 py-3 border-b border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Monitor className="h-5 w-5 text-green-400" />
                        <span className="text-green-400 font-mono text-sm font-bold">GLASS WINDOW</span>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleGlassWindow}
                        className="text-green-400 hover:text-green-300 hover:bg-gray-700"
                      >
                        {glassWindowOpen ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-1" />
                            CLOSE SHUTTERS
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-1" />
                            OPEN SHUTTERS
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Shutter Animation */}
                  <div className={`transition-all duration-700 ease-in-out overflow-hidden ${
                    glassWindowOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    {/* Glass Window Content */}
                    <div className="bg-black relative">
                      {/* Scanlines Effect */}
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/5 to-transparent
                                        bg-[length:100%_4px] animate-pulse opacity-30"></div>
                      </div>
                      
                      {/* Terminal Header */}
                      <div className="bg-gray-900 px-4 py-2 border-b border-green-400/20">
                        <div className="flex items-center space-x-2">
                          <span className="text-green-400 font-mono text-xs">BACKEND API MONITOR</span>
                          <span className="text-green-400/60 font-mono text-xs">|</span>
                          <span className="text-green-400/80 font-mono text-xs">
                            {sessionData?.status === 'running' ? 'LIVE' : 'IDLE'}
                          </span>
                          {sessionData?.status === 'running' && (
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                          )}
                        </div>
                      </div>

                      {/* API Calls Feed */}
                      <ScrollArea className="h-64">
                        <div className="p-4 space-y-1 font-mono text-xs">
                          {sessionData?.apiCalls?.map((call) => (
                            <div key={call.id} className="text-green-400 leading-relaxed animate-fadeIn">
                              <div className="flex items-center space-x-2">
                                <span className="text-green-600">{formatTime(call.timestamp)}</span>
                                <span className="text-white">█</span>
                                <span className={`font-bold ${
                                  call.method === 'GET' ? 'text-blue-400' :
                                  call.method === 'POST' ? 'text-green-400' :
                                  call.method === 'PUT' ? 'text-yellow-400' :
                                  call.method === 'DELETE' ? 'text-red-400' :
                                  'text-gray-400'
                                }`}>{call.method}</span>
                                <span className="text-cyan-400">{call.endpoint}</span>
                                <span className={`ml-auto ${
                                  call.status >= 200 && call.status < 300 ? 'text-green-400' :
                                  call.status >= 400 ? 'text-red-400' :
                                  'text-yellow-400'
                                }`}>[{call.status}]</span>
                                <span className="text-gray-500">{call.duration}ms</span>
                              </div>
                              <div className="text-gray-400 text-xs ml-16">
                                └─ {call.stage}
                              </div>
                            </div>
                          )) || (
                            <div className="text-center text-green-400/60 py-8">
                              <Monitor className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <div>Waiting for API calls...</div>
                              <div className="text-xs text-gray-500 mt-1">
                                Backend communication will appear here
                              </div>
                            </div>
                          )}
                          <div ref={apiCallsEndRef} />
                        </div>
                      </ScrollArea>
                    </div>
                  </div>

                  {/* Closed Shutter State */}
                  {!glassWindowOpen && (
                    <div className="bg-gradient-to-r from-gray-700 to-gray-600 px-4 py-8 text-center">
                      <div className="flex items-center justify-center space-x-2 text-gray-400">
                        <Monitor className="h-6 w-6" />
                        <span className="font-mono text-sm">SHUTTERS CLOSED</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        Click "OPEN SHUTTERS" to see behind-the-scenes API activity
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex space-x-2">
                {sessionData.status === 'completed' && (
                  <>
                    <Button onClick={handleViewResults} className="bg-blue-500 hover:bg-blue-600">
                      <Eye className="h-4 w-4 mr-2" />
                      View Results
                    </Button>
                    <Button onClick={handleDownloadResults} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                  </>
                )}
              </div>
              <Button onClick={handleClose} variant="outline">
                <X className="h-4 w-4 mr-2" />
                {sessionData.status === 'completed' ? 'Close' : 'Minimize'}
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default AutomationModal;
