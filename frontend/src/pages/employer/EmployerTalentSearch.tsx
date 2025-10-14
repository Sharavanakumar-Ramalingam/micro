import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useLanguage } from '../../contexts/LanguageContext';
import { api } from '../../services/api';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  UserIcon,
  MapPinIcon,
  AcademicCapIcon,
  StarIcon,
  CheckBadgeIcon,
  EyeIcon,
  HeartIcon,
  EnvelopeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface Candidate {
  id: string;
  name: string;
  title: string;
  location: string;
  experience: number;
  skills: string[];
  credentials: Credential[];
  profilePicture?: string;
  rating: number;
  isVerified: boolean;
  lastActive: string;
  availability: 'available' | 'busy' | 'not_looking';
  expectedSalary?: string;
  summary: string;
}

interface Credential {
  id: string;
  title: string;
  issuer: string;
  verificationStatus: 'verified' | 'pending' | 'expired';
  issuedDate: string;
  nsqfLevel?: number;
}

interface SearchFilters {
  skills: string[];
  location: string;
  experience: { min: number; max: number };
  nsqfLevel: number[];
  availability: string[];
  verifiedOnly: boolean;
  salaryRange: { min: number; max: number };
}

const EmployerTalentSearch = () => {
  const { t } = useLanguage();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [savedCandidates, setSavedCandidates] = useState<Set<string>>(new Set());

  const [filters, setFilters] = useState<SearchFilters>({
    skills: [],
    location: '',
    experience: { min: 0, max: 20 },
    nsqfLevel: [],
    availability: [],
    verifiedOnly: false,
    salaryRange: { min: 0, max: 50 }
  });

  const availableSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'Java', 'PHP', 'C++',
    'Digital Marketing', 'Data Science', 'Machine Learning', 'UI/UX Design',
    'Project Management', 'Cloud Computing', 'DevOps', 'Cybersecurity'
  ];

  const locations = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune',
    'Kolkata', 'Ahmedabad', 'Jaipur', 'Remote'
  ];

  useEffect(() => {
    fetchCandidates();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters, candidates]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/v1/employer/candidates').catch(() => ({
        data: generateMockCandidates()
      }));
      setCandidates(response.data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setCandidates(generateMockCandidates());
    } finally {
      setLoading(false);
    }
  };

  const generateMockCandidates = (): Candidate[] => {
    return [
      {
        id: '1',
        name: 'Rahul Sharma',
        title: 'Full Stack Developer',
        location: 'Bangalore',
        experience: 4,
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
        credentials: [
          {
            id: 'c1',
            title: 'Full Stack Web Development',
            issuer: 'Tech Institute',
            verificationStatus: 'verified',
            issuedDate: '2023-06-15',
            nsqfLevel: 6
          }
        ],
        rating: 4.8,
        isVerified: true,
        lastActive: '2024-10-13',
        availability: 'available',
        expectedSalary: '₹8-12 LPA',
        summary: 'Experienced full-stack developer with expertise in modern web technologies and agile methodologies.'
      },
      {
        id: '2',
        name: 'Priya Patel',
        title: 'UI/UX Designer',
        location: 'Mumbai',
        experience: 3,
        skills: ['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Prototyping'],
        credentials: [
          {
            id: 'c2',
            title: 'Professional UI/UX Design',
            issuer: 'Design Academy',
            verificationStatus: 'verified',
            issuedDate: '2023-09-20',
            nsqfLevel: 5
          }
        ],
        rating: 4.6,
        isVerified: true,
        lastActive: '2024-10-12',
        availability: 'available',
        expectedSalary: '₹6-9 LPA',
        summary: 'Creative UI/UX designer with a passion for creating intuitive and beautiful user experiences.'
      },
      {
        id: '3',
        name: 'Arjun Kumar',
        title: 'Data Scientist',
        location: 'Delhi',
        experience: 5,
        skills: ['Python', 'Machine Learning', 'Data Science', 'TensorFlow'],
        credentials: [
          {
            id: 'c3',
            title: 'Advanced Data Science',
            issuer: 'Analytics Institute',
            verificationStatus: 'verified',
            issuedDate: '2023-03-10',
            nsqfLevel: 7
          }
        ],
        rating: 4.9,
        isVerified: true,
        lastActive: '2024-10-14',
        availability: 'busy',
        expectedSalary: '₹12-18 LPA',
        summary: 'Senior data scientist with extensive experience in machine learning and statistical analysis.'
      },
      {
        id: '4',
        name: 'Sneha Reddy',
        title: 'Digital Marketing Specialist',
        location: 'Hyderabad',
        experience: 2,
        skills: ['Digital Marketing', 'SEO', 'Social Media Marketing', 'Google Analytics'],
        credentials: [
          {
            id: 'c4',
            title: 'Digital Marketing Certification',
            issuer: 'Marketing Hub',
            verificationStatus: 'verified',
            issuedDate: '2023-11-05',
            nsqfLevel: 4
          }
        ],
        rating: 4.4,
        isVerified: true,
        lastActive: '2024-10-11',
        availability: 'available',
        expectedSalary: '₹4-7 LPA',
        summary: 'Dynamic digital marketing professional with proven track record in driving online engagement.'
      }
    ];
  };

  const applyFilters = () => {
    let filtered = candidates;

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(candidate => 
        candidate.name.toLowerCase().includes(query) ||
        candidate.title.toLowerCase().includes(query) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(query)) ||
        candidate.location.toLowerCase().includes(query)
      );
    }

    // Skills filter
    if (filters.skills.length > 0) {
      filtered = filtered.filter(candidate =>
        filters.skills.some(skill => 
          candidate.skills.some(candidateSkill => 
            candidateSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(candidate =>
        candidate.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Experience filter
    filtered = filtered.filter(candidate =>
      candidate.experience >= filters.experience.min &&
      candidate.experience <= filters.experience.max
    );

    // NSQF Level filter
    if (filters.nsqfLevel.length > 0) {
      filtered = filtered.filter(candidate =>
        candidate.credentials.some(credential =>
          credential.nsqfLevel && filters.nsqfLevel.includes(credential.nsqfLevel)
        )
      );
    }

    // Availability filter
    if (filters.availability.length > 0) {
      filtered = filtered.filter(candidate =>
        filters.availability.includes(candidate.availability)
      );
    }

    // Verified only filter
    if (filters.verifiedOnly) {
      filtered = filtered.filter(candidate => candidate.isVerified);
    }

    setFilteredCandidates(filtered);
  };

  const toggleSaveCandidate = (candidateId: string) => {
    const newSaved = new Set(savedCandidates);
    if (newSaved.has(candidateId)) {
      newSaved.delete(candidateId);
    } else {
      newSaved.add(candidateId);
    }
    setSavedCandidates(newSaved);
  };

  const handleContactCandidate = async (candidateId: string) => {
    try {
      await api.post(`/api/v1/employer/contact/${candidateId}`);
      // Show success message
    } catch (error) {
      console.error('Error contacting candidate:', error);
    }
  };

  const CandidateCard = ({ candidate }: { candidate: Candidate }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            {candidate.profilePicture ? (
              <img
                src={candidate.profilePicture}
                alt={candidate.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <UserIcon className="h-6 w-6 text-blue-600" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
              {candidate.isVerified && (
                <CheckBadgeIcon className="h-5 w-5 text-green-500" />
              )}
            </div>
            <p className="text-sm text-gray-600">{candidate.title}</p>
            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <MapPinIcon className="h-4 w-4" />
                <span>{candidate.location}</span>
              </div>
              <span>•</span>
              <span>{candidate.experience} {t('years exp')}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">{candidate.rating}</span>
          </div>
          <button
            onClick={() => toggleSaveCandidate(candidate.id)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {savedCandidates.has(candidate.id) ? (
              <HeartSolidIcon className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600 mt-3">{candidate.summary}</p>

      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          {candidate.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {skill}
            </span>
          ))}
          {candidate.skills.length > 4 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{candidate.skills.length - 4} more
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <AcademicCapIcon className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {candidate.credentials.length} {t('credentials')}
            </span>
          </div>
          <span className={`px-2 py-1 text-xs rounded-full ${
            candidate.availability === 'available' 
              ? 'bg-green-100 text-green-800'
              : candidate.availability === 'busy'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {t(candidate.availability)}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedCandidate(candidate)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title={t('View Profile')}
          >
            <EyeIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleContactCandidate(candidate.id)}
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title={t('Contact')}
          >
            <EnvelopeIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('Talent Search')}</h1>
            <p className="text-gray-600">{t('Discover and connect with verified professionals')}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="text-sm text-gray-600">
              {filteredCandidates.length} {t('candidates found')}
            </span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder={t('Search by name, skills, title, or location...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FunnelIcon className="h-5 w-5 text-gray-600" />
              <span>{t('Filters')}</span>
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Skills Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Skills')}
                  </label>
                  <select
                    multiple
                    value={filters.skills}
                    onChange={(e) => {
                      const selectedSkills = Array.from(e.target.selectedOptions, option => option.value);
                      setFilters(prev => ({ ...prev, skills: selectedSkills }));
                    }}
                    className="w-full border border-gray-300 rounded-lg p-2 h-32"
                  >
                    {availableSkills.map(skill => (
                      <option key={skill} value={skill}>{skill}</option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Location')}
                  </label>
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  >
                    <option value="">{t('All Locations')}</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                {/* Experience Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Experience (Years)')}
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={filters.experience.max}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        experience: { ...prev.experience, max: parseInt(e.target.value) }
                      }))}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-600">
                      {filters.experience.min} - {filters.experience.max} years
                    </div>
                  </div>
                </div>

                {/* Additional Filters */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Options')}
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.verifiedOnly}
                        onChange={(e) => setFilters(prev => ({ ...prev, verifiedOnly: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{t('Verified only')}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredCandidates.length === 0 ? (
              <div className="text-center py-12">
                <UserIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('No candidates found')}</h3>
                <p className="text-gray-600">{t('Try adjusting your search criteria or filters')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCandidates.map((candidate) => (
                  <CandidateCard key={candidate.id} candidate={candidate} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Candidate Detail Modal */}
        {selectedCandidate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedCandidate.name}
                </h2>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedCandidate.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MapPinIcon className="h-4 w-4" />
                        <span>{selectedCandidate.location}</span>
                      </div>
                      <span>{selectedCandidate.experience} years experience</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center space-x-1">
                        <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{selectedCandidate.rating}</span>
                      </div>
                      {selectedCandidate.isVerified && (
                        <CheckBadgeIcon className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{t('Summary')}</h4>
                    <p className="text-gray-600">{selectedCandidate.summary}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{t('Skills')}</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCandidate.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{t('Credentials')}</h4>
                    <div className="space-y-3">
                      {selectedCandidate.credentials.map((credential) => (
                        <div key={credential.id} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-gray-900">{credential.title}</h5>
                              <p className="text-sm text-gray-600">{credential.issuer}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(credential.issuedDate).toLocaleDateString()}
                                {credential.nsqfLevel && ` • NSQF Level ${credential.nsqfLevel}`}
                              </p>
                            </div>
                            <div className={`px-2 py-1 text-xs rounded-full ${
                              credential.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' :
                              credential.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {t(credential.verificationStatus)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={() => handleContactCandidate(selectedCandidate.id)}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <EnvelopeIcon className="h-4 w-4" />
                      <span>{t('Contact Candidate')}</span>
                    </button>
                    <button
                      onClick={() => toggleSaveCandidate(selectedCandidate.id)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                    >
                      {savedCandidates.has(selectedCandidate.id) ? (
                        <HeartSolidIcon className="h-4 w-4 text-red-500" />
                      ) : (
                        <HeartIcon className="h-4 w-4 text-gray-400" />
                      )}
                      <span>{savedCandidates.has(selectedCandidate.id) ? t('Saved') : t('Save')}</span>
                    </button>
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

export default EmployerTalentSearch;