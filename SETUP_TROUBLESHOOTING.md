# Setup Troubleshooting Guide

## Common Issues and Solutions

### 1. bcrypt Password Length Error

**Error:**
```
ValueError: password cannot be longer than 72 bytes, truncate manually if necessary (e.g. my_password[:72])
```

**Solutions:**

#### Option A: Update Dependencies (Recommended)
```bash
# Ensure you have the latest compatible versions
pip install --upgrade passlib[bcrypt]==1.7.4
pip install --upgrade bcrypt==4.0.1
```

#### Option B: Fresh Virtual Environment
```bash
# Create a new virtual environment
python -m venv venv
# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### Option C: Force Reinstall
```bash
pip uninstall passlib bcrypt
pip install passlib[bcrypt]==1.7.4 bcrypt==4.0.1
```

### 2. PostgreSQL Connection Issues

**Error:** Connection refused or database not found

**Solutions:**
1. Ensure PostgreSQL is running on your system
2. Check your `.env` file has correct database credentials
3. Run the database creation script:
   ```bash
   python create_fresh_db.py
   ```

### 3. Frontend Build Issues

**Error:** Module not found or build failures

**Solutions:**
```bash
cd frontend
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### 4. Port Already in Use

**Error:** Port 8000 or 3000 already in use

**Solutions:**
```bash
# Find and kill processes using the ports
# Windows:
netstat -ano | findstr :8000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# macOS/Linux:
lsof -ti:8000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

## Recommended Setup Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sharavanakumar-Ramalingam/micro.git
   cd micro
   ```

2. **Set up Python environment:**
   ```bash
   python -m venv venv
   # Activate virtual environment
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # macOS/Linux
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   - Copy `.env.example` to `.env` (if exists)
   - Or create `.env` with your database credentials

5. **Initialize database:**
   ```bash
   python create_fresh_db.py
   ```

6. **Start backend server:**
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

7. **Set up frontend (new terminal):**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

8. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Demo Accounts

After running `create_fresh_db.py`, you can use these demo accounts:

- **Learner:** learner@test.com / test123
- **Issuer:** issuer@test.com / test123
- **Employer:** employer@test.com / test123
- **Admin:** admin@test.com / test123

## Environment Requirements

- **Python:** 3.8 or higher
- **Node.js:** 16 or higher
- **PostgreSQL:** 12 or higher
- **Operating System:** Windows, macOS, or Linux

## Getting Help

If you encounter issues not covered here:

1. Check the GitHub issues page
2. Ensure all dependencies are correctly installed
3. Verify your environment variables are set correctly
4. Try creating a fresh virtual environment

## Version Information

This application has been tested with:
- Python 3.11
- Node.js 18+
- PostgreSQL 14
- Windows 11, macOS, and Ubuntu 20.04+