import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'learner' as 'learner' | 'issuer' | 'employer',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return;
    }

    try {
      setIsLoading(true);
      await register({
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        role: formData.role,
      });
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl flex overflow-hidden max-w-4xl w-full transition-all duration-700 ease-in-out transform hover:scale-[1.02]">
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 transition-all duration-700 ease-in-out form-enter-left">
          <div className="max-w-md mx-auto transform transition-all duration-500 ease-in-out form-enter stagger-1">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-2 transform transition-all duration-500 ease-in-out hover:scale-105 stagger-2">
              Sign Up
            </h2>
            <p className="text-gray-600 text-center mb-8 transform transition-all duration-500 ease-in-out delay-100 stagger-3">
              Create your account to get started
            </p>

            <form className="space-y-4 transform transition-all duration-500 ease-in-out" onSubmit={handleSubmit}>
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4 transform transition-all duration-300 ease-in-out hover:scale-105">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 ease-in-out focus:scale-105 hover:shadow-md"
                  placeholder="First Name"
                  disabled={isLoading}
                />
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 ease-in-out focus:scale-105 hover:shadow-md"
                  placeholder="Last Name"
                  disabled={isLoading}
                />
              </div>

              {/* Email Field */}
              <div className="transform transition-all duration-300 ease-in-out hover:scale-105">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 ease-in-out focus:scale-105 hover:shadow-md"
                  placeholder="Email"
                  disabled={isLoading}
                />
              </div>

              {/* Role Field */}
              <div className="transform transition-all duration-300 ease-in-out hover:scale-105">
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 ease-in-out bg-white focus:scale-105 hover:shadow-md"
                  disabled={isLoading}
                >
                  <option value="learner">Learner</option>
                  <option value="issuer">Issuer</option>
                  <option value="employer">Employer</option>
                </select>
              </div>

              {/* Password Field */}
              <div className="relative transform transition-all duration-300 ease-in-out hover:scale-105">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 ease-in-out focus:scale-105 hover:shadow-md"
                  placeholder="Password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center transition-all duration-200 ease-in-out hover:scale-110"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400 transition-all duration-200 ease-in-out hover:text-blue-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400 transition-all duration-200 ease-in-out hover:text-blue-500" />
                  )}
                </button>
              </div>

              {/* Confirm Password Field */}
              <div className="relative transform transition-all duration-300 ease-in-out hover:scale-105">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 ease-in-out focus:scale-105 hover:shadow-md"
                  placeholder="Confirm Password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center transition-all duration-200 ease-in-out hover:scale-110"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400 transition-all duration-200 ease-in-out hover:text-blue-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400 transition-all duration-200 ease-in-out hover:text-blue-500" />
                  )}
                </button>
              </div>

              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-sm text-red-600 transform transition-all duration-300 ease-in-out animate-pulse">Passwords do not match</p>
              )}

              {/* Submit Button */}
              <div className="transform transition-all duration-300 ease-in-out hover:scale-105">
                <button
                  type="submit"
                  disabled={isLoading || formData.password !== formData.confirmPassword}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center transform hover:scale-105 hover:shadow-lg active:scale-95"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Loading...
                    </>
                  ) : (
                    'SIGN UP'
                  )}
                </button>
              </div>

              {/* Login Link */}
              <div className="text-center mt-6 transform transition-all duration-300 ease-in-out hover:scale-105">
                <span className="text-gray-600">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-700 font-medium transition-all duration-300 ease-in-out hover:underline transform hover:scale-110 inline-block"
                  >
                    Sign In
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Welcome Panel */}
        <div className="hidden md:block md:w-1/2 animated-gradient p-12 text-white relative overflow-hidden transition-all duration-700 ease-in-out form-enter-right">
          <div className="relative z-10 h-full flex flex-col justify-center transform transition-all duration-700 ease-in-out">
            <h2 className="text-4xl font-bold mb-4 transform transition-all duration-500 ease-in-out hover:scale-105 floating">
              Welcome Back!
            </h2>
            <p className="text-blue-100 mb-8 text-lg leading-relaxed transform transition-all duration-500 ease-in-out delay-100">
              To keep connected with us please login with your personal info
            </p>
            <Link
              to="/login"
              className="inline-block border-2 border-white text-white font-semibold py-3 px-8 rounded-full hover:bg-white hover:text-blue-600 transition-all duration-500 ease-in-out text-center transform hover:scale-105 hover:shadow-lg scale-hover button-press"
            >
              SIGN IN
            </Link>
          </div>
          
          {/* Decorative Elements with Animation */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16 floating"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white bg-opacity-5 rounded-full -ml-24 -mb-24 slow-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default Register;