import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import WelcomeScreen from "@/components/WelcomeScreen";
import AuthForm from "@/components/AuthForm";
import KYCVerification from "@/components/KYCVerification";
import AutomationInterface from "@/components/AutomationInterface";
import AutomationDashboard from "@/components/AutomationDashboard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoadingSpinner from "@/components/LoadingSpinner";
import apiService from "@/services/api";

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null);
  const [showDemo, setShowDemo] = useState(false);
  const [demoAutomationStarted, setDemoAutomationStarted] = useState(false);
  const [demoSessionId, setDemoSessionId] = useState<string | null>(null);
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoSession, setDemoSession] = useState<any>(null);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-blue-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading AutoFoundry PRO..." />
      </div>
    );
  }

  // Show authentication form
  if (authMode) {
    return (
      <AuthForm 
        mode={authMode} 
        onBack={() => setAuthMode(null)}
        onSuccess={() => setAuthMode(null)}
      />
    );
  }

  // Show demo automation interface or dashboard
  if (demoAutomationStarted) {
    // If we have a session ID, show the dashboard
    if (demoSessionId) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-blue-50">
          <div className="container mx-auto px-4 py-8">
            {/* Demo Header */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    AutoFoundry <span className="text-orange-500">Demo</span>
                  </h1>
                  <p className="text-gray-600">Live automation in progress...</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => {
                    setDemoAutomationStarted(false);
                    setDemoSessionId(null);
                  }}
                  className="px-4 py-2 border border-orange-300 text-orange-600 hover:bg-orange-50 rounded-md"
                >
                  ← Back to Demo
                </button>
                <button 
                  onClick={() => setAuthMode('signup')}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white rounded-md"
                >
                  Sign Up for Full Access
                </button>
              </div>
            </div>
            
            <AutomationDashboard 
              session={demoSession || {
                sessionId: demoSessionId,
                status: 'running',
                progress: 0,
                currentStage: 1,
                estimatedTime: 15,
                results: null,
                logs: []
              }}
              onCancel={() => {
                setDemoAutomationStarted(false);
                setDemoSessionId(null);
                setDemoSession(null);
              }}
              onRestart={() => {
                const newSessionId = 'demo-session-' + Date.now();
                setDemoSessionId(newSessionId);
                setDemoSession({
                  sessionId: newSessionId,
                  status: 'running',
                  progress: 0,
                  currentStage: 1,
                  estimatedTime: 15,
                  results: null,
                  logs: []
                });
              }}
            />
          </div>
        </div>
      );
    }
    
    // Otherwise show the interface
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          {/* Demo Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  AutoFoundry <span className="text-orange-500">Demo</span>
                </h1>
                <p className="text-gray-600">Experience our automation platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setDemoAutomationStarted(false)}
                className="px-4 py-2 border border-orange-300 text-orange-600 hover:bg-orange-50 rounded-md"
              >
                ← Back to Demo
              </button>
              <button 
                onClick={() => setAuthMode('signup')}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white rounded-md"
              >
                Sign Up for Full Access
              </button>
            </div>
          </div>
          
          <AutomationInterface 
            onStartAutomation={async (data) => {
              setDemoLoading(true);
              try {
                console.log('Demo automation started with:', data);
                
                // Create a demo session immediately
                const demoSessionId = 'demo-session-' + Date.now();
                const initialSession = {
                  sessionId: demoSessionId,
                  status: 'running',
                  progress: 0,
                  currentStage: 1,
                  estimatedTime: 15,
                  results: null,
                  logs: []
                };
                
                setDemoSessionId(demoSessionId);
                setDemoSession(initialSession);
                
                // Simulate progressive automation
                setTimeout(() => {
                  setDemoSession(prev => ({ ...prev, progress: 20, currentStage: 2 }));
                }, 3000);
                
                setTimeout(() => {
                  setDemoSession(prev => ({ ...prev, progress: 40, currentStage: 3 }));
                }, 6000);
                
                setTimeout(() => {
                  setDemoSession(prev => ({ ...prev, progress: 60, currentStage: 4 }));
                }, 9000);
                
                setTimeout(() => {
                  setDemoSession(prev => ({ ...prev, progress: 80, currentStage: 5 }));
                }, 12000);
                
                setTimeout(() => {
                  setDemoSession(prev => ({ 
                    ...prev, 
                    progress: 100, 
                    currentStage: 6, 
                    status: 'completed',
                    results: {
                      market_research: { market_size: '2.4B' },
                      business_name: 'Demo Business',
                      revenue_projection: '$500K'
                    }
                  }));
                }, 15000);
                
                // Simulate starting the automation
                try {
                  const response = await apiService.getDemoData();
                  console.log('Demo data:', response);
                } catch (error) {
                  console.log('Demo mode - using mock data');
                }
                
              } catch (error) {
                console.error('Demo automation failed:', error);
                alert('Failed to start demo automation. Please try again.');
                setDemoLoading(false);
              }
            }}
            isLoading={demoLoading}
          />
        </div>
      </div>
    );
  }

  // Show demo mode
  if (showDemo) {
    return (
      <WelcomeScreen 
        onShowAuth={(mode) => setAuthMode(mode)} 
        onStartDemo={(data) => {
          console.log('Demo started with data:', data);
          setDemoAutomationStarted(true);
        }}
      />
    );
  }

  // User is authenticated
  if (isAuthenticated && user) {
    // Check if user needs KYC verification
    if (user.kycStatus === 'not_started' || user.kycStatus === 'rejected') {
      return <KYCVerification />;
    }

    // User is verified, show main app
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    );
  }

  // Show welcome screen for unauthenticated users
  return (
    <WelcomeScreen 
      onShowAuth={(mode) => setAuthMode(mode)}
      onStartDemo={() => setShowDemo(true)}
    />
  );
};

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
