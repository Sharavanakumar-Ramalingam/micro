import axios from 'axios';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types';

const API_BASE_URL = 'http://localhost:8000';

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const loginData = {
      email: credentials.username,
      password: credentials.password,
    };
    
    const response = await api.post('/api/v1/auth/login', loginData);
    return response.data;
  },

  register: async (userData: RegisterRequest) => {
    const response = await api.post('/api/v1/auth/signup', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/api/v1/auth/me');
    return response.data;
  },
};

export const credentialsAPI = {
  getAll: async () => {
    const response = await api.get('/api/v1/credentials');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/api/v1/credentials/${id}`);
    return response.data;
  },

  create: async (credentialData: any) => {
    const response = await api.post('/api/v1/credentials', credentialData);
    return response.data;
  },

  verify: async (verificationCode: string) => {
    const response = await api.post('/api/v1/verify', { verification_code: verificationCode });
    return response.data;
  },

  revoke: async (id: number) => {
    const response = await api.delete(`/api/v1/credentials/${id}`);
    return response.data;
  },
};

export const badgeTemplatesAPI = {
  getAll: async () => {
    const response = await api.get('/api/v1/badge-templates');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/api/v1/badge-templates/${id}`);
    return response.data;
  },

  create: async (templateData: any) => {
    const response = await api.post('/api/v1/badge-templates', templateData);
    return response.data;
  },

  update: async (id: number, templateData: any) => {
    const response = await api.put(`/api/v1/badge-templates/${id}`, templateData);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/api/v1/badge-templates/${id}`);
  },
};

export const profileAPI = {
  createIssuerProfile: async (profileData: any) => {
    const response = await api.post('/api/v1/issuers/profile', profileData);
    return response.data;
  },

  createEmployerProfile: async (profileData: any) => {
    const response = await api.post('/api/v1/employers/profile', profileData);
    return response.data;
  },

  getIssuerProfile: async () => {
    const response = await api.get('/api/v1/issuers/me');
    return response.data;
  },

  getEmployerProfile: async () => {
    const response = await api.get('/api/v1/employers/me');
    return response.data;
  },

  updateIssuerProfile: async (profileData: any) => {
    const response = await api.put('/api/v1/issuers/me', profileData);
    return response.data;
  },

  updateEmployerProfile: async (profileData: any) => {
    const response = await api.put('/api/v1/employers/me', profileData);
    return response.data;
  },
};

export const adminAPI = {
  getDashboardStats: async () => {
    const response = await api.get('/api/v1/admin/national-statistics');
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get('/api/v1/admin/users');
    return response.data;
  },

  verifyIssuer: async (issuerId: number) => {
    const response = await api.post(`/api/v1/admin/verify-issuer/${issuerId}`);
    return response.data;
  },
};

export const nsqfAPI = {
  getAllLevels: async () => {
    const response = await api.get('/api/v1/nsqf/levels');
    return response.data;
  },

  getLevel: async (level: number) => {
    const response = await api.get(`/api/v1/nsqf/levels/${level}`);
    return response.data;
  },

  validateCredential: async (credentialData: any) => {
    const response = await api.post('/api/v1/nsqf/validate-credential', credentialData);
    return response.data;
  },
};

export const multilingualAPI = {
  getSupportedLanguages: async () => {
    const response = await api.get('/api/v1/content/languages');
    return response.data;
  },

  getTranslations: async (language: string) => {
    const response = await api.get(`/api/v1/content/translations/${language}`);
    return response.data;
  },
};