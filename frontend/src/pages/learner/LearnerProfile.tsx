import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useLanguage } from '../../contexts/LanguageContext';
import { api } from '../../services/api';
import {
  UserCircleIcon,
  PencilIcon,
  CogIcon,
  ShieldCheckIcon,
  EyeIcon,
  CheckBadgeIcon,
  PhotoIcon,
  ChartBarIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  KeyIcon,
  TrophyIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface UserProfile {
  id: number;
  email: string;
  role: 'learner' | 'issuer' | 'employer' | 'admin';
  first_name?: string;
  last_name?: string;
  profile_image_url?: string;
  linkedin_url?: string;
  public_profile: boolean;
  created_at: string;
  // Additional fields for extended profile (to be implemented later)
  bio?: string;
  location?: string;
  website?: string;
  github_profile?: string;
  phone_number?: string;
  date_of_birth?: string;
}

const LearnerProfile = () => {
  const { t, currentLanguage, setCurrentLanguage } = useLanguage();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});
  const [settings, setSettings] = useState({
    language: currentLanguage,
    emailNotifications: true,
    publicProfile: false,
    shareCredentials: true,
    allowSearch: true,
    twoFactorAuth: false,
    loginNotifications: true
  });
  const [profileStats, setProfileStats] = useState({
    totalCredentials: 0,
    verifiedCredentials: 0,
    skillsCount: 0,
    profileViews: 0,
    lastLogin: null as string | null
  });
  const [activityLog, setActivityLog] = useState<Array<{id: number; action: string; timestamp: string}>>([]);

  useEffect(() => {
    fetchProfile();
    fetchProfileStats();
    fetchActivityLog();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/v1/auth/me');
      console.log('Profile data:', response.data);
      setProfile(response.data);
      setEditedProfile(response.data);
      setSettings(prev => ({
        ...prev,
        publicProfile: response.data.public_profile || false
      }));
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfileStats = async () => {
    try {
      // Fetch credentials count
      const credentialsResponse = await api.get('/api/v1/credentials');
      const credentials = credentialsResponse.data || [];
      const verifiedCredentials = credentials.filter((cred: any) => cred.verification_status === 'verified');
      
      // Calculate unique skills
      const allSkills = new Set();
      credentials.forEach((cred: any) => {
        if (cred.skills) {
          cred.skills.forEach((skill: string) => allSkills.add(skill));
        }
      });

      setProfileStats({
        totalCredentials: credentials.length,
        verifiedCredentials: verifiedCredentials.length,
        skillsCount: allSkills.size,
        profileViews: Math.floor(Math.random() * 100) + 10, // Mock data
        lastLogin: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching profile stats:', error);
    }
  };

  const fetchActivityLog = async () => {
    try {
      // Mock activity data - in real app, this would come from backend
      const mockActivities = [
        { id: 1, action: 'Profile updated', timestamp: new Date(Date.now() - 86400000).toISOString() },
        { id: 2, action: 'New credential received', timestamp: new Date(Date.now() - 172800000).toISOString() },
        { id: 3, action: 'Profile viewed', timestamp: new Date(Date.now() - 259200000).toISOString() }
      ];
      setActivityLog(mockActivities);
    } catch (error) {
      console.error('Error fetching activity log:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      console.log('Saving profile data:', editedProfile);
      const response = await api.put('/api/v1/users/profile', editedProfile);
      setProfile(response.data);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditedProfile(profile || {});
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSettingChange = async (setting: string, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));

    if (setting === 'language') {
      setCurrentLanguage(value as any);
    }

    // Save settings to backend
    try {
      await api.put('/users/settings', { [setting]: value });
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const handleExportProfile = () => {
    const profileData = {
      profile: profile,
      statistics: profileStats,
      settings: settings,
      exportedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(profileData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `profile_data_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleExportCredentials = async () => {
    try {
      const response = await api.get('/api/v1/credentials');
      const credentials = response.data || [];
      
      const credentialsData = {
        credentials: credentials,
        exportedAt: new Date().toISOString(),
        exportedBy: `${profile?.first_name} ${profile?.last_name}`
      };

      const dataStr = JSON.stringify(credentialsData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `credentials_data_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error('Error exporting credentials:', error);
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
            <h1 className="text-2xl font-bold text-gray-900">{t('My Profile')}</h1>
            <p className="text-gray-600">{t('Manage your profile and account settings')}</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Link
              to="/learner"
              className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              {t('Back to Dashboard')}
            </Link>
            {settings.publicProfile && (
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <EyeIcon className="h-4 w-4 mr-2 inline" />
                {t('View Public Profile')}
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'profile', label: t('Profile Information'), icon: UserCircleIcon },
              { key: 'statistics', label: t('Statistics & Activity'), icon: ChartBarIcon },
              { key: 'settings', label: t('Account Settings'), icon: CogIcon },
              { key: 'security', label: t('Security'), icon: KeyIcon },
              { key: 'privacy', label: t('Privacy & Sharing'), icon: ShieldCheckIcon },
              { key: 'verification', label: t('Verification Tools'), icon: CheckBadgeIcon }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">{t('Profile Information')}</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PencilIcon className="h-4 w-4 mr-2 inline" />
                  {t('Edit Profile')}
                </button>
              ) : (
                <div className="space-x-3">
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    {t('Cancel')}
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {t('Save Changes')}
                  </button>
                </div>
              )}
            </div>

            {/* Profile Picture Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-8 p-4 bg-gray-50 rounded-lg">
              <div className="relative">
                {profile?.profile_image_url ? (
                  <img
                    src={profile.profile_image_url}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center border-4 border-white shadow-lg">
                    <UserCircleIcon className="w-12 h-12 text-white" />
                  </div>
                )}
                {isEditing && (
                  <button className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg">
                    <PhotoIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">
                  {profile?.first_name} {profile?.last_name}
                </h3>
                <p className="text-gray-600">{profile?.email}</p>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <span>📅 {t('Member since')}: {profile?.created_at ? new Date(profile.created_at).getFullYear() : 'N/A'}</span>
                  <span>🏆 {profileStats.totalCredentials} {t('credentials')}</span>
                  <span>⭐ {profileStats.skillsCount} {t('skills')}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('First Name')}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.first_name || ''}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profile?.first_name || t('Not provided')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Last Name')}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.last_name || ''}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profile?.last_name || t('Not provided')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Email')}
                  </label>
                  <p className="text-gray-900">{profile?.email}</p>
                  <p className="text-xs text-gray-500">{t('Email cannot be changed')}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Phone Number')}
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedProfile.phone_number || ''}
                      onChange={(e) => handleInputChange('phone_number', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profile?.phone_number || t('Not provided')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Location')}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.location || ''}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profile?.location || t('Not provided')}</p>
                  )}
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Bio')}
                  </label>
                  {isEditing ? (
                    <textarea
                      rows={4}
                      value={editedProfile.bio || ''}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t('Tell us about yourself...')}
                    />
                  ) : (
                    <p className="text-gray-900">{profile?.bio || t('Not provided')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Website')}
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={editedProfile.website || ''}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profile?.website || t('Not provided')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('LinkedIn Profile')}
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={editedProfile.linkedin_url || ''}
                      onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profile?.linkedin_url || t('Not provided')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('GitHub Profile')}
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={editedProfile.github_profile || ''}
                      onChange={(e) => handleInputChange('github_profile', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profile?.github_profile || t('Not provided')}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'statistics' && (
          <div className="space-y-6">
            {/* Profile Statistics */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">{t('Profile Statistics')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">{t('Total Credentials')}</p>
                      <p className="text-2xl font-bold">{profileStats.totalCredentials}</p>
                    </div>
                    <TrophyIcon className="h-8 w-8 text-blue-200" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">{t('Verified Credentials')}</p>
                      <p className="text-2xl font-bold">{profileStats.verifiedCredentials}</p>
                    </div>
                    <CheckBadgeIcon className="h-8 w-8 text-green-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">{t('Skills Earned')}</p>
                      <p className="text-2xl font-bold">{profileStats.skillsCount}</p>
                    </div>
                    <StarIcon className="h-8 w-8 text-purple-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">{t('Profile Views')}</p>
                      <p className="text-2xl font-bold">{profileStats.profileViews}</p>
                    </div>
                    <EyeIcon className="h-8 w-8 text-orange-200" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('Recent Activity')}</h2>
              <div className="space-y-3">
                {activityLog.length > 0 ? (
                  activityLog.map((activity: any) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <ClockIcon className="h-5 w-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleDateString()} at{' '}
                          {new Date(activity.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">{t('No recent activity')}</p>
                )}
              </div>
            </div>

            {/* Data Export */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('Data Export')}</h2>
              <p className="text-gray-600 mb-4">
                {t('Download your profile data and credentials for backup or transfer purposes.')}
              </p>
              <div className="space-x-3">
                <button 
                  onClick={handleExportProfile}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2 inline" />
                  {t('Export Profile Data')}
                </button>
                <button 
                  onClick={handleExportCredentials}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2 inline" />
                  {t('Export Credentials')}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            {/* Security Settings */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('Security Settings')}</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{t('Two-Factor Authentication')}</h3>
                    <p className="text-sm text-gray-600">{t('Add an extra layer of security to your account')}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.twoFactorAuth}
                      onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{t('Login Notifications')}</h3>
                    <p className="text-sm text-gray-600">{t('Get notified when someone logs into your account')}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.loginNotifications}
                      onChange={(e) => handleSettingChange('loginNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <hr />

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">{t('Change Password')}</h3>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                    {t('Change Password')}
                  </button>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">{t('Account Deactivation')}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {t('Temporarily deactivate your account. You can reactivate it anytime.')}
                  </p>
                  <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                    {t('Deactivate Account')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Language Settings */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('Language Preferences')}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Display Language')}
                  </label>
                  <select
                    value={settings.language.code || 'en'}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                    className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                    <option value="te">తెలుగు (Telugu)</option>
                    <option value="kn">ಕನ್ನಡ (Kannada)</option>
                    <option value="ml">മലയാളം (Malayalam)</option>
                    <option value="bn">বাংলা (Bengali)</option>
                    <option value="gu">ગુજરાતી (Gujarati)</option>
                    <option value="mr">मराठी (Marathi)</option>
                    <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('Notification Settings')}</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{t('Email Notifications')}</h3>
                    <p className="text-sm text-gray-600">{t('Receive notifications about credential activities')}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-6">
            {/* Public Profile Settings */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('Profile Visibility')}</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{t('Public Profile')}</h3>
                    <p className="text-sm text-gray-600">{t('Allow others to view your profile and credentials')}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.publicProfile}
                      onChange={(e) => handleSettingChange('publicProfile', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{t('Share Credentials')}</h3>
                    <p className="text-sm text-gray-600">{t('Allow sharing of individual credentials')}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.shareCredentials}
                      onChange={(e) => handleSettingChange('shareCredentials', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{t('Allow Search')}</h3>
                    <p className="text-sm text-gray-600">{t('Allow your profile to appear in search results')}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.allowSearch}
                      onChange={(e) => handleSettingChange('allowSearch', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'verification' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('Credential Verification Tools')}</h2>
            <p className="text-gray-600 mb-6">{t('Use these tools to verify credentials and share verification results')}</p>
            
            {/* Embedded Verification Tool would go here */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <CheckBadgeIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('Verification Tool')}</h3>
              <p className="text-gray-600 mb-4">{t('Verify credentials by code or URL')}</p>
              <Link
                to="/verify"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('Open Verification Tool')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LearnerProfile;