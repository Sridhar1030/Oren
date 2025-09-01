import React, { useState, useEffect } from 'react';
import { withAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout/Layout';
import { 
  Plus, 
  Calendar, 
  Eye, 
  Edit, 
  Trash2,
  BarChart3,
  TrendingUp,
  Leaf,
  Users
} from 'lucide-react';
import Link from 'next/link';

interface Questionnaire {
  id: string;
  financialYear: number;
  companyName: string;
  createdAt: string;
  status: 'draft' | 'completed' | 'submitted';
  metrics: {
    carbonEmissions?: number;
    renewableElectricityRatio?: number;
    diversityRatio?: number;
    communitySpendRatio?: number;
  };
}

const QuestionnaireIndexPage: React.FC = () => {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch questionnaires from API
    // For now, show sample data
    const sampleData: Questionnaire[] = [
      {
        id: '1',
        financialYear: 2024,
        companyName: 'Sample Corp',
        createdAt: '2024-01-15T10:00:00Z',
        status: 'completed',
        metrics: {
          carbonEmissions: 150.5,
          renewableElectricityRatio: 65.2,
          diversityRatio: 48.5,
          communitySpendRatio: 2.1
        }
      },
      {
        id: '2',
        financialYear: 2023,
        companyName: 'Sample Corp',
        createdAt: '2023-01-15T10:00:00Z',
        status: 'completed',
        metrics: {
          carbonEmissions: 165.2,
          renewableElectricityRatio: 58.7,
          diversityRatio: 45.2,
          communitySpendRatio: 1.8
        }
      }
    ];

    setTimeout(() => {
      setQuestionnaires(sampleData);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <Layout title="Questionnaires - Oren">
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#BBE8E1] via-white to-[#F5CD6B]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BBE8E1] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading questionnaires...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Questionnaires - Oren">
      <div className="min-h-screen bg-gradient-to-br from-[#BBE8E1] via-white to-[#F5CD6B] py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ESG Questionnaires</h1>
            <p className="text-gray-600">Manage your sustainability assessments and track progress over time</p>
          </div>

          {/* Action Bar */}
          <div className="bg-white/90 shadow-xl rounded-2xl p-6 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Quick Actions</h2>
                <p className="text-gray-600">Create new assessments or view existing data</p>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/questionnaire/new"
                  className="bg-[#BBE8E1] hover:bg-[#A8D8D1] text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  New Questionnaire
                </Link>
                <Link
                  href="/questionnaire/summary"
                  className="bg-[#F5CD6B] hover:bg-[#F0C55A] text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center"
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  View Summary
                </Link>
              </div>
            </div>
          </div>

          {/* Questionnaires List */}
          <div className="bg-white/90 shadow-xl rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Your Questionnaires</h2>
              <span className="text-sm text-gray-500">{questionnaires.length} total</span>
            </div>

            {questionnaires.length === 0 ? (
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No questionnaires yet</h3>
                <p className="text-gray-500 mb-6">Start by creating your first ESG assessment</p>
                <Link
                  href="/questionnaire/new"
                  className="bg-[#BBE8E1] hover:bg-[#A8D8D1] text-white font-semibold py-2 px-4 rounded-lg transition-colors inline-flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Questionnaire
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {questionnaires.map((questionnaire) => (
                  <div
                    key={questionnaire.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                      {/* Left side - Basic info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {questionnaire.companyName} - FY {questionnaire.financialYear}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(questionnaire.status)}`}>
                            {getStatusText(questionnaire.status)}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <Calendar className="w-4 h-4 mr-1" />
                          Created {new Date(questionnaire.createdAt).toLocaleDateString()}
                        </div>

                        {/* Metrics preview */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="flex items-center">
                            <Leaf className="w-4 h-4 text-green-600 mr-2" />
                            <span className="text-sm text-gray-600">
                              {questionnaire.metrics.carbonEmissions?.toFixed(1) || 'N/A'} T CO2e
                            </span>
                          </div>
                          <div className="flex items-center">
                            <TrendingUp className="w-4 h-4 text-blue-600 mr-2" />
                            <span className="text-sm text-gray-600">
                              {questionnaire.metrics.renewableElectricityRatio?.toFixed(1) || 'N/A'}% RE
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 text-purple-600 mr-2" />
                            <span className="text-sm text-gray-600">
                              {questionnaire.metrics.diversityRatio?.toFixed(1) || 'N/A'}% Diversity
                            </span>
                          </div>
                          <div className="flex items-center">
                            <BarChart3 className="w-4 h-4 text-orange-600 mr-2" />
                            <span className="text-sm text-gray-600">
                              {questionnaire.metrics.communitySpendRatio?.toFixed(1) || 'N/A'}% Community
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right side - Actions */}
                      <div className="flex gap-2">
                        <Link
                          href={`/questionnaire/${questionnaire.id}`}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/questionnaire/${questionnaire.id}/edit`}
                          className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default withAuth(QuestionnaireIndexPage, { title: "Questionnaires - Oren" });
