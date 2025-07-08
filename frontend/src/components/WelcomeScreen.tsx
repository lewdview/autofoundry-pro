import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Rocket, 
  Zap, 
  Target, 
  Shield, 
  TrendingUp, 
  DollarSign,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Play
} from 'lucide-react';
import Logo from './Logo';
import AutomationInterface from './AutomationInterface';

interface WelcomeScreenProps {
  onShowAuth: (mode: 'login' | 'signup') => void;
  onStartDemo: (data: any) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onShowAuth, onStartDemo }) => {
  const [showDemo, setShowDemo] = useState(false);
  const [demoStarted, setDemoStarted] = useState(false);

  const features = [
    {
      icon: <Target className="h-6 w-6 text-blue-500" />,
      title: "AI Market Research",
      description: "Deep analysis of your niche with competitor insights"
    },
    {
      icon: <Zap className="h-6 w-6 text-orange-500" />,
      title: "Automated Setup",
      description: "Business registration, EIN, DUNS, and legal docs"
    },
    {
      icon: <Rocket className="h-6 w-6 text-purple-500" />,
      title: "Product Creation",
      description: "MVP development and digital product setup"
    },
    {
      icon: <DollarSign className="h-6 w-6 text-green-500" />,
      title: "Funding Pipeline",
      description: "Investor decks and funding applications"
    },
    {
      icon: <Shield className="h-6 w-6 text-cyan-500" />,
      title: "Payment Systems",
      description: "Stripe, PayPal, and crypto payment setup"
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-red-500" />,
      title: "Growth Analytics",
      description: "Real-time business metrics and insights"
    }
  ];

  const pricingPlans = [
    {
      name: "Trial",
      price: "Free",
      period: "Demo only",
      features: [
        "1 Demo automation",
        "Basic market research",
        "Sample business plan"
      ],
      popular: false,
      credits: 50
    },
    {
      name: "Starter",
      price: "$99",
      period: "/month",
      features: [
        "5 Business automations",
        "Full market research",
        "Business registration",
        "Basic legal documents",
        "Email support"
      ],
      popular: false,
      credits: 500
    },
    {
      name: "Professional",
      price: "$299",
      period: "/month",
      features: [
        "Unlimited automations",
        "Advanced AI analysis",
        "Complete business setup",
        "Investment materials",
        "Funding applications",
        "Priority support"
      ],
      popular: true,
      credits: 1500
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "/month",
      features: [
        "White-label solution",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 phone support",
        "Custom reporting",
        "Multi-business management"
      ],
      popular: false,
      credits: "Unlimited"
    }
  ];

  const handleTryDemo = () => {
    setShowDemo(true);
  };

  const handleDemoStart = (data: any) => {
    setDemoStarted(true);
    onStartDemo(data);
  };

  if (showDemo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          {/* Demo Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <Logo size="md" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  AutoFoundry <span className="text-orange-500">Demo</span>
                </h1>
                <p className="text-gray-600">Experience our automation platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Demo Mode
              </Badge>
              <Button 
                variant="outline" 
                onClick={() => setShowDemo(false)}
                className="border-orange-300 text-orange-600 hover:bg-orange-50"
              >
                ← Back to Home
              </Button>
              <Button 
                onClick={() => onShowAuth('signup')}
                className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
              >
                Sign Up for Full Access
              </Button>
            </div>
          </div>

          {/* Demo Interface */}
          <AutomationInterface 
            onStartAutomation={handleDemoStart}
            isLoading={demoStarted}
          />

          {/* Demo Limitations Notice */}
          <Card className="mt-8 border-orange-200 bg-orange-50/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <Sparkles className="h-5 w-5 text-orange-600" />
                <h3 className="font-semibold text-orange-800">Demo Limitations</h3>
              </div>
              <p className="text-orange-700 mb-4">
                This demo shows you how our automation works, but some features are limited:
              </p>
              <ul className="list-disc list-inside text-orange-700 space-y-1">
                <li>Only basic market research (no real business registration)</li>
                <li>Sample data and templates only</li>
                <li>No document downloads or real integrations</li>
                <li>Limited to 1 automation run</li>
              </ul>
              <div className="mt-4 pt-4 border-t border-orange-200">
                <Button 
                  onClick={() => onShowAuth('signup')}
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                >
                  Get Full Access - Sign Up Now
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
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center space-x-4">
            <Logo size="lg" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                AutoFoundry <span className="text-transparent bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text">PRO</span>
              </h1>
              <p className="text-gray-600">Transform ideas into automated business empires</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => onShowAuth('login')}
              className="border-orange-300 text-orange-600 hover:bg-orange-50"
            >
              Log In
            </Button>
            <Button 
              onClick={() => onShowAuth('signup')}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
            >
              Sign Up
            </Button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            Build Your Business Empire 
            <span className="block text-transparent bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text">
              In Just 6 Steps
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Our AI-powered automation platform handles everything from market research to 
            payment processing. Watch your idea transform into a fully operational business.
          </p>
          
          <div className="flex justify-center space-x-6">
            <Button 
              size="lg" 
              onClick={handleTryDemo}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg"
            >
              <Play className="mr-3 h-6 w-6" />
              TRY ME! (Free Demo)
            </Button>
            <Button 
              size="lg" 
              onClick={() => onShowAuth('signup')}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-8 py-4 text-lg"
            >
              <Rocket className="mr-3 h-6 w-6" />
              Start Building Now
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Complete Business Automation Pipeline
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="glass-effect hover:bg-white/40 transition-all duration-300 ember-glow">
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

        {/* Pricing Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Choose Your Plan
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`glass-effect transition-all duration-300 ember-glow ${
                plan.popular 
                  ? 'ring-2 ring-orange-400 bg-gradient-to-br from-orange-100/50 to-yellow-100/50' 
                  : 'hover:bg-white/40'
              }`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-gray-800">{plan.name}</CardTitle>
                      <div className="text-2xl font-bold text-gray-800 mt-2">
                        {plan.price}
                        <span className="text-sm font-normal text-gray-600">{plan.period}</span>
                      </div>
                    </div>
                    {plan.popular && (
                      <Badge className="bg-orange-500 text-white">Popular</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600' 
                        : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                    onClick={() => onShowAuth('signup')}
                  >
                    {plan.name === 'Trial' ? 'Try Demo' : 'Get Started'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="glass-effect ember-glow bg-gradient-to-r from-orange-100/50 to-yellow-100/50 text-center">
          <CardContent className="p-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Ready to Automate Your Success?
            </h3>
            <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
              Join thousands of entrepreneurs who have already automated their way to success. 
              Start with our free demo or dive straight into building your empire.
            </p>
            <div className="flex justify-center space-x-4">
              <Button 
                size="lg" 
                onClick={handleTryDemo}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Play className="mr-2 h-5 w-5" />
                Try Free Demo
              </Button>
              <Button 
                size="lg" 
                onClick={() => onShowAuth('signup')}
                className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
              >
                <Rocket className="mr-2 h-5 w-5" />
                Start Building
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WelcomeScreen;
