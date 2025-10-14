import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useLanguage } from '../../contexts/LanguageContext';
import { api } from '../../services/api';
import { 
  AcademicCapIcon, 
  StarIcon, 
  TrophyIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

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

interface SkillRating {
  skill: string;
  stars: number;
  credentialCount: number;
  credentials: Credential[];
  nsqfLevels: number[];
}

interface NSQFLevel {
  level: number;
  name: string;
  description: string;
  credentialCount: number;
  skills: string[];
  achievements: number;
}

const LearnerSkills = () => {
  const { t } = useLanguage();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [skillRatings, setSkillRatings] = useState<SkillRating[]>([]);
  const [nsqfProgress, setNSQFProgress] = useState<NSQFLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalSkills, setTotalSkills] = useState(0);
  const [highestNSQFLevel, setHighestNSQFLevel] = useState(0);

  const nsqfLevelData = [
    { level: 1, name: "Certificate", description: "Basic knowledge and skills" },
    { level: 2, name: "Certificate", description: "Advanced basic skills" },
    { level: 3, name: "Certificate", description: "Skilled knowledge and competency" },
    { level: 4, name: "Certificate", description: "Multi-skilling and specialization" },
    { level: 5, name: "Diploma", description: "Comprehensive knowledge and skills" },
    { level: 6, name: "Advanced Diploma", description: "Specialized technical skills" },
    { level: 7, name: "Bachelor's Degree", description: "Broad knowledge base" },
    { level: 8, name: "Master's Degree", description: "Advanced specialized knowledge" },
    { level: 9, name: "Master's Degree", description: "Research and innovation skills" },
    { level: 10, name: "Doctoral Degree", description: "Expertise and research leadership" }
  ];

  useEffect(() => {
    fetchCredentials();
  }, []);

  useEffect(() => {
    if (credentials.length > 0) {
      analyzeSkills();
      analyzeNSQFProgress();
    }
  }, [credentials]);

  const fetchCredentials = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching credentials for skills analysis...');
      const response = await api.get('/api/v1/credentials');
      console.log('📋 Raw credentials response:', response.data);
      
      // Use the same approach as LearnerCredentials - no filtering initially
      console.log('� Raw API response:', response.data);
      console.log('🔍 Credential details:', response.data.map((c: any) => ({
        id: c.id,
        title: c.title,
        status: c.status,
        verification_status: c.verification_status,
        skills: c.skills,
        nsqf_level: c.nsqf_level,
        metadata: c.metadata
      })));
      
      // Set all credentials without filtering, same as LearnerCredentials
      setCredentials(response.data || []);
      console.log('✅ Setting credentials count:', (response.data || []).length);
    } catch (error) {
      console.error('❌ Error fetching credentials:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeSkills = () => {
    const skillMap = new Map<string, SkillRating>();

    credentials.forEach((credential) => {
      if (credential.skills && credential.skills.length > 0) {
        credential.skills.forEach((skill) => {
          if (!skillMap.has(skill)) {
            skillMap.set(skill, {
              skill,
              stars: 0,
              credentialCount: 0,
              credentials: [],
              nsqfLevels: []
            });
          }

          const rating = skillMap.get(skill)!;
          rating.credentialCount += 1;
          rating.credentials.push(credential);
          
          if (credential.nsqf_level) {
            rating.nsqfLevels.push(credential.nsqf_level);
          }
        });
      }
    });

    // Calculate star ratings based on credential count and NSQF levels
    const ratings = Array.from(skillMap.values()).map((rating) => {
      let stars = Math.min(rating.credentialCount, 5); // Base stars from credential count
      
      // Bonus stars for high NSQF levels
      const maxNSQF = Math.max(...rating.nsqfLevels, 0);
      if (maxNSQF >= 8) stars = Math.min(stars + 2, 5);
      else if (maxNSQF >= 6) stars = Math.min(stars + 1, 5);
      
      return { ...rating, stars };
    });

    // Sort by stars and credential count
    ratings.sort((a, b) => b.stars - a.stars || b.credentialCount - a.credentialCount);

    setSkillRatings(ratings);
    setTotalSkills(ratings.length);
  };

  const analyzeNSQFProgress = () => {
    const nsqfLevelMap = new Map<number, NSQFLevel>();
    let maxLevel = 0;

    // Initialize NSQF levels
    nsqfLevelData.forEach((levelData) => {
      nsqfLevelMap.set(levelData.level, {
        ...levelData,
        credentialCount: 0,
        skills: [],
        achievements: 0
      });
    });

    credentials.forEach((credential) => {
      if (credential.nsqf_level && credential.nsqf_level >= 1 && credential.nsqf_level <= 10) {
        const level = nsqfLevelMap.get(credential.nsqf_level)!;
        level.credentialCount += 1;
        level.achievements += 1;
        maxLevel = Math.max(maxLevel, credential.nsqf_level);
        
        if (credential.skills) {
          credential.skills.forEach((skill) => {
            if (!level.skills.includes(skill)) {
              level.skills.push(skill);
            }
          });
        }
      }
    });

    setNSQFProgress(Array.from(nsqfLevelMap.values()));
    setHighestNSQFLevel(maxLevel);
  };

  const renderStars = (count: number, maxStars: number = 5) => {
    return Array.from({ length: maxStars }, (_, i) => (
      <span key={i}>
        {i < count ? (
          <StarSolidIcon className="h-5 w-5 text-yellow-400" />
        ) : (
          <StarIcon className="h-5 w-5 text-gray-300" />
        )}
      </span>
    ));
  };

  const getSkillLevelColor = (stars: number) => {
    if (stars >= 5) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (stars >= 4) return 'bg-green-100 text-green-800 border-green-200';
    if (stars >= 3) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (stars >= 2) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getNSQFLevelColor = (level: number) => {
    if (level <= highestNSQFLevel) {
      if (level >= 8) return 'bg-purple-500 text-white';
      if (level >= 6) return 'bg-blue-500 text-white';
      if (level >= 4) return 'bg-green-500 text-white';
      return 'bg-yellow-500 text-white';
    }
    return 'bg-gray-200 text-gray-600';
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Header */}
          <div className="lg:flex lg:items-center lg:justify-between mb-8">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900">{t('Skills & NSQF Framework')}</h1>
              <p className="mt-1 text-sm text-gray-600">
                {t('Track your skill development and NSQF framework progress based on your verified credentials')}
              </p>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <TrophyIcon className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{totalSkills}</div>
                  <div className="text-sm text-gray-600">{t('Total Skills')}</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <CheckBadgeIcon className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{credentials.length}</div>
                  <div className="text-sm text-gray-600">{t('Verified Credentials')}</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <ChartBarIcon className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{highestNSQFLevel}</div>
                  <div className="text-sm text-gray-600">{t('Highest NSQF Level')}</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <AcademicCapIcon className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {skillRatings.filter(s => s.stars >= 4).length}
                  </div>
                  <div className="text-sm text-gray-600">{t('Expert Skills')}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Skills Portfolio */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <ClipboardDocumentListIcon className="h-6 w-6 mr-2 text-blue-500" />
                  {t('Skills Portfolio')}
                </h2>
              </div>
              
              <div className="p-6">
                {skillRatings.length === 0 ? (
                  <div className="text-center py-8">
                    <AcademicCapIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">{t('No skills found in your credentials')}</p>
                    <p className="text-sm text-gray-400 mt-2">
                      {t('Skills will appear here as you earn more credentials')}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {skillRatings.map((rating) => (
                      <div
                        key={rating.skill}
                        className={`p-4 rounded-lg border ${getSkillLevelColor(rating.stars)}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{rating.skill}</h3>
                          <div className="flex items-center space-x-1">
                            {renderStars(rating.stars)}
                          </div>
                        </div>
                        <div className="text-sm opacity-75">
                          {t('Based on')} {rating.credentialCount} {t('credential(s)')}
                          {rating.nsqfLevels.length > 0 && (
                            <span className="ml-2">
                              • {t('Max NSQF Level')}: {Math.max(...rating.nsqfLevels)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* NSQF Framework Progress */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <ChartBarIcon className="h-6 w-6 mr-2 text-green-500" />
                  {t('NSQF Framework Progress')}
                </h2>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-3">
                  {nsqfProgress.map((level) => (
                    <div
                      key={level.level}
                      className={`p-4 rounded-lg text-center transition-all duration-200 ${
                        level.credentialCount > 0 
                          ? `${getNSQFLevelColor(level.level)} shadow-md transform hover:scale-105`
                          : 'bg-gray-100 text-gray-500 border-2 border-dashed border-gray-300'
                      }`}
                    >
                      <div className="font-bold text-lg mb-1">
                        {t('Level')} {level.level}
                      </div>
                      <div className="text-sm font-medium mb-1">{level.name}</div>
                      {level.credentialCount > 0 && (
                        <div className="text-sm">
                          {level.credentialCount} {t('credential(s)')}
                        </div>
                      )}
                      {level.achievements > 0 && (
                        <div className="flex items-center justify-center mt-1">
                          <TrophyIcon className="h-4 w-4 mr-1" />
                          <span className="text-xs">{level.achievements}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">{t('NSQF Framework Guide')}</h3>
                  <div className="text-sm text-blue-700 space-y-1">
                    <div>• {t('Levels 1-4')}: {t('Certificate programs and skilled trades')}</div>
                    <div>• {t('Levels 5-6')}: {t('Diploma and advanced technical skills')}</div>
                    <div>• {t('Levels 7-8')}: {t('Bachelor\'s and Master\'s degree programs')}</div>
                    <div>• {t('Levels 9-10')}: {t('Research and doctoral level expertise')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skill Development Recommendations */}
          {skillRatings.length > 0 && (
            <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">{t('Skill Development Recommendations')}</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">{t('Strengthen Existing Skills')}</h3>
                    <div className="space-y-2">
                      {skillRatings.filter(s => s.stars < 4).slice(0, 3).map((skill) => (
                        <div key={skill.skill} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                          <span className="text-sm font-medium text-yellow-800">{skill.skill}</span>
                          <div className="flex items-center space-x-1">
                            {renderStars(skill.stars)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">{t('Next NSQF Level Target')}</h3>
                    {highestNSQFLevel < 10 && (
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="text-lg font-semibold text-green-800">
                          {t('Level')} {highestNSQFLevel + 1}
                        </div>
                        <div className="text-sm text-green-700">
                          {nsqfLevelData[highestNSQFLevel]?.name} - {nsqfLevelData[highestNSQFLevel]?.description}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default LearnerSkills;