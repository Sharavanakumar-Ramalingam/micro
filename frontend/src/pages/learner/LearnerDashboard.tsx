import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { api } from '../../services/api';
import {
  TrophyIcon,
  CheckBadgeIcon,
  EyeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const LearnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/api/v1/dashboard/learner');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
        </div>
      </Layout>
    );
  }

  const stats = dashboardData?.stats || {
    total_credentials: 0,
    verified_credentials: 0,
    public_credentials: 0,
    shared_credentials: 0
  };

  const recentCredentials = dashboardData?.recent_credentials || [];

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-gray-600">Track your learning progress and achievements</p>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card">
              <div className="flex items-center">
                <TrophyIcon className="h-8 w-8 text-yellow-500 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Total Credentials</p>
                  <p className="text-2xl font-bold">{stats.total_credentials}</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center">
                <CheckBadgeIcon className="h-8 w-8 text-green-500 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Verified</p>
                  <p className="text-2xl font-bold">{stats.verified_credentials}</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center">
                <EyeIcon className="h-8 w-8 text-blue-500 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Public</p>
                  <p className="text-2xl font-bold">{stats.public_credentials}</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center">
                <TrophyIcon className="h-8 w-8 text-purple-500 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Shared</p>
                  <p className="text-2xl font-bold">{stats.shared_credentials}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Credentials</h3>
            {recentCredentials.length === 0 ? (
              <div className="text-center py-8">
                <TrophyIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No credentials yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentCredentials.map((credential: any) => (
                  <div key={credential.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{credential.title}</h4>
                      <p className="text-sm text-gray-600">{credential.issuer.name}</p>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {credential.completion_date ? new Date(credential.completion_date).toLocaleDateString() : 'Recent'}
                      </div>
                    </div>
                    {credential.status === 'issued' && (
                      <CheckBadgeIcon className="h-6 w-6 text-green-500" />
                    )}
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

export default LearnerDashboard;