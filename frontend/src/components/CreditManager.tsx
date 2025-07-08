import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CreditCard, TrendingUp, Zap } from 'lucide-react';

interface CreditManagerProps {
  credits: number;
  usedCredits: number;
  totalCredits: number;
  onPurchaseCredits: () => void;
}

const CreditManager: React.FC<CreditManagerProps> = ({
  credits,
  usedCredits,
  totalCredits,
  onPurchaseCredits
}) => {
  const usagePercentage = (usedCredits / totalCredits) * 100;
  const remainingPercentage = (credits / totalCredits) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Credit Management
        </h2>
        <p className="text-gray-600">
          Track your automation credits and purchase more as needed
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="glass-effect ember-glow">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center">
              <Zap className="mr-2 h-5 w-5 text-orange-500" />
              Available Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {credits}
            </div>
            <p className="text-gray-600">Ready to use for automation</p>
          </CardContent>
        </Card>

        <Card className="glass-effect ember-glow">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-cyan-500" />
              Usage Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Used: {usedCredits}</span>
                <span className="text-gray-600">Total: {totalCredits}</span>
              </div>
              <Progress value={usagePercentage} className="h-2" />
              <div className="text-xs text-gray-500">
                {Math.round(usagePercentage)}% of total credits used
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-effect ember-glow">
        <CardHeader>
          <CardTitle className="text-gray-800">Purchase More Credits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Need more credits? Purchase additional automation credits to continue building your business empire.
            </p>
            <Button 
              onClick={onPurchaseCredits}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white ember-glow"
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Purchase Credits
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditManager;