import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown, Building, Rocket } from 'lucide-react';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import Logo from './Logo';

interface PricingTier {
  name: string;
  priceMonthly: number;
  priceYearly: number;
  credits: number | string;
  automations: number | string;
  features: string[];
  popular?: boolean;
}

interface PricingTiers {
  [key: string]: PricingTier;
}

const PricingPage: React.FC = () => {
  const [pricingTiers, setPricingTiers] = useState<PricingTiers>({});
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadPricingTiers();
  }, []);

  const loadPricingTiers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/pricing');
      const data = await response.json();
      
      if (data.success) {
        setPricingTiers(data.tiers);
      }
    } catch (error) {
      console.error('Failed to load pricing:', error);
      // Fallback pricing if API fails
      setPricingTiers({
        'startup-explorer': {
          name: 'Startup Explorer',
          priceMonthly: 199,
          priceYearly: 1997,
          credits: 100,
          automations: 5,
          features: [
            'Complete 6-stage automation pipeline',
            'Professional export documents',
            'Basic customer support',
            'Glass window dashboard',
            '30-day money-back guarantee'
          ]
        },
        'business-builder': {
          name: 'Business Builder',
          priceMonthly: 499,
          priceYearly: 4997,
          credits: 300,
          automations: 15,
          features: [
            'Everything in Startup Explorer',
            'Priority customer support',
            'Advanced analytics dashboard',
            'Custom branding on exports',
            'API access (limited)',
            'Rollover up to 50 unused credits'
          ],
          popular: true
        },
        'enterprise-accelerator': {
          name: 'Enterprise Accelerator',
          priceMonthly: 1499,
          priceYearly: 14997,
          credits: 1000,
          automations: 50,
          features: [
            'Everything in Business Builder',
            'White-label dashboard',
            'Full API access',
            'Dedicated account manager',
            'Custom integrations',
            'Unlimited rollover credits',
            'SLA guarantee (99.9% uptime)'
          ]
        },
        'agency-consultants': {
          name: 'Agency & Consultants',
          priceMonthly: 2999,
          priceYearly: 29997,
          credits: 'unlimited',
          automations: 'unlimited',
          features: [
            'Complete white-label solution',
            'Your branding throughout',
            'Reseller program (30% commission)',
            'Custom domain hosting',
            'Advanced user management',
            'Revenue sharing opportunities'
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = async (tierKey: string) => {
    setSelectedTier(tierKey);
    
    toast({
      title: "Plan Selected",
      description: `You selected ${pricingTiers[tierKey].name}. Redirecting to registration...`,
    });

    // In a real app, navigate to registration with selected tier
    console.log(`Selected tier: ${tierKey}, billing: ${billingCycle}`);
  };

  const getIcon = (tierKey: string) => {
    switch (tierKey) {
      case 'startup-explorer':
        return <Rocket className="h-8 w-8 text-blue-500" />;
      case 'business-builder':
        return <Star className="h-8 w-8 text-orange-500" />;
      case 'enterprise-accelerator':
        return <Building className="h-8 w-8 text-purple-500" />;
      case 'agency-consultants':
        return <Crown className="h-8 w-8 text-yellow-500" />;
      default:
        return <Zap className="h-8 w-8 text-gray-500" />;
    }
  };

  const formatPrice = (tier: PricingTier) => {
    const price = billingCycle === 'monthly' ? tier.priceMonthly : tier.priceYearly;
    const monthlyEquivalent = billingCycle === 'yearly' ? price / 12 : price;
    
    return {
      price,
      monthlyEquivalent: Math.round(monthlyEquivalent),
      savings: billingCycle === 'yearly' ? Math.round((tier.priceMonthly * 12 - tier.priceYearly) / (tier.priceMonthly * 12) * 100) : 0
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <Logo size="lg" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Choose the perfect plan to automate your business creation. 
            All plans include our complete 6-stage automation pipeline with zero AI costs.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                billingCycle === 'yearly' ? 'bg-orange-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <Badge className="bg-green-100 text-green-800">Save 16%</Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {Object.entries(pricingTiers).map(([tierKey, tier]) => {
            const pricing = formatPrice(tier);
            const isPopular = tier.popular;
            
            return (
              <Card 
                key={tierKey} 
                className={`relative glass-effect ${isPopular ? 'border-2 border-orange-500' : 'border border-gray-200'} hover:shadow-2xl transition-all duration-300 ${selectedTier === tierKey ? 'ring-2 ring-orange-500' : ''}`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-orange-500 text-white px-6 py-2">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <div className="flex justify-center mb-4">
                    {getIcon(tierKey)}
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {tier.name}
                  </CardTitle>
                  <div className="mt-4">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900">
                        ${pricing.monthlyEquivalent}
                      </span>
                      <span className="text-gray-500 ml-1">/month</span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <div className="text-sm text-gray-500 mt-1">
                        ${pricing.price} billed annually
                      </div>
                    )}
                    {pricing.savings > 0 && (
                      <div className="text-sm text-green-600 font-medium mt-1">
                        Save {pricing.savings}% with yearly billing
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Credits/month:</span>
                      <span className="font-semibold">{typeof tier.credits === 'number' ? tier.credits.toLocaleString() : tier.credits}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Automations:</span>
                      <span className="font-semibold">{typeof tier.automations === 'number' ? tier.automations : tier.automations}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleSelectPlan(tierKey)}
                    className={`w-full ${
                      isPopular 
                        ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}
                    disabled={selectedTier === tierKey}
                  >
                    {selectedTier === tierKey ? 'Selected' : 'Get Started'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Special Offers */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="glass-effect border-2 border-green-500">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center">
                <Star className="h-6 w-6 text-green-500 mr-2" />
                Lifetime Deal
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">$4,997</div>
              <div className="text-gray-600 mb-4">One-time payment</div>
              <div className="text-sm text-gray-500 mb-6">
                Limited to first 100 customers • Business Builder features forever
              </div>
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                Claim Lifetime Deal
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-effect border-2 border-blue-500">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center">
                <Crown className="h-6 w-6 text-blue-500 mr-2" />
                Founding Member
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">$99</div>
              <div className="text-gray-600 mb-4">per month forever</div>
              <div className="text-sm text-gray-500 mb-6">
                First 50 customers only • Startup Explorer features locked-in rate
              </div>
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                Become Founding Member
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Enterprise CTA */}
        <Card className="glass-effect border-2 border-purple-500 text-center">
          <CardContent className="p-12">
            <Crown className="h-16 w-16 text-purple-500 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Need Complete Platform Ownership?
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Get the entire BAT Pro platform with source code, private deployment, and territory exclusivity.
            </p>
            <div className="text-4xl font-bold text-gray-900 mb-2">$99,997</div>
            <div className="text-gray-600 mb-8">One-time + $4,997/month maintenance</div>
            <Button className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 text-lg">
              Contact for Enterprise Ownership
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">
            All plans include our revolutionary free AI technology with zero ongoing AI costs.
          </p>
          <p className="text-sm text-gray-500">
            30-day money-back guarantee • No setup fees • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
