import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import {
  MagnifyingGlassIcon,
  CheckBadgeIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  LinkIcon,
  QrCodeIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  UserIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

interface VerificationResult {
  isValid: boolean;
  credential: {
    id: string;
    title: string;
    issuer: string;
    recipient: string;
    issue_date: string;
    expiry_date?: string;
    status: string;
    verification_url: string;
    description?: string;
    skills?: string[];
    nsqf_level?: number;
  };
  verification_details: {
    verified_at: string;
    verification_method: string;
    blockchain_hash?: string;
    issuer_signature: boolean;
  };
}

interface VerifyCredentialToolProps {
  embedded?: boolean;
}

const VerifyCredentialTool: React.FC<VerifyCredentialToolProps> = ({ embedded = false }) => {
  const { t } = useLanguage();
  const [verificationMode, setVerificationMode] = useState<'code' | 'url'>('code');
  const [verificationInput, setVerificationInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!verificationInput.trim()) {
      setError(t('Please enter a verification code or URL'));
      return;
    }

    setIsVerifying(true);
    setError(null);
    setVerificationResult(null);

    try {
      const endpoint = verificationMode === 'code' 
        ? `/verify/${verificationInput.trim()}`
        : `/verify?url=${encodeURIComponent(verificationInput.trim())}`;
      
      const response = await api.get(endpoint);
      setVerificationResult(response.data);
    } catch (error: any) {
      console.error('Verification error:', error);
      setError(
        error.response?.data?.detail || 
        t('Failed to verify credential. Please check the code/URL and try again.')
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReset = () => {
    setVerificationInput('');
    setVerificationResult(null);
    setError(null);
  };

  const containerClass = embedded 
    ? "space-y-6" 
    : "max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-200";

  return (
    <div className={containerClass}>
      {!embedded && (
        <div className="text-center mb-8">
          <ShieldCheckIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('Verify Credential')}</h1>
          <p className="text-gray-600">{t('Verify the authenticity of digital credentials')}</p>
        </div>
      )}

      {/* Verification Mode Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {t('Verification Method')}
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="code"
              checked={verificationMode === 'code'}
              onChange={(e) => setVerificationMode(e.target.value as 'code' | 'url')}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              <QrCodeIcon className="h-4 w-4 inline mr-1" />
              {t('Verification Code')}
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="url"
              checked={verificationMode === 'url'}
              onChange={(e) => setVerificationMode(e.target.value as 'code' | 'url')}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              <LinkIcon className="h-4 w-4 inline mr-1" />
              {t('Verification URL')}
            </span>
          </label>
        </div>
      </div>

      {/* Verification Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {verificationMode === 'code' ? t('Verification Code') : t('Verification URL')}
        </label>
        <div className="flex space-x-3">
          <input
            type="text"
            value={verificationInput}
            onChange={(e) => setVerificationInput(e.target.value)}
            placeholder={
              verificationMode === 'code' 
                ? t('Enter verification code...') 
                : t('Enter verification URL...')
            }
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
          />
          <button
            onClick={handleVerify}
            disabled={isVerifying || !verificationInput.trim()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isVerifying ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <MagnifyingGlassIcon className="h-4 w-4 mr-2 inline" />
                {t('Verify')}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Verification Result */}
      {verificationResult && (
        <div className="space-y-6">
          {/* Verification Status */}
          <div className={`p-4 rounded-lg border ${
            verificationResult.isValid 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center">
              {verificationResult.isValid ? (
                <>
                  <CheckBadgeIcon className="h-6 w-6 text-green-500 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">{t('Credential Verified')}</h3>
                    <p className="text-sm text-green-600">{t('This credential is authentic and valid')}</p>
                  </div>
                </>
              ) : (
                <>
                  <XCircleIcon className="h-6 w-6 text-red-500 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-800">{t('Verification Failed')}</h3>
                    <p className="text-sm text-red-600">{t('This credential could not be verified')}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Credential Details */}
          {verificationResult.isValid && (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">{t('Credential Details')}</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <DocumentTextIcon className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">{t('Title')}</span>
                    </div>
                    <p className="text-gray-900 font-semibold">{verificationResult.credential.title}</p>
                  </div>

                  <div>
                    <div className="flex items-center mb-2">
                      <BuildingOfficeIcon className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">{t('Issuer')}</span>
                    </div>
                    <p className="text-gray-900">{verificationResult.credential.issuer}</p>
                  </div>

                  <div>
                    <div className="flex items-center mb-2">
                      <UserIcon className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">{t('Recipient')}</span>
                    </div>
                    <p className="text-gray-900">{verificationResult.credential.recipient}</p>
                  </div>

                  <div>
                    <div className="flex items-center mb-2">
                      <CalendarIcon className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">{t('Issue Date')}</span>
                    </div>
                    <p className="text-gray-900">
                      {new Date(verificationResult.credential.issue_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {verificationResult.credential.expiry_date && (
                    <div>
                      <div className="flex items-center mb-2">
                        <CalendarIcon className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm font-medium text-gray-700">{t('Expiry Date')}</span>
                      </div>
                      <p className="text-gray-900">
                        {new Date(verificationResult.credential.expiry_date).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center mb-2">
                      <CheckBadgeIcon className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">{t('Status')}</span>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      verificationResult.credential.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {t(verificationResult.credential.status)}
                    </span>
                  </div>

                  {verificationResult.credential.nsqf_level && (
                    <div>
                      <div className="flex items-center mb-2">
                        <ShieldCheckIcon className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm font-medium text-gray-700">{t('NSQF Level')}</span>
                      </div>
                      <p className="text-gray-900">Level {verificationResult.credential.nsqf_level}</p>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center mb-2">
                      <CalendarIcon className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">{t('Verified At')}</span>
                    </div>
                    <p className="text-gray-900">
                      {new Date(verificationResult.verification_details.verified_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {verificationResult.credential.description && (
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">{t('Description')}</h5>
                  <p className="text-gray-900 text-sm">{verificationResult.credential.description}</p>
                </div>
              )}

              {verificationResult.credential.skills && verificationResult.credential.skills.length > 0 && (
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">{t('Skills')}</h5>
                  <div className="flex flex-wrap gap-2">
                    {verificationResult.credential.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Verification Technical Details */}
          {verificationResult.isValid && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h5 className="text-sm font-semibold text-blue-800 mb-2">{t('Verification Details')}</h5>
              <div className="text-xs text-blue-700 space-y-1">
                <p>{t('Method')}: {verificationResult.verification_details.verification_method}</p>
                <p>{t('Issuer Signature')}: {verificationResult.verification_details.issuer_signature ? t('Valid') : t('Invalid')}</p>
                {verificationResult.verification_details.blockchain_hash && (
                  <p>{t('Blockchain Hash')}: {verificationResult.verification_details.blockchain_hash}</p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleReset}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              {t('Verify Another')}
            </button>
            {verificationResult.isValid && (
              <button
                onClick={() => window.open(verificationResult.credential.verification_url, '_blank')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <LinkIcon className="h-4 w-4 mr-2 inline" />
                {t('View Original')}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Help Text */}
      {!verificationResult && (
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">{t('How to verify a credential:')}</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>{t('For code verification: Enter the verification code from the credential')}</li>
                <li>{t('For URL verification: Copy and paste the verification URL')}</li>
                <li>{t('QR codes can be scanned to get the verification code or URL')}</li>
                <li>{t('Verification confirms the credential authenticity and current status')}</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyCredentialTool;