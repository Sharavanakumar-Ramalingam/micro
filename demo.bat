@echo off
echo ==========================================
echo    MicroMerge - Complete Demo Setup
echo ==========================================
echo.
echo This script will set up and demonstrate the complete MicroMerge platform
echo including both backend API and frontend React application.
echo.

echo Step 1: Checking Backend Server...
echo.
curl -s http://localhost:8000/health >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Backend server is not running!
    echo.
    echo Please start the backend server first:
    echo   1. Open a new terminal
    echo   2. Navigate to the project root
    echo   3. Run: python run.py
    echo   4. Wait for server to start on http://localhost:8000
    echo.
    pause
    echo Checking again...
    curl -s http://localhost:8000/health >nul 2>&1
    if %errorlevel% neq 0 (
        echo ❌ Backend still not accessible. Please start the backend first.
        pause
        exit /b 1
    )
)

echo ✅ Backend server is running!
echo.

echo Step 2: Setting up Frontend...
echo.
cd frontend

echo Installing dependencies...
npm install --silent

if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

echo ✅ Frontend dependencies installed!
echo.

echo ==========================================
echo    🎉 MicroMerge Demo Ready!
echo ==========================================
echo.
echo 🔗 URLs:
echo   Backend API: http://localhost:8000
echo   Frontend:    http://localhost:3000
echo   API Docs:    http://localhost:8000/docs
echo.
echo 👥 Demo Accounts:
echo.
echo   🎓 LEARNER
echo      Email:    fresh_learner@test.com
echo      Password: password123
echo      Features: View credentials, learning dashboard
echo.
echo   🏢 ISSUER  
echo      Email:    fresh_issuer@test.com
echo      Password: password123
echo      Features: Create badges, issue credentials
echo.
echo   💼 EMPLOYER
echo      Email:    fresh_employer@test.com  
echo      Password: password123
echo      Features: Verify credentials, hiring tools
echo.
echo   ⚙️  ADMIN
echo      Email:    fresh_admin@test.com
echo      Password: password123
echo      Features: Platform management, analytics
echo.
echo 🌟 Key Features to Explore:
echo.
echo   ✨ Modern React Frontend
echo      - Responsive design for all devices
echo      - Beautiful UI with Tailwind CSS
echo      - Role-based navigation
echo.
echo   🌐 Multilingual Support  
echo      - 12 Indian languages supported
echo      - Hindi, Tamil, Telugu, Bengali + more
echo      - Native script rendering
echo.
echo   🏆 NSQF Compliance
echo      - All 10 NSQF levels supported
echo      - Automatic validation
echo      - Skills mapping
echo.
echo   🔐 Security & Authentication
echo      - JWT-based authentication
echo      - Role-based access control
echo      - Secure API communication
echo.
echo   📊 Dashboard Analytics
echo      - Real-time statistics  
echo      - Interactive charts
echo      - Recent activity tracking
echo.
echo   🎯 Credential Management
echo      - Digital badge creation
echo      - QR code verification
echo      - Bulk operations
echo.
echo 🧪 Demo Workflow:
echo.
echo   1. Start with ADMIN account - See platform overview
echo   2. Switch to ISSUER - Create badge templates
echo   3. Issue credentials to learners
echo   4. Use LEARNER account - View portfolio  
echo   5. Test EMPLOYER features - Verify credentials
echo   6. Try language switching - Test multilingual
echo.
echo Press any key to start the frontend development server...
pause >nul
echo.
echo 🚀 Starting frontend server...
echo The application will open at http://localhost:3000
echo.

start http://localhost:3000
npm run dev