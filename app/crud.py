from sqlalchemy.orm import Session, joinedload
from . import models, schemas, auth
from fastapi import HTTPException, status
from typing import List, Optional
import secrets
import string
import uuid

# User operations
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        email=user.email, 
        hashed_password=hashed_password, 
        role=user.role,
        first_name=user.first_name,
        last_name=user.last_name,
        profile_image_url=user.profile_image_url,
        linkedin_url=user.linkedin_url,
        public_profile=user.public_profile
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Issuer operations
def create_issuer(db: Session, issuer: schemas.IssuerCreate, user_id: int):
    db_issuer = models.Issuer(
        name=issuer.name,
        organization=issuer.organization,
        description=issuer.description,
        website=issuer.website,
        logo_url=issuer.logo_url,
        industry=issuer.industry,
        location=issuer.location,
        user_id=user_id
    )
    db.add(db_issuer)
    db.commit()
    db.refresh(db_issuer)
    return db_issuer

def get_issuer_by_user_id(db: Session, user_id: int):
    return db.query(models.Issuer).filter(models.Issuer.user_id == user_id).first()

def update_issuer(db: Session, issuer_id: int, issuer_update: schemas.IssuerUpdate):
    db_issuer = db.query(models.Issuer).filter(models.Issuer.id == issuer_id).first()
    if not db_issuer:
        return None
    
    update_data = issuer_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_issuer, field, value)
    
    db.commit()
    db.refresh(db_issuer)
    return db_issuer

# Badge Template operations (Credly-like)
def create_badge_template(db: Session, template: schemas.BadgeTemplateCreate, issuer_id: int):
    db_template = models.BadgeTemplate(
        name=template.name,
        description=template.description,
        badge_type=template.badge_type,
        criteria=template.criteria,
        skills=template.skills,
        image_url=template.image_url,
        estimated_duration=template.estimated_duration,
        prerequisites=template.prerequisites,
        tags=template.tags,
        issuer_id=issuer_id
    )
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    return db_template

def get_badge_templates_by_issuer(db: Session, issuer_id: int, active_only: bool = True):
    query = db.query(models.BadgeTemplate).filter(models.BadgeTemplate.issuer_id == issuer_id)
    if active_only:
        query = query.filter(models.BadgeTemplate.active == True)
    return query.all()

def get_badge_template(db: Session, template_id: int):
    return db.query(models.BadgeTemplate).filter(models.BadgeTemplate.id == template_id).first()

def update_badge_template(db: Session, template_id: int, template_update: schemas.BadgeTemplateUpdate):
    db_template = db.query(models.BadgeTemplate).filter(models.BadgeTemplate.id == template_id).first()
    if not db_template:
        return None
    
    update_data = template_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_template, field, value)
    
    db.commit()
    db.refresh(db_template)
    return db_template

# Credential operations
def generate_verification_code() -> str:
    """Generate a unique verification code for credentials"""
    return ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(8))

def generate_public_url() -> str:
    """Generate a unique public URL for credentials"""
    return str(uuid.uuid4())

def create_credential(db: Session, credential: schemas.CredentialCreate, issuer_id: int):
    # Find learner by email
    learner = get_user_by_email(db, credential.learner_email)
    if not learner:
        raise HTTPException(status_code=404, detail="Learner not found")
    
    if learner.role != models.UserRole.learner:
        raise HTTPException(status_code=400, detail="User is not a learner")
    
    # Generate unique codes
    verification_code = generate_verification_code()
    while db.query(models.Credential).filter(models.Credential.verification_code == verification_code).first():
        verification_code = generate_verification_code()
    
    public_url = generate_public_url()
    while db.query(models.Credential).filter(models.Credential.public_url == public_url).first():
        public_url = generate_public_url()
    
    db_credential = models.Credential(
        title=credential.title,
        description=credential.description,
        skills=credential.skills,
        skill_category=credential.skill_category,
        tags=credential.tags,
        completion_date=credential.completion_date,
        expiry_date=credential.expiry_date,
        evidence_url=credential.evidence_url,
        is_public=credential.is_public,
        learner_id=learner.id,
        issuer_id=issuer_id,
        badge_template_id=credential.badge_template_id,
        verification_code=verification_code,
        public_url=public_url,
        status=models.CredentialStatus.issued
    )
    db.add(db_credential)
    db.commit()
    db.refresh(db_credential)
    return db_credential

def issue_credential_from_template(db: Session, issue_data: schemas.CredentialIssue, issuer_id: int):
    # Find learner by email
    learner = get_user_by_email(db, issue_data.learner_email)
    if not learner:
        raise HTTPException(status_code=404, detail="Learner not found")
    
    if learner.role != models.UserRole.learner:
        raise HTTPException(status_code=400, detail="User is not a learner")
    
    # Get badge template
    template = get_badge_template(db, issue_data.badge_template_id)
    if not template or template.issuer_id != issuer_id:
        raise HTTPException(status_code=404, detail="Badge template not found")
    
    # Generate unique codes
    verification_code = generate_verification_code()
    while db.query(models.Credential).filter(models.Credential.verification_code == verification_code).first():
        verification_code = generate_verification_code()
    
    public_url = generate_public_url()
    while db.query(models.Credential).filter(models.Credential.public_url == public_url).first():
        public_url = generate_public_url()
    
    db_credential = models.Credential(
        title=template.name,
        description=template.description,
        skills=template.skills,
        skill_category=template.badge_type.value,
        tags=template.tags,
        completion_date=issue_data.completion_date,
        evidence_url=issue_data.evidence_url,
        is_public=True,
        learner_id=learner.id,
        issuer_id=issuer_id,
        badge_template_id=template.id,
        verification_code=verification_code,
        public_url=public_url,
        status=models.CredentialStatus.issued
    )
    db.add(db_credential)
    db.commit()
    db.refresh(db_credential)
    return db_credential

