export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'learner' | 'issuer' | 'employer' | 'admin';
  is_active: boolean;
  created_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: 'learner' | 'issuer' | 'employer';
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Credential {
  id: number;
  title: string;
  description: string;
  issuer_name: string;
  learner_name: string;
  issue_date: string;
  expiry_date?: string;
  status: 'issued' | 'revoked' | 'expired';
  verification_code: string;
  nsqf_level?: number;
  skills: string[];
  badge_template_id?: number;
}

export interface BadgeTemplate {
  id: number;
  name: string;
  description: string;
  badge_type: 'certification' | 'achievement' | 'skill';
  design_config: {
    background_color: string;
    text_color: string;
    border_color: string;
    logo_url?: string;
  };
  criteria: string;
  skills: string[];
  nsqf_level?: number;
  active: boolean;
  issuer_id: number;
}

export interface IssuerProfile {
  id: number;
  name: string;
  organization: string;
  contact_email: string;
  website?: string;
  description?: string;
  verified: boolean;
  user_id: number;
}

export interface EmployerProfile {
  id: number;
  company_name: string;
  industry: string;
  company_size?: string;
  location?: string;
  website?: string;
  description?: string;
  user_id: number;
}

export interface NSQFLevel {
  level: number;
  title: string;
  description: string;
  characteristics: string[];
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export interface DashboardStats {
  total_users: number;
  total_credentials: number;
  total_badge_templates: number;
  total_verifications: number;
  credentials_by_status: {
    issued: number;
    revoked: number;
    expired: number;
  };
  users_by_role: {
    learner: number;
    issuer: number;
    employer: number;
    admin: number;
  };
  skill_categories: string[];
  recent_activity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'credential_issued' | 'user_registered' | 'template_created' | 'verification';
  description: string;
  timestamp: string;
  user_name?: string;
}