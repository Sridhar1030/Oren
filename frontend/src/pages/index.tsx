import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  BarChart3, 
  Shield, 
  Zap, 
  Users, 
  TrendingUp, 
  CheckCircle,
  Leaf,
  Building,
  Calendar,
  Plus,
  Download,
  Eye,
  Upload
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Layout from '@/components/Layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { esgAPI, handleApiError } from '@/utils/api';
import { downloadPDF, downloadExcel, getCompanyName } from '@/utils/exportUtils';
import toast from 'react-hot-toast';

interface ESGSummary {
  totalResponses: number;
  financialYears: number[];
  latestResponse: any;
  trends: {
    carbonEmissions: { year: number; value: number }[];
    totalRevenue: { year: number; value: number }[];
    totalEmployees: { year: number; value: number }[];
    diversityRatio: { year: number; value: number }[];
  };
}

const HomePage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [summary, setSummary] = useState<ESGSummary | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const exportDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target as Node)) {
        setExportDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchSummary = async () => {
        setDashboardLoading(true);
        try {
          const response = await esgAPI.getSummary();
          setSummary(response.data);
        } catch (error) {
          console.error('Error fetching ESG summary:', error);
          handleApiError(error);
        } finally {
          setDashboardLoading(false);
        }
      };

      fetchSummary();
    }
  }, [isAuthenticated]);

  // Show loading state while determining authentication
  if (isLoading) {
    return (
      <Layout title="Oren ESG - Sustainability Data Management Platform">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      </Layout>
    );
  }

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

  // Dashboard data
  const latestData = summary?.latestResponse;
  const hasData = summary && (summary.totalResponses ?? 0) > 0;

  // Define pie chart data for ESG distribution
  const pieData = [
    { name: 'Environmental', value: 35, color: '#10b981' },
    { name: 'Social', value: 40, color: '#3b82f6' },
    { name: 'Governance', value: 25, color: '#8b5cf6' }
  ];

  // Export functions
  const handleExportPDF = async () => {
    if (!summary) return;
    
    setExportLoading(true);
    try {
      const companyName = getCompanyName();
      downloadPDF(summary, { companyName });
      toast.success('PDF exported successfully!');
      setExportDropdownOpen(false);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export PDF');
    } finally {
      setExportLoading(false);
    }
  };

  const handleExportExcel = async () => {
    if (!summary) return;
    
    setExportLoading(true);
    try {
      const companyName = getCompanyName();
      downloadExcel(summary, { companyName });
      toast.success('Excel file exported successfully!');
      setExportLoading(false);
    } catch (error) {
      console.error('Error exporting Excel:', error);
      toast.error('Failed to export Excel file');
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <Layout title="Oren ESG - Sustainability Data Management Platform">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-teal-100"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              All Your{' '}
              <span className="bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">Sustainability Data</span>
              <br />
              and Stakeholders{' '}
              <span className="bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">Connected</span>
              <br />
              in One Place
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Comprehensive ESG questionnaire and sustainability data management platform. 
              Track, analyze, and report your environmental, social, and governance metrics with ease.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link href="/questionnaire" className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 shadow-sm hover:shadow-md inline-flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Fill ESG Questionnaire</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link href="/auth/register" className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 shadow-sm hover:shadow-md inline-flex items-center space-x-2">
                    <span>Get Started Free</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link href="/auth/login" className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg border border-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 shadow-sm hover:shadow-md">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Section - Only show if authenticated */}
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <div key={index} className="bg-white rounded-xl transition-all duration-300 border border-gray-100 shadow-sm hover:shadow-md hover:scale-105 p-6">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-20 bg-gradient-to-r from-teal-50 to-teal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl transition-all duration-300 border border-gray-100 shadow-sm hover:shadow-md p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {metric.label}
                </h3>
                <p className="text-sm text-gray-600">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default HomePage;