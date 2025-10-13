import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { credentialsAPI } from '../services/api';
import { Award, CheckCircle, Calendar, User } from 'lucide-react';

const VerifyCredential = () => {
  const { verificationCode } = useParams<{ verificationCode: string }>();
  const [credential, setCredential] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyCredential = async () => {
      if (!verificationCode) return;
      
      try {
        setLoading(true);
        const data = await credentialsAPI.verify(verificationCode);
        setCredential(data);
      } catch (err) {
        setError('Invalid or expired verification code');
      } finally {
        setLoading(false);
      }
    };

    verifyCredential();
  }, [verificationCode]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !credential) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto text-red-500 mb-4">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Credential Not Found</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex items-center justify-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Verified Credential
              </h1>
              <p className="text-gray-600">
                This credential has been successfully verified
              </p>
            </div>

            <div className="border-2 border-gray-200 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <Award className="w-8 h-8 text-primary-600 mr-3" />
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {credential.title}
                  </h2>
                  <p className="text-gray-600">{credential.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center">
                  <User className="w-5 h-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Issued to</p>
                    <p className="font-medium">{credential.learner_name}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Award className="w-5 h-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Issued by</p>
                    <p className="font-medium">{credential.issuer_name}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Issue Date</p>
                    <p className="font-medium">
                      {new Date(credential.issue_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {credential.nsqf_level && (
                  <div className="flex items-center">
                    <Award className="w-5 h-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">NSQF Level</p>
                      <p className="font-medium">{credential.nsqf_level}</p>
                    </div>
                  </div>
                )}
              </div>

              {credential.skills && credential.skills.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm text-gray-600 mb-2">Skills Certified</p>
                  <div className="flex flex-wrap gap-2">
                    {credential.skills.map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="text-center text-sm text-gray-500">
              <p>Verification Code: {verificationCode}</p>
              <p className="mt-1">
                Verified on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyCredential;