import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useLanguage } from '../../contexts/LanguageContext';
import { api } from '../../services/api';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  EyeIcon,
  DocumentDuplicateIcon,
  CheckBadgeIcon,
  TrashIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  TagIcon,
  ViewColumnsIcon,
  ListBulletIcon,
  ChevronDownIcon
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

const LearnerCredentials = () => {
  const { t } = useLanguage();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [filteredCredentials, setFilteredCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCredentials, setSelectedCredentials] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    verification: 'all',
    type: 'all',
    issuer: 'all',
    dateRange: 'all'
  });

  useEffect(() => {
    fetchCredentials();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [credentials, searchTerm, filters]);

  const fetchCredentials = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/v1/credentials');
      setCredentials(response.data || []);
    } catch (error) {
      console.error('Error fetching credentials:', error);
      setCredentials([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = credentials;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(cred =>
        cred.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cred.issuer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cred.credential_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(cred => cred.status === filters.status);
    }

    // Apply verification filter
    if (filters.verification !== 'all') {
      filtered = filtered.filter(cred => cred.verification_status === filters.verification);
    }

    // Apply type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(cred => cred.credential_type === filters.type);
    }

    setFilteredCredentials(filtered);
  };

  const handleSelectCredential = (credentialId: string) => {
    setSelectedCredentials(prev =>
      prev.includes(credentialId)
        ? prev.filter(id => id !== credentialId)
        : [...prev, credentialId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCredentials.length === filteredCredentials.length) {
      setSelectedCredentials([]);
    } else {
      setSelectedCredentials(filteredCredentials.map(cred => cred.id));
    }
  };

  const handleBulkShare = async () => {
    try {
      // Implement bulk share logic
      console.log('Sharing credentials:', selectedCredentials);
    } catch (error) {
      console.error('Error sharing credentials:', error);
    }
  };

  const handleBulkDownload = async () => {
    try {
      // Implement bulk download logic
      console.log('Downloading credentials:', selectedCredentials);
    } catch (error) {
      console.error('Error downloading credentials:', error);
    }
  };

  const handleViewCredential = (credentialId: string) => {
    // Navigate to credential detail page
    window.location.href = `/credentials/${credentialId}`;
  };

  const handleShareCredential = async (credentialId: string) => {
    try {
      await api.post(`/api/v1/credentials/${credentialId}/share`, {
        platform: 'public'
      });
      
      // Create a simple share URL
      const shareUrl = `${window.location.origin}/public/credentials/${credentialId}`;
      await navigator.clipboard.writeText(shareUrl);
      alert('Share link copied to clipboard!');
    } catch (error) {
      console.error('Error sharing credential:', error);
      // Fallback: create share URL anyway
      const shareUrl = `${window.location.origin}/public/credentials/${credentialId}`;
      await navigator.clipboard.writeText(shareUrl);
      alert('Share link copied to clipboard!');
    }
  };

  const handleDownloadCredential = async (credentialId: string) => {
    try {
      // Get credential details first
      const credential = credentials.find(c => c.id === credentialId);
      if (!credential) {
        alert('Credential not found');
        return;
      }
      
      // Create credential text content
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
Generated on: ${new Date().toLocaleString()}
      `;
      
      // Create and download file
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
            <h1 className="text-2xl font-bold text-gray-900">{t('My Credentials')}</h1>
            <p className="text-gray-600">{t('Manage and share your digital credentials')}</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Link
              to="/learner"
              className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              {t('Back to Dashboard')}
            </Link>
            {selectedCredentials.length > 0 && (
              <>
                <button
                  onClick={handleBulkShare}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ShareIcon className="h-4 w-4 mr-2 inline" />
                  {t('Share Selected')} ({selectedCredentials.length})
                </button>
                <button
                  onClick={handleBulkDownload}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2 inline" />
                  {t('Download Selected')}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder={t('Search credentials...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <ViewColumnsIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <ListBulletIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              {t('Filters')}
              <ChevronDownIcon className="h-4 w-4 ml-2" />
            </button>

            {/* Select All */}
            {filteredCredentials.length > 0 && (
              <button
                onClick={handleSelectAll}
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                {selectedCredentials.length === filteredCredentials.length ? t('Deselect All') : t('Select All')}
              </button>
            )}
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">{t('All Status')}</option>
                <option value="active">{t('Active')}</option>
                <option value="expired">{t('Expired')}</option>
                <option value="revoked">{t('Revoked')}</option>
              </select>

              <select
                value={filters.verification}
                onChange={(e) => setFilters(prev => ({ ...prev, verification: e.target.value }))}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">{t('All Verification')}</option>
                <option value="verified">{t('Verified')}</option>
                <option value="pending">{t('Pending')}</option>
                <option value="failed">{t('Failed')}</option>
              </select>

              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">{t('All Types')}</option>
                <option value="certificate">{t('Certificate')}</option>
                <option value="badge">{t('Badge')}</option>
                <option value="diploma">{t('Diploma')}</option>
              </select>

              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">{t('All Dates')}</option>
                <option value="last30">{t('Last 30 days')}</option>
                <option value="last90">{t('Last 90 days')}</option>
                <option value="lastYear">{t('Last year')}</option>
              </select>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {t('Showing')} {filteredCredentials.length} {t('of')} {credentials.length} {t('credentials')}
          </p>
        </div>

        {/* Credentials Display */}
        {filteredCredentials.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
            <DocumentDuplicateIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('No credentials found')}</h3>
            <p className="text-gray-600">{t('Try adjusting your search or filter criteria')}</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCredentials.map((credential) => (
              <div
                key={credential.id}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${
                  selectedCredentials.includes(credential.id) ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <input
                      type="checkbox"
                      checked={selectedCredentials.includes(credential.id)}
                      onChange={() => handleSelectCredential(credential.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex space-x-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(credential.status)}`}>
                        {t(credential.status)}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getVerificationColor(credential.verification_status)}`}>
                        {credential.verification_status === 'verified' && <CheckBadgeIcon className="h-3 w-3 inline mr-1" />}
                        {t(credential.verification_status)}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{credential.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{credential.issuer}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {t('Issued')}: {new Date(credential.issue_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <TagIcon className="h-4 w-4 mr-2" />
                      {credential.credential_type}
                    </div>
                    {credential.nsqf_level && (
                      <div className="flex items-center text-sm text-gray-500">
                        <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                        NSQF Level {credential.nsqf_level}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleViewCredential(credential.id)}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      <EyeIcon className="h-4 w-4 mr-1 inline" />
                      {t('View')}
                    </button>
                    <button 
                      onClick={() => handleShareCredential(credential.id)}
                      className="bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      <ShareIcon className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDownloadCredential(credential.id)}
                      className="bg-gray-600 text-white py-2 px-3 rounded text-sm hover:bg-gray-700 transition-colors"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedCredentials.length === filteredCredentials.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('Credential')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('Issuer')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('Type')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('Status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('Issue Date')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('Actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCredentials.map((credential) => (
                  <tr key={credential.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedCredentials.includes(credential.id)}
                        onChange={() => handleSelectCredential(credential.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{credential.title}</div>
                          <div className="text-sm text-gray-500">{credential.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {credential.issuer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {credential.credential_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(credential.status)}`}>
                          {t(credential.status)}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getVerificationColor(credential.verification_status)}`}>
                          {credential.verification_status === 'verified' && <CheckBadgeIcon className="h-3 w-3 mr-1" />}
                          {t(credential.verification_status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(credential.issue_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewCredential(credential.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Credential"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleShareCredential(credential.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Share Credential"
                        >
                          <ShareIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDownloadCredential(credential.id)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Download Credential"
                        >
                          <ArrowDownTrayIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => console.log('Delete credential:', credential.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Credential"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LearnerCredentials;