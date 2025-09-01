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
      {isAuthenticated && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Dashboard Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">ESG Dashboard</h2>
                <p className="text-gray-600">
                  Track and analyze your sustainability metrics
                </p>
              </div>
              <div className="flex space-x-4 mt-4 lg:mt-0">
                <Link href="/questionnaire" className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Data</span>
                </Link>
                {hasData && (
                  <div className="relative" ref={exportDropdownRef}>
                    <button 
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
                      onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                    >
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Export Dropdown */}
                    {exportDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                        <div className="py-1">
                          <button
                            onClick={handleExportPDF}
                            disabled={exportLoading}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                          >
                            {exportLoading ? (
                              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                              </svg>
                            )}
                            <span>Export as PDF</span>
                          </button>
                          <button
                            onClick={handleExportExcel}
                            disabled={exportLoading}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                          >
                            {exportLoading ? (
                              <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                              </svg>
                            )}
                            <span>Export as Excel</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {dashboardLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
              </div>
            ) : !hasData ? (
              /* Empty State */
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="w-12 h-12 text-teal-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Welcome to your ESG Dashboard
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Start by filling out your first ESG questionnaire to see your sustainability metrics and insights.
                </p>
                <Link href="/questionnaire" className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-6 rounded-lg transition-colors inline-flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Fill ESG Questionnaire</span>
                </Link>
              </div>
            ) : (
              <>
                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Carbon Intensity</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {latestData?.carbonIntensity?.toFixed(6) || 'N/A'}
                          </p>
                          <p className="text-xs text-gray-500">T CO2e / INR</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <Leaf className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Renewable Energy</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {latestData?.renewableElectricityRatio?.toFixed(1) || 'N/A'}%
                          </p>
                          <p className="text-xs text-gray-500">Clean energy ratio</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Diversity Ratio</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {latestData?.diversityRatio?.toFixed(1) || 'N/A'}%
                          </p>
                          <p className="text-xs text-gray-500">Gender diversity</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Users className="w-6 h-6 text-purple-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Community Spend</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {latestData?.communitySpendRatio?.toFixed(1) || 'N/A'}%
                          </p>
                          <p className="text-xs text-gray-500">Of total revenue</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Building className="w-6 h-6 text-orange-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Carbon Emissions Trend */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Carbon Emissions Trend
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={summary?.trends?.carbonEmissions || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#14b8a6" 
                          strokeWidth={2}
                          dot={{ fill: '#14b8a6' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Revenue Trend */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Revenue Growth
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={summary?.trends?.totalRevenue || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#06b6d4" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* ESG Distribution and Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* ESG Distribution */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      ESG Focus Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center space-x-6 mt-4">
                      {pieData.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="text-sm text-gray-600">
                            {item.name} ({item.value}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Recent Activity
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-4">
                        {(summary?.financialYears || []).slice(0, 5).map((year, index) => (
                          <div key={year} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-teal-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  ESG Data for {year}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Financial year {year}
                                </p>
                              </div>
                            </div>
                            <Link 
                              href={`/questionnaire?year=${year}`}
                              className="text-teal-600 hover:text-teal-700 text-sm flex items-center space-x-1 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              <span>View</span>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      )}

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

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Ready to start your ESG journey?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join organizations worldwide who trust Oren ESG for their sustainability reporting
            </p>
            
            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register" className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 shadow-sm hover:shadow-md inline-flex items-center space-x-2">
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/auth/login" className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg border border-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 shadow-sm hover:shadow-md">
                  Sign In to Existing Account
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/questionnaire" className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 shadow-sm hover:shadow-md inline-flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Fill ESG Questionnaire</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/upload-pdf" className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm hover:shadow-md inline-flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>Upload PDF</span>
                  <ArrowRight className="w-5 h-5" />
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