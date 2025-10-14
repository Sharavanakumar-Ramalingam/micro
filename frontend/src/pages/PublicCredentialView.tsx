import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import {
  CheckBadgeIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  TagIcon,
  ClipboardDocumentIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface PublicCredential {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  status: 'active' | 'expired' | 'revoked';
  verification_status: 'verified' | 'pending' | 'failed';
  credential_type: string;
  description?: string;
  skills?: string[];
  nsqf_level?: number;
}

const PublicCredentialView = () => {
  const { public_url } = useParams<{ public_url: string }>();
  const [credential, setCredential] = useState<PublicCredential | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (public_url) {
      fetchPublicCredential(public_url);
    }
  }, [public_url]);

  const fetchPublicCredential = async (publicUrl: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/public/credentials/${publicUrl}`);
      setCredential(response.data);
    } catch (error: any) {
      console.error('Error fetching public credential:', error);
      setError('Credential not found or not publicly accessible');
    } finally {
      setLoading(false);
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

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case 'verified': return <ShieldCheckIcon className="h-16 w-16 text-green-500" />;
      case 'pending': return <ExclamationTriangleIcon className="h-16 w-16 text-yellow-500" />;
      case 'failed': return <ExclamationTriangleIcon className="h-16 w-16 text-red-500" />;
      default: return <ExclamationTriangleIcon className="h-16 w-16 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Credential Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Please check the URL and try again.</p>
        </div>
      </div>
    );
  }

  if (!credential) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Credential Not Available</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Digital Credential Verification</h1>
          <p className="text-gray-600">Verify the authenticity of this digital credential</p>
        </div>

        {/* Verification Status */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center justify-center mb-6">
            {getVerificationIcon(credential.verification_status)}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {credential.verification_status === 'verified' ? 'Verified Credential' : 'Credential Verification Status'}
            </h2>
            <span className={`inline-flex px-4 py-2 text-lg font-medium rounded-full ${getVerificationColor(credential.verification_status)}`}>
              {credential.verification_status === 'verified' && <CheckBadgeIcon className="h-5 w-5 mr-2" />}
              {credential.verification_status.charAt(0).toUpperCase() + credential.verification_status.slice(1)}
            </span>
          </div>
        </div>

        {/* Credential Details */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 px-8 py-6">
            <h3 className="text-2xl font-bold text-white">{credential.title}</h3>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <BuildingOfficeIcon className="h-6 w-6 text-gray-400 mt-1" />
                  <div>
                    <div className="text-sm text-gray-500">Issued by</div>
                    <div className="text-lg font-medium text-gray-900">{credential.issuer}</div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <CalendarIcon className="h-6 w-6 text-gray-400 mt-1" />
                  <div>
                    <div className="text-sm text-gray-500">Issue Date</div>
                    <div className="text-lg font-medium text-gray-900">
                      {new Date(credential.issue_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {credential.expiry_date && (
                  <div className="flex items-start space-x-4">
                    <CalendarIcon className="h-6 w-6 text-gray-400 mt-1" />
                    <div>
                      <div className="text-sm text-gray-500">Expiry Date</div>
                      <div className="text-lg font-medium text-gray-900">
                        {new Date(credential.expiry_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-4">
                  <TagIcon className="h-6 w-6 text-gray-400 mt-1" />
                  <div>
                    <div className="text-sm text-gray-500">Credential Type</div>
                    <div className="text-lg font-medium text-gray-900">{credential.credential_type}</div>
                  </div>
                </div>

                {credential.nsqf_level && (
                  <div className="flex items-start space-x-4">
                    <ClipboardDocumentIcon className="h-6 w-6 text-gray-400 mt-1" />
                    <div>
                      <div className="text-sm text-gray-500">NSQF Level</div>
                      <div className="text-lg font-medium text-gray-900">Level {credential.nsqf_level}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <div className="text-sm text-gray-500 mb-2">Status</div>
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(credential.status)}`}>
                    {credential.status.charAt(0).toUpperCase() + credential.status.slice(1)}
                  </span>
                </div>

                {credential.description && (
                  <div>
                    <div className="text-sm text-gray-500 mb-2">Description</div>
                    <p className="text-gray-900">{credential.description}</p>
                  </div>
                )}

                {credential.skills && credential.skills.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-500 mb-2">Skills</div>
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
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>This credential was verified on {new Date().toLocaleDateString()}</p>
          <p className="mt-2">Powered by MicroMerge Digital Credential Platform</p>
        </div>
      </div>
    </div>
  );
};

export default PublicCredentialView;