import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useLanguage } from '../../contexts/LanguageContext';
import { api } from '../../services/api';
import {
  BuildingOfficeIcon,
  PencilIcon,
  CheckIcon,
  MapPinIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  DocumentTextIcon,
  IdentificationIcon,
  ShieldCheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface CompanyProfile {
  id: string;
  name: string;
  description: string;
  industry: string;
  size: string;
  founded: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  contact: {
    email: string;
    phone: string;
    website?: string;
    linkedIn?: string;
  };
  logo?: string;
  coverImage?: string;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  verificationDocuments?: {
    businessRegistration?: string;
    taxRegistration?: string;
    incorporationCertificate?: string;
  };
  socialProfiles: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  companyValues: string[];
  benefits: string[];
  culture: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

const EmployerProfile = () => {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'verification' | 'settings'>('profile');
  const [formData, setFormData] = useState<Partial<CompanyProfile>>({});

  const industries = [
    'Technology', 'Finance', 'Healthcare', 'Education', 'Manufacturing',
    'Retail', 'Consulting', 'Marketing', 'Real Estate', 'Transportation'
  ];

  const companySizes = [
    '1-10 employees', '11-50 employees', '51-200 employees',
    '201-500 employees', '501-1000 employees', '1000+ employees'
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/v1/employer/profile').catch(() => ({
        data: generateMockProfile()
      }));
      setProfile(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      const mockProfile = generateMockProfile();
      setProfile(mockProfile);
      setFormData(mockProfile);
    } finally {
      setLoading(false);
    }
  };

  const generateMockProfile = (): CompanyProfile => {
    return {
      id: '1',
      name: 'TechCorp Solutions',
      description: 'A leading technology company specializing in innovative software solutions and digital transformation services.',
      industry: 'Technology',
      size: '201-500 employees',
      founded: '2015',
      location: {
        address: '123 Tech Park, Electronics City',
        city: 'Bangalore',
        state: 'Karnataka',
        country: 'India',
        pincode: '560100'
      },
      contact: {
        email: 'hr@techcorp.com',
        phone: '+91-80-12345678',
        website: 'https://techcorp.com',
        linkedIn: 'https://linkedin.com/company/techcorp'
      },
      verificationStatus: 'verified',
      verificationDocuments: {
        businessRegistration: 'doc_001.pdf',
        taxRegistration: 'doc_002.pdf',
        incorporationCertificate: 'doc_003.pdf'
      },
      socialProfiles: {
        twitter: 'https://twitter.com/techcorp',
        facebook: 'https://facebook.com/techcorp'
      },
      companyValues: ['Innovation', 'Integrity', 'Collaboration', 'Excellence'],
      benefits: ['Health Insurance', 'Flexible Work Hours', 'Professional Development', 'Stock Options'],
      culture: 'We foster a culture of innovation and continuous learning, where every team member is valued and empowered to make a difference.',
      isPublic: true,
      createdAt: '2023-01-15T00:00:00Z',
      updatedAt: '2024-10-10T00:00:00Z'
    };
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await api.put('/api/v1/employer/profile', formData);
      setProfile(formData as CompanyProfile);
      setEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile || {});
    setEditing(false);
  };

  const requestVerification = async () => {
    try {
      await api.post('/api/v1/employer/request-verification');
      // Show success message
      if (profile) {
        setProfile({ ...profile, verificationStatus: 'pending' });
      }
    } catch (error) {
      console.error('Error requesting verification:', error);
    }
  };

  const getVerificationStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && !profile) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="text-center py-12">
          <BuildingOfficeIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('No profile found')}</h3>
          <p className="text-gray-600 mb-4">{t('Create your company profile to start hiring')}</p>
          <button
            onClick={() => setEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('Create Profile')}
          </button>
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
            <h1 className="text-2xl font-bold text-gray-900">{t('Company Profile')}</h1>
            <p className="text-gray-600">{t('Manage your organization information and verification status')}</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <PencilIcon className="h-4 w-4" />
                <span>{t('Edit Profile')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'profile', label: 'Company Profile', icon: BuildingOfficeIcon },
              { key: 'verification', label: 'Verification', icon: ShieldCheckIcon },
              { key: 'settings', label: 'Settings', icon: IdentificationIcon }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="mr-2 h-4 w-4" />
                {t(label)}
              </button>
            ))}
          </nav>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Company Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                    {profile.logo ? (
                      <img
                        src={profile.logo}
                        alt={profile.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-xl font-semibold text-gray-900">{profile.name}</h2>
                      <span className={`px-2 py-1 text-xs rounded-full ${getVerificationStatusColor(profile.verificationStatus)}`}>
                        {t(profile.verificationStatus)}
                      </span>
                    </div>
                    <p className="text-gray-600">{profile.industry} • {profile.size}</p>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <span>{t('Founded')} {profile.founded}</span>
                      <span>•</span>
                      <span>{profile.location.city}, {profile.location.state}</span>
                    </div>
                  </div>
                </div>
                {profile.verificationStatus === 'verified' && (
                  <CheckIcon className="h-8 w-8 text-green-500" />
                )}
              </div>
              
              <div className="p-6">
                {editing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('Company Name')} *
                        </label>
                        <input
                          type="text"
                          value={formData.name || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('Industry')} *
                        </label>
                        <select
                          value={formData.industry || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        >
                          <option value="">{t('Select Industry')}</option>
                          {industries.map(industry => (
                            <option key={industry} value={industry}>{industry}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('Company Size')} *
                        </label>
                        <select
                          value={formData.size || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        >
                          <option value="">{t('Select Size')}</option>
                          {companySizes.map(size => (
                            <option key={size} value={size}>{size}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('Founded Year')} *
                        </label>
                        <input
                          type="number"
                          value={formData.founded || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, founded: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          min="1900"
                          max={new Date().getFullYear()}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('Company Description')} *
                      </label>
                      <textarea
                        value={formData.description || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        placeholder={t('Describe your company, mission, and what makes it unique...')}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-700 mb-4">{profile.description}</p>
                    
                    {/* Company Values */}
                    {profile.companyValues.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">{t('Company Values')}</h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.companyValues.map((value, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                            >
                              {value}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Benefits */}
                    {profile.benefits.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">{t('Employee Benefits')}</h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.benefits.map((benefit, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                            >
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Culture */}
                    {profile.culture && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">{t('Company Culture')}</h4>
                        <p className="text-gray-600">{profile.culture}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">{t('Contact Information')}</h3>
              </div>
              <div className="p-6">
                {editing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('Email')} *
                        </label>
                        <input
                          type="email"
                          value={formData.contact?.email || ''}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            contact: { ...prev.contact, email: e.target.value }
                          }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('Phone')} *
                        </label>
                        <input
                          type="tel"
                          value={formData.contact?.phone || ''}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            contact: { ...prev.contact, phone: e.target.value }
                          }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('Website')}
                        </label>
                        <input
                          type="url"
                          value={formData.contact?.website || ''}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            contact: { ...prev.contact, website: e.target.value }
                          }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          placeholder="https://"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('LinkedIn')}
                        </label>
                        <input
                          type="url"
                          value={formData.contact?.linkedIn || ''}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            contact: { ...prev.contact, linkedIn: e.target.value }
                          }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          placeholder="https://linkedin.com/company/"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">{t('Address')}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('Street Address')} *
                          </label>
                          <input
                            type="text"
                            value={formData.location?.address || ''}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              location: { ...prev.location, address: e.target.value }
                            }))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('City')} *
                          </label>
                          <input
                            type="text"
                            value={formData.location?.city || ''}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              location: { ...prev.location, city: e.target.value }
                            }))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('State')} *
                          </label>
                          <input
                            type="text"
                            value={formData.location?.state || ''}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              location: { ...prev.location, state: e.target.value }
                            }))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('PIN Code')} *
                          </label>
                          <input
                            type="text"
                            value={formData.location?.pincode || ''}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              location: { ...prev.location, pincode: e.target.value }
                            }))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('Country')} *
                          </label>
                          <input
                            type="text"
                            value={formData.location?.country || ''}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              location: { ...prev.location, country: e.target.value }
                            }))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-600">{t('Email')}</div>
                          <div className="font-medium text-gray-900">{profile.contact.email}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-600">{t('Phone')}</div>
                          <div className="font-medium text-gray-900">{profile.contact.phone}</div>
                        </div>
                      </div>

                      {profile.contact.website && (
                        <div className="flex items-center space-x-3">
                          <GlobeAltIcon className="h-5 w-5 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-600">{t('Website')}</div>
                            <a
                              href={profile.contact.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-blue-600 hover:text-blue-700"
                            >
                              {profile.contact.website}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-start space-x-3">
                        <MapPinIcon className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          <div className="text-sm text-gray-600">{t('Address')}</div>
                          <div className="font-medium text-gray-900">
                            {profile.location.address}<br />
                            {profile.location.city}, {profile.location.state} {profile.location.pincode}<br />
                            {profile.location.country}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Edit Actions */}
            {editing && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {t('Cancel')}
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors flex items-center space-x-2"
                  >
                    <CheckIcon className="h-4 w-4" />
                    <span>{loading ? t('Saving...') : t('Save Changes')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Verification Tab */}
        {activeTab === 'verification' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{t('Company Verification')}</h3>
                  <p className="text-sm text-gray-600">{t('Verify your company to build trust with candidates')}</p>
                </div>
                <div className={`px-3 py-1 rounded-full ${getVerificationStatusColor(profile.verificationStatus)}`}>
                  {t(profile.verificationStatus)}
                </div>
              </div>
            </div>
            <div className="p-6">
              {profile.verificationStatus === 'unverified' ? (
                <div className="text-center py-8">
                  <ShieldCheckIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">{t('Get Verified')}</h4>
                  <p className="text-gray-600 mb-6">{t('Upload required documents to verify your company')}</p>
                  <button
                    onClick={requestVerification}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {t('Start Verification')}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { key: 'businessRegistration', label: 'Business Registration' },
                      { key: 'taxRegistration', label: 'Tax Registration' },
                      { key: 'incorporationCertificate', label: 'Incorporation Certificate' }
                    ].map(({ key, label }) => (
                      <div key={key} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                          <span className="font-medium text-gray-900">{t(label)}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {profile.verificationDocuments?.[key as keyof typeof profile.verificationDocuments] ? (
                            <div className="flex items-center space-x-1 text-green-600">
                              <CheckIcon className="h-4 w-4" />
                              <span>{t('Submitted')}</span>
                            </div>
                          ) : (
                            <span className="text-red-600">{t('Required')}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {profile.verificationStatus === 'pending' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <ClockIcon className="h-5 w-5 text-yellow-600" />
                        <span className="font-medium text-yellow-800">{t('Verification in Progress')}</span>
                      </div>
                      <p className="text-yellow-700 mt-1">
                        {t('Your verification request is being reviewed. This typically takes 2-3 business days.')}
                      </p>
                    </div>
                  )}

                  {profile.verificationStatus === 'verified' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <CheckIcon className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-800">{t('Company Verified')}</span>
                      </div>
                      <p className="text-green-700 mt-1">
                        {t('Your company is verified. Candidates can trust your job postings and communications.')}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">{t('Profile Visibility')}</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{t('Public Profile')}</div>
                      <div className="text-sm text-gray-600">
                        {t('Make your company profile visible to job seekers')}
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.isPublic}
                        onChange={(e) => setProfile(prev => prev ? { ...prev, isPublic: e.target.checked } : null)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">{t('Account Information')}</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">{t('Account Created')}</div>
                    <div className="font-medium text-gray-900">
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <PencilIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">{t('Last Updated')}</div>
                    <div className="font-medium text-gray-900">
                      {new Date(profile.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EmployerProfile;