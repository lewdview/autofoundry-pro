import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AutomationInterface from './AutomationInterface';
import AutomationModal from './AutomationModal';
import Logo from './Logo';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { Zap, Target, Rocket, DollarSign, Shield, TrendingUp, Settings, CreditCard, User, LogOut, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const MainApp: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [showPricing, setShowPricing] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [showAutomationModal, setShowAutomationModal] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [automationType, setAutomationType] = useState<string>('');
  const [isStartingAutomation, setIsStartingAutomation] = useState(false);

  const handleStartAutomation = async (data: any) => {
    console.log('Starting automation with:', data);
    setIsStartingAutomation(true);
    setAutomationType(data.automationType);
    
    try {
      // Call the real backend API
      console.log('Making API call to start automation...');
      const response = await apiService.startTwoQuestionAutomation(data);
      console.log('API response received:', response);
      
      if (response.success || response.sessionId) {
        const sessionId = response.sessionId || response.session_id;
        console.log('Session ID extracted:', sessionId);
        
        if (!sessionId) {
          throw new Error('No session ID received from server');
        }
        
        setCurrentSessionId(sessionId);
        setShowAutomationModal(true);
        setActiveTab('dashboard');
        
        // Set basic session info for the dashboard
        setSession({
          sessionId: sessionId,
          status: 'running',
          currentStage: 1,
          progress: 0,
          estimatedTime: response.estimatedTime || 3600
        });
        
        console.log('Automation modal should now be visible');
      } else {
        console.error('Failed to start automation:', response);
        alert('Failed to start automation: ' + (response.message || 'Unknown error'));
      }
    } catch (error: any) {
      console.error('Error starting automation:', error);
      alert(error.message || 'Failed to start automation. Please try again.');
    } finally {
      setIsStartingAutomation(false);
    }
  };

  const handleRestartAutomation = () => {
    setActiveTab('automation');
  };

  const handlePurchaseCredits = () => {
    setShowPricing(true);
  };

  const handlePlanSelect = (plan: string) => {
    setShowPricing(false);
    // In a real app, this would update user credits via API
    console.log('Plan selected:', plan);
  };

  const getKYCStatusBadge = () => {
    switch (user?.kycStatus) {
      case 'approved':
        return <Badge className="bg-green-500 text-white"><CheckCircle className="h-3 w-3 mr-1" />Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 text-white"><AlertCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary"><AlertCircle className="h-3 w-3 mr-1" />Unverified</Badge>;
    }
  };

  const getUserInitials = () => {
    if (!user?.firstName || !user?.lastName) return 'U';
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  };

  const features = [
    {
      icon: <Target className="h-8 w-8 text-blue-400" />,
      title: "AI-Powered Market Research",
      description: "Advanced algorithms analyze trends and competition"
    },
    {
      icon: <Zap className="h-8 w-8 text-orange-400" />,
      title: "Complete Automation",
      description: "From idea to fully operational business in days"
    },
    {
      icon: <Shield className="h-8 w-8 text-cyan-400" />,
      title: "Compliance & Security",
      description: "PCI, GDPR compliant with enterprise-grade security"
    }
  ];

  if (showPricing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <Button 
            onClick={() => setShowPricing(false)}
            variant="outline" 
            className="mb-6 border-orange-300 text-orange-600 hover:bg-orange-50"
          >
            ← Back to Dashboard
          </Button>
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Pricing Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button onClick={() => handlePlanSelect('Starter')} className="p-4 h-auto">
                  <div>
                    <div className="font-bold">Starter - $99/mo</div>
                    <div className="text-sm">500 Credits</div>
                  </div>
                </Button>
                <Button onClick={() => handlePlanSelect('Professional')} className="p-4 h-auto bg-orange-500">
                  <div>
                    <div className="font-bold">Professional - $299/mo</div>
                    <div className="text-sm">1500 Credits</div>
                  </div>
                </Button>
                <Button onClick={() => handlePlanSelect('Enterprise')} className="p-4 h-auto">
                  <div>
                    <div className="font-bold">Enterprise - Custom</div>
                    <div className="text-sm">Unlimited Credits</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-6">
            <Logo size="lg" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {user?.businessName || 'AutoFoundry PRO'}
                <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent ml-2">DEMO</span>
              </h1>
              <div className="flex items-center space-x-3">
                <p className="text-gray-600">
                  Welcome back, {user?.firstName}!
                </p>
                {getKYCStatusBadge()}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-orange-600 font-bold">{user?.credits || 0} Credits</div>
              <div className="text-gray-500 text-sm">Available</div>
            </div>
            <Button 
              onClick={handlePurchaseCredits}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white ember-glow"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Buy Credits
            </Button>
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.avatar} alt={user?.firstName} />
                    <AvatarFallback className="bg-orange-500 text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass-effect mb-8">
            <TabsTrigger value="home" className="data-[state=active]:bg-orange-200/50">
              <Rocket className="mr-2 h-4 w-4" />
              Home
            </TabsTrigger>
            <TabsTrigger value="automation" className="data-[state=active]:bg-orange-200/50">
              <Zap className="mr-2 h-4 w-4" />
              Start Automation
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-orange-200/50" disabled={!session}>
              <TrendingUp className="mr-2 h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="credits" className="data-[state=active]:bg-orange-200/50">
              <DollarSign className="mr-2 h-4 w-4" />
              Credits
            </TabsTrigger>
          </TabsList>

          {/* Home Tab */}
          <TabsContent value="home">
            <div className="space-y-8">
              {/* Hero Section */}
              <Card className="glass-effect ember-glow bg-gradient-to-r from-orange-100/50 to-yellow-100/50">
                <CardContent className="p-8">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                      Ready to Build Your Business Empire?
                    </h2>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Our AI-powered automation pipeline handles everything from market research to payment processing. 
                      Get started with just two questions.
                    </p>
                    <Button 
                      onClick={() => setActiveTab('automation')}
                      size="lg"
                      className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white ember-glow"
                    >
                      <Rocket className="mr-2 h-5 w-5" />
                      Start Your Empire
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <Card key={index} className="glass-effect hover:bg-white/30 transition-all duration-300 ember-glow">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        {feature.icon}
                        <CardTitle className="text-gray-800">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Automation Tab */}
          <TabsContent value="automation">
            <AutomationInterface 
              onStartAutomation={handleStartAutomation} 
              isLoading={isStartingAutomation}
            />
          </TabsContent>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            {session ? (
              <div className="space-y-6">
                {/* 6-Stage Pipeline Progress */}
                <Card className="glass-effect ember-glow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Rocket className="h-6 w-6 text-orange-500" />
                      <span>6-Stage Business Automation Pipeline</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { stage: 1, name: '🔍 Niche Analysis & Business Planning', status: session.currentStage > 1 ? 'completed' : session.currentStage === 1 ? 'active' : 'pending' },
                        { stage: 2, name: '🏢 Business Registration Automation', status: session.currentStage > 2 ? 'completed' : session.currentStage === 2 ? 'active' : 'pending' },
                        { stage: 3, name: '🛍️ Digital Product & Storefront Creation', status: session.currentStage > 3 ? 'completed' : session.currentStage === 3 ? 'active' : 'pending' },
                        { stage: 4, name: '💼 Investment Materials Generation', status: session.currentStage > 4 ? 'completed' : session.currentStage === 4 ? 'active' : 'pending' },
                        { stage: 5, name: '💰 Funding Applications', status: session.currentStage > 5 ? 'completed' : session.currentStage === 5 ? 'active' : 'pending' },
                        { stage: 6, name: '💳 Payment Processing Setup', status: session.currentStage > 6 ? 'completed' : session.currentStage === 6 ? 'active' : 'pending' }
                      ].map(({ stage, name, status }) => (
                        <div key={stage} className={`flex items-center space-x-3 p-3 rounded-lg ${
                          status === 'completed' ? 'bg-green-100 border-green-300' :
                          status === 'active' ? 'bg-orange-100 border-orange-300 ring-2 ring-orange-400' :
                          'bg-gray-100 border-gray-300'
                        } border`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            status === 'completed' ? 'bg-green-500 text-white' :
                            status === 'active' ? 'bg-orange-500 text-white' :
                            'bg-gray-300 text-gray-600'
                          }`}>
                            {status === 'completed' ? '✓' : stage}
                          </div>
                          <span className={`flex-1 font-medium ${
                            status === 'active' ? 'text-orange-800' : 
                            status === 'completed' ? 'text-green-800' : 'text-gray-600'
                          }`}>
                            {name}
                          </span>
                          {status === 'active' && (
                            <div className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                              <Badge className="bg-orange-500 text-white">Running</Badge>
                            </div>
                          )}
                          {status === 'completed' && (
                            <Badge className="bg-green-500 text-white">Completed</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Session Status */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="glass-effect">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{session.currentStage}/6</div>
                        <div className="text-sm text-gray-600">Stages Complete</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="glass-effect">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{Math.round((session.currentStage / 6) * 100)}%</div>
                        <div className="text-sm text-gray-600">Progress</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="glass-effect">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <Badge className={`${session.status === 'running' ? 'bg-orange-500' : session.status === 'completed' ? 'bg-green-500' : 'bg-gray-500'} text-white`}>
                          {session.status.toUpperCase()}
                        </Badge>
                        <div className="text-sm text-gray-600 mt-1">Status</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Controls */}
                <div className="flex space-x-4">
                  <Button variant="outline" onClick={handleRestartAutomation}>Restart Automation</Button>
                  <Button variant="destructive" onClick={() => setSession(null)}>Cancel Session</Button>
                </div>
              </div>
            ) : (
              <Card className="glass-effect">
                <CardContent className="p-8 text-center">
                  <Rocket className="h-16 w-16 text-orange-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No Active Automation Session</h3>
                  <p className="text-gray-600 mb-4">Start an automation to see the 6-stage pipeline in action</p>
                  <Button onClick={() => setActiveTab('automation')} className="bg-orange-500 hover:bg-orange-600">
                    Start 6-Stage Automation
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Credits Tab */}
          <TabsContent value="credits">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Credit Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">{user?.credits || 0}</div>
                    <div className="text-gray-600">Available Credits</div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded">
                      <div className="font-semibold">Used This Month</div>
                      <div className="text-2xl text-gray-600">50</div>
                    </div>
                    <div className="p-4 border rounded">
                      <div className="font-semibold">Total Credits</div>
                      <div className="text-2xl text-gray-600">{user?.credits || 0}</div>
                    </div>
                  </div>
                  <Button onClick={handlePurchaseCredits} className="w-full bg-orange-500">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Buy More Credits
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Automation Progress Modal */}
        <AutomationModal
          isOpen={showAutomationModal}
          onClose={() => setShowAutomationModal(false)}
          sessionId={currentSessionId}
          automationType={automationType}
        />
      </div>
    </div>
  );
};

export default MainApp;
