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
  Loader2
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

interface SessionData {
  id: string;
  status: 'running' | 'completed' | 'error';
  progress: number;
  currentStage: number;
  results?: any;
  logs: LogEntry[];
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
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

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

  const fetchSessionData = async () => {
    if (!sessionId) return;

    try {
      const response = await apiService.getSessionStatus(sessionId);
      if (response.success) {
        setSessionData(response.session);
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch session data');
      setIsLoading(false);
    }
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
                <Progress 
                  value={(sessionData.currentStage / stages.length) * 100} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
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

              {/* Live Logs */}
              <div>
                <h3 className="font-semibold mb-3">Live Activity Log</h3>
                <ScrollArea className="h-64 w-full border rounded-lg">
                  <div className="p-3 space-y-2">
                    {sessionData.logs.map((log) => (
                      <div key={log.id} className="flex items-start space-x-2 text-sm">
                        {getLogIcon(log.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                              {formatTime(log.timestamp)}
                            </span>
                          </div>
                          <div className="text-gray-800">{log.message}</div>
                        </div>
                      </div>
                    ))}
                    <div ref={logsEndRef} />
                  </div>
                </ScrollArea>
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
