import React from 'react';
import Link from 'next/link';
import { ArrowRight, BarChart3, Shield, Zap, Users, TrendingUp, CheckCircle } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import { useAuth } from '@/hooks/useAuth';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Comprehensive ESG Tracking',
      description: 'Track environmental, social, and governance metrics across multiple financial years.',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Auto-calculated Insights',
      description: 'Automatically calculate key ratios and performance indicators from your data.',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure & Compliant',
      description: 'Enterprise-grade security with full data privacy and compliance features.',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Real-time Updates',
      description: 'See your ESG metrics update in real-time as you input data.',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Team Collaboration',
      description: 'Work together with your team to collect and analyze sustainability data.',
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'Export & Reports',
      description: 'Generate comprehensive reports and export data in multiple formats.',
    },
  ];

  const metrics = [
    { label: 'Carbon Intensity', description: 'T CO2e / INR' },
    { label: 'Renewable Energy Ratio', description: 'Percentage of clean energy' },
    { label: 'Diversity Ratio', description: 'Gender diversity metrics' },
    { label: 'Community Investment', description: 'Social impact spending' },
  ];

  return (
    <Layout title="Oren ESG - Sustainability Data Management Platform">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-primary-100"></div>
        <div className="relative container-custom py-20 lg:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-large">
                <BarChart3 className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              All Your{' '}
              <span className="gradient-text">Sustainability Data</span>
              <br />
              and Stakeholders{' '}
              <span className="gradient-text">Connected</span>
              <br />
              in One Place
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Comprehensive ESG questionnaire and sustainability data management platform. 
              Track, analyze, and report your environmental, social, and governance metrics with ease.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link href="/dashboard" className="btn-primary inline-flex items-center space-x-2">
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link href="/auth/register" className="btn-primary inline-flex items-center space-x-2">
                    <span>Get Started Free</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link href="/auth/login" className="btn-secondary">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything you need for ESG reporting
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features to help you collect, analyze, and report on your sustainability metrics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card hover:scale-105 transition-transform duration-300">
                <div className="card-body">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-20 bg-gradient-to-r from-primary-50 to-primary-100">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Auto-calculated ESG Metrics
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform automatically calculates key sustainability indicators from your input data
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <div key={index} className="card bg-white/80 backdrop-blur-sm">
                <div className="card-body text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {metric.label}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {metric.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Ready to start your ESG journey?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join organizations worldwide who trust Oren ESG for their sustainability reporting
            </p>
            
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register" className="btn-primary inline-flex items-center space-x-2">
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/auth/login" className="btn-secondary">
                  Sign In to Existing Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;