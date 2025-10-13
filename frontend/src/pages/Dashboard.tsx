import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { DashboardStats } from '../types';
import { adminAPI } from '../services/api';
import {
  Users,
  Award,
  FileText,
  CheckCircle,
  TrendingUp,
  Calendar,
  BarChart3,
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect to role-specific dashboard
    if (user?.role && user.role !== 'admin') {
      navigate(`/${user.role}`);
      return;
    }

    // Load dashboard stats for admin
    const loadStats = async () => {
      try {
        if (user?.role === 'admin') {
          const data = await adminAPI.getDashboardStats();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.first_name}!
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Here's what's happening on your platform today.
            </p>
          </div>

          {/* Stats Grid */}
          {stats && (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <StatCard
                  title="Total Users"
                  value={stats.total_users}
                  icon={Users}
                  color="bg-blue-500"
                  trend="+12%"
                />
                <StatCard
                  title="Credentials Issued"
                  value={stats.total_credentials}
                  icon={FileText}
                  color="bg-green-500"
                  trend="+8%"
                />
                <StatCard
                  title="Badge Templates"
                  value={stats.total_badge_templates}
                  icon={Award}
                  color="bg-yellow-500"
                  trend="+5%"
                />
                <StatCard
                  title="Verifications"
                  value={stats.total_verifications}
                  icon={CheckCircle}
                  color="bg-purple-500"
                  trend="+15%"
                />
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Users by Role Chart */}
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Users by Role</h3>
                    <BarChart3 className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="space-y-3">
                    {Object.entries(stats.users_by_role).map(([role, count]) => (
                      <div key={role} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${getRoleColor(role)}`}></div>
                          <span className="text-sm font-medium capitalize text-gray-900">
                            {role}s
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Credentials Status Chart */}
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Credential Status</h3>
                    <TrendingUp className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="space-y-3">
                    {Object.entries(stats.credentials_by_status).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${getStatusColor(status)}`}></div>
                          <span className="text-sm font-medium capitalize text-gray-900">
                            {status}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-3">
                  {stats.recent_activity.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          {getActivityIcon({ type: activity.type })}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill Categories */}
              <div className="mt-8">
                <div className="card">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Popular Skill Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {stats.skill_categories.slice(0, 10).map((category) => (
                      <span
                        key={category}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

// Helper Components
const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <div className="card-hover">
    <div className="flex items-center">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <div className="flex items-center">
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {trend && (
            <span className="ml-2 text-sm font-medium text-green-600">{trend}</span>
          )}
        </div>
      </div>
    </div>
  </div>
);

const getRoleColor = (role: string) => {
  switch (role) {
    case 'learner': return 'bg-blue-500';
    case 'issuer': return 'bg-green-500';
    case 'employer': return 'bg-yellow-500';
    case 'admin': return 'bg-purple-500';
    default: return 'bg-gray-500';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'issued': return 'bg-green-500';
    case 'revoked': return 'bg-red-500';
    case 'expired': return 'bg-gray-500';
    default: return 'bg-gray-500';
  }
};

const getActivityIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'credential_issued':
      return <FileText className="w-4 h-4 text-primary-600" />;
    case 'user_registered':
      return <Users className="w-4 h-4 text-primary-600" />;
    case 'template_created':
      return <Award className="w-4 h-4 text-primary-600" />;
    case 'verification':
      return <CheckCircle className="w-4 h-4 text-primary-600" />;
    default:
      return <div className="w-4 h-4 bg-primary-600 rounded-full" />;
  }
};

export default Dashboard;