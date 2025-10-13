#!/usr/bin/env python3
"""
Complete Reset Script for MicroMerge Application
This script will completely reset the environment to fix bcrypt issues
"""

import os
import sys
import shutil
import subprocess
from pathlib import Path

def run_command(cmd, description="", check=True):
    """Run a command and handle errors"""
    print(f"🔄 {description}")
    print(f"Running: {cmd}")
    
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, check=check)
        if result.stdout:
            print(f"✅ Output: {result.stdout.strip()}")
        return result
    except subprocess.CalledProcessError as e:
        print(f"❌ Error: {e}")
        if e.stdout:
            print(f"Stdout: {e.stdout}")
        if e.stderr:
            print(f"Stderr: {e.stderr}")
        if check:
            sys.exit(1)
        return e

def clear_python_cache():
    """Clear Python cache files"""
    print("🧹 Clearing Python cache files...")
    
    # Remove __pycache__ directories
    for root, dirs, files in os.walk('.'):
        for d in dirs:
            if d == '__pycache__':
                cache_path = os.path.join(root, d)
                print(f"Removing: {cache_path}")
                shutil.rmtree(cache_path, ignore_errors=True)
    
    # Remove .pyc files
    for root, dirs, files in os.walk('.'):
        for f in files:
            if f.endswith('.pyc'):
                pyc_path = os.path.join(root, f)
                print(f"Removing: {pyc_path}")
                os.remove(pyc_path)

def main():
    print("🚀 MicroMerge Complete Reset Script")
    print("This will fix bcrypt password issues by completely resetting the environment")
    print("=" * 60)
    
    # Check if we're in the right directory
    if not os.path.exists('app') or not os.path.exists('requirements.txt'):
        print("❌ Error: Please run this script from the MicroMerge root directory")
        sys.exit(1)
    
    # Step 1: Clear Python cache
    clear_python_cache()
    
    # Step 2: Deactivate and remove virtual environment if it exists
    if os.path.exists('venv'):
        print("🗑️  Removing existing virtual environment...")
        shutil.rmtree('venv', ignore_errors=True)
    
    # Step 3: Create new virtual environment
    run_command("python -m venv venv", "Creating new virtual environment")
    
    # Step 4: Activate virtual environment and upgrade pip
    if os.name == 'nt':  # Windows
        pip_cmd = "venv\\Scripts\\pip"
        python_cmd = "venv\\Scripts\\python"
    else:  # Unix/Linux/macOS
        pip_cmd = "venv/bin/pip"
        python_cmd = "venv/bin/python"
    
    run_command(f"{pip_cmd} install --upgrade pip", "Upgrading pip")
    
    # Step 5: Install specific versions of problematic packages first
    print("📦 Installing specific bcrypt and passlib versions...")
    run_command(f"{pip_cmd} install bcrypt==4.0.1", "Installing bcrypt")
    run_command(f"{pip_cmd} install 'passlib[bcrypt]==1.7.4'", "Installing passlib")
    
    # Step 6: Install all requirements
    run_command(f"{pip_cmd} install -r requirements.txt", "Installing all requirements")
    
    # Step 7: Create fresh database
    run_command(f"{python_cmd} create_fresh_db.py", "Creating fresh database")
    
    # Step 8: Run database migrations
    run_command("alembic upgrade head", "Running database migrations", check=False)
    
    # Step 9: Create demo users
    demo_script = """
import sys
sys.path.append('.')
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app import models, schemas, crud
from app.db import get_database_url
import os
from dotenv import load_dotenv

load_dotenv()

# Create database connection
DATABASE_URL = get_database_url()
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create all tables
models.Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    # Demo users with short passwords to avoid bcrypt issues
    demo_users = [
        {"email": "learner@test.com", "password": "test123", "role": "learner", "first_name": "Demo", "last_name": "Learner"},
        {"email": "issuer@test.com", "password": "test123", "role": "issuer", "first_name": "Demo", "last_name": "Issuer"},
        {"email": "employer@test.com", "password": "test123", "role": "employer", "first_name": "Demo", "last_name": "Employer"},
        {"email": "admin@test.com", "password": "test123", "role": "admin", "first_name": "Demo", "last_name": "Admin"}
    ]
    
    print("Creating demo users...")
    for user_data in demo_users:
        # Check if user already exists
        existing_user = crud.get_user_by_email(db, email=user_data["email"])
        if not existing_user:
            user_create = schemas.UserCreate(**user_data)
            new_user = crud.create_user(db=db, user=user_create)
            print(f"✅ Created user: {user_data['email']} ({user_data['role']})")
        else:
            print(f"⚠️  User already exists: {user_data['email']}")
    
    print("✅ Demo users setup complete!")
    
except Exception as e:
    print(f"❌ Error creating demo users: {e}")
finally:
    db.close()
"""
    
    # Write and run demo script
    with open('temp_demo_setup.py', 'w') as f:
        f.write(demo_script)
    
    run_command(f"{python_cmd} temp_demo_setup.py", "Creating demo users")
    
    # Clean up temp script
    os.remove('temp_demo_setup.py')
    
    print("=" * 60)
    print("🎉 Reset Complete!")
    print("\nTo start the application:")
    print("1. Activate virtual environment:")
    if os.name == 'nt':
        print("   venv\\Scripts\\activate")
    else:
        print("   source venv/bin/activate")
    print("2. Start backend: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload")
    print("3. In another terminal, start frontend:")
    print("   cd frontend")
    print("   npm install")
    print("   npm run dev")
    print("\nDemo accounts:")
    print("- learner@test.com / test123")
    print("- issuer@test.com / test123") 
    print("- employer@test.com / test123")
    print("- admin@test.com / test123")

if __name__ == "__main__":
    main()