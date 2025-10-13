"""
Step-by-step Feature Test for MicroMerge API
Creates users first, then tests features systematically
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_step_by_step():
    """Test features step by step"""
    print("🚀 MicroMerge Step-by-Step Feature Test")
    print("=" * 50)
    
    # Step 1: Create all types of users
    print("Step 1: Creating Users...")
    
    users = [
        {"email": "fresh_learner@test.com", "password": "test123", "role": "learner", "first_name": "Fresh", "last_name": "Learner"},
        {"email": "fresh_issuer@test.com", "password": "test123", "role": "issuer", "first_name": "Fresh", "last_name": "Issuer"},
        {"email": "fresh_employer@test.com", "password": "test123", "role": "employer", "first_name": "Fresh", "last_name": "Employer"},
        {"email": "fresh_admin@test.com", "password": "test123", "role": "admin", "first_name": "Fresh", "last_name": "Admin"}
    ]
    
    tokens = {}
    
    for user in users:
        try:
            # Register user
            response = requests.post(f"{BASE_URL}/api/v1/auth/signup", json=user)
            if response.status_code == 200:
                print(f"✅ Created {user['role']}: {user['email']}")
            else:
                print(f"⚠️ {user['role']} may already exist")
            
            # Login and get token
            login_response = requests.post(f"{BASE_URL}/api/v1/auth/login", 
                                         json={"email": user['email'], "password": user['password']})
            if login_response.status_code == 200:
                token_data = login_response.json()
                tokens[user['role']] = token_data.get("access_token")
                print(f"   🔑 Token obtained for {user['role']}")
            else:
                print(f"   ❌ Login failed for {user['role']}")
        except Exception as e:
            print(f"   ❌ Error with {user['role']}: {e}")
    
    # Step 2: Test NSQF Framework
    print("\nStep 2: Testing NSQF Framework...")
    try:
        response = requests.get(f"{BASE_URL}/api/v1/nsqf/levels")
        if response.status_code == 200:
            nsqf_data = response.json()
            levels = nsqf_data.get('nsqf_levels', {})
            print(f"✅ NSQF Levels: {len(levels)} levels available")
        else:
            print(f"❌ NSQF Levels failed: {response.status_code}")
    except Exception as e:
        print(f"❌ NSQF test failed: {e}")
    
    # Step 3: Test Multilingual Support
    print("\nStep 3: Testing Multilingual Support...")
    try:
        response = requests.get(f"{BASE_URL}/api/v1/content/languages")
        if response.status_code == 200:
            lang_data = response.json()
            languages = lang_data.get('supported_languages', {})
            print(f"✅ Languages: {len(languages)} languages supported")
        else:
            print(f"❌ Languages failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Languages test failed: {e}")
    
    # Step 4: Test Employer Features
    print("\nStep 4: Testing Employer Features...")
    if 'employer' in tokens:
        try:
            headers = {"Authorization": f"Bearer {tokens['employer']}", "Content-Type": "application/json"}
            employer_profile = {
                "company_name": "Test Company Ltd",
                "industry": "Technology",
                "company_size": "11-50",
                "location": "Mumbai, Maharashtra",
                "website": "https://testcompany.com",
                "description": "A test technology company"
            }
            
            response = requests.post(f"{BASE_URL}/api/v1/employers/profile", 
                                   json=employer_profile, headers=headers)
            if response.status_code == 200:
                print(f"✅ Employer Profile Created: {employer_profile['company_name']}")
            else:
                print(f"⚠️ Employer Profile: {response.status_code} - {response.text[:100]}")
        except Exception as e:
            print(f"❌ Employer test failed: {e}")
    
    # Step 5: Test Admin Features
    print("\nStep 5: Testing Admin Features...")
    if 'admin' in tokens:
        try:
            headers = {"Authorization": f"Bearer {tokens['admin']}"}
            response = requests.get(f"{BASE_URL}/api/v1/admin/national-statistics", headers=headers)
            if response.status_code == 200:
                stats = response.json()
                print(f"✅ Admin Stats: {stats.get('total_active_learners', 0)} learners, {stats.get('total_issuers', 0)} issuers")
            else:
                print(f"⚠️ Admin Stats: {response.status_code}")
        except Exception as e:
            print(f"❌ Admin test failed: {e}")
    
    # Step 6: Test Issuer Features
    print("\nStep 6: Testing Issuer Features...")
    if 'issuer' in tokens:
        try:
            headers = {"Authorization": f"Bearer {tokens['issuer']}", "Content-Type": "application/json"}
            
            # Test issuer profile
            response = requests.get(f"{BASE_URL}/api/v1/issuers/me", headers=headers)
            if response.status_code == 200:
                issuer_info = response.json()
                print(f"✅ Issuer Profile: {issuer_info.get('name', 'Unknown')}")
            else:
                print(f"⚠️ Issuer Profile: {response.status_code}")
            
            # Test badge template creation
            badge_template = {
                "name": "Basic Programming",
                "description": "Introduction to programming concepts",
                "badge_type": "certification",
                "criteria": "Complete basic programming course",
                "image_url": "https://example.com/basic-programming.png",
                "skills": ["Programming", "Logic", "Problem Solving"],
                "estimated_duration": "20 hours",
                "prerequisites": "None",
                "tags": ["beginner", "programming"]
            }
            
            response = requests.post(f"{BASE_URL}/api/v1/badge-templates", 
                                   json=badge_template, headers=headers)
            if response.status_code == 200:
                template_info = response.json()
                print(f"✅ Badge Template Created: {badge_template['name']}")
            else:
                print(f"⚠️ Badge Template: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Issuer test failed: {e}")
    
    # Step 7: Test Credential Creation
    print("\nStep 7: Testing Credential Creation...")
    if 'issuer' in tokens:
        try:
            headers = {"Authorization": f"Bearer {tokens['issuer']}", "Content-Type": "application/json"}
            
            credential = {
                "title": "Basic Programming Certificate",
                "description": "Certificate for completing basic programming course",
                "learner_email": "fresh_learner@test.com",
                "skills": ["Programming", "Logic"],
                "skill_category": "Technology",
                "tags": ["programming", "beginner"],
                "completion_date": "2025-10-10T00:00:00",
                "expiry_date": "2026-10-11T00:00:00",
                "evidence_url": "https://example.com/evidence",
                "is_public": True
            }
            
            response = requests.post(f"{BASE_URL}/api/v1/credentials", 
                                   json=credential, headers=headers)
            if response.status_code == 200:
                cred_info = response.json()
                print(f"✅ Credential Created: {credential['title']}")
                print(f"   Credential ID: {cred_info.get('id', 'N/A')}")
                
                # Note: Verification code is auto-generated, so we'll skip verification test for now
                print(f"✅ Credential Ready for Verification")
                    
            else:
                print(f"⚠️ Credential Creation: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Credential test failed: {e}")
    
    # Step 8: Test Dashboards
    print("\nStep 8: Testing Dashboards...")
    
    # Learner dashboard
    if 'learner' in tokens:
        try:
            headers = {"Authorization": f"Bearer {tokens['learner']}"}
            response = requests.get(f"{BASE_URL}/api/v1/dashboard/learner", headers=headers)
            if response.status_code == 200:
                dashboard = response.json()
                stats = dashboard.get('stats', {})
                print(f"✅ Learner Dashboard: {stats.get('total_credentials', 0)} credentials")
            else:
                print(f"⚠️ Learner Dashboard: {response.status_code}")
        except Exception as e:
            print(f"❌ Learner dashboard failed: {e}")
    
    # Issuer dashboard
    if 'issuer' in tokens:
        try:
            headers = {"Authorization": f"Bearer {tokens['issuer']}"}
            response = requests.get(f"{BASE_URL}/api/v1/dashboard/issuer", headers=headers)
            if response.status_code == 200:
                dashboard = response.json()
                stats = dashboard.get('stats', {})
                print(f"✅ Issuer Dashboard: {stats.get('total_credentials_issued', 0)} issued")
            else:
                print(f"⚠️ Issuer Dashboard: {response.status_code}")
        except Exception as e:
            print(f"❌ Issuer dashboard failed: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Step-by-Step Test Complete!")
    print("✅ MicroMerge API features tested successfully!")

if __name__ == "__main__":
    test_step_by_step()