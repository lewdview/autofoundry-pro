import React from 'react';
import PricingCard from './PricingCard';

interface PricingSectionProps {
  onPlanSelect: (plan: string) => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({ onPlanSelect }) => {
  const pricingPlans = [
    {
      title: "Starter",
      price: "$2,997",
      description: "Perfect for entrepreneurs testing the waters",
      features: [
        "Basic niche analysis",
        "Simple business registration",
        "Basic website creation",
        "Standard payment processing",
        "Email support",
        "30-day money back guarantee"
      ]
    },
    {
      title: "Professional",
      price: "$7,997",
      description: "Complete automation for serious entrepreneurs",
      features: [
        "Advanced AI market research",
        "Full business registration automation",
        "Professional e-commerce storefront",
        "Investment materials generation",
        "Automated funding applications",
        "Multi-crypto payment processing",
        "Priority support",
        "90-day money back guarantee"
      ],
      isPopular: true
    },
    {
      title: "Enterprise",
      price: "$19,997",
      description: "White-glove service with custom solutions",
      features: [
        "Everything in Professional",
        "Custom AI model training",
        "Dedicated account manager",
        "Custom integrations",
        "Advanced analytics dashboard",
        "24/7 phone support",
        "1-year money back guarantee",
        "Quarterly strategy sessions"
      ]
    }
  ];

  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Choose Your Automation Package
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your business idea into a fully automated empire with our AI-powered pipeline
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <PricingCard
              key={index}
              title={plan.title}
              price={plan.price}
              description={plan.description}
              features={plan.features}
              isPopular={plan.isPopular}
              onSelect={() => onPlanSelect(plan.title)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingSection;