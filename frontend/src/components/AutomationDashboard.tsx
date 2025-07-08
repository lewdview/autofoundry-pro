import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Download, RefreshCw, Play, Pause, FileText, FileSpreadsheet, Presentation, Archive, TrendingUp, DollarSign, Clock, Users, Target, Zap } from 'lucide-react';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import Logo from './Logo';

interface AutomationSession {
  sessionId: string;
  status: 'running' | 'completed' | 'paused' | 'failed';
  progress: number;
  currentStage: number;
  estimatedTime: number;
  results?: any;
  logs?: Array<{
    timestamp: string;
    message: string;
    type: string;
    id: number;
  }>;
}

interface AutomationDashboardProps {
  session: AutomationSession;
  onCancel: () => void;
  onRestart: () => void;
}

const AutomationDashboard: React.FC<AutomationDashboardProps> = ({ session, onCancel, onRestart }) => {
  const [liveLog, setLiveLog] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('progress');
  const [exportInfo, setExportInfo] = useState<any>(null);
  const [downloadingFormats, setDownloadingFormats] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const stages = [
    { id: 1, name: 'Niche Analysis & Business Planning', icon: '🔍' },
    { id: 2, name: 'Business Registration Automation', icon: '🏢' },
    { id: 3, name: 'Digital Product & Storefront Creation', icon: '🛍' },
    { id: 4, name: 'Investment Materials Generation', icon: '💼' },
    { id: 5, name: 'Funding Applications', icon: '💰' },
    { id: 6, name: 'Payment Processing Setup', icon: '💳' }
  ];

  // Load export info when session is completed
  useEffect(() => {
    if (session.status === 'completed' && session.sessionId) {
      loadExportInfo();
    }
  }, [session.status, session.sessionId, loadExportInfo]);

  useEffect(() => {
    let messageIndex = 0;
    const stageMappedMessages = {
      1: ['🔍 Analyzing market trends...', '📊 Researching target demographics...', '🎯 Identifying market opportunities...'],
      2: ['🏢 Processing business registration...', '📋 Preparing EIN application...', '📝 Setting up legal framework...'],
      3: ['🛍️ Creating digital storefront...', '💻 Building product catalog...', '🎨 Designing user interface...'],
      4: ['💼 Generating pitch deck...', '📈 Creating financial projections...', '📊 Preparing investor materials...'],
      5: ['💰 Searching for investors...', '📧 Submitting funding applications...', '🤝 Connecting with venture capital...'],
      6: ['💳 Setting up payment processing...', '🔐 Configuring security protocols...', '✅ Finalizing business setup...']
    };

    // Clear logs when session changes or status changes to running
    if (session.status === 'running') {
      setLiveLog([]);
    }

    const interval = setInterval(() => {
      if (session.status === 'running') {
        const currentStageMessages = stageMappedMessages[session.currentStage] || ['Processing...'];
        const message = currentStageMessages[messageIndex % currentStageMessages.length];
        messageIndex++;

        setLiveLog(prev => {
          const timestamp = new Date().toLocaleTimeString();
          const logEntry = `[${timestamp}] ${message}`;
          const newLog = [...prev, logEntry].slice(-12); // Keep last 12 messages
          return newLog;
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [session.status, session.currentStage, session.sessionId]);

  const loadExportInfo = useCallback(async () => {
    try {
      const info = await apiService.getExportInfo(session.sessionId);
      setExportInfo(info);
    } catch (error) {
      console.error('Failed to load export info:', error);
    }
  }, [session.sessionId]);

  const handleDownload = async (format: string, formatName: string) => {
    try {
      setDownloadingFormats(prev => new Set(prev).add(format));
      
      toast({
        title: "Download Started",
        description: `Generating ${formatName}...`,
      });
      
      await apiService.downloadExport(session.sessionId, format);
      
      toast({
        title: "Download Complete",
        description: `${formatName} has been downloaded successfully.`,
      });
    } catch (error: any) {
      toast({
        title: "Download Failed",
        description: error.message || `Failed to download ${formatName}`,
        variant: "destructive",
      });
    } finally {
      setDownloadingFormats(prev => {
        const newSet = new Set(prev);
        newSet.delete(format);
        return newSet;
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-orange-500';
      case 'completed': return 'bg-cyan-500';
      case 'paused': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getFormatIcon = (fileType: string) => {
    switch (fileType) {
      case 'pptx':
        return Presentation;
      case 'xlsx':
        return FileSpreadsheet;
      case 'docx':
      case 'pdf':
        return FileText;
      case 'zip':
        return Archive;
      default:
        return FileText;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-6">
          <Logo size="md" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Automation Dashboard
            </h2>
            <div className="flex items-center space-x-4">
              <Badge className={`${getStatusColor(session.status)} text-white`}>
                {session.status.toUpperCase()}
              </Badge>
              <span className="text-gray-600 text-sm">
                Session: {session.sessionId.split('_')[1]}
              </span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          {session.status === 'running' && (
            <Button variant="outline" onClick={onCancel} className="border-orange-300">
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </Button>
          )}
          <Button variant="outline" onClick={onRestart} className="border-orange-300">
            <RefreshCw className="mr-2 h-4 w-4" />
            Restart
          </Button>
        </div>
      </div>

      {/* KPI Dashboard for Investors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="glass-effect ember-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Market Opportunity</p>
                <p className="text-2xl font-bold text-gray-900">${session.results?.market_research?.market_size || '2.4B'}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-effect ember-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Projected Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${session.results?.digital_product_storefront_creation?.estimated_revenue || '125K'}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-effect ember-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Time to Market</p>
                <p className="text-2xl font-bold text-gray-900">{session.results?.digital_product_storefront_creation?.launch_timeline || '14 days'}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-effect ember-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Automation Score</p>
                <p className="text-2xl font-bold text-gray-900">{session.results?.niche_analysis_business_planning?.viability_score || '94%'}</p>
              </div>
              <Zap className="h-8 w-8 text-cyan-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-effect ember-glow mb-8">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center justify-between">
            Overall Progress
            <span className="text-sm font-normal">
              {Math.round(session.progress)}% Complete
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={session.progress} className="mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {stages.map((stage) => (
              <div key={stage.id} className={`text-center p-3 rounded-lg ${
                stage.id <= session.currentStage ? 'bg-cyan-100 border border-cyan-300' : 'bg-gray-100 border border-gray-300'
              }`}>
                <div className="text-2xl mb-1">{stage.icon}</div>
                <div className="text-xs text-gray-700">{stage.name}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 glass-effect">
          <TabsTrigger value="progress">Live Progress</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="mt-6">
          <Card className="glass-effect ember-glow">
            <CardHeader>
              <CardTitle className="text-gray-800">Real-time Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-cyan-400 h-64 overflow-y-auto">
                {liveLog.length > 0 ? (
                  liveLog.map((log, index) => (
                    <div key={index} className="mb-1 opacity-90 hover:opacity-100 transition-opacity">
                      <span className="text-cyan-400">{log}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-center py-8">
                    {session.status === 'running' ? 
                      'Starting automation processes...' : 
                      'No active automation processes'}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Market Research Results */}
            {session.results?.market_research && (
              <Card className="glass-effect ember-glow">
                <CardHeader>
                  <CardTitle className="text-gray-800">Market Research</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Market Size:</span>
                      <span className="text-gray-800">{session.results.market_research.market_size || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Growth Rate:</span>
                      <span className="text-cyan-600">{session.results.market_research.growth_rate || 'N/A'}</span>
                    </div>
                    {session.results.market_research.opportunities && (
                      <div>
                        <span className="text-gray-600">Opportunities:</span>
                        <ul className="mt-1 text-sm text-gray-700">
                          {session.results.market_research.opportunities.map((opp: string, idx: number) => (
                            <li key={idx} className="ml-2">• {opp}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Trend Analysis Results */}
            {session.results?.trend_analysis && (
              <Card className="glass-effect ember-glow">
                <CardHeader>
                  <CardTitle className="text-gray-800">Trend Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {session.results.trend_analysis.data && Array.isArray(session.results.trend_analysis.data) ? (
                      session.results.trend_analysis.data.slice(0, 3).map((trend: any, idx: number) => (
                        <div key={idx} className="border-b border-gray-200 pb-2 last:border-b-0">
                          <div className="flex justify-between">
                            <span className="text-gray-600">{trend.title}:</span>
                            <span className="text-cyan-600">{trend.traffic}</span>
                          </div>
                          {trend.relatedQueries && (
                            <div className="text-xs text-gray-500 mt-1">
                              {trend.relatedQueries.slice(0, 2).join(', ')}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500">No trend data available</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Competitor Analysis Results */}
            {session.results?.competitor_scan && (
              <Card className="glass-effect ember-glow">
                <CardHeader>
                  <CardTitle className="text-gray-800">Competitor Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Competitors Found:</span>
                      <span className="text-gray-800">
                        {session.results.competitor_scan.competitors ? 
                          session.results.competitor_scan.competitors.length : 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Market Share:</span>
                      <span className="text-gray-800">{session.results.competitor_scan.market_share || 'N/A'}</span>
                    </div>
                    {session.results.competitor_scan.differentiation_opportunities && (
                      <div>
                        <span className="text-gray-600">Opportunities:</span>
                        <ul className="mt-1 text-sm text-gray-700">
                          {session.results.competitor_scan.differentiation_opportunities.map((opp: string, idx: number) => (
                            <li key={idx} className="ml-2">• {opp}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Niche Analysis Results */}
            {session.results?.niche_analysis_business_planning && (
              <Card className="glass-effect ember-glow">
                <CardHeader>
                  <CardTitle className="text-gray-800">Niche Analysis & Business Planning</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Viability Score:</span>
                      <span className="text-cyan-600">{session.results.niche_analysis_business_planning.viability_score || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Market Potential:</span>
                      <span className="text-gray-800">{session.results.niche_analysis_business_planning.marketResearch?.market_size || 'N/A'}</span>
                    </div>
                    {session.results.niche_analysis_business_planning.businessModel && (
                      <div>
                        <span className="text-gray-600">Business Model:</span>
                        <div className="text-sm text-gray-700 mt-1">
                          {session.results.niche_analysis_business_planning.businessModel.revenue_model || 'Subscription-based'}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Business Registration Results */}
            {session.results?.business_registration_automation && (
              <Card className="glass-effect ember-glow">
                <CardHeader>
                  <CardTitle className="text-gray-800">Business Registration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">EIN Status:</span>
                      <Badge className="bg-cyan-500">{session.results.business_registration_automation.ein_status || 'N/A'}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">DUNS Status:</span>
                      <Badge className="bg-yellow-500">{session.results.business_registration_automation.duns_status || 'N/A'}</Badge>
                    </div>
                    {session.results.business_registration_automation.next_steps && (
                      <div>
                        <span className="text-gray-600">Next Steps:</span>
                        <ul className="mt-1 text-sm text-gray-700">
                          {session.results.business_registration_automation.next_steps.slice(0, 3).map((step: string, idx: number) => (
                            <li key={idx} className="ml-2">• {step}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Digital Storefront Results */}
            {session.results?.digital_product_storefront_creation && (
              <Card className="glass-effect ember-glow">
                <CardHeader>
                  <CardTitle className="text-gray-800">Digital Storefront</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Platform:</span>
                      <span className="text-gray-800">{session.results.digital_product_storefront_creation.storefront?.platform || 'Shopify Plus'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Launch Timeline:</span>
                      <span className="text-cyan-600">{session.results.digital_product_storefront_creation.launch_timeline || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Revenue Estimate:</span>
                      <span className="text-green-600">{session.results.digital_product_storefront_creation.estimated_revenue || 'N/A'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Investment Materials Results */}
            {session.results?.investment_materials_generation && (
              <Card className="glass-effect ember-glow">
                <CardHeader>
                  <CardTitle className="text-gray-800">Investment Materials</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Funding Target:</span>
                      <span className="text-green-600">{session.results.investment_materials_generation.funding_target || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pitch Deck:</span>
                      <Badge className="bg-cyan-500">Ready</Badge>
                    </div>
                    {session.results.investment_materials_generation.investor_types && (
                      <div>
                        <span className="text-gray-600">Target Investors:</span>
                        <div className="text-sm text-gray-700 mt-1">
                          {session.results.investment_materials_generation.investor_types.join(', ')}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Funding Applications Results */}
            {session.results?.funding_applications && (
              <Card className="glass-effect ember-glow">
                <CardHeader>
                  <CardTitle className="text-gray-800">Funding Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Applications Submitted:</span>
                      <span className="text-gray-800">{session.results.funding_applications.applications_submitted || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Potential Funding:</span>
                      <span className="text-green-600">{session.results.funding_applications.potential_funding || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Timeline:</span>
                      <span className="text-cyan-600">{session.results.funding_applications.expected_timeline || 'N/A'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Setup Results */}
            {session.results?.payment_processing_setup && (
              <Card className="glass-effect ember-glow">
                <CardHeader>
                  <CardTitle className="text-gray-800">Payment Processing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Primary Gateway:</span>
                      <span className="text-gray-800">{session.results.payment_processing_setup.paymentGateways?.primary || 'Stripe'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Processing Fees:</span>
                      <span className="text-gray-600">{session.results.payment_processing_setup.processing_fees || '2.9% + 30¢'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">PCI Compliance:</span>
                      <Badge className="bg-green-500">{session.results.payment_processing_setup.pci_compliance || 'Level 1'}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Show message if no results yet */}
            {(!session.results || Object.keys(session.results).length === 0) && (
              <Card className="glass-effect ember-glow col-span-2">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-600">
                    {session.status === 'running' ? 
                      'Results will appear here as automation progresses...' : 
                      'No results available for this session.'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="logs" className="mt-6">
          <Card className="glass-effect ember-glow">
            <CardHeader>
              <CardTitle className="text-gray-800">System Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs text-gray-300 h-96 overflow-y-auto">
                {session.logs && session.logs.length > 0 ? (
                  session.logs.map((log, index) => {
                    const logTypeColors = {
                      'info': 'text-cyan-400',
                      'success': 'text-green-400',
                      'warning': 'text-yellow-400',
                      'error': 'text-red-400',
                      'process': 'text-blue-400',
                      'api': 'text-purple-400'
                    };
                    const colorClass = logTypeColors[log.type as keyof typeof logTypeColors] || 'text-gray-300';
                    
                    return (
                      <div key={index} className={`mb-1 ${colorClass}`}>
                        <span className="text-gray-500">
                          [{new Date(log.timestamp).toLocaleTimeString()}]
                        </span>
                        {' '}
                        <span className={`${log.type === 'error' ? 'font-bold' : ''}`}>
                          {log.message}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-gray-500">
                    {session.status === 'running' ? 
                      'Logs will appear here as automation progresses...' : 
                      'No logs available for this session.'}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="downloads" className="mt-6">
          <Card className="glass-effect ember-glow">
            <CardHeader>
              <CardTitle className="text-gray-800">Export Documents</CardTitle>
              {session.status === 'completed' && (
                <p className="text-sm text-gray-600">
                  Download professional business documents generated from your automation
                </p>
              )}
            </CardHeader>
            <CardContent>
              {session.status !== 'completed' ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Complete the automation to access downloads</p>
                </div>
              ) : exportInfo ? (
                <div className="space-y-4">
                  {exportInfo.exportOptions?.map((option: any) => {
                    const isDownloading = downloadingFormats.has(option.format);
                    const IconComponent = getFormatIcon(option.fileType);
                    
                    return (
                      <Card key={option.format} className="border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <IconComponent className="h-8 w-8 text-blue-600" />
                              <div>
                                <h3 className="font-medium text-gray-900">{option.name}</h3>
                                <p className="text-sm text-gray-600">{option.description}</p>
                                <div className="flex items-center space-x-4 mt-1">
                                  <span className="text-xs text-gray-500">Size: {option.estimatedSize}</span>
                                  <Badge 
                                    className={option.available ? 'bg-green-500' : 'bg-gray-500'}
                                  >
                                    {option.available ? 'Ready' : 'Not Available'}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <Button
                              onClick={() => handleDownload(option.format, option.name)}
                              disabled={!option.available || isDownloading}
                              variant="outline"
                              className="border-orange-300"
                            >
                              {isDownloading ? (
                                <>
                                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-orange-500 border-t-transparent rounded-full" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Download className="mr-2 h-4 w-4" />
                                  Download
                                </>
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                  
                  {/* Complete Package Download */}
                  <Card className="border-2 border-orange-300 bg-orange-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Archive className="h-8 w-8 text-orange-600" />
                          <div>
                            <h3 className="font-medium text-gray-900">Complete Business Package</h3>
                            <p className="text-sm text-gray-600">All documents bundled with README file</p>
                            <span className="text-xs text-gray-500">Recommended for investors</span>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleDownload('complete', 'Complete Package')}
                          disabled={downloadingFormats.has('complete')}
                          className="bg-orange-500 hover:bg-orange-600 text-white"
                        >
                          {downloadingFormats.has('complete') ? (
                            <>
                              <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                              Packaging...
                            </>
                          ) : (
                            <>
                              <Archive className="mr-2 h-4 w-4" />
                              Download All
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 mx-auto border-4 border-orange-500 border-t-transparent rounded-full mb-4" />
                  <p className="text-gray-600">Loading export options...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutomationDashboard;