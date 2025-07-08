import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  onSelect: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  description,
  features,
  isPopular = false,
  onSelect
}) => {
  return (
    <Card className={`relative h-full transition-all duration-300 hover:scale-105 glass-effect ember-glow ${
      isPopular ? 'border-orange-400 shadow-2xl shadow-orange-500/25' : 'border-orange-200'
    }`}>
      {isPopular && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-yellow-500">
          Most Popular
        </Badge>
      )}
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold text-gray-800">{title}</CardTitle>
        <div className="text-4xl font-bold text-orange-600 mt-2">{price}</div>
        <p className="text-gray-600 mt-2">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center space-x-2">
              <Check className="h-5 w-5 text-cyan-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
        <Button 
          onClick={onSelect}
          className={`w-full mt-6 ${
            isPopular 
              ? 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white ember-glow' 
              : 'bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white'
          }`}
        >
          Get Started
        </Button>
      </CardContent>
    </Card>
  );
};

export default PricingCard;