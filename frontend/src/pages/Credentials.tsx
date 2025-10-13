import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Credential } from '../types';
import { credentialsAPI } from '../services/api';
import {
  FileText,
  Calendar,
  Award,
  Eye,
  Download,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Credentials = () => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    try {
      setLoading(true);
      const data = await credentialsAPI.getAll();
      setCredentials(data);
    } catch (error) {
      console.error('Failed to load credentials:', error);
      toast.error('Failed to load credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleViewCredential = (credential: Credential) => {
    // Open credential in modal or new tab
    window.open(`/verify/${credential.verification_code}`, '_blank');
  };

  const handleDownloadCredential = (_credential: Credential) => {
    // Generate and download credential as PDF
    toast.success('Download feature coming soon!');
  };

  const filteredCredentials = credentials.filter(credential => {
    const matchesSearch = 
      credential.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      credential.issuer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      credential.learner_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || credential.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'issued':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'revoked':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'expired':
        return <Clock className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'issued':
        return 'bg-green-100 text-green-800';
      case 'revoked':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Credentials</h1>
            <p className="mt-1 text-sm text-gray-600">
              View and manage all digital credentials in the platform.
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search credentials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Status</option>
                <option value="issued">Issued</option>
                <option value="revoked">Revoked</option>
                <option value="expired">Expired</option>
              </select>
              <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Credentials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCredentials.map((credential) => (
              <div key={credential.id} className="card-hover">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <Award className="w-8 h-8 text-primary-600 mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {credential.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {credential.issuer_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {getStatusIcon(credential.status)}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <FileText className="w-4 h-4 mr-2" />
                    <span>Issued to: {credential.learner_name}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      Issued: {new Date(credential.issue_date).toLocaleDateString()}
                    </span>
                  </div>

                  {credential.nsqf_level && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Award className="w-4 h-4 mr-2" />
                      <span>NSQF Level: {credential.nsqf_level}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(credential.status)}`}>
                    {credential.status.charAt(0).toUpperCase() + credential.status.slice(1)}
                  </span>
                  
                  <div className="text-xs text-gray-500">
                    Code: {credential.verification_code}
                  </div>
                </div>

                {credential.skills.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {credential.skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {skill}
                        </span>
                      ))}
                      {credential.skills.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          +{credential.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewCredential(credential)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-primary-300 text-sm font-medium rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </button>
                  <button
                    onClick={() => handleDownloadCredential(credential)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredCredentials.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No credentials found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No credentials have been issued yet.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Credentials;