import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setIsLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl flex overflow-hidden max-w-4xl w-full transition-all duration-700 ease-in-out transform hover:scale-[1.02]">
        {/* Left Side - Welcome Panel */}
        <div className="hidden md:block md:w-1/2 animated-gradient p-12 text-white relative overflow-hidden transition-all duration-700 ease-in-out form-enter-left">
          <div className="relative z-10 h-full flex flex-col justify-center transform transition-all duration-700 ease-in-out">
            <h2 className="text-4xl font-bold mb-4 transform transition-all duration-500 ease-in-out hover:scale-105 floating">
              Welcome Back!
            </h2>
            <p className="text-blue-100 mb-8 text-lg leading-relaxed transform transition-all duration-500 ease-in-out delay-100">
              To keep connected with us please login with your personal info
            </p>
            <Link
              to="/register"
              className="inline-block border-2 border-white text-white font-semibold py-3 px-8 rounded-full hover:bg-white hover:text-blue-600 transition-all duration-500 ease-in-out text-center transform hover:scale-105 hover:shadow-lg scale-hover button-press"
            >
              SIGN UP
            </Link>
          </div>
          
          {/* Decorative Elements with Animation */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16 floating"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white bg-opacity-5 rounded-full -ml-24 -mb-24 slow-bounce"></div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 transition-all duration-700 ease-in-out form-enter-right">
          <div className="max-w-md mx-auto transform transition-all duration-500 ease-in-out form-enter stagger-1">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-2 transform transition-all duration-500 ease-in-out hover:scale-105 stagger-2">
              Sign In
            </h2>
            <p className="text-gray-600 text-center mb-8 transform transition-all duration-500 ease-in-out delay-100 stagger-3">
              Welcome back! Please sign in to your account
            </p>

            <form className="space-y-6 transform transition-all duration-500 ease-in-out form-enter stagger-4" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="transform transition-all duration-300 ease-in-out hover:scale-105 stagger-5">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 ease-in-out focus:scale-105 hover:shadow-md input-glow"
                  placeholder="Email"
                  disabled={isLoading}
                />
              </div>

              {/* Password Field */}
              <div className="relative transform transition-all duration-300 ease-in-out hover:scale-105 stagger-6">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 ease-in-out focus:scale-105 hover:shadow-md input-glow"
                  placeholder="Password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center transition-all duration-200 ease-in-out hover:scale-110 scale-hover"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400 transition-all duration-200 ease-in-out hover:text-blue-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400 transition-all duration-200 ease-in-out hover:text-blue-500" />
                  )}
                </button>
              </div>

              {/* Submit Button */}
              <div className="transform transition-all duration-300 ease-in-out hover:scale-105 stagger-1">
                <button
                  type="submit"
                  disabled={isLoading || !email || !password}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center transform hover:scale-105 hover:shadow-lg button-press"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Loading...
                    </>
                  ) : (
                    'SIGN IN'
                  )}
                </button>
              </div>

              {/* Register Link */}
              <div className="text-center mt-6 transform transition-all duration-300 ease-in-out hover:scale-105 stagger-2">
                <span className="text-gray-600">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="text-blue-600 hover:text-blue-700 font-medium transition-all duration-300 ease-in-out hover:underline transform hover:scale-110 inline-block scale-hover"
                  >
                    Sign Up
                  </Link>
                </span>
              </div>

              {/* Demo Credentials */}
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md scale-hover stagger-3">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">Demo Credentials</h4>
                <div className="text-xs text-blue-700 space-y-1">
                  <p><strong>Learner:</strong> fresh_learner@test.com / password123</p>
                  <p><strong>Issuer:</strong> fresh_issuer@test.com / password123</p>
                  <p><strong>Employer:</strong> fresh_employer@test.com / password123</p>
                  <p><strong>Admin:</strong> fresh_admin@test.com / password123</p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;