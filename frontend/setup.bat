@echo off
echo ==========================================
echo    MicroMerge Frontend Setup Script
echo ==========================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

echo Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed or not in PATH
    pause
    exit /b 1
)

echo npm version:
npm --version
echo.

echo Installing frontend dependencies...
echo This may take a few minutes...
echo.

npm install

if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    echo Please check your internet connection and try again
    pause
    exit /b 1
)

echo.
echo ==========================================
echo    Installation Complete!
echo ==========================================
echo.
echo The MicroMerge frontend has been successfully set up!
echo.
echo Available commands:
echo   npm run dev      - Start development server
echo   npm run build    - Build for production
echo   npm run preview  - Preview production build
echo   npm run lint     - Run linter
echo.
echo Demo Accounts:
echo   Learner:  fresh_learner@test.com / password123
echo   Issuer:   fresh_issuer@test.com / password123  
echo   Employer: fresh_employer@test.com / password123
echo   Admin:    fresh_admin@test.com / password123
echo.
echo Starting development server...
echo The application will open at http://localhost:3000
echo Make sure the backend server is running at http://localhost:8000
echo.

npm run dev