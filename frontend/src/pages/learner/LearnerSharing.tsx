import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useLanguage } from '../../contexts/LanguageContext';
import { api } from '../../services/api';
import { 
  ShareIcon, 
  EyeIcon, 
  GlobeAltIcon,
  PencilIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  LinkIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  profile_image_url?: string;
  linkedin_url?: string;
  public_profile: boolean;
  created_at: string;
}

const LearnerSharing = () => {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sharingStats, setSharingStats] = useState({
    totalShares: 0,
    profileViews: 0,
    linkedInShares: 0,
    twitterShares: 0,
    facebookShares: 0,
    whatsappShares: 0
  });

  useEffect(() => {
    fetchProfile();
    fetchSharingStats();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/v1/auth/me');
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSharingStats = async () => {
    try {
      // Mock data - in real implementation, this would come from backend
      setSharingStats({
        totalShares: Math.floor(Math.random() * 50) + 5,
        profileViews: Math.floor(Math.random() * 100) + 20,
        linkedInShares: Math.floor(Math.random() * 15) + 2,
        twitterShares: Math.floor(Math.random() * 10) + 1,
        facebookShares: Math.floor(Math.random() * 8) + 1,
        whatsappShares: Math.floor(Math.random() * 12) + 3
      });
    } catch (error) {
      console.error('Error fetching sharing stats:', error);
    }
  };

  const isProfileComplete = () => {
    if (!profile) return false;
    return !!(profile.first_name && profile.last_name && profile.public_profile);
  };

  const generateShareUrl = (platform: string) => {
    const baseUrl = `${window.location.origin}/public/profile/${profile?.id}`;
    const text = `Check out my verified credentials on MicroMerge!`;
    
    switch (platform) {
      case 'linkedin':
        if (profile?.linkedin_url) {
          return profile.linkedin_url;
        }
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(baseUrl)}`;
      case 'twitter':
        return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(baseUrl)}`;
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(baseUrl)}`;
      case 'whatsapp':
        return `https://wa.me/?text=${encodeURIComponent(text + ' ' + baseUrl)}`;
      default:
        return baseUrl;
    }
  };

  const handleShare = (platform: string) => {
    if (!isProfileComplete()) {
      alert(t('Please complete your profile first to enable sharing.'));
      return;
    }

    const shareUrl = generateShareUrl(platform);
    window.open(shareUrl, '_blank');
    
    // Update share count (in real app, this would be API call)
    setSharingStats(prev => ({
      ...prev,
      totalShares: prev.totalShares + 1,
      [`${platform}Shares`]: prev[`${platform}Shares` as keyof typeof prev] + 1
    }));
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
            <h1 className="text-2xl font-bold text-gray-900">{t('Sharing & Views')}</h1>
            <p className="text-gray-600">{t('Manage how you share your credentials and track public views')}</p>
          </div>
        </div>

        {/* Profile Status Alert */}
        {!isProfileComplete() && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-yellow-800">
                  {t('Profile Incomplete')}
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  {t('Complete your profile to enable sharing and public visibility features.')}
                </p>
                <div className="mt-3">
                  <Link
                    to="/profile"
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-700 transition-colors inline-flex items-center"
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    {t('Complete Profile')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sharing Statistics */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('Sharing Statistics')}</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <ShareIcon className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-blue-900">{t('Total Shares')}</p>
                    <p className="text-sm text-blue-600">{t('Across all platforms')}</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-blue-900">{sharingStats.totalShares}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <EyeIcon className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-green-900">{t('Profile Views')}</p>
                    <p className="text-sm text-green-600">{t('Public credential views')}</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-green-900">{sharingStats.profileViews}</span>
              </div>

              {/* Platform-specific stats */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">LinkedIn</p>
                  <p className="text-lg font-semibold text-gray-900">{sharingStats.linkedInShares}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Twitter</p>
                  <p className="text-lg font-semibold text-gray-900">{sharingStats.twitterShares}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Facebook</p>
                  <p className="text-lg font-semibold text-gray-900">{sharingStats.facebookShares}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">WhatsApp</p>
                  <p className="text-lg font-semibold text-gray-900">{sharingStats.whatsappShares}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Public Profile */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('Public Profile')}</h3>
            
            {/* Profile Preview */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                {profile?.profile_image_url ? (
                  <img 
                    src={profile.profile_image_url} 
                    alt="Profile" 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <UserCircleIcon className="w-8 h-8 text-white" />
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-gray-900">
                    {profile?.first_name} {profile?.last_name}
                  </h4>
                  <p className="text-sm text-gray-600">{profile?.email}</p>
                </div>
                {profile?.public_profile && (
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                )}
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  profile?.public_profile 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {profile?.public_profile ? t('Public') : t('Private')}
                </span>
                {profile?.linkedin_url && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    LinkedIn Connected
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{t('Your Public Portfolio')}</h4>
                <p className="text-sm text-gray-600 mb-4">
                  {t('Share your verified credentials with employers and institutions')}
                </p>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => handleShare('public')}
                    disabled={!isProfileComplete()}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <GlobeAltIcon className="h-4 w-4 mr-2" />
                    {t('View Public Profile')}
                  </button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => handleShare('linkedin')}
                      disabled={!isProfileComplete()}
                      className="bg-blue-700 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <LinkIcon className="h-4 w-4 mr-1" />
                      LinkedIn
                    </button>
                    <button 
                      onClick={() => handleShare('twitter')}
                      disabled={!isProfileComplete()}
                      className="bg-sky-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-sky-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Twitter
                    </button>
                    <button 
                      onClick={() => handleShare('facebook')}
                      disabled={!isProfileComplete()}
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Facebook
                    </button>
                    <button 
                      onClick={() => handleShare('whatsapp')}
                      disabled={!isProfileComplete()}
                      className="bg-green-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      WhatsApp
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Profile URL */}
              {isProfileComplete() && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">{t('Your Public URL')}</h4>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}/public/profile/${profile?.id}`}
                      className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/public/profile/${profile?.id}`);
                        alert(t('URL copied to clipboard!'));
                      }}
                      className="bg-gray-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors"
                    >
                      {t('Copy')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LearnerSharing;