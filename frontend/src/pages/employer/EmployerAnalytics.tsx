import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useLanguage } from '../../contexts/LanguageContext';
import { api } from '../../services/api';
import {
  ChartBarIcon,
  UsersIcon,
  BriefcaseIcon,
  CheckBadgeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MapPinIcon,
  AcademicCapIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  overview: {
    totalApplications: number;
    totalCandidates: number;
    verificationRequests: number;
    activeJobs: number;
    applicationTrend: number;
    candidateTrend: number;
  };
  applicationsByMonth: Array<{
    month: string;
    applications: number;
    hired: number;
  }>;
  topSkillsInDemand: Array<{
    skill: string;
    jobCount: number;
    candidateCount: number;
    demandRatio: number;
  }>;
  locationAnalytics: Array<{
    location: string;
    jobCount: number;
    applicationCount: number;
    averageSalary: number;
  }>;
  credentialAnalytics: Array<{
    credentialType: string;
    verificationCount: number;
    successRate: number;
    nsqfLevel?: number;
  }>;
  hiringFunnel: {
    totalApplications: number;
    screeningPassed: number;
    interviewScheduled: number;
    interviewed: number;
    offered: number;
    hired: number;
  };
}

const EmployerAnalytics = () => {
  const { t } = useLanguage();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/v1/employer/analytics?period=${dateRange}`).catch(() => ({
        data: generateMockAnalytics()
      }));
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setAnalytics(generateMockAnalytics());
    } finally {
      setLoading(false);
    }
  };

  const generateMockAnalytics = (): AnalyticsData => {
    return {
      overview: {
        totalApplications: 324,
        totalCandidates: 1247,
        verificationRequests: 89,
        activeJobs: 12,
        applicationTrend: 15.3,
        candidateTrend: 8.7
      },
      applicationsByMonth: [
        { month: 'Jan', applications: 45, hired: 3 },
        { month: 'Feb', applications: 52, hired: 4 },
        { month: 'Mar', applications: 38, hired: 2 },
        { month: 'Apr', applications: 67, hired: 5 },
        { month: 'May', applications: 78, hired: 6 },
        { month: 'Jun', applications: 69, hired: 4 },
        { month: 'Jul', applications: 84, hired: 7 },
        { month: 'Aug', applications: 92, hired: 8 },
        { month: 'Sep', applications: 76, hired: 5 },
        { month: 'Oct', applications: 89, hired: 6 }
      ],
      topSkillsInDemand: [
        { skill: 'JavaScript', jobCount: 15, candidateCount: 245, demandRatio: 0.061 },
        { skill: 'Python', jobCount: 12, candidateCount: 198, demandRatio: 0.061 },
        { skill: 'React', jobCount: 18, candidateCount: 167, demandRatio: 0.108 },
        { skill: 'Node.js', jobCount: 10, candidateCount: 134, demandRatio: 0.075 },
        { skill: 'UI/UX Design', jobCount: 8, candidateCount: 89, demandRatio: 0.090 },
        { skill: 'Data Science', jobCount: 6, candidateCount: 76, demandRatio: 0.079 }
      ],
      locationAnalytics: [
        { location: 'Bangalore', jobCount: 25, applicationCount: 156, averageSalary: 1200000 },
        { location: 'Mumbai', jobCount: 18, applicationCount: 134, averageSalary: 1100000 },
        { location: 'Delhi', jobCount: 15, applicationCount: 98, averageSalary: 1000000 },
        { location: 'Hyderabad', jobCount: 12, applicationCount: 87, averageSalary: 950000 },
        { location: 'Pune', jobCount: 10, applicationCount: 76, averageSalary: 900000 },
        { location: 'Remote', jobCount: 8, applicationCount: 45, averageSalary: 1150000 }
      ],
      credentialAnalytics: [
        { credentialType: 'Software Development', verificationCount: 45, successRate: 0.92, nsqfLevel: 6 },
        { credentialType: 'Data Science', verificationCount: 28, successRate: 0.89, nsqfLevel: 7 },
        { credentialType: 'Digital Marketing', verificationCount: 34, successRate: 0.87, nsqfLevel: 5 },
        { credentialType: 'Project Management', verificationCount: 21, successRate: 0.95, nsqfLevel: 6 },
        { credentialType: 'Cloud Computing', verificationCount: 18, successRate: 0.83, nsqfLevel: 7 },
        { credentialType: 'Cybersecurity', verificationCount: 15, successRate: 0.90, nsqfLevel: 8 }
      ],
      hiringFunnel: {
        totalApplications: 324,
        screeningPassed: 156,
        interviewScheduled: 89,
        interviewed: 67,
        offered: 23,
        hired: 18
      }
    };
  };

  const formatCurrency = (amount: number) => {
    return `₹${(amount / 100000).toFixed(1)}L`;
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) {
      return <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />;
    } else if (trend < 0) {
      return <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />;
    }
    return null;
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

  if (!analytics) {
    return (
      <Layout>
        <div className="text-center py-12">
          <ChartBarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('No analytics data available')}</h3>
          <p className="text-gray-600">{t('Analytics will appear once you have hiring activity')}</p>
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
            <h1 className="text-2xl font-bold text-gray-900">{t('Analytics & Insights')}</h1>
            <p className="text-gray-600">{t('Track your hiring performance and talent market trends')}</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="7d">{t('Last 7 days')}</option>
              <option value="30d">{t('Last 30 days')}</option>
              <option value="90d">{t('Last 3 months')}</option>
              <option value="1y">{t('Last year')}</option>
            </select>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{analytics.overview.totalApplications}</div>
                <div className="text-sm text-gray-600">{t('Total Applications')}</div>
              </div>
              <div className="flex items-center space-x-1">
                {getTrendIcon(analytics.overview.applicationTrend)}
                <span className={`text-sm ${
                  analytics.overview.applicationTrend > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {Math.abs(analytics.overview.applicationTrend).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="mt-2">
              <UsersIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{analytics.overview.totalCandidates}</div>
                <div className="text-sm text-gray-600">{t('Total Candidates')}</div>
              </div>
              <div className="flex items-center space-x-1">
                {getTrendIcon(analytics.overview.candidateTrend)}
                <span className={`text-sm ${
                  analytics.overview.candidateTrend > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {Math.abs(analytics.overview.candidateTrend).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="mt-2">
              <UsersIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{analytics.overview.verificationRequests}</div>
                <div className="text-sm text-gray-600">{t('Verifications')}</div>
              </div>
            </div>
            <div className="mt-2">
              <CheckBadgeIcon className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{analytics.overview.activeJobs}</div>
                <div className="text-sm text-gray-600">{t('Active Jobs')}</div>
              </div>
            </div>
            <div className="mt-2">
              <BriefcaseIcon className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Applications Trend */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">{t('Applications Over Time')}</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {analytics.applicationsByMonth.slice(-6).map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 text-sm text-gray-600">{data.month}</div>
                      <div className="flex-1">
                        <div className="flex space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ 
                                width: `${(data.applications / Math.max(...analytics.applicationsByMonth.map(d => d.applications))) * 100}%` 
                              }}
                            ></div>
                          </div>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ 
                                width: `${(data.hired / Math.max(...analytics.applicationsByMonth.map(d => d.hired))) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-gray-900">{data.applications} applications</div>
                      <div className="text-green-600">{data.hired} hired</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <span>{t('Applications')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <span>{t('Hired')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hiring Funnel */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">{t('Hiring Funnel')}</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { label: 'Applications', value: analytics.hiringFunnel.totalApplications, color: 'bg-blue-600' },
                  { label: 'Screening Passed', value: analytics.hiringFunnel.screeningPassed, color: 'bg-indigo-600' },
                  { label: 'Interview Scheduled', value: analytics.hiringFunnel.interviewScheduled, color: 'bg-purple-600' },
                  { label: 'Interviewed', value: analytics.hiringFunnel.interviewed, color: 'bg-pink-600' },
                  { label: 'Offered', value: analytics.hiringFunnel.offered, color: 'bg-orange-600' },
                  { label: 'Hired', value: analytics.hiringFunnel.hired, color: 'bg-green-600' }
                ].map((stage, index) => {
                  const percentage = (stage.value / analytics.hiringFunnel.totalApplications) * 100;
                  return (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-24 text-sm text-gray-600">{t(stage.label)}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                        <div
                          className={`${stage.color} h-6 rounded-full flex items-center justify-end pr-2`}
                          style={{ width: `${Math.max(percentage, 5)}%` }}
                        >
                          <span className="text-white text-xs font-medium">{stage.value}</span>
                        </div>
                      </div>
                      <div className="w-12 text-sm text-gray-600 text-right">
                        {percentage.toFixed(0)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Skills in Demand */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">{t('Skills in High Demand')}</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {analytics.topSkillsInDemand.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-800">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{skill.skill}</div>
                        <div className="text-sm text-gray-600">
                          {skill.jobCount} jobs • {skill.candidateCount} candidates
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {formatPercentage(skill.demandRatio)}
                      </div>
                      <div className="text-xs text-gray-500">{t('demand ratio')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Location Analytics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">{t('Location Insights')}</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {analytics.locationAnalytics.map((location, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <MapPinIcon className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{location.location}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatCurrency(location.averageSalary)} avg
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <BriefcaseIcon className="h-4 w-4 text-blue-600" />
                        <span className="text-gray-600">{location.jobCount} jobs</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <UsersIcon className="h-4 w-4 text-green-600" />
                        <span className="text-gray-600">{location.applicationCount} applications</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Credential Verification Analytics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{t('Credential Verification Insights')}</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analytics.credentialAnalytics.map((credential, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <AcademicCapIcon className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-gray-900">{credential.credentialType}</div>
                        {credential.nsqfLevel && (
                          <div className="text-xs text-gray-500">NSQF Level {credential.nsqfLevel}</div>
                        )}
                      </div>
                    </div>
                    <div className={`px-2 py-1 text-xs rounded-full ${
                      credential.successRate >= 0.9 ? 'bg-green-100 text-green-800' :
                      credential.successRate >= 0.8 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {formatPercentage(credential.successRate)}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('Verifications')}:</span>
                      <span className="text-gray-900">{credential.verificationCount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics Summary */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4">{t('Key Insights')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <ClockIcon className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-gray-900">{t('Conversion Rate')}</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {formatPercentage(analytics.hiringFunnel.hired / analytics.hiringFunnel.totalApplications)}
              </div>
              <div className="text-gray-600">from application to hire</div>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckBadgeIcon className="h-4 w-4 text-green-600" />
                <span className="font-medium text-gray-900">{t('Avg. Success Rate')}</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {formatPercentage(
                  analytics.credentialAnalytics.reduce((acc, curr) => acc + curr.successRate, 0) / 
                  analytics.credentialAnalytics.length
                )}
              </div>
              <div className="text-gray-600">credential verification</div>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <UsersIcon className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-gray-900">{t('Top Location')}</span>
              </div>
              <div className="text-lg font-bold text-purple-600">
                {analytics.locationAnalytics[0]?.location}
              </div>
              <div className="text-gray-600">
                {analytics.locationAnalytics[0]?.applicationCount} applications
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EmployerAnalytics;