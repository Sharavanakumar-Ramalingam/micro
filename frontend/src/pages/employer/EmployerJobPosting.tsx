import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useLanguage } from '../../contexts/LanguageContext';
import { api } from '../../services/api';
import {
  PlusIcon,
  BriefcaseIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  CalendarIcon,
  UserGroupIcon,
  ClockIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface JobPost {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience: { min: number; max: number };
  salary: { min: number; max: number; currency: string };
  description: string;
  requirements: string[];
  preferredSkills: string[];
  requiredCredentials: RequiredCredential[];
  benefits: string[];
  applicationDeadline: string;
  status: 'draft' | 'published' | 'closed' | 'paused';
  applicationsCount: number;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

interface RequiredCredential {
  title: string;
  issuer?: string;
  nsqfLevel?: number;
  required: boolean;
}

const EmployerJobPosting = () => {
  const { t } = useLanguage();
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'draft' | 'published' | 'closed'>('all');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'full-time' as JobPost['type'],
    experience: { min: 0, max: 5 },
    salary: { min: 300000, max: 1000000, currency: 'INR' },
    description: '',
    requirements: [''],
    preferredSkills: [''],
    requiredCredentials: [] as RequiredCredential[],
    benefits: [''],
    applicationDeadline: ''
  });

  const jobTypes = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' }
  ];

  const departments = [
    'Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'HR', 'Operations', 'Finance'
  ];

  const locations = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Remote'
  ];

  const availableSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'Java', 'PHP', 'C++',
    'Digital Marketing', 'Data Science', 'Machine Learning', 'UI/UX Design',
    'Project Management', 'Cloud Computing', 'DevOps', 'Cybersecurity'
  ];

  useEffect(() => {
    fetchJobPosts();
  }, []);

  const fetchJobPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/v1/employer/jobs').catch(() => ({
        data: generateMockJobs()
      }));
      setJobPosts(response.data);
    } catch (error) {
      console.error('Error fetching job posts:', error);
      setJobPosts(generateMockJobs());
    } finally {
      setLoading(false);
    }
  };

  const generateMockJobs = (): JobPost[] => {
    return [
      {
        id: '1',
        title: 'Senior Full Stack Developer',
        department: 'Engineering',
        location: 'Bangalore',
        type: 'full-time',
        experience: { min: 3, max: 7 },
        salary: { min: 800000, max: 1500000, currency: 'INR' },
        description: 'We are looking for an experienced Full Stack Developer to join our engineering team...',
        requirements: [
          'Bachelor\'s degree in Computer Science or related field',
          'Minimum 3 years of experience in web development',
          'Strong proficiency in JavaScript and modern frameworks',
          'Experience with both frontend and backend technologies'
        ],
        preferredSkills: ['React', 'Node.js', 'MongoDB', 'AWS'],
        requiredCredentials: [
          { title: 'Full Stack Development Certification', required: true, nsqfLevel: 6 }
        ],
        benefits: ['Health Insurance', 'Flexible Working Hours', 'Learning Budget'],
        applicationDeadline: '2024-11-15',
        status: 'published',
        applicationsCount: 24,
        viewsCount: 156,
        createdAt: '2024-10-01T00:00:00Z',
        updatedAt: '2024-10-05T00:00:00Z'
      },
      {
        id: '2',
        title: 'UI/UX Designer',
        department: 'Design',
        location: 'Mumbai',
        type: 'full-time',
        experience: { min: 2, max: 5 },
        salary: { min: 600000, max: 1200000, currency: 'INR' },
        description: 'Join our design team to create beautiful and intuitive user experiences...',
        requirements: [
          'Bachelor\'s degree in Design or related field',
          'Portfolio demonstrating UI/UX design skills',
          'Proficiency in design tools like Figma, Sketch',
          'Understanding of user-centered design principles'
        ],
        preferredSkills: ['Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research'],
        requiredCredentials: [
          { title: 'UI/UX Design Certification', required: false, nsqfLevel: 5 }
        ],
        benefits: ['Health Insurance', 'Creative Environment', 'Professional Development'],
        applicationDeadline: '2024-11-20',
        status: 'published',
        applicationsCount: 18,
        viewsCount: 89,
        createdAt: '2024-10-03T00:00:00Z',
        updatedAt: '2024-10-08T00:00:00Z'
      }
    ];
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Filter out empty requirements and skills
      const cleanedData = {
        ...formData,
        requirements: formData.requirements.filter(req => req.trim()),
        preferredSkills: formData.preferredSkills.filter(skill => skill.trim()),
        benefits: formData.benefits.filter(benefit => benefit.trim())
      };

      if (editingJob) {
        await api.put(`/api/v1/employer/jobs/${editingJob.id}`, cleanedData);
      } else {
        await api.post('/api/v1/employer/jobs', cleanedData);
      }
      
      await fetchJobPosts();
      resetForm();
      setShowJobForm(false);
      setEditingJob(null);
    } catch (error) {
      console.error('Error saving job post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm(t('Are you sure you want to delete this job post?'))) return;
    
    try {
      await api.delete(`/api/v1/employer/jobs/${jobId}`);
      await fetchJobPosts();
    } catch (error) {
      console.error('Error deleting job post:', error);
    }
  };

  const handleStatusChange = async (jobId: string, newStatus: JobPost['status']) => {
    try {
      await api.patch(`/api/v1/employer/jobs/${jobId}/status`, { status: newStatus });
      await fetchJobPosts();
    } catch (error) {
      console.error('Error updating job status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      department: '',
      location: '',
      type: 'full-time',
      experience: { min: 0, max: 5 },
      salary: { min: 300000, max: 1000000, currency: 'INR' },
      description: '',
      requirements: [''],
      preferredSkills: [''],
      requiredCredentials: [],
      benefits: [''],
      applicationDeadline: ''
    });
  };

  const startEdit = (job: JobPost) => {
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      experience: job.experience,
      salary: job.salary,
      description: job.description,
      requirements: job.requirements.length > 0 ? job.requirements : [''],
      preferredSkills: job.preferredSkills.length > 0 ? job.preferredSkills : [''],
      requiredCredentials: job.requiredCredentials,
      benefits: job.benefits.length > 0 ? job.benefits : [''],
      applicationDeadline: job.applicationDeadline
    });
    setEditingJob(job);
    setShowJobForm(true);
  };

  const addListItem = (field: 'requirements' | 'preferredSkills' | 'benefits') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const updateListItem = (field: 'requirements' | 'preferredSkills' | 'benefits', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const removeListItem = (field: 'requirements' | 'preferredSkills' | 'benefits', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const filteredJobs = jobPosts.filter(job => filter === 'all' || job.status === filter);

  const getStatusColor = (status: JobPost['status']) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('Job Posts')}</h1>
            <p className="text-gray-600">{t('Create and manage your job postings')}</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              onClick={() => {
                resetForm();
                setEditingJob(null);
                setShowJobForm(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <PlusIcon className="h-4 w-4" />
              <span>{t('Post New Job')}</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-4 border-b border-gray-200">
          {[
            { key: 'all', label: 'All Jobs' },
            { key: 'published', label: 'Published' },
            { key: 'draft', label: 'Drafts' },
            { key: 'closed', label: 'Closed' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`pb-2 px-1 border-b-2 transition-colors ${
                filter === key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {t(label)}
            </button>
          ))}
        </div>

        {/* Job List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <BriefcaseIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('No job posts found')}</h3>
              <p className="text-gray-600 mb-4">{t('Create your first job post to start hiring')}</p>
              <button
                onClick={() => {
                  resetForm();
                  setShowJobForm(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('Post New Job')}
              </button>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(job.status)}`}>
                        {t(job.status)}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <BriefcaseIcon className="h-4 w-4" />
                        <span>{job.department}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPinIcon className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CurrencyRupeeIcon className="h-4 w-4" />
                        <span>₹{(job.salary.min / 100000).toFixed(1)}L - ₹{(job.salary.max / 100000).toFixed(1)}L</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="h-4 w-4" />
                        <span>{job.experience.min}-{job.experience.max} years</span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <UserGroupIcon className="h-4 w-4" />
                          <span>{job.applicationsCount} {t('applications')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <EyeIcon className="h-4 w-4" />
                          <span>{job.viewsCount} {t('views')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{t('Deadline')}: {new Date(job.applicationDeadline).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {job.status === 'draft' && (
                      <button
                        onClick={() => handleStatusChange(job.id, 'published')}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title={t('Publish')}
                      >
                        <CheckIcon className="h-4 w-4" />
                      </button>
                    )}
                    {job.status === 'published' && (
                      <button
                        onClick={() => handleStatusChange(job.id, 'paused')}
                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        title={t('Pause')}
                      >
                        <ClockIcon className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => startEdit(job)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title={t('Edit')}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title={t('Delete')}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Job Form Modal */}
        {showJobForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingJob ? t('Edit Job Post') : t('Create New Job Post')}
                </h2>
                <button
                  onClick={() => {
                    setShowJobForm(false);
                    setEditingJob(null);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('Job Title')} *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder={t('e.g. Senior Software Engineer')}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('Department')} *
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    >
                      <option value="">{t('Select Department')}</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('Location')} *
                    </label>
                    <select
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    >
                      <option value="">{t('Select Location')}</option>
                      {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('Employment Type')} *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    >
                      {jobTypes.map(type => (
                        <option key={type.value} value={type.value}>{t(type.label)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Experience and Salary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('Experience (Years)')}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder={t('Min')}
                        value={formData.experience.min}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          experience: { ...prev.experience, min: parseInt(e.target.value) || 0 }
                        }))}
                        className="border border-gray-300 rounded-lg px-3 py-2"
                      />
                      <input
                        type="number"
                        placeholder={t('Max')}
                        value={formData.experience.max}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          experience: { ...prev.experience, max: parseInt(e.target.value) || 5 }
                        }))}
                        className="border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('Salary (₹ per year)')}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder={t('Min')}
                        value={formData.salary.min}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          salary: { ...prev.salary, min: parseInt(e.target.value) || 300000 }
                        }))}
                        className="border border-gray-300 rounded-lg px-3 py-2"
                      />
                      <input
                        type="number"
                        placeholder={t('Max')}
                        value={formData.salary.max}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          salary: { ...prev.salary, max: parseInt(e.target.value) || 1000000 }
                        }))}
                        className="border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('Application Deadline')} *
                  </label>
                  <input
                    type="date"
                    value={formData.applicationDeadline}
                    onChange={(e) => setFormData(prev => ({ ...prev, applicationDeadline: e.target.value }))}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>

                {/* Job Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('Job Description')} *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder={t('Describe the role, responsibilities, and what you are looking for...')}
                    required
                  />
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('Requirements')}
                  </label>
                  <div className="space-y-2">
                    {formData.requirements.map((req, index) => (
                      <div key={index} className="flex space-x-2">
                        <input
                          type="text"
                          value={req}
                          onChange={(e) => updateListItem('requirements', index, e.target.value)}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                          placeholder={t('e.g. Bachelor\'s degree in Computer Science')}
                        />
                        {formData.requirements.length > 1 && (
                          <button
                            onClick={() => removeListItem('requirements', index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addListItem('requirements')}
                      className="text-blue-600 text-sm hover:text-blue-700"
                    >
                      + {t('Add Requirement')}
                    </button>
                  </div>
                </div>

                {/* Preferred Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('Preferred Skills')}
                  </label>
                  <div className="space-y-2">
                    {formData.preferredSkills.map((skill, index) => (
                      <div key={index} className="flex space-x-2">
                        <select
                          value={skill}
                          onChange={(e) => updateListItem('preferredSkills', index, e.target.value)}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                        >
                          <option value="">{t('Select a skill')}</option>
                          {availableSkills.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        {formData.preferredSkills.length > 1 && (
                          <button
                            onClick={() => removeListItem('preferredSkills', index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addListItem('preferredSkills')}
                      className="text-blue-600 text-sm hover:text-blue-700"
                    >
                      + {t('Add Skill')}
                    </button>
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('Benefits')}
                  </label>
                  <div className="space-y-2">
                    {formData.benefits.map((benefit, index) => (
                      <div key={index} className="flex space-x-2">
                        <input
                          type="text"
                          value={benefit}
                          onChange={(e) => updateListItem('benefits', index, e.target.value)}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                          placeholder={t('e.g. Health Insurance')}
                        />
                        {formData.benefits.length > 1 && (
                          <button
                            onClick={() => removeListItem('benefits', index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addListItem('benefits')}
                      className="text-blue-600 text-sm hover:text-blue-700"
                    >
                      + {t('Add Benefit')}
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowJobForm(false);
                    setEditingJob(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  {t('Cancel')}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !formData.title || !formData.department}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
                >
                  {loading ? t('Saving...') : editingJob ? t('Update Job') : t('Post Job')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EmployerJobPosting;