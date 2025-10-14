import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Award,
  Home,
  FileText,
  Star,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Globe,
  Share,
  Search,
  Plus,
  BarChart
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t, currentLanguage, setCurrentLanguage, supportedLanguages } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  let navigation = [
    { name: t('nav.dashboard'), href: '/dashboard', icon: Home },
    { name: t('nav.credentials'), href: '/credentials', icon: FileText },
    { name: t('nav.badges'), href: '/badge-templates', icon: Star },
    { name: t('nav.profile'), href: '/profile', icon: User },
  ];

  // Replace navigation for different roles
  if (user?.role === 'admin') {
    navigation.unshift({ name: 'Admin Panel', href: '/admin', icon: Settings });
  } else if (user?.role === 'issuer') {
    navigation.unshift({ name: 'Issuer Panel', href: '/issuer', icon: Settings });
  } else if (user?.role === 'employer') {
    // Replace with employer-specific navigation
    navigation = [
      { name: t('Dashboard'), href: '/employer', icon: Home },
      { name: t('Talent Search'), href: '/employer/talent-search', icon: Search },
      { name: t('Verify Credentials'), href: '/employer/verify-credential', icon: FileText },
      { name: t('Job Postings'), href: '/employer/post-job', icon: Plus },
      { name: t('Analytics'), href: '/employer/analytics', icon: BarChart },
      { name: t('Company Profile'), href: '/employer/profile', icon: User },
    ];
  } else if (user?.role === 'learner') {
    // Replace with learner-specific navigation
    navigation = [
      { name: t('Dashboard'), href: '/learner', icon: Home },
      { name: t('My Credentials'), href: '/learner/credentials', icon: FileText },
      { name: t('Skills & NSQF'), href: '/learner/skills', icon: Star },
      { name: t('Sharing & Views'), href: '/learner/sharing', icon: Share },
      { name: t('Profile'), href: '/profile', icon: User },
    ];
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <SidebarContent navigation={navigation} currentPath={location.pathname} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <SidebarContent navigation={navigation} currentPath={location.pathname} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top navigation */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            className="px-4 border-r border-gray-200 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="flex items-center h-16">
                    <h1 className="text-xl font-semibold text-gray-900">
                      {navigation.find(nav => nav.href === location.pathname)?.name || 'Dashboard'}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              {/* Language selector */}
              <div className="relative">
                <select
                  value={currentLanguage.code}
                  onChange={(e) => {
                    const lang = supportedLanguages.find(l => l.code === e.target.value);
                    if (lang) setCurrentLanguage(lang);
                  }}
                  className="appearance-none bg-gray-50 border border-gray-300 rounded-md px-3 py-1 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {supportedLanguages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.nativeName}
                    </option>
                  ))}
                </select>
                <Globe className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* User menu */}
              <div className="relative flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.first_name[0]}{user?.last_name[0]}
                    </span>
                  </div>
                  <div className="hidden md:block">
                    <div className="text-sm font-medium text-gray-900">
                      {user?.first_name} {user?.last_name}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {t(`role.${user?.role}`)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  title={t('nav.logout')}
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
};

const SidebarContent = ({ navigation, currentPath }: { navigation: any[], currentPath: string }) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-gray-200">
        <Award className="h-8 w-8 text-primary-600" />
        <span className="ml-2 text-xl font-bold text-gradient">
          {t('app.title')}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = currentPath === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                isActive
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon
                className={`mr-3 flex-shrink-0 h-5 w-5 ${
                  isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                }`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;