import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import PricingSection from './PricingSection';
import StageProgress from './StageProgress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Target, Rocket, DollarSign, Shield, TrendingUp } from 'lucide-react';

const AppLayout: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useAppContext();
  const isMobile = useIsMobile();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showProgress, setShowProgress] = useState(false);

  const mockStages = [
    {
      id: 1,
      title: "Niche Analysis & Business Planning",
      description: "AI-powered market research and competitor analysis",
      status: 'completed' as const,
      progress: 100,
      tasks: []
    },
    {
      id: 2,
      title: "Business Registration Automation",
      description: "EIN, DUNS, and state registration processing",
      status: 'in-progress' as const,
      progress: 65,
      tasks: ["Processing EIN application", "Generating legal documents", "State registration pending"]
    },
    {
      id: 3,
      title: "Digital Product & Storefront Creation",
      description: "AI content generation and e-commerce setup",
      status: 'pending' as const,
      progress: 0,
      tasks: []
    },
    {
      id: 4,
      title: "Investment Materials",
      description: "Pitch deck and financial modeling",
      status: 'pending' as const,
      progress: 0,
      tasks: []
    },
    {
      id: 5,
      title: "Funding Applications",
      description: "Automated investor outreach",
      status: 'pending' as const,
      progress: 0,
      tasks: []
    },
    {
      id: 6,
      title: "Payment Processing",
      description: "Crypto wallet and payment gateway setup",
      status: 'pending' as const,
      progress: 0,
      tasks: []
    }
  ];

  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan);
    setShowProgress(true);
  };

  const features = [
    {
      icon: <Target className="h-8 w-8 text-blue-400" />,
      title: "AI-Powered Market Research",
      description: "Advanced algorithms analyze trends and competition"
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-400" />,
      title: "Complete Automation",
      description: "From idea to fully operational business in days"
    },
    {
      icon: <Shield className="h-8 w-8 text-green-400" />,
      title: "Compliance & Security",
      description: "PCI, GDPR compliant with enterprise-grade security"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-6">
              Business Automation
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Pipeline</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Transform your business idea into a fully automated empire with our AI-powered 6-stage pipeline. 
              From market research to payment processing, we handle everything.
            </p>
            <div className="flex justify-center space-x-4">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Rocket className="mr-2 h-5 w-5" />
                Start Your Empire
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="backdrop-blur-lg bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    {feature.icon}
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <PricingSection onPlanSelect={handlePlanSelect} />

      {/* Progress Glass Window */}
      {showProgress && (
        <div className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-4">
                Your Automation Pipeline
              </h3>
              <p className="text-gray-300">
                Watch as our AI systems work to build your business empire
              </p>
            </div>
            <StageProgress stages={mockStages} currentStage={2} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AppLayout;