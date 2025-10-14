from pydantic import BaseModel, EmailStr, Field, HttpUrl
from typing import Optional, List
from enum import Enum
from datetime import datetime

class UserRole(str, Enum):
    learner = "learner"
    issuer = "issuer"
    admin = "admin"
    employer = "employer"

class CredentialStatus(str, Enum):
    pending = "pending"
    issued = "issued"
    revoked = "revoked"
    verified = "verified"
    expired = "expired"

class BadgeType(str, Enum):
    certification = "certification"
    course_completion = "course_completion"
    skill_badge = "skill_badge"
    achievement = "achievement"
    license = "license"

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    role: UserRole
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    profile_image_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    public_profile: bool = True

class UserCreate(UserBase):
    password: str = Field(min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    profile_image_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    public_profile: Optional[bool] = None

class UserOut(UserBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# Issuer schemas
class IssuerBase(BaseModel):
    name: str
    organization: Optional[str] = None
    description: Optional[str] = None
    website: Optional[str] = None
    logo_url: Optional[str] = None
    industry: Optional[str] = None
    location: Optional[str] = None

class IssuerCreate(IssuerBase):
    pass

class IssuerUpdate(BaseModel):
    name: Optional[str] = None
    organization: Optional[str] = None
    description: Optional[str] = None
    website: Optional[str] = None
    logo_url: Optional[str] = None
    industry: Optional[str] = None
    location: Optional[str] = None

class IssuerOut(IssuerBase):
    id: int
    user_id: int
    verified: bool
    class Config:
        from_attributes = True

# Badge Template schemas (Credly-like)
class BadgeTemplateBase(BaseModel):
    name: str
    description: Optional[str] = None
    badge_type: BadgeType
    criteria: str
    skills: Optional[List[str]] = []
    image_url: Optional[str] = None
    estimated_duration: Optional[str] = None
    prerequisites: Optional[str] = None
    tags: Optional[List[str]] = []

class BadgeTemplateCreate(BadgeTemplateBase):
    pass

class BadgeTemplateUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    badge_type: Optional[BadgeType] = None
    criteria: Optional[str] = None
    skills: Optional[List[str]] = None
    image_url: Optional[str] = None
    estimated_duration: Optional[str] = None
    prerequisites: Optional[str] = None
    tags: Optional[List[str]] = None
    active: Optional[bool] = None

class BadgeTemplateOut(BadgeTemplateBase):
    id: int
    issuer_id: int
    active: bool
    created_at: datetime
    class Config:
        from_attributes = True

# Credential schemas
class CredentialBase(BaseModel):
    title: str
    description: Optional[str] = None
    skills: Optional[List[str]] = []
    skill_category: Optional[str] = None
    tags: Optional[List[str]] = []
    completion_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    evidence_url: Optional[str] = None
    is_public: bool = True

class CredentialCreate(CredentialBase):
    learner_email: str
    badge_template_id: Optional[int] = None

class CredentialIssue(BaseModel):
    """For issuing credentials based on badge templates"""
    learner_email: str
    badge_template_id: int
    completion_date: Optional[datetime] = None
    evidence_url: Optional[str] = None
    custom_message: Optional[str] = None

class CredentialUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    skills: Optional[List[str]] = None
    skill_category: Optional[str] = None
    tags: Optional[List[str]] = None
    completion_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    evidence_url: Optional[str] = None
    status: Optional[CredentialStatus] = None
    is_public: Optional[bool] = None

class CredentialOut(CredentialBase):
    id: int
    issuer_id: int
    learner_id: int
    badge_template_id: Optional[int] = None
    status: CredentialStatus
    verification_code: Optional[str] = None
    public_url: Optional[str] = None
    shared_on_linkedin: bool
    issued_at: datetime
    updated_at: Optional[datetime] = None
    nsqf_level: Optional[int] = None  # NSQF level from metadata
    issuer: Optional[str] = None  # Issuer name for frontend
    issue_date: Optional[datetime] = None  # Alias for issued_at
    verification_status: str = "verified"  # Default verification status
    credential_type: Optional[str] = None  # Type based on badge template
    class Config:
        from_attributes = True

class CredentialWithDetails(CredentialOut):
    issuer: IssuerOut
    badge_template: Optional[BadgeTemplateOut] = None
    learner_email: str
    learner_name: Optional[str] = None

class PublicCredential(BaseModel):
    """Public view of credential for verification"""
    id: int
    title: str
    description: Optional[str] = None
    skills: Optional[List[str]] = []
    skill_category: Optional[str] = None
    completion_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    issued_at: datetime
    status: CredentialStatus
    issuer: IssuerOut
    badge_template: Optional[BadgeTemplateOut] = None
    learner_name: Optional[str] = None
    verification_code: str

class CredentialShare(BaseModel):
    platform: str  # "linkedin", "email", "twitter", etc.

class CredentialShareCreate(BaseModel):
    platform: str  # "linkedin", "email", "twitter", etc.

class CredentialVerify(BaseModel):
    verification_code: str

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: Optional[int] = None
    role: Optional[UserRole] = None

# NSQF and National Qualification Framework schemas
class NSQFLevel(int, Enum):
    LEVEL_1 = 1
    LEVEL_2 = 2
    LEVEL_3 = 3
    LEVEL_4 = 4
    LEVEL_5 = 5
    LEVEL_6 = 6
    LEVEL_7 = 7
    LEVEL_8 = 8
    LEVEL_9 = 9
    LEVEL_10 = 10

class QualificationPathway(str, Enum):
    general = "general"
    vocational = "vocational"
    skill_based = "skill_based"

class VerificationMethod(str, Enum):
    blockchain = "blockchain"
    digilocker = "digilocker"
    skill_india_digital = "skill_india_digital"
    ncvet_registry = "ncvet_registry"
    manual = "manual"

# Enhanced credential schemas for NCVET compliance
class CredentialMetadata(BaseModel):
    nsqf_level: Optional[NSQFLevel] = None
    qualification_pathway: Optional[QualificationPathway] = None
    credit_hours: Optional[int] = None
    learning_outcomes: Optional[List[str]] = []
    assessment_criteria: Optional[List[str]] = []
    industry_alignment: Optional[List[str]] = []
    job_roles: Optional[List[str]] = []
    competency_framework: Optional[str] = None

class BlockchainVerification(BaseModel):
    blockchain_hash: Optional[str] = None
    transaction_id: Optional[str] = None
    verification_url: Optional[HttpUrl] = None
    verification_method: VerificationMethod = VerificationMethod.manual
    verified_at: Optional[datetime] = None
    verified_by: Optional[str] = None

# Employer portal schemas
class EmployerProfile(BaseModel):
    company_name: str = Field(..., max_length=200)
    industry: str = Field(..., max_length=100)
    company_size: str = Field(..., max_length=50)  # "startup", "sme", "large", "enterprise"
    location: str = Field(..., max_length=100)
    website: Optional[HttpUrl] = None
    description: Optional[str] = None
    cin_number: Optional[str] = None  # Corporate Identification Number
    gstin: Optional[str] = None  # GST Identification Number

class JobRequirement(BaseModel):
    job_title: str = Field(..., max_length=200)
    required_skills: List[str] = Field(..., min_items=1)
    preferred_skills: Optional[List[str]] = []
    min_nsqf_level: Optional[NSQFLevel] = None
    experience_years: Optional[int] = Field(None, ge=0)
    qualification_pathway: Optional[QualificationPathway] = None

class SkillMatch(BaseModel):
    skill_name: str
    match_percentage: float = Field(..., ge=0, le=100)
    evidence_credentials: List[int]  # credential IDs

class LearnerProfile(BaseModel):
    learner_id: int
    full_name: str
    email: str
    total_credentials: int
    nsqf_levels_achieved: List[NSQFLevel]
    skill_categories: List[str]
    top_skills: List[str]
    last_credential_date: Optional[datetime]
    profile_completeness: float = Field(..., ge=0, le=100)

class SkillGapAnalysis(BaseModel):
    job_requirement: JobRequirement
    learner_profile: LearnerProfile
    skill_matches: List[SkillMatch]
    overall_match_score: float = Field(..., ge=0, le=100)
    skill_gaps: List[str]
    recommended_credentials: List[str]

# Multi-language support schemas
class MultilingualContent(BaseModel):
    en: str  # English (required)
    hi: Optional[str] = None  # Hindi
    ta: Optional[str] = None  # Tamil
    te: Optional[str] = None  # Telugu
    bn: Optional[str] = None  # Bengali
    gu: Optional[str] = None  # Gujarati
    kn: Optional[str] = None  # Kannada
    ml: Optional[str] = None  # Malayalam
    mr: Optional[str] = None  # Marathi
    or_: Optional[str] = None  # Odia
    pa: Optional[str] = None  # Punjabi
    ur: Optional[str] = None  # Urdu

# API Integration schemas
class ExternalProvider(BaseModel):
    provider_name: str = Field(..., max_length=200)
    provider_type: str = Field(..., max_length=50)  # "university", "edtech", "training_center"
    api_endpoint: HttpUrl
    authentication_method: str = Field(..., max_length=50)  # "oauth", "api_key", "basic_auth"
    is_ncvet_recognized: bool = False
    trust_level: int = Field(..., ge=1, le=5)  # 1-5 trust rating
    supported_formats: List[str] = ["json", "xml"]

class CredentialImport(BaseModel):
    external_provider_id: int
    learner_email: str
    external_credential_id: str
    import_date: datetime
    mapping_confidence: float = Field(..., ge=0, le=1)
    requires_manual_review: bool = False

# Enhanced dashboard for national statistics
class NationalStats(BaseModel):
    total_credentials_issued: int
    total_active_learners: int
    total_issuers: int
    total_employers: int
    credentials_by_nsqf_level: dict  # {level: count}
    top_skill_categories: List[dict]  # [{category: str, count: int}]
    monthly_growth_rate: float
    state_wise_distribution: dict  # {state: count}

class RegulatorDashboard(BaseModel):
    national_stats: NationalStats
    compliance_metrics: dict
    verification_success_rate: float
    top_performing_issuers: List[dict]
    flagged_credentials: int
    pending_reviews: int

# Digital India integration schemas
class DigiLockerIntegration(BaseModel):
    digilocker_id: Optional[str] = None
    document_uri: Optional[str] = None
    verification_status: str = "pending"  # "pending", "verified", "failed"
    last_synced: Optional[datetime] = None

class SkillIndiaProfile(BaseModel):
    skill_india_id: Optional[str] = None
    linked_pmkvy_courses: Optional[List[str]] = []
    recognition_of_prior_learning: bool = False
    linked_apprenticeships: Optional[List[str]] = []
    verified_credentials: int
    public_credentials: int
    shared_credentials: int

# Dashboard schemas
class DashboardStats(BaseModel):
    total_credentials: int
    pending_credentials: int
    verified_credentials: int
    public_credentials: int
    shared_credentials: int

class LearnerDashboard(BaseModel):
    stats: DashboardStats
    recent_credentials: List[CredentialWithDetails]
    skill_categories: List[str]

class IssuerDashboard(BaseModel):
    stats: DashboardStats
    recent_issued: List[CredentialOut]
    badge_templates: List[BadgeTemplateOut]
    issuer_info: IssuerOut

class EmployerDashboard(BaseModel):
    recent_verifications: List[PublicCredential]
    popular_skills: List[str]