def get_credential(db: Session, credential_id: int):
    return db.query(models.Credential).options(
        joinedload(models.Credential.issuer),
        joinedload(models.Credential.badge_template)
    ).filter(models.Credential.id == credential_id).first()

def get_public_credential(db: Session, public_url: str):
    return db.query(models.Credential).options(
        joinedload(models.Credential.issuer),
        joinedload(models.Credential.badge_template)
    ).filter(
        models.Credential.public_url == public_url,
        models.Credential.is_public == True
    ).first()

def get_credentials_by_learner(db: Session, learner_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Credential).options(
        joinedload(models.Credential.issuer),
        joinedload(models.Credential.badge_template)
    ).filter(
        models.Credential.learner_id == learner_id
    ).offset(skip).limit(limit).all()

def get_public_credentials_by_learner(db: Session, learner_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Credential).options(
        joinedload(models.Credential.issuer),
        joinedload(models.Credential.badge_template)
    ).filter(
        models.Credential.learner_id == learner_id,
        models.Credential.is_public == True
    ).offset(skip).limit(limit).all()

def get_credentials_by_issuer(db: Session, issuer_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Credential).options(
        joinedload(models.Credential.badge_template)
    ).filter(
        models.Credential.issuer_id == issuer_id
    ).offset(skip).limit(limit).all()

def verify_credential(db: Session, verification_code: str):
    credential = db.query(models.Credential).options(
        joinedload(models.Credential.issuer),
        joinedload(models.Credential.badge_template)
    ).filter(models.Credential.verification_code == verification_code).first()
    
    if not credential:
        raise HTTPException(status_code=404, detail="Credential not found")
    
    # Update status to verified
    credential.status = models.CredentialStatus.verified
    db.commit()
    db.refresh(credential)
    return credential

def share_credential(db: Session, credential_id: int, platform: str, user_id: int):
    # Record the share
    share = models.CredentialShare(
        credential_id=credential_id,
        platform=platform,
        shared_by=user_id
    )
    db.add(share)
    
    # Update LinkedIn sharing flag if applicable
    if platform == "linkedin":
        credential = db.query(models.Credential).filter(models.Credential.id == credential_id).first()
        if credential:
            credential.shared_on_linkedin = True
    
    db.commit()
    return share

def record_credential_view(db: Session, credential_id: int, viewer_ip: str = None, user_agent: str = None):
    view = models.CredentialView(
        credential_id=credential_id,
        viewer_ip=viewer_ip,
        viewer_user_agent=user_agent
    )
    db.add(view)
    db.commit()
    return view

# Dashboard data
def get_learner_stats(db: Session, learner_id: int):
    total = db.query(models.Credential).filter(models.Credential.learner_id == learner_id).count()
    pending = db.query(models.Credential).filter(
        models.Credential.learner_id == learner_id,
        models.Credential.status == models.CredentialStatus.pending
    ).count()
    verified = db.query(models.Credential).filter(
        models.Credential.learner_id == learner_id,
        models.Credential.status == models.CredentialStatus.verified
    ).count()
    public = db.query(models.Credential).filter(
        models.Credential.learner_id == learner_id,
        models.Credential.is_public == True
    ).count()
    shared = db.query(models.Credential).filter(
        models.Credential.learner_id == learner_id,
        models.Credential.shared_on_linkedin == True
    ).count()
    
    return {
        "total_credentials": total,
        "pending_credentials": pending,
        "verified_credentials": verified,
        "public_credentials": public,
        "shared_credentials": shared
    }

def get_issuer_stats(db: Session, issuer_id: int):
    total = db.query(models.Credential).filter(models.Credential.issuer_id == issuer_id).count()
    pending = db.query(models.Credential).filter(
        models.Credential.issuer_id == issuer_id,
        models.Credential.status == models.CredentialStatus.pending
    ).count()
    verified = db.query(models.Credential).filter(
        models.Credential.issuer_id == issuer_id,
        models.Credential.status == models.CredentialStatus.verified
    ).count()
    public = db.query(models.Credential).filter(
        models.Credential.issuer_id == issuer_id,
        models.Credential.is_public == True
    ).count()
    shared = db.query(models.Credential).filter(
        models.Credential.issuer_id == issuer_id,
        models.Credential.shared_on_linkedin == True
    ).count()
    
    return {
        "total_credentials": total,
        "pending_credentials": pending,
        "verified_credentials": verified,
        "public_credentials": public,
        "shared_credentials": shared
    }

def get_skill_categories(db: Session, learner_id: int = None):
    """Get distinct skill categories for a learner or globally"""
    query = db.query(models.Credential.skill_category).distinct()
    if learner_id:
        query = query.filter(models.Credential.learner_id == learner_id)
    categories = [cat[0] for cat in query.all() if cat[0]]
    return categories

def get_popular_skills(db: Session, limit: int = 10):
    """Get most popular skills across all credentials"""
    # This would require more complex JSON aggregation in a real implementation
    # For now, return some sample skills
    return ["Python", "Project Management", "Data Analysis", "Communication", "Leadership"]
