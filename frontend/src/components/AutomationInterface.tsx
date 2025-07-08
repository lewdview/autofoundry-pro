import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, Zap, Target, AlertCircle } from 'lucide-react';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import LoadingSpinner from './LoadingSpinner';
import Logo from './Logo';
import { AppError } from '@/types/errors';

interface AutomationInterfaceProps {
  onStartAutomation: (data: any) => void;
  isLoading?: boolean;
}

const AutomationInterface: React.FC<AutomationInterfaceProps> = ({ 
  onStartAutomation, 
  isLoading = false 
}) => {
  const [mode, setMode] = useState<'lucky' | 'custom'>('lucky');
  const [businessIdea, setBusinessIdea] = useState('');
  const [automationType, setAutomationType] = useState('full-automation');
  const [industry, setIndustry] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  const { error, clearError } = useErrorHandler();

  const validateInputs = (): boolean => {
    const errors: string[] = [];
    
    if (mode === 'custom') {
      if (!businessIdea.trim()) {
        errors.push('Business idea is required');
      } else if (businessIdea.trim().length < 10) {
        errors.push('Business idea must be at least 10 characters long');
      } else if (businessIdea.trim().length > 500) {
        errors.push('Business idea must be less than 500 characters');
      }
      
      if (!industry) {
        errors.push('Industry selection is required');
      }
    }
    
    if (!automationType) {
      errors.push('Automation type is required');
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const getCreditsForType = (type: string): number => {
    const creditMap: Record<string, number> = {
      'niche-only': 25,
      'business-setup': 45,
      'full-automation': 80
    };
    return creditMap[type] || 45;
  };

  const handleFeelingLucky = () => {
    try {
      clearError();
      setValidationErrors([]);
      
      if (!validateInputs()) {
        return;
      }

      const data = {
        feelingLucky: true,
        automationType,
        creditsUsed: getCreditsForType(automationType)
      };

      onStartAutomation(data);
    } catch (err) {
      setValidationErrors(['Failed to start automation. Please try again.']);
    }
  };

  const handleCustomStart = () => {
    try {
      clearError();
      setValidationErrors([]);
      
      if (!validateInputs()) {
        return;
      }

      const data = {
        businessIdea: businessIdea.trim(),
        automationType,
        industry,
        feelingLucky: false,
        creditsUsed: getCreditsForType(automationType)
      };

      onStartAutomation(data);
    } catch (err) {
      setValidationErrors(['Failed to start automation. Please try again.']);
    }
  };

  const handleModeChange = (newMode: 'lucky' | 'custom') => {
    setMode(newMode);
    setValidationErrors([]);
    clearError();
  };

  const handleBusinessIdeaChange = (value: string) => {
    setBusinessIdea(value);
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  if (isLoading) {
    return (
      <LoadingSpinner 
        size="lg" 
        text="Starting your automation..." 
        fullScreen 
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <Logo size="lg" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Choose Your Path to Success
        </h2>
        <p className="text-gray-600 text-lg">
          Let our AI build your business empire or provide your own vision
        </p>
      </div>

      {/* Error Display */}
      {(error || validationErrors.length > 0) && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error ? error.message : validationErrors.join(', ')}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Feeling Lucky */}
        <Card className={`glass-effect border-2 transition-all duration-300 cursor-pointer ember-glow ${
          mode === 'lucky' 
            ? 'bg-gradient-to-br from-orange-100/50 to-yellow-100/50 border-orange-400' 
            : 'border-orange-200 hover:bg-white/30'
        }`} onClick={() => handleModeChange('lucky')}>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Sparkles className="h-8 w-8 text-orange-500" />
              <CardTitle className="text-gray-800 text-2xl">I'm Feeling Lucky</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              Let our AI randomly select a profitable niche and build your entire business automatically.
            </p>
            {mode === 'lucky' && (
              <div className="space-y-4">
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">
                    Automation Level
                  </label>
                  <Select value={automationType} onValueChange={setAutomationType}>
                    <SelectTrigger className="glass-effect border-orange-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="niche-only">Niche Analysis Only (25 credits)</SelectItem>
                      <SelectItem value="business-setup">Business Setup (45 credits)</SelectItem>
                      <SelectItem value="full-automation">Full Automation (80 credits)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleFeelingLucky}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white ember-glow disabled:opacity-50 disabled:cursor-not-allowed"
                  size="lg"
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <Sparkles className="mr-2 h-5 w-5" />
                  )}
                  Start Lucky Automation
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Custom Idea */}
        <Card className={`glass-effect border-2 transition-all duration-300 cursor-pointer ember-glow ${
          mode === 'custom' 
            ? 'bg-gradient-to-br from-blue-100/50 to-cyan-100/50 border-blue-400' 
            : 'border-orange-200 hover:bg-white/30'
        }`} onClick={() => handleModeChange('custom')}>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Target className="h-8 w-8 text-blue-500" />
              <CardTitle className="text-gray-800 text-2xl">Custom Business Idea</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              Have a specific business idea? Let our AI analyze and build it for you.
            </p>
            {mode === 'custom' && (
              <div className="space-y-4">
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">
                    Business Idea *
                  </label>
                  <Textarea
                    value={businessIdea}
                    onChange={(e) => handleBusinessIdeaChange(e.target.value)}
                    placeholder="Describe your business idea in detail... (10-500 characters)"
                    className="glass-effect border-blue-200 placeholder-gray-500 min-h-[100px]"
                    maxLength={500}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {businessIdea.length}/500 characters
                  </div>
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">
                    Industry *
                  </label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger className="glass-effect border-blue-200">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="saas">SaaS</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="digital-products">Digital Products</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">
                    Automation Level
                  </label>
                  <Select value={automationType} onValueChange={setAutomationType}>
                    <SelectTrigger className="glass-effect border-blue-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="niche-only">Niche Analysis Only (25 credits)</SelectItem>
                      <SelectItem value="business-setup">Business Setup (45 credits)</SelectItem>
                      <SelectItem value="full-automation">Full Automation (80 credits)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleCustomStart}
                  disabled={!businessIdea.trim() || !industry || isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white ember-glow disabled:opacity-50 disabled:cursor-not-allowed"
                  size="lg"
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <Zap className="mr-2 h-5 w-5" />
                  )}
                  Analyze & Build
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AutomationInterface;