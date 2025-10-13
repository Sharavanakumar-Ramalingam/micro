import { createContext, useContext, useState, ReactNode } from 'react';
import { Language } from '../types';

// Supported Indian languages
const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
];

// Basic translations for common UI elements
const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    'app.title': 'MicroMerge',
    'nav.dashboard': 'Dashboard',
    'nav.credentials': 'Credentials',
    'nav.badges': 'Badge Templates',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.firstName': 'First Name',
    'auth.lastName': 'Last Name',
    'auth.role': 'Role',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.loading': 'Loading...',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'role.learner': 'Learner',
    'role.issuer': 'Issuer',
    'role.employer': 'Employer',
    'role.admin': 'Administrator',
  },
  hi: {
    'app.title': 'माइक्रोमर्ज',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.credentials': 'प्रमाण पत्र',
    'nav.badges': 'बैज टेम्प्लेट',
    'nav.profile': 'प्रोफ़ाइल',
    'nav.logout': 'लॉग आउट',
    'auth.login': 'लॉगिन',
    'auth.register': 'पंजीकरण',
    'auth.email': 'ईमेल',
    'auth.password': 'पासवर्ड',
    'auth.firstName': 'पहला नाम',
    'auth.lastName': 'अंतिम नाम',
    'auth.role': 'भूमिका',
    'common.save': 'सेव',
    'common.cancel': 'रद्द करें',
    'common.delete': 'हटाएं',
    'common.edit': 'संपादित करें',
    'common.view': 'देखें',
    'common.loading': 'लोड हो रहा है...',
    'common.search': 'खोजें',
    'common.filter': 'फिल्टर',
    'role.learner': 'शिक्षार्थी',
    'role.issuer': 'जारीकर्ता',
    'role.employer': 'नियोक्ता',
    'role.admin': 'प्रशासक',
  },
  // Add more translations as needed
};

interface LanguageContextType {
  currentLanguage: Language;
  setCurrentLanguage: (language: Language) => void;
  supportedLanguages: Language[];
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [currentLanguage, setCurrentLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('selectedLanguage');
    if (saved) {
      return JSON.parse(saved);
    }
    return SUPPORTED_LANGUAGES[0]; // Default to English
  });

  const setCurrentLanguage = (language: Language) => {
    setCurrentLanguageState(language);
    localStorage.setItem('selectedLanguage', JSON.stringify(language));
  };

  const t = (key: string): string => {
    const translations = TRANSLATIONS[currentLanguage.code];
    return translations?.[key] || TRANSLATIONS.en[key] || key;
  };

  const isRTL = false; // None of the supported Indian languages use RTL

  const value = {
    currentLanguage,
    setCurrentLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
    t,
    isRTL,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};