import React from 'react';
import { Search, Zap, Clock, Shield, CreditCard, ArrowRight } from 'lucide-react';
import { cn } from '../utils/cn';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Search className="w-6 h-6" />,
    title: "AI-Powered Search",
    description: "Get comprehensive answers powered by advanced AI technology"
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Real-time Data",
    description: "Access live stock market data and weather updates"
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Search History",
    description: "Keep track of your searches and continue conversations"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Secure & Private",
    description: "Your data is encrypted and protected at all times"
  }
];

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  popular?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying out INQUISAI",
    features: [
      "5 searches per month",
      "Basic search features",
      "Weather updates",
      "Stock market data"
    ],
    buttonText: "Get Started"
  },
  {
    name: "Pro",
    price: "$20",
    description: "For power users who need more",
    features: [
      "150 searches per month",
      "Advanced search features",
      "Priority support",
      "No ads"
    ],
    buttonText: "Upgrade to Pro",
    popular: true
  },
  {
    name: "Pay-as-you-go",
    price: "$10",
    description: "Flexible credit packages",
    features: [
      "50 additional searches",
      "Credits never expire",
      "Use anytime",
      "Same features as Pro"
    ],
    buttonText: "Buy Credits"
  }
];

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Discover Answers with
              <span className="text-[#0A85D1] block">AI-Powered Search</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Get comprehensive answers to your questions using advanced AI technology and real-time data sources.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-[#0A85D1] text-white rounded-full hover:bg-[#0972B5] transition-colors font-medium flex items-center justify-center gap-2">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium">
                View Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Everything you need to find the answers you're looking for
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-[#0A85D1] bg-opacity-10 rounded-lg flex items-center justify-center mb-4 text-[#0A85D1]">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Choose the plan that works best for you
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <div
                key={index}
                className={cn(
                  "bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition-shadow p-8 relative",
                  tier.popular && "border-2 border-[#0A85D1]"
                )}
              >
                {tier.popular && (
                  <div className="absolute top-0 right-8 transform -translate-y-1/2">
                    <div className="bg-[#0A85D1] text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {tier.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {tier.price}
                    </span>
                    {tier.name === "Pro" && (
                      <span className="text-gray-600 dark:text-gray-400">/month</span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    {tier.description}
                  </p>
                </div>
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center gap-3 text-gray-700 dark:text-gray-300"
                    >
                      <svg
                        className="w-5 h-5 text-[#0A85D1]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={cn(
                    "w-full py-3 rounded-lg font-medium transition-colors",
                    tier.popular
                      ? "bg-[#0A85D1] text-white hover:bg-[#0972B5]"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                  )}
                >
                  {tier.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};