#!/usr/bin/env python3
"""
Script to verify and display the sample data created for learner 'sharavanakumar'
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.models import *
from datetime import datetime

def verify_sample_data():
    """Verify the sample data and display statistics"""
    db = SessionLocal()
    
    try:
        print("🔍 Verifying sample data for learner 'sharavanakumar'...")
        print("=" * 60)
        
        # Get learner user
        learner_user = db.query(User).filter(User.email == "sharavanakumar@example.com").first()
        if not learner_user:
            print("❌ Learner user not found!")
            return
        
        print(f"👤 Learner Profile:")
        print(f"   Name: {learner_user.first_name} {learner_user.last_name}")
        print(f"   Email: {learner_user.email}")
        print(f"   Role: {learner_user.role}")
        print(f"   Public Profile: {learner_user.public_profile}")
        print(f"   LinkedIn: {learner_user.linkedin_url}")
        print()
        
        # Get credentials
        credentials = db.query(Credential).filter(Credential.learner_id == learner_user.id).all()
        print(f"📜 Credentials ({len(credentials)} total):")
        
        total_views = 0
        total_shares = 0
        
        for i, cred in enumerate(credentials, 1):
            # Get views and shares
            views_count = db.query(CredentialView).filter(CredentialView.credential_id == cred.id).count()
            shares_count = db.query(CredentialShare).filter(CredentialShare.credential_id == cred.id).count()
            
            # Get metadata
            metadata = db.query(CredentialMetadata).filter(CredentialMetadata.credential_id == cred.id).first()
            nsqf_level = metadata.nsqf_level if metadata else "N/A"
            
            # Get blockchain verification
            blockchain_verify = db.query(BlockchainVerification).filter(
                BlockchainVerification.credential_id == cred.id
            ).first()
            
            total_views += views_count
            total_shares += shares_count
            
            print(f"   {i}. {cred.title}")
            print(f"      📅 Issued: {cred.issued_at.strftime('%Y-%m-%d')}")
            print(f"      ✅ Status: {cred.status}")
            print(f"      🎯 NSQF Level: {nsqf_level}")
            print(f"      👀 Views: {views_count}")
            print(f"      📤 Shares: {shares_count}")
            print(f"      🔗 Verification Code: {cred.verification_code}")
            print(f"      🌐 Public URL: {cred.public_url}")
            print(f"      🔗 Evidence: {cred.evidence_url}")
            if blockchain_verify:
                print(f"      ⛓️  Blockchain Verified: ✅")
            print(f"      🏷️  Skills: {', '.join(cred.skills) if cred.skills else 'None'}")
            print()
        
        # Get issuers
        issuers = db.query(Issuer).all()
        print(f"🏢 Issuers ({len(issuers)} total):")
        for issuer in issuers:
            cred_count = db.query(Credential).filter(Credential.issuer_id == issuer.id).count()
            print(f"   • {issuer.name} ({issuer.organization}) - {cred_count} credentials issued")
        print()
        
        # Get badge templates
        templates = db.query(BadgeTemplate).all()
        print(f"🎖️  Badge Templates ({len(templates)} total):")
        for template in templates:
            cred_count = db.query(Credential).filter(Credential.badge_template_id == template.id).count()
            print(f"   • {template.name} ({template.badge_type}) - {cred_count} credentials")
        print()
        
        # Statistics summary
        print("📊 Statistics Summary:")
        print(f"   Total Credentials: {len(credentials)}")
        print(f"   Total Views: {total_views}")
        print(f"   Total Shares: {total_shares}")
        print(f"   Total Issuers: {len(issuers)}")
        print(f"   Total Badge Templates: {len(templates)}")
        
        # NSQF Level distribution
        nsqf_distribution = {}
        for cred in credentials:
            metadata = db.query(CredentialMetadata).filter(CredentialMetadata.credential_id == cred.id).first()
            if metadata and metadata.nsqf_level:
                level = metadata.nsqf_level
                nsqf_distribution[level] = nsqf_distribution.get(level, 0) + 1
        
        if nsqf_distribution:
            print(f"   NSQF Level Distribution: {nsqf_distribution}")
        
        # Skill categories
        skill_categories = {}
        for cred in credentials:
            if cred.skill_category:
                skill_categories[cred.skill_category] = skill_categories.get(cred.skill_category, 0) + 1
        
        if skill_categories:
            print(f"   Skill Categories: {skill_categories}")
        
        # Verification status
        blockchain_verified = db.query(BlockchainVerification).filter(
            BlockchainVerification.verification_status == "verified"
        ).count()
        
        print(f"   Blockchain Verified Credentials: {blockchain_verified}")
        
        # Skill India profile
        skill_profile = db.query(SkillIndiaProfile).filter(
            SkillIndiaProfile.user_id == learner_user.id
        ).first()
        
        if skill_profile:
            print(f"   Skill India Profile: ✅ (ID: {skill_profile.skill_india_id})")
            print(f"   PMKVY Courses: {len(skill_profile.linked_pmkvy_courses) if skill_profile.linked_pmkvy_courses else 0}")
        
        # Multilingual content
        multilingual_count = db.query(MultilingualContent).count()
        if multilingual_count > 0:
            print(f"   Multilingual Translations: {multilingual_count}")
        
        print()
        print("🎉 Data verification completed successfully!")
        print()
        print("🚀 Ready to test the application!")
        print("   1. Start the backend: python run.py")
        print("   2. Start the frontend: cd frontend && npm run dev")
        print("   3. Login with: sharavanakumar@example.com / password123")
        print("   4. Explore the learner dashboard with real data!")
        
    except Exception as e:
        print(f"❌ Error verifying sample data: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    verify_sample_data()