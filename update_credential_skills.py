"""
Database script to add skills and NSQF level data to existing credentials
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.db import get_db, engine
from app import models
import json

# Skills mapping data
CREDENTIAL_SKILLS_MAPPING = {
    "python developer certification": {
        "skills": ["Python Programming", "Web Development", "API Development", "Database Management", "Problem Solving"],
        "nsqf_level": 6
    },
    "javascript intermediate": {
        "skills": ["JavaScript", "Frontend Development", "DOM Manipulation", "Asynchronous Programming", "Web APIs"],
        "nsqf_level": 5
    },
    "data science fundamentals": {
        "skills": ["Data Analysis", "Statistics", "Python", "Machine Learning", "Data Visualization"],
        "nsqf_level": 7
    },
    "leadership excellence badge": {
        "skills": ["Leadership", "Team Management", "Strategic Planning", "Communication", "Decision Making"],
        "nsqf_level": 8
    },
    "digital marketing specialist": {
        "skills": ["Digital Marketing", "SEO", "Social Media Marketing", "Content Marketing", "Analytics"],
        "nsqf_level": 6
    }
}

def get_skills_for_title(title):
    """Get skills for a credential title"""
    title_lower = title.lower()
    
    # Direct match
    if title_lower in CREDENTIAL_SKILLS_MAPPING:
        return CREDENTIAL_SKILLS_MAPPING[title_lower]
    
    # Keyword matching
    for key, data in CREDENTIAL_SKILLS_MAPPING.items():
        if any(word in title_lower for word in key.split()):
            return data
    
    # Default skills based on title keywords
    if "python" in title_lower:
        return {
            "skills": ["Python Programming", "Software Development", "Problem Solving"],
            "nsqf_level": 5
        }
    elif "javascript" in title_lower or "js" in title_lower:
        return {
            "skills": ["JavaScript", "Web Development", "Programming"],
            "nsqf_level": 5
        }
    elif "data" in title_lower:
        return {
            "skills": ["Data Analysis", "Statistics", "Analytics"],
            "nsqf_level": 6
        }
    elif "leadership" in title_lower or "management" in title_lower:
        return {
            "skills": ["Leadership", "Management", "Communication"],
            "nsqf_level": 7
        }
    elif "marketing" in title_lower:
        return {
            "skills": ["Marketing", "Digital Marketing", "Communication"],
            "nsqf_level": 6
        }
    elif "certificate" in title_lower or "certification" in title_lower:
        return {
            "skills": ["Professional Skills", "Industry Knowledge"],
            "nsqf_level": 5
        }
    
    # Ultimate fallback
    return {
        "skills": ["Professional Development", "Skill Building"],
        "nsqf_level": 4
    }

def update_credentials_with_skills():
    """Update existing credentials with skills and create metadata"""
    
    # Create database tables if they don't exist
    models.Base.metadata.create_all(bind=engine)
    
    db = next(get_db())
    
    try:
        # Get all existing credentials
        credentials = db.query(models.Credential).all()
        
        print(f"🔍 Found {len(credentials)} credentials to update")
        
        for credential in credentials:
            print(f"\n📋 Processing: {credential.title}")
            
            # Get skills data for this credential
            skills_data = get_skills_for_title(credential.title)
            
            # Update credential with skills
            credential.skills = skills_data["skills"]
            
            # Create or update credential metadata with NSQF level
            metadata = db.query(models.CredentialMetadata).filter(
                models.CredentialMetadata.credential_id == credential.id
            ).first()
            
            if not metadata:
                metadata = models.CredentialMetadata(
                    credential_id=credential.id,
                    nsqf_level=skills_data["nsqf_level"],
                    qualification_pathway="skill_based",
                    learning_outcomes=skills_data["skills"],
                    industry_alignment=["General"]
                )
                db.add(metadata)
            else:
                metadata.nsqf_level = skills_data["nsqf_level"]
                metadata.learning_outcomes = skills_data["skills"]
            
            print(f"   ✅ Added {len(skills_data['skills'])} skills")
            print(f"   📊 Set NSQF Level: {skills_data['nsqf_level']}")
            print(f"   🎯 Skills: {', '.join(skills_data['skills'])}")
        
        # Commit all changes
        db.commit()
        print(f"\n🎉 Successfully updated {len(credentials)} credentials!")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Updating Credentials with Skills and NSQF Data")
    print("=" * 60)
    update_credentials_with_skills()