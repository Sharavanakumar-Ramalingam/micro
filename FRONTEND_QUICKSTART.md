# 🚀 Quick Start Guide - MicroMerge Frontend

## Step 1: Setup Frontend
Navigate to the frontend directory and run the setup script:
```bash
cd frontend
setup.bat
```

This will:
- ✅ Check Node.js and npm installation  
- ✅ Install all dependencies
- ✅ Start the development server
- ✅ Open http://localhost:3000

## Step 2: Ensure Backend is Running
Make sure your FastAPI backend is running on http://localhost:8000

## Step 3: Login with Demo Accounts

### 🎓 Learner Account
- **Email**: `fresh_learner@test.com`
- **Password**: `password123`
- **Access**: Personal dashboard, view credentials, learning progress

### 🏢 Issuer Account  
- **Email**: `fresh_issuer@test.com`
- **Password**: `password123`
- **Access**: Create badge templates, issue credentials, manage issuance

### 💼 Employer Account
- **Email**: `fresh_employer@test.com` 
- **Password**: `password123`
- **Access**: Verify credentials, hiring dashboard, candidate verification

### ⚙️ Admin Account
- **Email**: `fresh_admin@test.com`
- **Password**: `password123`
- **Access**: Full platform control, analytics, user management

## 🌟 Key Features to Test

### 🔐 Authentication
- [x] Login/Register with role selection
- [x] JWT token management  
- [x] Automatic logout on token expiry

### 🎨 User Interface
- [x] Modern, responsive design
- [x] Mobile-friendly navigation
- [x] 12 Indian language support
- [x] Dark/light theme adaptability

### 🏆 Credential Management
- [x] View all credentials with filtering
- [x] Real-time verification via QR codes
- [x] NSQF level compliance checking
- [x] Skills and competency tracking

### 📊 Dashboard Analytics
- [x] Role-specific dashboards
- [x] Real-time statistics
- [x] Interactive charts and graphs
- [x] Recent activity feeds

### 🌐 Multilingual Support
- [x] Switch between 12 Indian languages
- [x] Native script support (देवनागरी, তমিল, etc.)
- [x] Context-aware translations

## 🛠️ Development Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production  
npm run preview  # Preview production build
npm run lint     # Check code quality
```

## 🎯 Testing Workflow

1. **Start with Admin Account** - See platform overview
2. **Switch to Issuer** - Create badge templates  
3. **Issue Credentials** - Create credentials for learners
4. **Use Learner Account** - View received credentials
5. **Test Employer Features** - Verify credentials
6. **Try Language Switching** - Test multilingual support

## 🌟 What Makes This Special

### ✨ Modern React Architecture
- Built with React 18 + TypeScript
- Vite for lightning-fast development
- Component-based architecture

### 🎨 Beautiful Design System  
- Tailwind CSS for consistent styling
- Custom components and layouts
- Responsive across all devices

### 🔒 Enterprise-Grade Security
- JWT authentication with auto-refresh
- Role-based access control
- Secure API communication

### 🌍 Cultural Sensitivity
- Support for 12 Indian languages
- NSQF standard compliance
- Localized user experience

### 📱 Progressive Web App
- Works on any device
- Offline capabilities
- App-like experience

## 🆘 Troubleshooting

### Port Already in Use?
```bash
# Kill process using port 3000
npx kill-port 3000
npm run dev
```

### Dependencies Issues?
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Backend Connection Issues?
- Ensure FastAPI server is running on port 8000
- Check CORS configuration in backend
- Verify API endpoints are accessible

## 📞 Need Help?

The frontend includes:
- 📖 Comprehensive documentation
- 🧪 Demo data and accounts  
- 🔧 Development tools and debugging
- 📱 Responsive design testing

**Happy Coding! 🎉**