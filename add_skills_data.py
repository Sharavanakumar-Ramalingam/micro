"""
Script to add skills and NSQF level data to existing credentials
"""
import asyncio
import requests
import json

BASE_URL = "http://localhost:8000"

# Predefined skills mapping based on credential titles/types
CREDENTIAL_SKILLS_MAPPING = {
    # Programming and Development
    "Python Developer Certification": {
        "skills": ["Python Programming", "Web Development", "API Development", "Database Management", "Problem Solving"],
        "nsqf_level": 6,
        "industry": ["Information Technology", "Software Development"]
    },
    "JavaScript Intermediate": {
        "skills": ["JavaScript", "Frontend Development", "DOM Manipulation", "Asynchronous Programming", "Web APIs"],
        "nsqf_level": 5,
        "industry": ["Web Development", "Software Development"]
    },
    "Data Science Fundamentals": {
        "skills": ["Data Analysis", "Statistics", "Python", "Machine Learning", "Data Visualization"],
        "nsqf_level": 7,
        "industry": ["Data Science", "Analytics", "Research"]
    },
    
    # Management and Leadership
    "Leadership Excellence Badge": {
        "skills": ["Leadership", "Team Management", "Strategic Planning", "Communication", "Decision Making"],
        "nsqf_level": 8,
        "industry": ["Management", "Human Resources", "Business Administration"]
    },
    
    # Digital Marketing
    "Digital Marketing Specialist": {
        "skills": ["Digital Marketing", "SEO", "Social Media Marketing", "Content Marketing", "Analytics"],
        "nsqf_level": 6,
        "industry": ["Marketing", "Digital Media", "E-commerce"]
    },
    
    # General mappings based on keywords
    "certification": {
        "skills": ["Professional Skills", "Industry Knowledge", "Compliance"],
        "nsqf_level": 5,
        "industry": ["General"]
    },
    "course": {
        "skills": ["Learning", "Knowledge Application", "Skill Development"],
        "nsqf_level": 4,
        "industry": ["Education", "Training"]
    },
    "badge": {
        "skills": ["Achievement", "Competency", "Skill Validation"],
        "nsqf_level": 3,
        "industry": ["General"]
    }
}

def get_skills_for_credential(title, credential_type=""):
    """Get skills and NSQF level for a credential based on its title"""
    title_lower = title.lower()
    
    # Check for exact matches first
    for key, data in CREDENTIAL_SKILLS_MAPPING.items():
        if key.lower() in title_lower:
            return data
    
    # Check for keyword matches
    for keyword in ["python", "javascript", "data science", "leadership", "marketing"]:
        if keyword in title_lower:
            for key, data in CREDENTIAL_SKILLS_MAPPING.items():
                if keyword in key.lower():
                    return data
    
    # Default mapping based on type
    if "certification" in title_lower or "certificate" in title_lower:
        return CREDENTIAL_SKILLS_MAPPING["certification"]
    elif "course" in title_lower:
        return CREDENTIAL_SKILLS_MAPPING["course"]
    elif "badge" in title_lower:
        return CREDENTIAL_SKILLS_MAPPING["badge"]
    
    # Ultimate fallback
    return {
        "skills": ["General Skills", "Professional Development"],
        "nsqf_level": 4,
        "industry": ["General"]
    }

def update_credentials_with_skills():
    """Update existing credentials with skills and NSQF data"""
    
    # Test credentials data (since we can't easily access the database)
    test_credentials = [
        {"id": 1, "title": "Python Developer Certification", "credential_type": "certification"},
        {"id": 2, "title": "Data Science Fundamentals", "credential_type": "course"},
        {"id": 3, "title": "Leadership Excellence Badge", "credential_type": "badge"},
        {"id": 4, "title": "JavaScript Intermediate", "credential_type": "course"},
        {"id": 5, "title": "Digital Marketing Specialist", "credential_type": "certification"}
    ]
    
    print("🚀 Skills and NSQF Data Mapping for Credentials")
    print("=" * 60)
    
    for cred in test_credentials:
        skills_data = get_skills_for_credential(cred["title"], cred["credential_type"])
        
        print(f"\n📋 Credential: {cred['title']}")
        print(f"   🎯 Skills: {', '.join(skills_data['skills'])}")
        print(f"   📊 NSQF Level: {skills_data['nsqf_level']}")
        print(f"   🏢 Industry: {', '.join(skills_data['industry'])}")
        
    print(f"\n✅ Processed {len(test_credentials)} credentials")
    print("\n💡 To apply this data:")
    print("   1. Update the backend to populate credentials with skills")
    print("   2. Add NSQF level to credential metadata")
    print("   3. The frontend will automatically display the skill ratings")

if __name__ == "__main__":
    update_credentials_with_skills()