from sqlalchemy import Column, Integer, String, ForeignKey, Enum, DateTime, func, Text, Boolean, JSON, Date, Float, Index
from sqlalchemy.orm import relationship
from .db import Base
import enum

class UserRole(str, enum.Enum):
    learner = "learner"
    issuer = "issuer"
    employer = "employer"
    admin = "admin"

class CredentialStatus(str, enum.Enum):
    pending = "pending"
    issued = "issued"
    revoked = "revoked"
    verified = "verified"
    expired = "expired"

class BadgeType(str, enum.Enum):
    certification = "certification"
    course_completion = "course_completion"
    skill_badge = "skill_badge"
    achievement = "achievement"
    license = "license"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    profile_image_url = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    public_profile = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    issuer = relationship("Issuer", back_populates="user", uselist=False)
    
class Issuer(Base):
    __tablename__ = "issuers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    organization = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    website = Column(String, nullable=True)
    logo_url = Column(String, nullable=True)
    verified = Column(Boolean, default=False)
    industry = Column(String, nullable=True)
    location = Column(String, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    user = relationship("User", back_populates="issuer")
    credentials = relationship("Credential", back_populates="issuer")
    badge_templates = relationship("BadgeTemplate", back_populates="issuer")

class BadgeTemplate(Base):
    __tablename__ = "badge_templates"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    badge_type = Column(Enum(BadgeType), nullable=False)
    criteria = Column(Text, nullable=False)  # What the learner must do to earn this
    skills = Column(JSON, nullable=True)  # List of skills this badge represents
    image_url = Column(String, nullable=True)
    estimated_duration = Column(String, nullable=True)  # e.g., "40 hours", "6 months"
    prerequisites = Column(Text, nullable=True)
    tags = Column(JSON, nullable=True)  # Array of tags
    active = Column(Boolean, default=True)
    issuer_id = Column(Integer, ForeignKey("issuers.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    issuer = relationship("Issuer", back_populates="badge_templates")
    credentials = relationship("Credential", back_populates="badge_template")

class Credential(Base):
    __tablename__ = "credentials"
    id = Column(Integer, primary_key=True, index=True)
    learner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    issuer_id = Column(Integer, ForeignKey("issuers.id"), nullable=False)
    badge_template_id = Column(Integer, ForeignKey("badge_templates.id"), nullable=True)
    
    # Basic Info
    title = Column(String, nullable=False)
    description = Column(Text)
    
    # Credly-like features
    public_url = Column(String, unique=True, nullable=True)  # Public shareable URL
    verification_code = Column(String, unique=True, nullable=True)  # For verification
    evidence_url = Column(String, nullable=True)  # Link to portfolio/evidence
    
    # Skills and Categories
    skills = Column(JSON, nullable=True)  # Array of skills
    skill_category = Column(String, nullable=True)
    tags = Column(JSON, nullable=True)  # Array of tags
    
    # Dates
    completion_date = Column(DateTime(timezone=True), nullable=True)
    expiry_date = Column(DateTime(timezone=True), nullable=True)
    issued_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Status and Sharing
    status = Column(Enum(CredentialStatus), default=CredentialStatus.issued)
    is_public = Column(Boolean, default=True)
    shared_on_linkedin = Column(Boolean, default=False)
    
    # Relationships
    issuer = relationship("Issuer", back_populates="credentials")
    badge_template = relationship("BadgeTemplate", back_populates="credentials")
    
class CredentialShare(Base):
    __tablename__ = "credential_shares"
    id = Column(Integer, primary_key=True, index=True)
    credential_id = Column(Integer, ForeignKey("credentials.id"), nullable=False)
    platform = Column(String, nullable=False)  # "linkedin", "email", "twitter", etc.
    shared_at = Column(DateTime(timezone=True), server_default=func.now())
    shared_by = Column(Integer, ForeignKey("users.id"), nullable=False)

class CredentialView(Base):
    __tablename__ = "credential_views"
    id = Column(Integer, primary_key=True, index=True)
    credential_id = Column(Integer, ForeignKey("credentials.id"), nullable=False)
    viewer_ip = Column(String, nullable=True)
    viewer_user_agent = Column(String, nullable=True)
    viewed_at = Column(DateTime(timezone=True), server_default=func.now())

# NCVET and National Framework Models
class ExternalProvider(Base):
    """External credential providers (universities, training centers, EdTech platforms)"""
    __tablename__ = "external_providers"
    
    id = Column(Integer, primary_key=True, index=True)
    provider_name = Column(String(200), nullable=False)
    provider_type = Column(String(50), nullable=False)  # university, edtech, training_center
    api_endpoint = Column(String(500))
    authentication_method = Column(String(50))
    is_ncvet_recognized = Column(Boolean, default=False)
    trust_level = Column(Integer, default=3)  # 1-5 rating
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Boolean, default=True)

class EmployerProfile(Base):
    """Employer profiles for job matching and verification"""
    __tablename__ = "employer_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    company_name = Column(String(200), nullable=False)
    industry = Column(String(100))
    company_size = Column(String(50))  # startup, sme, large, enterprise
    location = Column(String(100))
    website = Column(String(500))
    description = Column(Text)
    cin_number = Column(String(50))  # Corporate Identification Number
    gstin = Column(String(50))  # GST Identification Number
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class JobRequirement(Base):
    """Job requirements posted by employers"""
    __tablename__ = "job_requirements"
    
    id = Column(Integer, primary_key=True, index=True)
    employer_id = Column(Integer, ForeignKey("employer_profiles.id"))
    job_title = Column(String(200), nullable=False)
    required_skills = Column(JSON)  # List of required skills
    preferred_skills = Column(JSON)  # List of preferred skills
    min_nsqf_level = Column(Integer)  # Minimum NSQF level (1-10)
    experience_years = Column(Integer, default=0)
    qualification_pathway = Column(String(50))  # general, vocational, skill_based
    job_description = Column(Text)
    salary_range = Column(String(100))
    location = Column(String(100))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class CredentialMetadata(Base):
    """Enhanced metadata for credentials aligned with NSQF"""
    __tablename__ = "credential_metadata"
    
    id = Column(Integer, primary_key=True, index=True)
    credential_id = Column(Integer, ForeignKey("credentials.id"), unique=True)
    nsqf_level = Column(Integer)  # 1-10 NSQF levels
    qualification_pathway = Column(String(50))  # general, vocational, skill_based
    credit_hours = Column(Integer)
    learning_outcomes = Column(JSON)  # List of learning outcomes
    assessment_criteria = Column(JSON)  # List of assessment criteria
    industry_alignment = Column(JSON)  # List of aligned industries
    job_roles = Column(JSON)  # List of relevant job roles
    competency_framework = Column(String(200))
    prerequisite_qualifications = Column(JSON)
    stackable_with = Column(JSON)  # IDs of stackable credentials
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class BlockchainVerification(Base):
    """Blockchain-based credential verification"""
    __tablename__ = "blockchain_verifications"
    
    id = Column(Integer, primary_key=True, index=True)
    credential_id = Column(Integer, ForeignKey("credentials.id"))
    blockchain_hash = Column(String(128))
    transaction_id = Column(String(128))
    verification_url = Column(String(500))
    verification_method = Column(String(50))  # blockchain, digilocker, skill_india_digital
    verified_at = Column(DateTime(timezone=True))
    verified_by = Column(String(200))
    verification_status = Column(String(20), default="pending")  # pending, verified, failed
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class DigiLockerIntegration(Base):
    """Integration with DigiLocker for document verification"""
    __tablename__ = "digilocker_integrations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    credential_id = Column(Integer, ForeignKey("credentials.id"))
    digilocker_id = Column(String(100))
    document_uri = Column(String(500))
    verification_status = Column(String(20), default="pending")
    last_synced = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SkillIndiaProfile(Base):
    """Integration with Skill India Digital platform"""
    __tablename__ = "skill_india_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    skill_india_id = Column(String(100))
    linked_pmkvy_courses = Column(JSON)  # List of PMKVY course IDs
    recognition_of_prior_learning = Column(Boolean, default=False)
    linked_apprenticeships = Column(JSON)  # List of apprenticeship IDs
    last_synced = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class NationalStatistics(Base):
    """Track national-level statistics for regulatory reporting"""
    __tablename__ = "national_statistics"
    
    id = Column(Integer, primary_key=True, index=True)
    report_date = Column(Date, nullable=False)
    total_credentials_issued = Column(Integer, default=0)
    total_active_learners = Column(Integer, default=0)
    total_issuers = Column(Integer, default=0)
    total_employers = Column(Integer, default=0)
    credentials_by_nsqf_level = Column(JSON)  # {level: count}
    top_skill_categories = Column(JSON)  # [{category: str, count: int}]
    state_wise_distribution = Column(JSON)  # {state: count}
    monthly_growth_rate = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class MultilingualContent(Base):
    """Support for multilingual content"""
    __tablename__ = "multilingual_content"
    
    id = Column(Integer, primary_key=True, index=True)
    content_type = Column(String(50))  # credential_title, credential_description, skill_name
    content_id = Column(String(50))  # ID of the content being translated
    language_code = Column(String(5))  # en, hi, ta, te, bn, gu, kn, ml, mr, or, pa, ur
    translated_text = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
