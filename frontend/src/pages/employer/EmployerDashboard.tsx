import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useLanguage } from '../../contexts/LanguageContext';
import { api } from '../../services/api';
import {
  UsersIcon,
  BriefcaseIcon,
  CheckBadgeIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  DocumentCheckIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalCandidates: number;
  verifiedCredentials: number;
  activeJobs: number;
  applicationsReceived: number;
  credentialsVerifiedToday: number;
  talentPoolSize: number;
}

interface RecentActivity {
  id: string;
  type: 'verification' | 'application' | 'job_post' | 'candidate_view';
  title: string;
  description: string;
  timestamp: string;
  status?: 'success' | 'pending' | 'failed';
}

interface TrendingSkill {
  skill: string;
  candidateCount: number;
  trend: 'up' | 'down' | 'stable';
  demandScore: number;
}

const EmployerDashboard = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats>({
    totalCandidates: 0,
    verifiedCredentials: 0,
    activeJobs: 0,
    applicationsReceived: 0,
    credentialsVerifiedToday: 0,
    talentPoolSize: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [trendingSkills, setTrendingSkills] = useState<TrendingSkill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch employer dashboard statistics
      const [statsResponse, activityResponse, skillsResponse] = await Promise.all([
        api.get('/api/v1/employer/stats'),
        api.get('/api/v1/employer/recent-activity'),
        api.get('/api/v1/employer/trending-skills')
      ]).catch(() => [
        // Mock data if API calls fail
        { data: {
          totalCandidates: 1247,
          verifiedCredentials: 3892,
          activeJobs: 8,
          applicationsReceived: 156,
          credentialsVerifiedToday: 23,
          talentPoolSize: 892
        }},
        { data: [
          {
            id: '1',
            type: 'verification',
            title: 'Credential Verified',
            description: 'Python Developer Certificate - Rahul Sharma',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            status: 'success'
          },
          {
            id: '2',
            type: 'application',
            title: 'New Application',
            description: 'Frontend Developer - Priya Patel applied',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            status: 'pending'
          },
          {
            id: '3',
            type: 'candidate_view',
            title: 'Candidate Profile Viewed',
            description: 'Viewed profile: Arjun Kumar (Full Stack Developer)',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '4',
            type: 'job_post',
            title: 'Job Posted',
            description: 'Senior React Developer position created',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            status: 'success'
          }
        ]},
        { data: [
          { skill: 'JavaScript', candidateCount: 245, trend: 'up', demandScore: 92 },
          { skill: 'Python', candidateCount: 198, trend: 'up', demandScore: 88 },
          { skill: 'React', candidateCount: 167, trend: 'stable', demandScore: 85 },
          { skill: 'Node.js', candidateCount: 134, trend: 'up', demandScore: 82 },
          { skill: 'Digital Marketing', candidateCount: 89, trend: 'down', demandScore: 78 },
          { skill: 'Data Science', candidateCount: 76, trend: 'up', demandScore: 90 }
        ]}
      ]);

      setStats(statsResponse.data);
      setRecentActivity(activityResponse.data);
      setTrendingSkills(skillsResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'verification':
        return <CheckBadgeIcon className="h-5 w-5 text-green-600" />;
      case 'application':
        return <DocumentCheckIcon className="h-5 w-5 text-blue-600" />;
      case 'job_post':
        return <BriefcaseIcon className="h-5 w-5 text-purple-600" />;
      case 'candidate_view':
        return <EyeIcon className="h-5 w-5 text-gray-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />;
      case 'down':
        return <ArrowTrendingUpIcon className="h-4 w-4 text-red-500 transform rotate-180" />;
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full"></div>;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('Employer Dashboard')}</h1>
            <p className="text-gray-600">{t('Manage hiring, verify credentials, and discover talent')}</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Link
              to="/employer/talent-search"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MagnifyingGlassIcon className="h-4 w-4 mr-2 inline" />
              {t('Search Talent')}
            </Link>
            <Link
              to="/employer/post-job"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <BriefcaseIcon className="h-4 w-4 mr-2 inline" />
              {t('Post Job')}
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{stats.totalCandidates}</div>
                <div className="text-sm text-gray-600">{t('Total Candidates')}</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckBadgeIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{stats.verifiedCredentials}</div>
                <div className="text-sm text-gray-600">{t('Verified Credentials')}</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BriefcaseIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{stats.activeJobs}</div>
                <div className="text-sm text-gray-600">{t('Active Job Posts')}</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentCheckIcon className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{stats.applicationsReceived}</div>
                <div className="text-sm text-gray-600">{t('Applications Received')}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">{t('Recent Activity')}</h2>
            </div>
            <div className="p-6">
              {recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <ClockIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">{t('No recent activity')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {activity.status && (
                        <div className={`px-2 py-1 text-xs rounded-full ${
                          activity.status === 'success' ? 'bg-green-100 text-green-800' :
                          activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {t(activity.status)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Trending Skills */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">{t('Trending Skills')}</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {trendingSkills.map((skill, index) => (
                  <div key={skill.skill} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-800">{index + 1}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{skill.skill}</p>
                        <p className="text-xs text-gray-600">{skill.candidateCount} {t('candidates')}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{skill.demandScore}</span>
                      </div>
                      {getTrendIcon(skill.trend)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{t('Quick Actions')}</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                to="/employer/verify-credential"
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
              >
                <CheckBadgeIcon className="h-8 w-8 text-gray-400 group-hover:text-blue-600 mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">{t('Verify Credential')}</h3>
                <p className="text-sm text-gray-600">{t('Verify candidate credentials instantly')}</p>
              </Link>

              <Link
                to="/employer/talent-search"
                className="p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group"
              >
                <UserGroupIcon className="h-8 w-8 text-gray-400 group-hover:text-green-600 mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">{t('Search Talent')}</h3>
                <p className="text-sm text-gray-600">{t('Find candidates by skills and credentials')}</p>
              </Link>

              <Link
                to="/employer/analytics"
                className="p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors group"
              >
                <ChartBarIcon className="h-8 w-8 text-gray-400 group-hover:text-purple-600 mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">{t('View Analytics')}</h3>
                <p className="text-sm text-gray-600">{t('Hiring insights and trend analysis')}</p>
              </Link>

              <Link
                to="/employer/profile"
                className="p-4 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors group"
              >
                <BuildingOfficeIcon className="h-8 w-8 text-gray-400 group-hover:text-orange-600 mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">{t('Company Profile')}</h3>
                <p className="text-sm text-gray-600">{t('Manage your organization profile')}</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EmployerDashboard;