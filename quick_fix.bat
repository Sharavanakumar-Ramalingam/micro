@echo off
echo ============================================
echo MicroMerge Quick Fix for bcrypt Issues
echo ============================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    pause
    exit /b 1
)

echo Step 1: Pulling latest changes from git...
git pull origin main

echo.
echo Step 2: Running complete environment reset...
python reset_environment.py

echo.
echo Step 3: Quick verification...
echo Testing if bcrypt works with current setup...

REM Create a quick test script
echo import sys > test_bcrypt.py
echo sys.path.append('.') >> test_bcrypt.py
echo from app.auth import get_password_hash, verify_password >> test_bcrypt.py
echo. >> test_bcrypt.py
echo try: >> test_bcrypt.py
echo     # Test with a normal password >> test_bcrypt.py
echo     test_pass = "test123" >> test_bcrypt.py
echo     hashed = get_password_hash(test_pass) >> test_bcrypt.py
echo     verified = verify_password(test_pass, hashed) >> test_bcrypt.py
echo     print("✅ bcrypt test passed!") >> test_bcrypt.py
echo     print(f"Password hashing works: {verified}") >> test_bcrypt.py
echo except Exception as e: >> test_bcrypt.py
echo     print(f"❌ bcrypt test failed: {e}") >> test_bcrypt.py

venv\Scripts\python test_bcrypt.py
del test_bcrypt.py

echo.
echo ============================================
echo Setup Complete!
echo ============================================
echo.
echo To start the application:
echo 1. Open terminal and run: venv\Scripts\activate
echo 2. Start backend: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
echo 3. Open another terminal, go to frontend folder: cd frontend
echo 4. Install and start frontend: npm install ^&^& npm run dev
echo.
echo Demo accounts available:
echo - learner@test.com / test123
echo - issuer@test.com / test123
echo - employer@test.com / test123
echo - admin@test.com / test123
echo.
pause