import React, { useState, useEffect } from 'react';
import { withAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout/Layout';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Leaf, 
  Building, 
  Download,
  ArrowLeft,
  FileText,
  FileSpreadsheet
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Link from 'next/link';

interface ESGData {
  id: string;
  financialYear: number;
  companyName: string;
  totalElectricityConsumption: number;
  renewableElectricityConsumption: number;
  totalFuelConsumption: number;
  carbonEmissions: number;
  totalEmployees: number;
  femaleEmployees: number;
  averageTrainingHours: number;
  communityInvestment: number;
  independentBoardMembers: number;
  hasDataPrivacyPolicy: string;
  totalRevenue: number;
  createdAt: string;
}

const SummaryPage: React.FC = () => {
  const [esgData, setEsgData] = useState<ESGData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useEffect(() => {
    // TODO: Fetch ESG data from API
    // For now, show sample data
    const sampleData: ESGData[] = [
      {
        id: '1',
        financialYear: 2024,
        companyName: 'Sample Corp',
        totalElectricityConsumption: 50000,
        renewableElectricityConsumption: 32500,
        totalFuelConsumption: 2500,
        carbonEmissions: 150.5,
        totalEmployees: 200,
        femaleEmployees: 96,
        averageTrainingHours: 24.5,
        communityInvestment: 500000,
        independentBoardMembers: 60,
        hasDataPrivacyPolicy: 'yes',
        totalRevenue: 25000000,
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        financialYear: 2023,
        companyName: 'Sample Corp',
        totalElectricityConsumption: 48000,
        renewableElectricityConsumption: 28800,
        totalFuelConsumption: 2800,
        carbonEmissions: 165.2,
        totalEmployees: 180,
        femaleEmployees: 81,
        averageTrainingHours: 22.0,
        communityInvestment: 450000,
        independentBoardMembers: 55,
        hasDataPrivacyPolicy: 'yes',
        totalRevenue: 22000000,
        createdAt: '2023-01-15T10:00:00Z'
      }
    ];

    setTimeout(() => {
      setEsgData(sampleData);
      setSelectedYear(2024);
      setLoading(false);
    }, 1000);
  }, []);

  const selectedData = esgData.find(data => data.financialYear === selectedYear);

  // Chart data preparation
  const yearlyComparisonData = esgData.map(data => ({
    year: data.financialYear,
    carbonEmissions: data.carbonEmissions,
    renewableRatio: data.totalElectricityConsumption > 0 ? 
      (data.renewableElectricityConsumption / data.totalElectricityConsumption) * 100 : 0,
    diversityRatio: data.totalEmployees > 0 ? 
      (data.femaleEmployees / data.totalEmployees) * 100 : 0,
    communitySpendRatio: data.totalRevenue > 0 ? 
      (data.communityInvestment / data.totalRevenue) * 100 : 0
  }));

  const pieData = selectedData ? [
    { name: 'Environmental', value: 35, color: '#10b981' },
    { name: 'Social', value: 40, color: '#3b82f6' },
    { name: 'Governance', value: 25, color: '#8b5cf6' }
  ] : [];

  const handleDownloadPDF = () => {
    // TODO: Implement PDF download
    alert('PDF download functionality will be implemented here');
  };

  const handleDownloadExcel = () => {
    // TODO: Implement Excel download
    alert('Excel download functionality will be implemented here');
  };

  if (loading) {
    return (
      <Layout title="ESG Summary - Oren">
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#BBE8E1] via-white to-[#F5CD6B]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BBE8E1] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading ESG summary...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="ESG Summary - Oren">
      <div className="min-h-screen bg-gradient-to-br from-[#BBE8E1] via-white to-[#F5CD6B] py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/questionnaire" 
              className="inline-flex items-center text-[#BBE8E1] hover:text-[#A8D8D1] mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Questionnaire
            </Link>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">ESG Summary Dashboard</h1>
                <p className="text-gray-600">Comprehensive overview of your sustainability metrics</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleDownloadPDF}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Download PDF
                </button>
                <button
                  onClick={handleDownloadExcel}
                  className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Download Excel
                </button>
              </div>
            </div>
          </div>

          {/* Year Selector */}
          <div className="bg-white/90 shadow-xl rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Financial Year</h2>
            <div className="flex gap-3">
              {esgData.map(data => (
                <button
                  key={data.financialYear}
                  onClick={() => setSelectedYear(data.financialYear)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedYear === data.financialYear
                      ? 'bg-[#BBE8E1] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  FY {data.financialYear}
                </button>
              ))}
            </div>
          </div>

          {selectedData && (
            <>
              {/* Key Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white/90 shadow-xl rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Carbon Intensity</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {selectedData.totalRevenue > 0 ? 
                          (selectedData.carbonEmissions / selectedData.totalRevenue).toFixed(6) : 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500">T CO2e / INR</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Leaf className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 shadow-xl rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Renewable Energy</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {selectedData.totalElectricityConsumption > 0 ? 
                          ((selectedData.renewableElectricityConsumption / selectedData.totalElectricityConsumption) * 100).toFixed(1) : 'N/A'}%
                      </p>
                      <p className="text-xs text-gray-500">Clean energy ratio</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 shadow-xl rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Diversity Ratio</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {selectedData.totalEmployees > 0 ? 
                          ((selectedData.femaleEmployees / selectedData.totalEmployees) * 100).toFixed(1) : 'N/A'}%
                      </p>
                      <p className="text-xs text-gray-500">Gender diversity</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 shadow-xl rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Community Spend</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {selectedData.totalRevenue > 0 ? 
                          ((selectedData.communityInvestment / selectedData.totalRevenue) * 100).toFixed(2) : 'N/A'}%
                      </p>
                      <p className="text-xs text-gray-500">Of total revenue</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Building className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Yearly Comparison */}
                <div className="bg-white/90 shadow-xl rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Yearly ESG Performance Comparison
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={yearlyComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="carbonEmissions" fill="#10b981" name="Carbon Emissions" />
                      <Bar dataKey="renewableRatio" fill="#3b82f6" name="Renewable Ratio %" />
                      <Bar dataKey="diversityRatio" fill="#8b5cf6" name="Diversity Ratio %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* ESG Distribution */}
                <div className="bg-white/90 shadow-xl rounded-2xl p-6">
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
              </div>

              {/* Detailed Metrics Table */}
              <div className="bg-white/90 shadow-xl rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Detailed Metrics for FY {selectedData.financialYear}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Metric</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Value</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Unit</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4 text-sm text-gray-600">Environmental</td>
                        <td className="py-3 px-4 text-sm text-gray-900">Total Electricity Consumption</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{selectedData.totalElectricityConsumption.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-gray-500">kWh</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4 text-sm text-gray-600">Environmental</td>
                        <td className="py-3 px-4 text-sm text-gray-900">Renewable Electricity</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{selectedData.renewableElectricityConsumption.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-gray-500">kWh</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4 text-sm text-gray-600">Environmental</td>
                        <td className="py-3 px-4 text-sm text-gray-900">Carbon Emissions</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{selectedData.carbonEmissions.toFixed(2)}</td>
                        <td className="py-3 px-4 text-sm text-gray-500">T CO2e</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4 text-sm text-gray-600">Social</td>
                        <td className="py-3 px-4 text-sm text-gray-900">Total Employees</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{selectedData.totalEmployees.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-gray-500">-</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4 text-sm text-gray-600">Social</td>
                        <td className="py-3 px-4 text-sm text-gray-900">Female Employees</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{selectedData.femaleEmployees.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-gray-500">-</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4 text-sm text-gray-600">Governance</td>
                        <td className="py-3 px-4 text-sm text-gray-900">Independent Board Members</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{selectedData.independentBoardMembers}%</td>
                        <td className="py-3 px-4 text-sm text-gray-500">%</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4 text-sm text-gray-600">Governance</td>
                        <td className="py-3 px-4 text-sm text-gray-900">Data Privacy Policy</td>
                        <td className="py-3 px-4 text-sm text-gray-900 capitalize">{selectedData.hasDataPrivacyPolicy}</td>
                        <td className="py-3 px-4 text-sm text-gray-500">-</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-sm text-gray-600">Financial</td>
                        <td className="py-3 px-4 text-sm text-gray-900">Total Revenue</td>
                        <td className="py-3 px-4 text-sm text-gray-900">₹{selectedData.totalRevenue.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-gray-500">INR</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default withAuth(SummaryPage, { title: "ESG Summary - Oren" });
