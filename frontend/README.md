# MicroMerge Frontend

A modern, user-friendly React frontend for the MicroMerge digital credential management platform. Built with React, TypeScript, Tailwind CSS, and featuring comprehensive NSQF compliance and multilingual support.

## 🚀 Features

### 🎯 Core Features
- **Modern React Architecture**: Built with React 18, TypeScript, and Vite for optimal performance
- **Responsive Design**: Mobile-first design that works on all devices
- **Role-Based Access Control**: Separate interfaces for Learners, Issuers, Employers, and Administrators
- **Real-time Authentication**: JWT-based authentication with secure token management

### 🌐 NSQF Compliance
- Full support for NSQF Levels 1-10
- Automated NSQF validation and standards compliance
- Visual NSQF level indicators and certification pathways
- Skills mapping and competency tracking

### 🌏 Multilingual Support
Support for 12 Indian languages:
- English (en)
- Hindi (हिन्दी)
- Tamil (தமிழ்)
- Telugu (తెలుగు)
- Bengali (বাংলা)
- Marathi (मराठी)
- Gujarati (ગુજરાતી)
- Kannada (ಕನ್ನಡ)
- Malayalam (മലയാളം)
- Punjabi (ਪੰਜਾਬੀ)
- Odia (ଓଡ଼ିଆ)
- Assamese (অসমীয়া)

### 📊 Advanced Functionality
- **Interactive Dashboard**: Role-specific dashboards with analytics and insights
- **Credential Verification**: QR code and verification code based credential validation
- **Badge Template Management**: Visual badge designer with NSQF compliance
- **Real-time Notifications**: Toast notifications for user actions and system updates
- **Advanced Search & Filtering**: Multi-criteria search across all entities

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router v6 with protected routes
- **State Management**: React Context API for auth and language
- **HTTP Client**: Axios with interceptors for API communication
- **UI Components**: Headless UI and Lucide React icons
- **Animations**: Framer Motion for smooth transitions
- **Form Handling**: React Hook Form for efficient form management
- **Notifications**: React Hot Toast for user feedback

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Layout.tsx       # Main layout wrapper
│   ├── PrivateRoute.tsx # Protected route wrapper
│   └── PublicRoute.tsx  # Public route wrapper
├── contexts/            # React Context providers
│   ├── AuthContext.tsx  # Authentication state management
│   └── LanguageContext.tsx # Multilingual support
├── pages/               # Page components
│   ├── admin/          # Admin-specific pages
│   ├── employer/       # Employer-specific pages
│   ├── issuer/         # Issuer-specific pages
│   ├── learner/        # Learner-specific pages
│   ├── Login.tsx       # Authentication pages
│   ├── Register.tsx
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Credentials.tsx # Credential management
│   ├── BadgeTemplates.tsx # Badge template management
│   ├── Profile.tsx     # User profile management
│   └── VerifyCredential.tsx # Public credential verification
├── services/           # API service layer
│   └── api.ts          # Centralized API functions
├── types/              # TypeScript type definitions
│   └── index.ts        # All interface definitions
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles and Tailwind imports
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MicroMerge backend server running on http://localhost:8000

### Installation

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview  # Preview production build
```

## 🔐 Authentication & Demo Accounts

The application includes demo accounts for testing all role types:

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| **Learner** | `fresh_learner@test.com` | `password123` | Access learning dashboard and credentials |
| **Issuer** | `fresh_issuer@test.com` | `password123` | Create badge templates and issue credentials |
| **Employer** | `fresh_employer@test.com` | `password123` | Verify credentials and manage hiring |
| **Admin** | `fresh_admin@test.com` | `password123` | Full platform administration |

## 🎨 Design System

### Color Palette
- **Primary**: Blue (`#3b82f6`) - Main brand color
- **Secondary**: Gray (`#64748b`) - Supporting elements
- **Success**: Green (`#10b981`) - Positive actions
- **Warning**: Yellow (`#f59e0b`) - Caution states
- **Error**: Red (`#ef4444`) - Error states

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold weights with proper hierarchy
- **Body Text**: Regular weight with optimal line height

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Multiple variants (primary, secondary, outline)
- **Forms**: Consistent styling with validation states
- **Navigation**: Clean sidebar with active states

## 🔧 API Integration

### Base Configuration
```typescript
const API_BASE_URL = 'http://localhost:8000'
```

### Available Services
- **Authentication**: Login, register, token management
- **Credentials**: CRUD operations and verification
- **Badge Templates**: Template management and design
- **User Profiles**: Role-specific profile management
- **NSQF**: Level validation and compliance checking
- **Multilingual**: Language switching and translations

### Request Interceptors
- Automatic JWT token attachment
- Request/response logging in development
- Error handling and token refresh

## 🌐 Responsive Design

### Breakpoints
- **Mobile**: `< 640px`
- **Tablet**: `640px - 1024px`
- **Desktop**: `> 1024px`

### Features
- Mobile-first approach
- Collapsible sidebar navigation
- Touch-friendly interactions
- Optimized for various screen sizes

## 🎯 Role-Specific Features

### 👨‍🎓 Learner Dashboard
- Personal credential portfolio
- Learning progress tracking
- Skill development pathways
- Achievement showcases

### 🏢 Issuer Dashboard
- Badge template creation and management
- Credential issuance workflows
- NSQF compliance validation
- Bulk operations support

### 💼 Employer Dashboard
- Credential verification tools
- Candidate skill assessment
- Hiring process integration
- Verification history

### ⚙️ Admin Dashboard
- Platform-wide analytics
- User management
- System configuration
- Audit logs and reporting

## 🔍 Search & Filter Capabilities

### Credential Search
- Full-text search across titles and descriptions
- Filter by status (issued, revoked, expired)
- Filter by NSQF levels
- Sort by date, issuer, or relevance

### User Management
- Search by name, email, or role
- Filter by registration date
- Role-based filtering
- Bulk actions support

## 📱 Progressive Web App (PWA) Ready

- Service worker configuration
- Offline functionality
- App-like experience on mobile devices
- Push notification support (future enhancement)

## 🚀 Performance Optimizations

- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Component lazy loading for improved initial load
- **Image Optimization**: Responsive images with proper formats
- **Bundle Analysis**: Webpack bundle analyzer integration
- **Caching Strategy**: Efficient caching for API responses

## 🔧 Development Tools

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Development Features
- Hot Module Replacement (HMR)
- TypeScript support with strict mode
- ESLint configuration for code quality
- Prettier integration for code formatting
- Path aliases for clean imports

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation for common solutions

---

**MicroMerge Frontend** - Empowering digital credential management with modern technology and user-centric design.