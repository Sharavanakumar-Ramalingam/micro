from fastapi import FastAPI, Depends, HTTPException, status, Request, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, schemas, crud, auth
from .db import get_db, engine
from typing import List, Optional
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="MicroMerge API", description="Centralized micro-credential aggregator platform", version="1.0.0")

# CORS middleware
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
models.Base.metadata.create_all(bind=engine)

# Security
security = HTTPBearer()

# Health check
@app.get("/health")
def health():
    return {"status": "ok", "message": "MicroMerge API is running"}

# Authentication endpoints
@app.post("/api/v1/auth/signup", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = crud.create_user(db=db, user=user)
    
    # Auto-create issuer profile if user is an issuer
    if user.role == models.UserRole.issuer:
        issuer_data = schemas.IssuerCreate(
            name=f"{user.first_name} {user.last_name}" if user.first_name and user.last_name else user.email,
            organization=user.first_name or "Organization"
        )
        crud.create_issuer(db, issuer_data, new_user.id)
    
    return new_user

@app.post("/api/v1/auth/login")
def login(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    """Login user and return access token"""
    user = crud.get_user_by_email(db, email=user_credentials.email)
    if not user or not auth.verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = auth.create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer", "user": schemas.UserOut.from_orm(user)}

@app.get("/api/v1/auth/me", response_model=schemas.UserOut)
def get_current_user_profile(current_user: models.User = Depends(auth.get_current_user)):
    """Get current user profile"""
    return current_user

# User management
@app.put("/api/v1/users/profile", response_model=schemas.UserOut)
def update_profile(
    profile_update: schemas.UserUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile"""
    update_data = profile_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    return current_user

# Badge Template management (Credly-like)
@app.post("/api/v1/badge-templates", response_model=schemas.BadgeTemplateOut)
def create_badge_template(
    template: schemas.BadgeTemplateCreate,
    current_user: models.User = Depends(auth.require_role([models.UserRole.issuer])),
    db: Session = Depends(get_db)
):
    """Create a new badge template"""
    issuer = crud.get_issuer_by_user_id(db, current_user.id)
    if not issuer:
        raise HTTPException(status_code=404, detail="Issuer profile not found")
    return crud.create_badge_template(db=db, template=template, issuer_id=issuer.id)

@app.get("/api/v1/badge-templates", response_model=List[schemas.BadgeTemplateOut])
def get_my_badge_templates(
    active_only: bool = True,
    current_user: models.User = Depends(auth.require_role([models.UserRole.issuer])),
    db: Session = Depends(get_db)
):
    """Get badge templates for current issuer"""
    issuer = crud.get_issuer_by_user_id(db, current_user.id)
    if not issuer:
        raise HTTPException(status_code=404, detail="Issuer profile not found")
    return crud.get_badge_templates_by_issuer(db=db, issuer_id=issuer.id, active_only=active_only)

# Credential management - Issue from template (Credly-like)
@app.post("/api/v1/credentials/issue", response_model=schemas.CredentialOut)
def issue_credential_from_template(
    issue_data: schemas.CredentialIssue,
    current_user: models.User = Depends(auth.require_role([models.UserRole.issuer])),
    db: Session = Depends(get_db)
):
    """Issue a credential from a badge template"""
    issuer = crud.get_issuer_by_user_id(db, current_user.id)
    if not issuer:
        raise HTTPException(status_code=404, detail="Issuer profile not found")
    return crud.issue_credential_from_template(db=db, issue_data=issue_data, issuer_id=issuer.id)

# Public credential verification and viewing
@app.get("/public/credentials/{public_url}", response_model=schemas.PublicCredential)
def view_public_credential(
    public_url: str,
    request: Request,
    db: Session = Depends(get_db)
):
    """View a public credential"""
    credential = crud.get_public_credential(db, public_url)
    if not credential:
        raise HTTPException(status_code=404, detail="Public credential not found")
    
    # Record the view
    client_ip = request.client.host
    user_agent = request.headers.get("user-agent")
    crud.record_credential_view(db, credential.id, client_ip, user_agent)
    
    return schemas.PublicCredential.from_orm(credential)

@app.post("/api/v1/credentials/{credential_id}/share")
def share_credential(
    credential_id: int,
    share_data: schemas.CredentialShareCreate,
    current_user: models.User = Depends(auth.require_role([models.UserRole.learner])),
    db: Session = Depends(get_db)
):
    """Share a credential on social platforms"""
    credential = crud.get_credential(db, credential_id)
    if not credential:
        raise HTTPException(status_code=404, detail="Credential not found")
    
    if credential.learner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to share this credential")
    
    share = crud.share_credential(db, credential_id, share_data.platform, current_user.id)
    return {"message": "Credential shared successfully", "share_id": share.id}

# Issuer endpoints
@app.get("/api/v1/issuers/me", response_model=schemas.IssuerOut)
def get_my_issuer_profile(
    current_user: models.User = Depends(auth.require_role([schemas.UserRole.issuer])),
    db_sess: Session = Depends(get_db)
):
    issuer = crud.get_issuer_by_user_id(db_sess, current_user.id)
    if not issuer:
        raise HTTPException(status_code=404, detail="Issuer profile not found")
    return issuer

@app.put("/api/v1/issuers/me", response_model=schemas.IssuerOut)
def update_my_issuer_profile(
    issuer_update: schemas.IssuerUpdate,
    current_user: models.User = Depends(auth.require_role([schemas.UserRole.issuer])),
    db_sess: Session = Depends(get_db)
):
    issuer = crud.get_issuer_by_user_id(db_sess, current_user.id)
    if not issuer:
        raise HTTPException(status_code=404, detail="Issuer profile not found")
    
    updated_issuer = crud.update_issuer(db_sess, issuer.id, issuer_update)
    return updated_issuer

# Credential endpoints
@app.post("/api/v1/credentials", response_model=schemas.CredentialOut)
def issue_credential(
    credential: schemas.CredentialCreate,
    current_user: models.User = Depends(auth.require_role([schemas.UserRole.issuer, schemas.UserRole.admin])),
    db_sess: Session = Depends(get_db)
):
    # Get issuer profile
    issuer = crud.get_issuer_by_user_id(db_sess, current_user.id)
    if not issuer:
        raise HTTPException(status_code=404, detail="Issuer profile not found")
    
    return crud.create_credential(db_sess, credential, issuer.id)

@app.get("/api/v1/credentials", response_model=List[schemas.CredentialOut])
def get_my_credentials(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user: models.User = Depends(auth.get_current_user),
    db_sess: Session = Depends(get_db)
):
    if current_user.role == schemas.UserRole.learner:
        return crud.get_credentials_by_learner(db_sess, current_user.id, skip, limit)
    elif current_user.role == schemas.UserRole.issuer:
        issuer = crud.get_issuer_by_user_id(db_sess, current_user.id)
        if not issuer:
            raise HTTPException(status_code=404, detail="Issuer profile not found")
        return crud.get_credentials_by_issuer(db_sess, issuer.id, skip, limit)
    else:
        raise HTTPException(status_code=403, detail="Access denied")

@app.get("/api/v1/credentials/{credential_id}", response_model=schemas.CredentialOut)
def get_credential(
    credential_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db_sess: Session = Depends(get_db)
):
    credential = crud.get_credential(db_sess, credential_id)
    if not credential:
        raise HTTPException(status_code=404, detail="Credential not found")
    
    # Check access permissions
    if current_user.role == schemas.UserRole.learner and credential.learner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    elif current_user.role == schemas.UserRole.issuer:
        issuer = crud.get_issuer_by_user_id(db_sess, current_user.id)
        if not issuer or credential.issuer_id != issuer.id:
            raise HTTPException(status_code=403, detail="Access denied")
    
    return credential

@app.put("/api/v1/credentials/{credential_id}", response_model=schemas.CredentialOut)
def update_credential(
    credential_id: int,
    credential_update: schemas.CredentialUpdate,
    current_user: models.User = Depends(auth.require_role([schemas.UserRole.issuer, schemas.UserRole.admin])),
    db_sess: Session = Depends(get_db)
):
    credential = crud.get_credential(db_sess, credential_id)
    if not credential:
        raise HTTPException(status_code=404, detail="Credential not found")
    
    # Check if issuer owns this credential
    if current_user.role == schemas.UserRole.issuer:
        issuer = crud.get_issuer_by_user_id(db_sess, current_user.id)
        if not issuer or credential.issuer_id != issuer.id:
            raise HTTPException(status_code=403, detail="Access denied")
    
    updated_credential = crud.update_credential(db_sess, credential_id, credential_update)
    return updated_credential

@app.delete("/api/v1/credentials/{credential_id}")
def delete_credential(
    credential_id: int,
    current_user: models.User = Depends(auth.require_role([schemas.UserRole.issuer, schemas.UserRole.admin])),
    db_sess: Session = Depends(get_db)
):
    credential = crud.get_credential(db_sess, credential_id)
    if not credential:
        raise HTTPException(status_code=404, detail="Credential not found")
    
    # Check if issuer owns this credential
    if current_user.role == schemas.UserRole.issuer:
        issuer = crud.get_issuer_by_user_id(db_sess, current_user.id)
        if not issuer or credential.issuer_id != issuer.id:
            raise HTTPException(status_code=403, detail="Access denied")
    
    if crud.delete_credential(db_sess, credential_id):
        return {"message": "Credential deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Credential not found")

# Verification endpoint (public)
@app.post("/api/v1/verify", response_model=schemas.CredentialOut)
def verify_credential(
    verification_data: schemas.CredentialVerify,
    db_sess: Session = Depends(get_db)
):
    return crud.verify_credential(db_sess, verification_data.verification_code)

# Dashboard endpoints
@app.get("/api/v1/dashboard/learner", response_model=schemas.LearnerDashboard)
def get_learner_dashboard(
    current_user: models.User = Depends(auth.require_role([schemas.UserRole.learner])),
    db_sess: Session = Depends(get_db)
):
    stats = crud.get_learner_stats(db_sess, current_user.id)
    recent_credentials = crud.get_credentials_by_learner(db_sess, current_user.id, 0, 5)
    
    # Add issuer details to credentials
    credentials_with_details = []
    for cred in recent_credentials:
        cred_dict = {
            **cred.__dict__,
            "issuer": cred.issuer,
            "learner_email": current_user.email
        }
        credentials_with_details.append(cred_dict)
    
    # Get skill categories from user's credentials
    skill_categories = []
    for cred in recent_credentials:
        if cred.skills:
            skill_categories.extend(cred.skills)
    skill_categories = list(set(skill_categories))  # Remove duplicates
    
    return {
        "stats": stats,
        "recent_credentials": credentials_with_details,
        "skill_categories": skill_categories
    }

@app.get("/api/v1/dashboard/issuer", response_model=schemas.IssuerDashboard)
def get_issuer_dashboard(
    current_user: models.User = Depends(auth.require_role([schemas.UserRole.issuer])),
    db_sess: Session = Depends(get_db)
):
    issuer = crud.get_issuer_by_user_id(db_sess, current_user.id)
    if not issuer:
        raise HTTPException(status_code=404, detail="Issuer profile not found")
    
    stats = crud.get_issuer_stats(db_sess, issuer.id)
    recent_issued = crud.get_credentials_by_issuer(db_sess, issuer.id, 0, 5)
    
    # Get badge templates for the issuer
    badge_templates = crud.get_badge_templates_by_issuer(db_sess, issuer.id, active_only=False)
    
    return {
        "stats": stats,
        "recent_issued": recent_issued,
        "badge_templates": badge_templates,
        "issuer_info": issuer
    }

# NCVET and National Framework Endpoints

# Employer Portal Endpoints
@app.post("/api/v1/employers/profile")
def create_employer_profile(
    profile: schemas.EmployerProfile,
    current_user: models.User = Depends(auth.require_role([models.UserRole.employer])),
    db: Session = Depends(get_db)
):
    """Create employer profile for job matching and verification"""
    existing_profile = db.query(models.EmployerProfile).filter(models.EmployerProfile.user_id == current_user.id).first()
    if existing_profile:
        raise HTTPException(status_code=400, detail="Employer profile already exists")
    
    profile_data = profile.dict()
    # Convert URL object to string if present
    if 'website' in profile_data and profile_data['website'] is not None:
        profile_data['website'] = str(profile_data['website'])
    
    db_profile = models.EmployerProfile(
        user_id=current_user.id,
        **profile_data
    )
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

@app.get("/api/v1/nsqf/levels")
def get_nsqf_levels():
    """Get all NSQF levels and their descriptions"""
    nsqf_levels = {
        1: {"description": "Job role related to processes that are routine, predictable", "example": "Mason Helper, Data Entry Operator"},
        2: {"description": "Job role related to well defined routine activities", "example": "Retail Trainee, General Assistant"},
        3: {"description": "Job role that requires some responsibility for quality", "example": "Sales Associate, Healthcare Assistant"},
        4: {"description": "Job role that requires responsibility for quality and guidance", "example": "Sales Executive, Lab Assistant"},
        5: {"description": "Job role involving broad range of activities", "example": "Assistant Manager, Junior Engineer"},
        6: {"description": "Job role involving technical knowledge in specialized areas", "example": "Manager, Software Developer"},
        7: {"description": "Job role requiring wide ranging technical knowledge", "example": "Senior Manager, System Analyst"},
        8: {"description": "Job role involving comprehension across broad variety", "example": "General Manager, Principal Engineer"},
        9: {"description": "Job role involving understanding of broad information", "example": "Deputy GM, Senior Consultant"},
        10: {"description": "Job role requiring understanding across unpredictable variety", "example": "CEO, Chief Architect"}
    }
    return {"nsqf_levels": nsqf_levels}

@app.get("/api/v1/admin/national-statistics")
def get_national_statistics(
    current_user: models.User = Depends(auth.require_role([models.UserRole.admin])),
    db: Session = Depends(get_db)
):
    """Get national-level statistics for regulatory reporting"""
    total_credentials = db.query(models.Credential).count()
    total_learners = db.query(models.User).filter(models.User.role == models.UserRole.learner).count()
    total_issuers = db.query(models.User).filter(models.User.role == models.UserRole.issuer).count()
    total_employers = db.query(models.User).filter(models.User.role == models.UserRole.employer).count()
    
    return {
        "total_credentials_issued": total_credentials,
        "total_active_learners": total_learners,
        "total_issuers": total_issuers,
        "total_employers": total_employers,
        "credentials_by_nsqf_level": {},
        "top_skill_categories": [],
        "monthly_growth_rate": 0.0,
        "state_wise_distribution": {}
    }

@app.get("/api/v1/content/languages")
def get_supported_languages():
    """Get list of supported languages for multilingual content"""
    return {
        "supported_languages": {
            "en": "English",
            "hi": "हिंदी (Hindi)",
            "ta": "தமிழ் (Tamil)",
            "te": "తెలుగు (Telugu)",
            "bn": "বাংলা (Bengali)",
            "gu": "ગુજરાતી (Gujarati)",
            "kn": "ಕನ್ನಡ (Kannada)",
            "ml": "മലയാളം (Malayalam)",
            "mr": "मराठी (Marathi)",
            "or": "ଓଡ଼ିଆ (Odia)",
            "pa": "ਪੰਜਾਬੀ (Punjabi)",
            "ur": "اردو (Urdu)"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
