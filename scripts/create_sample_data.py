#!/usr/bin/env python3
"""
Script to add sample data for learner 'sharavanakumar' to demonstrate the application functionality
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.db import SessionLocal, engine
from app.models import *
from app.auth import get_password_hash
from datetime import datetime, timedelta
import json

def create_sample_data():
    """Create comprehensive sample data for learner sharavanakumar"""
    db = SessionLocal()
    
    try:
        print("🚀 Creating sample data for learner 'sharavanakumar'...")
        
        # 1. Create learner user if doesn't exist
        existing_user = db.query(User).filter(User.email == "sharavanakumar@example.com").first()
        if existing_user:
            print("📝 User already exists, updating...")
            learner_user = existing_user
        else:
            learner_user = User(
                email="sharavanakumar@example.com",
                hashed_password=get_password_hash("password123"),
                role=UserRole.learner,
                first_name="Sharavana",
                last_name="Kumar",
                profile_image_url="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
                linkedin_url="https://linkedin.com/in/sharavanakumar",
                public_profile=True
            )
            db.add(learner_user)
            db.commit()
            db.refresh(learner_user)
            print("✅ Created learner user: sharavanakumar@example.com")

        # 2. Create sample issuers
        issuers_data = [
            {
                "name": "TechSkills Academy",
                "organization": "TechSkills Academy Pvt Ltd",
                "description": "Leading technology training institute",
                "website": "https://techskills.edu",
                "industry": "Education Technology",
                "location": "Bangalore, Karnataka"
            },
            {
                "name": "Digital Marketing Institute",
                "organization": "DMI India",
                "description": "Premier digital marketing certification body",
                "website": "https://dmi.edu",
                "industry": "Digital Marketing",
                "location": "Mumbai, Maharashtra"
            },
            {
                "name": "NSDC India",
                "organization": "National Skill Development Corporation",
                "description": "Government skill development agency",
                "website": "https://nsdcindia.org",
                "industry": "Skill Development",
                "location": "New Delhi"
            }
        ]
        
        issuers = []
        for issuer_data in issuers_data:
            # Create issuer user account
            issuer_email = f"{issuer_data['name'].lower().replace(' ', '')}@example.com"
            existing_issuer_user = db.query(User).filter(User.email == issuer_email).first()
            
            if not existing_issuer_user:
                issuer_user = User(
                    email=issuer_email,
                    hashed_password=get_password_hash("issuer123"),
                    role=UserRole.issuer,
                    first_name=issuer_data['name'],
                    last_name="Admin"
                )
                db.add(issuer_user)
                db.commit()
                db.refresh(issuer_user)
            else:
                issuer_user = existing_issuer_user
            
            # Create issuer profile
            existing_issuer = db.query(Issuer).filter(Issuer.user_id == issuer_user.id).first()
            if not existing_issuer:
                issuer = Issuer(
                    user_id=issuer_user.id,
                    verified=True,
                    **issuer_data
                )
                db.add(issuer)
                db.commit()
                db.refresh(issuer)
                issuers.append(issuer)
                print(f"✅ Created issuer: {issuer.name}")
            else:
                issuers.append(existing_issuer)

        # 3. Create badge templates
        badge_templates_data = [
            {
                "name": "Python Developer Certification",
                "description": "Comprehensive Python programming certification",
                "badge_type": BadgeType.certification,
                "criteria": "Complete Python fundamentals, OOP, web frameworks, and final project",
                "skills": ["Python", "Django", "Flask", "API Development", "Database Design"],
                "estimated_duration": "120 hours",
                "prerequisites": "Basic programming knowledge",
                "tags": ["python", "backend", "web-development", "certification"]
            },
            {
                "name": "Digital Marketing Specialist",
                "description": "Advanced digital marketing and analytics certification",
                "badge_type": BadgeType.certification,
                "criteria": "Master SEO, SEM, social media marketing, and analytics tools",
                "skills": ["SEO", "Google Ads", "Facebook Marketing", "Analytics", "Content Strategy"],
                "estimated_duration": "80 hours",
                "prerequisites": "Marketing basics",
                "tags": ["digital-marketing", "seo", "analytics", "certification"]
            },
            {
                "name": "Data Science Fundamentals",
                "description": "Introduction to data science and machine learning",
                "badge_type": BadgeType.course_completion,
                "criteria": "Complete statistics, Python for data science, and ML algorithms",
                "skills": ["Python", "Statistics", "Machine Learning", "Data Visualization", "Pandas"],
                "estimated_duration": "100 hours",
                "prerequisites": "Basic mathematics and programming",
                "tags": ["data-science", "machine-learning", "python", "analytics"]
            },
            {
                "name": "Leadership Excellence",
                "description": "Leadership and team management certification",
                "badge_type": BadgeType.skill_badge,
                "criteria": "Demonstrate leadership skills through projects and assessments",
                "skills": ["Leadership", "Team Management", "Communication", "Strategic Thinking"],
                "estimated_duration": "60 hours",
                "prerequisites": "2+ years work experience",
                "tags": ["leadership", "management", "soft-skills"]
            }
        ]
        
        badge_templates = []
        for i, template_data in enumerate(badge_templates_data):
            existing_template = db.query(BadgeTemplate).filter(
                BadgeTemplate.name == template_data['name'],
                BadgeTemplate.issuer_id == issuers[i % len(issuers)].id
            ).first()
            
            if not existing_template:
                template = BadgeTemplate(
                    issuer_id=issuers[i % len(issuers)].id,
                    **template_data
                )
                db.add(template)
                db.commit()
                db.refresh(template)
                badge_templates.append(template)
                print(f"✅ Created badge template: {template.name}")
            else:
                badge_templates.append(existing_template)

        # 4. Create credentials for sharavanakumar
        credentials_data = [
            {
                "title": "Python Developer Certification",
                "description": "Certified Python developer with expertise in web frameworks and API development",
                "completion_date": datetime.now() - timedelta(days=30),
                "expiry_date": datetime.now() + timedelta(days=730),  # 2 years
                "status": CredentialStatus.issued,
                "skills": ["Python", "Django", "Flask", "REST APIs", "PostgreSQL"],
                "skill_category": "Software Development",
                "tags": ["python", "backend", "certification"],
                "is_public": True,
                "verification_code": "PY2024SHK001"
            },
            {
                "title": "Digital Marketing Specialist",
                "description": "Advanced certification in digital marketing with hands-on experience in SEO and PPC",
                "completion_date": datetime.now() - timedelta(days=60),
                "expiry_date": datetime.now() + timedelta(days=365),  # 1 year
                "status": CredentialStatus.issued,
                "skills": ["SEO", "Google Ads", "Facebook Marketing", "Google Analytics", "Content Marketing"],
                "skill_category": "Digital Marketing",
                "tags": ["marketing", "seo", "advertising"],
                "is_public": True,
                "shared_on_linkedin": True,
                "verification_code": "DM2024SHK002"
            },
            {
                "title": "Data Science Fundamentals",
                "description": "Foundation course in data science covering statistics, Python, and machine learning basics",
                "completion_date": datetime.now() - timedelta(days=90),
                "status": CredentialStatus.issued,
                "skills": ["Python", "Statistics", "Pandas", "Scikit-learn", "Data Visualization"],
                "skill_category": "Data Science",
                "tags": ["data-science", "python", "analytics"],
                "is_public": True,
                "verification_code": "DS2024SHK003"
            },
            {
                "title": "Leadership Excellence Badge",
                "description": "Demonstrated leadership skills in project management and team coordination",
                "completion_date": datetime.now() - timedelta(days=15),
                "status": CredentialStatus.issued,
                "skills": ["Leadership", "Project Management", "Team Building", "Communication"],
                "skill_category": "Leadership",
                "tags": ["leadership", "management", "soft-skills"],
                "is_public": True,
                "verification_code": "LD2024SHK004"
            },
            {
                "title": "JavaScript Intermediate",
                "description": "Intermediate JavaScript programming including ES6+ features and frameworks",
                "completion_date": datetime.now() - timedelta(days=45),
                "status": CredentialStatus.issued,
                "skills": ["JavaScript", "ES6+", "React", "Node.js", "MongoDB"],
                "skill_category": "Software Development",
                "tags": ["javascript", "frontend", "fullstack"],
                "is_public": True,
                "verification_code": "JS2024SHK005"
            }
        ]
        
        credentials = []
        for i, cred_data in enumerate(credentials_data):
            existing_cred = db.query(Credential).filter(
                Credential.verification_code == cred_data['verification_code']
            ).first()
            
            if not existing_cred:
                # Generate public URL
                public_url = f"https://micromerge.app/verify/{cred_data['verification_code']}"
                
                credential = Credential(
                    learner_id=learner_user.id,
                    issuer_id=issuers[i % len(issuers)].id,
                    badge_template_id=badge_templates[i % len(badge_templates)].id if i < len(badge_templates) else None,
                    public_url=public_url,
                    evidence_url=f"https://portfolio.sharavanakumar.dev/credential/{cred_data['verification_code']}",
                    **cred_data
                )
                db.add(credential)
                db.commit()
                db.refresh(credential)
                credentials.append(credential)
                print(f"✅ Created credential: {credential.title}")
            else:
                credentials.append(existing_cred)

        # 5. Create credential metadata with NSQF levels
        nsqf_levels = [6, 5, 4, 7, 5]  # Corresponding NSQF levels for each credential
        learning_outcomes_data = [
            ["Develop web applications using Python frameworks", "Design and implement RESTful APIs", "Work with databases and ORM"],
            ["Create and manage digital marketing campaigns", "Analyze campaign performance using analytics tools", "Optimize content for search engines"],
            ["Perform statistical analysis on datasets", "Build predictive models using machine learning", "Visualize data insights effectively"],
            ["Lead cross-functional teams effectively", "Develop strategic plans and execute projects", "Communicate vision and motivate team members"],
            ["Build interactive web applications", "Implement modern JavaScript frameworks", "Develop full-stack applications"]
        ]
        
        for i, credential in enumerate(credentials):
            existing_metadata = db.query(CredentialMetadata).filter(
                CredentialMetadata.credential_id == credential.id
            ).first()
            
            if not existing_metadata:
                metadata = CredentialMetadata(
                    credential_id=credential.id,
                    nsqf_level=nsqf_levels[i],
                    qualification_pathway="skill_based",
                    credit_hours=40 + (i * 20),
                    learning_outcomes=learning_outcomes_data[i],
                    assessment_criteria=["Project-based assessment", "Written examination", "Practical demonstration"],
                    industry_alignment=["Technology", "IT Services", "Software Development"],
                    job_roles=["Software Developer", "Technical Lead", "Full Stack Developer"] if i in [0, 4] else 
                             ["Digital Marketing Manager", "SEO Specialist", "Content Strategist"] if i == 1 else
                             ["Data Analyst", "Business Intelligence Developer", "Research Analyst"] if i == 2 else
                             ["Team Lead", "Project Manager", "Department Head"],
                    competency_framework="NSQF India",
                    prerequisite_qualifications=[],
                    stackable_with=[]
                )
                db.add(metadata)
                print(f"✅ Created metadata for credential: {credential.title}")

        # 6. Create credential shares (social sharing records)
        share_platforms = ["linkedin", "twitter", "email", "whatsapp"]
        for i, credential in enumerate(credentials[:3]):  # Only for first 3 credentials
            for platform in share_platforms[:2]:  # Share on 2 platforms each
                existing_share = db.query(CredentialShare).filter(
                    CredentialShare.credential_id == credential.id,
                    CredentialShare.platform == platform
                ).first()
                
                if not existing_share:
                    share = CredentialShare(
                        credential_id=credential.id,
                        platform=platform,
                        shared_by=learner_user.id,
                        shared_at=datetime.now() - timedelta(days=i*10, hours=i*2)
                    )
                    db.add(share)

        # 7. Create credential views (analytics data)
        import random
        for credential in credentials:
            # Create multiple views for each credential
            for day in range(30):  # Views over last 30 days
                views_count = random.randint(1, 5)  # 1-5 views per day
                for view in range(views_count):
                    existing_view_count = db.query(CredentialView).filter(
                        CredentialView.credential_id == credential.id
                    ).count()
                    
                    if existing_view_count < 50:  # Limit to 50 views per credential
                        view_record = CredentialView(
                            credential_id=credential.id,
                            viewer_ip=f"192.168.1.{random.randint(1, 255)}",
                            viewer_user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                            viewed_at=datetime.now() - timedelta(days=day, hours=random.randint(0, 23))
                        )
                        db.add(view_record)

        # 8. Create blockchain verification records
        for i, credential in enumerate(credentials[:2]):  # Only for first 2 credentials
            existing_blockchain = db.query(BlockchainVerification).filter(
                BlockchainVerification.credential_id == credential.id
            ).first()
            
            if not existing_blockchain:
                blockchain_verify = BlockchainVerification(
                    credential_id=credential.id,
                    blockchain_hash=f"0x{''.join([str(random.randint(0, 9)) for _ in range(64)])}",
                    transaction_id=f"tx_{''.join([str(random.randint(0, 9)) for _ in range(32)])}",
                    verification_url=f"https://blockchain.micromerge.app/verify/{credential.verification_code}",
                    verification_method="blockchain",
                    verified_at=credential.issued_at,
                    verified_by="MicroMerge Blockchain Validator",
                    verification_status="verified"
                )
                db.add(blockchain_verify)
                print(f"✅ Created blockchain verification for: {credential.title}")

        # 9. Create Skill India profile
        existing_skill_profile = db.query(SkillIndiaProfile).filter(
            SkillIndiaProfile.user_id == learner_user.id
        ).first()
        
        if not existing_skill_profile:
            skill_profile = SkillIndiaProfile(
                user_id=learner_user.id,
                skill_india_id="SIDP2024SHK001",
                linked_pmkvy_courses=["PMKVY_IT_001", "PMKVY_DM_002"],
                recognition_of_prior_learning=True,
                linked_apprenticeships=["APP_TECH_001"],
                last_synced=datetime.now()
            )
            db.add(skill_profile)
            print("✅ Created Skill India profile")

        # 10. Add multilingual content for some credentials
        languages = ["hi", "ta", "te", "kn"]  # Hindi, Tamil, Telugu, Kannada
        translations = {
            "Python Developer Certification": {
                "hi": "पायथन डेवलपर प्रमाणन",
                "ta": "பைதான் டெவலப்பர் சான்றிதழ்",
                "te": "పైథాన్ డెవలపర్ సర్టిఫికేషన్",
                "kn": "ಪೈಥಾನ್ ಡೆವಲಪರ್ ಪ್ರಮಾಣೀಕರಣ"
            },
            "Digital Marketing Specialist": {
                "hi": "डिजिटल मार्केटिंग विशेषज्ञ",
                "ta": "டிஜிட்டல் மார்க்கெட்டிங் நிபுணர்",
                "te": "డిజిటల్ మార్కెటింగ్ స్పెషలిస్ట్",
                "kn": "ಡಿಜಿಟಲ್ ಮಾರ್ಕೆಟಿಂಗ್ ತಜ್ಞ"
            }
        }
        
        for credential in credentials[:2]:  # First 2 credentials
            if credential.title in translations:
                for lang_code, translation in translations[credential.title].items():
                    existing_translation = db.query(MultilingualContent).filter(
                        MultilingualContent.content_type == "credential_title",
                        MultilingualContent.content_id == str(credential.id),
                        MultilingualContent.language_code == lang_code
                    ).first()
                    
                    if not existing_translation:
                        multilingual_content = MultilingualContent(
                            content_type="credential_title",
                            content_id=str(credential.id),
                            language_code=lang_code,
                            translated_text=translation
                        )
                        db.add(multilingual_content)

        # Commit all changes
        db.commit()
        
        # Print summary
        print("\n🎉 Sample data creation completed!")
        print(f"📧 Learner Email: sharavanakumar@example.com")
        print(f"🔑 Password: password123")
        print(f"📜 Created {len(credentials)} credentials")
        print(f"🏢 Created {len(issuers)} issuers")
        print(f"🎖️ Created {len(badge_templates)} badge templates")
        print("\n📊 Credential Summary:")
        
        for cred in credentials:
            views_count = db.query(CredentialView).filter(CredentialView.credential_id == cred.id).count()
            shares_count = db.query(CredentialShare).filter(CredentialShare.credential_id == cred.id).count()
            print(f"  • {cred.title} - {views_count} views, {shares_count} shares")
        
        print(f"\n🌐 Access the application:")
        print(f"  Frontend: http://localhost:3000")
        print(f"  Backend: http://localhost:8000")
        print(f"  Login with: sharavanakumar@example.com / password123")

    except Exception as e:
        print(f"❌ Error creating sample data: {e}")
        db.rollback()
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    create_sample_data()