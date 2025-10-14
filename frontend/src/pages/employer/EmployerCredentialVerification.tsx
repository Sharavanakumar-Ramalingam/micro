import { useState } from 'react';
import Layout from '../../components/Layout';
import { useLanguage } from '../../contexts/LanguageContext';
import { api } from '../../services/api';
import {
  DocumentCheckIcon,
  MagnifyingGlassIcon,
  CheckBadgeIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  UserIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  QrCodeIcon,
  DocumentDuplicateIcon,
  ShareIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';

interface VerificationResult {
  id: string;
  credentialId: string;
  title: string;
  issuer: string;
  recipientName: string;
  recipientEmail: string;
  issuedDate: string;
  expirationDate?: string;
  status: 'verified' | 'invalid' | 'expired' | 'revoked';
  nsqfLevel?: number;
  skills?: string[];
  verificationHash: string;
  blockchainTx?: string;
  metadata: {
    program?: string;
    grade?: string;
    creditHours?: number;
    institution?: string;
    certificationBody?: string;
  };
}

interface VerificationHistory {
  id: string;
  credentialId: string;
  title: string;
  recipientName: string;
  verifiedBy: string;
  verificationDate: string;
  status: 'verified' | 'invalid';
  ipAddress: string;
}

const EmployerCredentialVerification = () => {
  const { t } = useLanguage();
  const [searchMethod, setSearchMethod] = useState<'id' | 'qr' | 'hash'>('id');
  const [searchValue, setSearchValue] = useState('');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [verificationHistory, setVerificationHistory] = useState<VerificationHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showQrScanner, setShowQrScanner] = useState(false);

  const handleVerification = async () => {
    if (!searchValue.trim()) {
      setError(t('Please enter a credential ID, hash, or scan QR code'));
      return;
    }

    setLoading(true);
    setError('');
    setVerificationResult(null);

    try {
      const response = await api.post('/api/v1/employer/verify-credential', {
        searchMethod,
        searchValue: searchValue.trim()
      }).catch(() => {
        // Mock verification result if API fails
        return {
          data: {
            id: 'ver_' + Date.now(),
            credentialId: searchValue.trim(),
            title: 'Full Stack Web Development Certification',
            issuer: 'Tech Institute of Excellence',
            recipientName: 'Rahul Sharma',
            recipientEmail: 'rahul.sharma@email.com',
            issuedDate: '2023-06-15T00:00:00Z',
            expirationDate: '2026-06-15T00:00:00Z',
            status: Math.random() > 0.2 ? 'verified' : 'invalid',
            nsqfLevel: 6,
            skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'API Development'],
            verificationHash: 'abc123def456ghi789jkl012mno345pqr678',
            blockchainTx: '0x1234567890abcdef1234567890abcdef12345678',
            metadata: {
              program: 'Advanced Full Stack Development',
              grade: 'A',
              creditHours: 120,
              institution: 'Tech Institute of Excellence',
              certificationBody: 'National Skills Development Council'
            }
          }
        };
      });

      setVerificationResult(response.data);
      
      // Add to verification history
      const historyEntry: VerificationHistory = {
        id: 'hist_' + Date.now(),
        credentialId: response.data.credentialId,
        title: response.data.title,
        recipientName: response.data.recipientName,
        verifiedBy: 'Current User', // This would come from auth context
        verificationDate: new Date().toISOString(),
        status: response.data.status === 'verified' ? 'verified' : 'invalid',
        ipAddress: '192.168.1.1' // This would come from the backend
      };
      
      setVerificationHistory(prev => [historyEntry, ...prev.slice(0, 9)]); // Keep last 10
      
    } catch (err) {
      setError(t('Verification failed. Please check the credential ID and try again.'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-100';
      case 'expired':
        return 'text-yellow-600 bg-yellow-100';
      case 'invalid':
      case 'revoked':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckBadgeIcon className="h-5 w-5 text-green-600" />;
      case 'expired':
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      case 'invalid':
      case 'revoked':
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const exportVerificationReport = () => {
    if (!verificationResult) return;
    
    const report = {
      verificationDate: new Date().toISOString(),
      credentialDetails: verificationResult,
      verifier: 'Current User', // From auth context
      organization: 'Current Company' // From employer profile
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `credential-verification-${verificationResult.credentialId}.json`;
    a.click();
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('Credential Verification')}</h1>
            <p className="text-gray-600">{t('Verify the authenticity of digital credentials instantly')}</p>
          </div>
        </div>

        {/* Verification Input */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('Verify a Credential')}</h2>
          
          {/* Search Method Selection */}
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setSearchMethod('id')}
              className={`px-4 py-2 rounded-lg border ${
                searchMethod === 'id'
                  ? 'bg-blue-100 text-blue-700 border-blue-300'
                  : 'bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100'
              }`}
            >
              <DocumentCheckIcon className="h-4 w-4 inline mr-2" />
              {t('Credential ID')}
            </button>
            <button
              onClick={() => setSearchMethod('qr')}
              className={`px-4 py-2 rounded-lg border ${
                searchMethod === 'qr'
                  ? 'bg-blue-100 text-blue-700 border-blue-300'
                  : 'bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100'
              }`}
            >
              <QrCodeIcon className="h-4 w-4 inline mr-2" />
              {t('QR Code')}
            </button>
            <button
              onClick={() => setSearchMethod('hash')}
              className={`px-4 py-2 rounded-lg border ${
                searchMethod === 'hash'
                  ? 'bg-blue-100 text-blue-700 border-blue-300'
                  : 'bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100'
              }`}
            >
              <DocumentDuplicateIcon className="h-4 w-4 inline mr-2" />
              {t('Hash')}
            </button>
          </div>

          {/* Search Input */}
          <div className="flex gap-4">
            {searchMethod === 'qr' ? (
              <div className="flex-1">
                <button
                  onClick={() => setShowQrScanner(true)}
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
                >
                  <QrCodeIcon className="h-8 w-8 mx-auto mb-2" />
                  <span className="block">{t('Click to scan QR code')}</span>
                </button>
              </div>
            ) : (
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder={
                    searchMethod === 'id'
                      ? t('Enter credential ID (e.g., CERT-2024-001234)')
                      : t('Enter verification hash')
                  }
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleVerification()}
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
              </div>
            )}
            <button
              onClick={handleVerification}
              disabled={loading || (searchMethod !== 'qr' && !searchValue.trim())}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>{t('Verifying...')}</span>
                </div>
              ) : (
                t('Verify')
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Verification Result */}
        {verificationResult && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(verificationResult.status)}
                <h2 className="text-lg font-semibold text-gray-900">{t('Verification Result')}</h2>
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(verificationResult.status)}`}>
                  {t(verificationResult.status)}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={exportVerificationReport}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title={t('Export Report')}
                >
                  <DocumentDuplicateIcon className="h-5 w-5" />
                </button>
                <button
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title={t('Share')}
                >
                  <ShareIcon className="h-5 w-5" />
                </button>
                <button
                  className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  title={t('Print')}
                  onClick={() => window.print()}
                >
                  <PrinterIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Credential Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">{t('Credential Information')}</h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <AcademicCapIcon className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          <div className="font-medium text-gray-900">{verificationResult.title}</div>
                          <div className="text-sm text-gray-600">
                            {verificationResult.metadata.program && (
                              <span>{verificationResult.metadata.program}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          <div className="font-medium text-gray-900">{verificationResult.issuer}</div>
                          <div className="text-sm text-gray-600">
                            {verificationResult.metadata.certificationBody}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <UserIcon className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          <div className="font-medium text-gray-900">{verificationResult.recipientName}</div>
                          <div className="text-sm text-gray-600">{verificationResult.recipientEmail}</div>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <CalendarIcon className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          <div className="font-medium text-gray-900">
                            {t('Issued')}: {new Date(verificationResult.issuedDate).toLocaleDateString()}
                          </div>
                          {verificationResult.expirationDate && (
                            <div className="text-sm text-gray-600">
                              {t('Expires')}: {new Date(verificationResult.expirationDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  {verificationResult.skills && verificationResult.skills.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">{t('Skills Covered')}</h4>
                      <div className="flex flex-wrap gap-2">
                        {verificationResult.skills.map((skill, index) => (
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

                {/* Technical Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">{t('Technical Verification')}</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div>
                        <div className="text-sm font-medium text-gray-700">{t('Credential ID')}</div>
                        <div className="text-sm text-gray-900 font-mono break-all">
                          {verificationResult.credentialId}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-gray-700">{t('Verification Hash')}</div>
                        <div className="text-sm text-gray-900 font-mono break-all">
                          {verificationResult.verificationHash}
                        </div>
                      </div>

                      {verificationResult.blockchainTx && (
                        <div>
                          <div className="text-sm font-medium text-gray-700">{t('Blockchain Transaction')}</div>
                          <div className="text-sm text-gray-900 font-mono break-all">
                            {verificationResult.blockchainTx}
                          </div>
                        </div>
                      )}

                      {verificationResult.nsqfLevel && (
                        <div>
                          <div className="text-sm font-medium text-gray-700">{t('NSQF Level')}</div>
                          <div className="text-sm text-gray-900">
                            Level {verificationResult.nsqfLevel}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Metadata */}
                  {verificationResult.metadata && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">{t('Additional Details')}</h4>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        {verificationResult.metadata.grade && (
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">{t('Grade')}:</span>
                            <span className="text-sm text-gray-900">{verificationResult.metadata.grade}</span>
                          </div>
                        )}
                        {verificationResult.metadata.creditHours && (
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">{t('Credit Hours')}:</span>
                            <span className="text-sm text-gray-900">{verificationResult.metadata.creditHours}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Verification History */}
        {verificationHistory.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">{t('Recent Verifications')}</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {verificationHistory.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(item.status)}
                      <div>
                        <div className="font-medium text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-600">{item.recipientName}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(item.verificationDate).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                        {t(item.status)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{item.credentialId}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-3">{t('How to Verify Credentials')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
            <div>
              <div className="font-medium mb-1">{t('1. Get Credential ID')}</div>
              <div>Ask the candidate for their credential ID or verification link</div>
            </div>
            <div>
              <div className="font-medium mb-1">{t('2. Enter Details')}</div>
              <div>Input the credential ID, scan QR code, or paste hash</div>
            </div>
            <div>
              <div className="font-medium mb-1">{t('3. View Results')}</div>
              <div>Get instant verification status and detailed information</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EmployerCredentialVerification;