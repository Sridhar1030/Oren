import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Leaf, 
  Building, 
  Calendar,
  Plus,
  Download,
  Eye
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Layout from '@/components/Layout/Layout';
import { withAuth } from '@/hooks/useAuth';
import { esgAPI, handleApiError } from '@/utils/api';

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

const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<ESGSummary | null>(null);
  const [loading, setLoading] = useState(true);
  return (
    <Layout title="Dashboard - Oren ESG">
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#BBE8E1] via-white to-[#F5CD6B] py-12 px-4">
        <div className="w-full max-w-4xl bg-white/90 shadow-2xl rounded-3xl p-10 flex flex-col items-center">
          <div className="w-16 h-2 bg-[#BBE8E1] mb-8 rounded" />
          <h1 className="text-5xl font-extrabold mb-2 text-center text-gray-800">Dashboard</h1>
          <p className="mb-8 text-center text-gray-500 text-lg">Welcome to your dashboard!</p>
          <div className="w-full bg-[#F5FCFA] rounded-xl p-8 shadow flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-[#14b8a6]">Overview</h2>
            <p className="text-gray-700">This is your dashboard. You can add widgets and more content here.</p>
          </div>
        </div>
      </div>
    </Layout>
  );

  if (loading) {
    return (
      <Layout title="Dashboard - Oren ESG">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  const latestData = summary?.latestResponse;
  const hasData = summary && (summary.totalResponses ?? 0) > 0;

  // Define pie chart data for ESG distribution
  const pieData = [
    { name: 'Environmental', value: 35, color: '#10b981' },
    { name: 'Social', value: 40, color: '#3b82f6' },
    { name: 'Governance', value: 25, color: '#8b5cf6' }
  ];

  return (
    <Layout title="Dashboard - Oren ESG">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ESG Dashboard</h1>
            <p className="text-gray-600">
              Track and analyze your sustainability metrics
            </p>
          </div>
          <div className="flex space-x-4 mt-4 lg:mt-0">
            <Link href="/questionnaire" className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Data</span>
            </Link>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {!hasData ? (
          /* Empty State */
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-12 h-12 text-primary-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Welcome to your ESG Dashboard
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start by filling out your first ESG questionnaire to see your sustainability metrics and insights.
            </p>
            <Link href="/questionnaire" className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-lg transition-colors inline-flex items-center space-x-2">
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
                    {summary?.financialYears?.slice(0, 5).map((year, index) => (
                      <div key={year} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-primary-600" />
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
                          className="text-primary-600 hover:text-primary-700 text-sm flex items-center space-x-1 transition-colors"
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
    </Layout>
  );
};

export default withAuth(DashboardPage, { title: "Dashboard - Oren ESG" });
  