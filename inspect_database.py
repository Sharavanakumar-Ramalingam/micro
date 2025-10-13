"""
Database Content Inspector for MicroMerge
Check what data has been stored in the database during testing
"""
import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import json
from datetime import datetime

# Add the app directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.models import *
from app.db import get_db, engine
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def inspect_database():
    """Inspect all tables and show their contents"""
    print("🔍 MicroMerge Database Content Inspector")
    print("=" * 60)
    
    # Create session
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # 1. Check Users table
        print("\n👥 USERS TABLE:")
        users = db.query(User).all()
        print(f"   Total Users: {len(users)}")
        
        for user in users:
            print(f"   ID: {user.id} | Email: {user.email} | Role: {user.role}")
            print(f"   Name: {user.first_name} {user.last_name}")
            print(f"   Created: {user.created_at}")
            print(f"   ---")
        
        # 2. Check Issuers table
        print("\n🏢 ISSUERS TABLE:")
        issuers = db.query(Issuer).all()
        print(f"   Total Issuers: {len(issuers)}")
        
        for issuer in issuers:
            print(f"   ID: {issuer.id} | Name: {issuer.name}")
            print(f"   Organization: {issuer.organization}")
            print(f"   User ID: {issuer.user_id}")
            print(f"   Verified: {issuer.verified}")
            print(f"   ---")
        
        # 3. Check Badge Templates table
        print("\n🏅 BADGE TEMPLATES TABLE:")
        templates = db.query(BadgeTemplate).all()
        print(f"   Total Badge Templates: {len(templates)}")
        
        for template in templates:
            print(f"   ID: {template.id} | Name: {template.name}")
            print(f"   Badge Type: {template.badge_type}")
            print(f"   Issuer ID: {template.issuer_id}")
            print(f"   Active: {template.active}")
            print(f"   Skills: {template.skills}")
            print(f"   Duration: {template.estimated_duration}")
            print(f"   ---")
        
        # 4. Check Credentials table
        print("\n🎓 CREDENTIALS TABLE:")
        credentials = db.query(Credential).all()
        print(f"   Total Credentials: {len(credentials)}")
        
        for credential in credentials:
            print(f"   ID: {credential.id} | Title: {credential.title}")
            print(f"   Learner ID: {credential.learner_id}")
            print(f"   Issuer ID: {credential.issuer_id}")
            print(f"   Status: {credential.status}")
            print(f"   Skills: {credential.skills}")
            print(f"   Public: {credential.is_public}")
            print(f"   Verification Code: {credential.verification_code}")
            print(f"   Created: {credential.created_at}")
            print(f"   ---")
        
        # 5. Check Employer Profiles table
        print("\n🏭 EMPLOYER PROFILES TABLE:")
        employer_profiles = db.query(EmployerProfile).all()
        print(f"   Total Employer Profiles: {len(employer_profiles)}")
        
        for profile in employer_profiles:
            print(f"   ID: {profile.id} | Company: {profile.company_name}")
            print(f"   Industry: {profile.industry}")
            print(f"   Size: {profile.company_size}")
            print(f"   Location: {profile.location}")
            print(f"   Website: {profile.website}")
            print(f"   User ID: {profile.user_id}")
            print(f"   Verified: {profile.is_verified}")
            print(f"   ---")
        
        # 6. Check Credential Views table (if any)
        print("\n👀 CREDENTIAL VIEWS TABLE:")
        try:
            views = db.query(CredentialView).all()
            print(f"   Total Credential Views: {len(views)}")
            
            for view in views:
                print(f"   ID: {view.id} | Credential ID: {view.credential_id}")
                print(f"   IP: {view.ip_address}")
                print(f"   Viewed At: {view.viewed_at}")
                print(f"   ---")
        except Exception as e:
            print(f"   ⚠️ Credential Views table might not exist or be empty")
        
        # 7. Check any other relevant tables
        print("\n📊 DATABASE SUMMARY:")
        print(f"   Total Users: {len(users)}")
        print(f"   Total Issuers: {len(issuers)}")
        print(f"   Total Badge Templates: {len(templates)}")
        print(f"   Total Credentials: {len(credentials)}")
        print(f"   Total Employer Profiles: {len(employer_profiles)}")
        
        # 8. Show user role distribution
        print("\n👥 USER ROLE DISTRIBUTION:")
        role_counts = {}
        for user in users:
            role = user.role
            role_counts[role] = role_counts.get(role, 0) + 1
        
        for role, count in role_counts.items():
            print(f"   {role}: {count} users")
        
        # 9. Show recent activity
        print("\n⏰ RECENT ACTIVITY:")
        if credentials:
            latest_credential = max(credentials, key=lambda c: c.created_at)
            print(f"   Latest Credential: '{latest_credential.title}' created at {latest_credential.created_at}")
        
        if templates:
            latest_template = max(templates, key=lambda t: t.created_at)
            print(f"   Latest Badge Template: '{latest_template.name}' created at {latest_template.created_at}")
        
        # 10. Data integrity check
        print("\n🔍 DATA INTEGRITY CHECK:")
        
        # Check if all issuers have corresponding users
        orphaned_issuers = []
        for issuer in issuers:
            user_exists = db.query(User).filter(User.id == issuer.user_id).first()
            if not user_exists:
                orphaned_issuers.append(issuer.id)
        
        if orphaned_issuers:
            print(f"   ⚠️ Orphaned Issuers (no corresponding user): {orphaned_issuers}")
        else:
            print(f"   ✅ All issuers have corresponding users")
        
        # Check if all credentials have valid issuers and learners
        orphaned_credentials = []
        for credential in credentials:
            issuer_exists = db.query(Issuer).filter(Issuer.id == credential.issuer_id).first()
            learner_exists = db.query(User).filter(User.id == credential.learner_id).first()
            if not issuer_exists or not learner_exists:
                orphaned_credentials.append(credential.id)
        
        if orphaned_credentials:
            print(f"   ⚠️ Orphaned Credentials: {orphaned_credentials}")
        else:
            print(f"   ✅ All credentials have valid issuers and learners")
        
    except Exception as e:
        print(f"❌ Error inspecting database: {e}")
    finally:
        db.close()

def check_database_connection():
    """Check if database connection is working"""
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("✅ Database connection successful")
            return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def main():
    """Main function to inspect database"""
    print("🗄️ Starting Database Inspection...")
    
    if not check_database_connection():
        print("❌ Cannot connect to database. Make sure PostgreSQL is running and configured correctly.")
        return
    
    inspect_database()
    
    print("\n" + "=" * 60)
    print("✅ Database inspection complete!")

if __name__ == "__main__":
    main()