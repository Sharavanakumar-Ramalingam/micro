import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useLanguage } from '../../contexts/LanguageContext';
import { api } from '../../services/api';
import {
  ArrowLeftIcon,
  ShareIcon,
  ArrowDownTrayIcon,
  CheckBadgeIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  TagIcon,
  ClipboardDocumentIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

interface Credential {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  status: 'active' | 'expired' | 'revoked';
  verification_status: 'verified' | 'pending' | 'failed';
  credential_type: string;
  description?: string;
  image_url?: string;
  skills?: string[];
  nsqf_level?: number;
  metadata?: any;
}

const CredentialDetail = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const [credential, setCredential] = useState<Credential | null>(null);
  const [loading, setLoading] = useState(true);
  const [shareUrl, setShareUrl] = useState<string>('');

  useEffect(() => {
    if (id) {
      fetchCredential(id);
    }
  }, [id]);

  const fetchCredential = async (credentialId: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/v1/credentials/${credentialId}`);
      setCredential(response.data);
    } catch (error) {
      console.error('Error fetching credential:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!credential) return;
    
    try {
      await api.post(`/api/v1/credentials/${credential.id}/share`, {
        platform: 'public'
      });
      
      // For now, create a simple share URL
      const url = `${window.location.origin}/public/credentials/${credential.id}`;
      setShareUrl(url);
      
      await navigator.clipboard.writeText(url);
      alert('Share link copied to clipboard!');
    } catch (error) {
      console.error('Error sharing credential:', error);
      // Fallback: create a simple share URL anyway
      const url = `${window.location.origin}/public/credentials/${credential.id}`;
      setShareUrl(url);
      await navigator.clipboard.writeText(url);
      alert('Share link copied to clipboard!');
    }
  };

  const handleDownload = async () => {
    if (!credential) return;
    
    try {
      // For now, create a simple text file with credential info
      const credentialText = `
DIGITAL CREDENTIAL

Title: ${credential.title}
Issuer: ${credential.issuer}
Issue Date: ${new Date(credential.issue_date).toLocaleDateString()}
Status: ${credential.status}
Verification: ${credential.verification_status}
Type: ${credential.credential_type}
${credential.description ? `Description: ${credential.description}` : ''}
${credential.nsqf_level ? `NSQF Level: ${credential.nsqf_level}` : ''}
${credential.skills?.length ? `Skills: ${credential.skills.join(', ')}` : ''}

Verification URL: ${window.location.origin}/public/credentials/${credential.id}
      `;
      
      const blob = new Blob([credentialText], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${credential.title.replace(/[^a-z0-9]/gi, '_')}.txt`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading credential:', error);
      alert('Failed to download credential');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'expired': return 'text-yellow-600 bg-yellow-100';
      case 'revoked': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getVerificationColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!credential) {
    return (
      <Layout>
        <div className="p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Credential Not Found</h2>
            <Link to="/learner/credentials" className="text-blue-600 hover:text-blue-800">
              Back to Credentials
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link
              to="/learner/credentials"
              className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{t('Credential Details')}</h1>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleShare}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <ShareIcon className="h-4 w-4 mr-2" />
              {t('Share')}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              {t('Download')}
            </button>
          </div>
        </div>

        {/* Credential Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8">
            {/* Status Badges */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex space-x-2">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(credential.status)}`}>
                  {t(credential.status)}
                </span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getVerificationColor(credential.verification_status)}`}>
                  {credential.verification_status === 'verified' && <CheckBadgeIcon className="h-4 w-4 inline mr-1" />}
                  {t(credential.verification_status)}
                </span>
              </div>
              {shareUrl && (
                <div className="flex items-center text-sm text-gray-600">
                  <GlobeAltIcon className="h-4 w-4 mr-1" />
                  Shareable
                </div>
              )}
            </div>

            {/* Credential Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{credential.title}</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <BuildingOfficeIcon className="h-5 w-5 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Issued by</div>
                      <div className="font-medium text-gray-900">{credential.issuer}</div>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <CalendarIcon className="h-5 w-5 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Issue Date</div>
                      <div className="font-medium text-gray-900">
                        {new Date(credential.issue_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {credential.expiry_date && (
                    <div className="flex items-center text-gray-600">
                      <CalendarIcon className="h-5 w-5 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Expiry Date</div>
                        <div className="font-medium text-gray-900">
                          {new Date(credential.expiry_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center text-gray-600">
                    <TagIcon className="h-5 w-5 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Credential Type</div>
                      <div className="font-medium text-gray-900">{credential.credential_type}</div>
                    </div>
                  </div>

                  {credential.nsqf_level && (
                    <div className="flex items-center text-gray-600">
                      <ClipboardDocumentIcon className="h-5 w-5 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">NSQF Level</div>
                        <div className="font-medium text-gray-900">Level {credential.nsqf_level}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                {credential.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600">{credential.description}</p>
                  </div>
                )}

                {credential.skills && credential.skills.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {credential.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {shareUrl && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Share Link</h3>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={shareUrl}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                      <button
                        onClick={() => navigator.clipboard.writeText(shareUrl)}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CredentialDetail;