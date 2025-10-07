# MicroMerge - National Micro-Credential Aggregator Platform

## Overview

MicroMerge is a comprehensive centralized micro-credential aggregator platform designed specifically for India's National Council for Vocational Education and Training (NCVET) requirements. The platform addresses the challenge of fragmented micro-credentials by providing a unified system to collect, validate, organize, and display learner achievements from multiple training providers, universities, and online platforms.

## 🚀 Key Features


### Core Platform Features
- **Centralized Credential Aggregation**: Collect and integrate micro-credentials from multiple sources
- **Unified Learner Profiles**: Comprehensive digital portfolios showing all acquired micro-credentials
- **Multi-stakeholder Support**: Dedicated portals for learners, issuers, employers, and administrators
- **Professional Verification**: Credly-like credential issuance, viewing, and verification system

### NCVET-Specific Features
- **NSQF Alignment**: Full integration with National Skills Qualifications Framework (Levels 1-10)
- **Stackable Credentials**: Support for credit-linked and stackable qualifications
- **Multiple Verification Methods**: Blockchain, DigiLocker, and Skill India Digital integration
- **Regulatory Compliance**: Built-in compliance reporting and national statistics tracking

### Digital India Integration
- **DigiLocker Integration**: Seamless document verification and storage
- **Skill India Digital**: Direct integration with PMKVY courses and apprenticeships
- **Blockchain Verification**: Immutable credential verification using blockchain technology
- **Multilingual Support**: Content available in 12+ Indian languages

### Advanced Features
- **AI-Powered Skill Matching**: Intelligent job-skill matching for employers
- **Employer Portal**: Comprehensive recruitment and verification tools
- **Quality Assurance**: Multi-level verification and trust scoring
- **Analytics Dashboard**: Real-time insights and reporting for all stakeholders

## 🏗️ Architecture

### Backend API (FastAPI)
- **Framework**: FastAPI with Python 3.12
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT-based with role-based access control
- **API Documentation**: Auto-generated with OpenAPI/Swagger
- **Development**: Hot-reload development server with uvicorn

### Database Schema
- **Users**: Multi-role support (learners, issuers, employers, administrators)
- **Credentials**: Enhanced with NSQF metadata and verification tracking
- **Badge Templates**: Credly-like template system for credential issuance
- **NCVET Tables**: NSQF mapping, employer profiles, job requirements, blockchain verification
- **External Providers**: Integration with DigiLocker, Skill India Digital
- **Blockchain Verification**: Immutable credential verification records

### API Features
- **RESTful Design**: Clean, intuitive API endpoints
- **Auto Documentation**: Interactive Swagger UI and ReDoc
- **Data Validation**: Pydantic models for request/response validation
- **Error Handling**: Comprehensive error responses with proper status codes
- **CORS Support**: Configurable cross-origin resource sharing

## 🛠️ Technology Stack

### Backend API
- **FastAPI**: Modern, fast web framework for building APIs with automatic documentation
- **PostgreSQL**: Robust relational database for data persistence and complex queries
- **SQLAlchemy**: Python SQL toolkit and ORM for database operations
- **Alembic**: Database migration tool for schema versioning
- **JWT**: JSON Web Tokens for secure authentication and authorization
- **bcrypt**: Password hashing for security
- **Pydantic**: Data validation and settings management using Python type annotations
- **uvicorn**: ASGI server for high-performance async applications

### Integration & Verification
- **Blockchain Integration**: For immutable credential verification
- **DigiLocker API**: Government document verification
- **Skill India Digital**: PMKVY and apprenticeship integration
- **Email Services**: Credential notification and sharing
- **File Upload**: Secure document and badge image handling

## 📊 API Endpoints

### Authentication & User Management
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user profile
- `PUT /api/v1/users/profile` - Update user profile

### Credential Management
- `POST /api/v1/credentials` - Create new credential
- `POST /api/v1/credentials/issue` - Issue credential from template
- `GET /api/v1/credentials/my` - Get learner's credentials
- `GET /api/v1/credentials/issued` - Get issuer's issued credentials
- `POST /api/v1/credentials/{id}/share` - Share credential on social platforms

### Badge Templates (Credly-like)
- `POST /api/v1/badge-templates` - Create badge template
- `GET /api/v1/badge-templates` - Get issuer's templates
- `PUT /api/v1/badge-templates/{id}` - Update template

### Public Verification
- `GET /public/credentials/{public_url}` - View public credential
- `POST /api/v1/verify` - Verify credential by code
- `GET /api/v1/credentials/{id}/verification-status` - Get verification status

### NCVET & NSQF Features
- `GET /api/v1/nsqf/levels` - Get NSQF level descriptions
- `GET /api/v1/credentials/nsqf-analysis/{learner_id}` - NSQF analysis
- `GET /api/v1/admin/national-statistics` - National statistics for regulators

### Employer Portal
- `POST /api/v1/employers/profile` - Create employer profile
- `POST /api/v1/employers/job-requirements` - Post job requirements
- `GET /api/v1/employers/skill-matching/{job_id}` - Find matching candidates

### Digital India Integration
- `POST /api/v1/integrations/digilocker/link` - Link DigiLocker account
- `POST /api/v1/integrations/skill-india/link` - Link Skill India profile
- `POST /api/v1/credentials/{id}/blockchain-verify` - Create blockchain verification

### Multilingual Support
- `GET /api/v1/content/languages` - Get supported languages
- `GET /api/v1/credentials/{id}/translate/{lang}` - Get translated content

## 🚀 Quick Start

### Prerequisites
- Python 3.12+
- PostgreSQL 12+
- Git (for version control)

### Backend API Setup

1. **Clone and navigate to project**
   ```bash
   git clone https://github.com/Sharavanakumar-Ramalingam/micro.git
   cd micro
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment configuration**
   ```bash
   # Create .env file with the following variables:
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/micromerge_fresh
   SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=60
   ENVIRONMENT=development
   ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
   HOST=0.0.0.0
   PORT=8000
   ```

5. **Database setup (Fresh Start)**
   ```bash
   # Option 1: Use the provided script to create fresh database
   python create_fresh_db.py
   
   # Option 2: Manual database creation
   createdb micromerge_fresh
   
   # Run migrations to create all tables
   alembic upgrade head
   ```

6. **Start backend server**
   ```bash
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Access the API
- **API Documentation (Swagger UI)**: http://localhost:8000/docs
- **Alternative Documentation (ReDoc)**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health
- **API Base URL**: http://localhost:8000/api/v1

### Testing the API
You can test the API endpoints using:
- **Swagger UI**: Interactive testing at http://localhost:8000/docs
- **curl**: Command line HTTP requests
- **Postman**: Import OpenAPI specification from http://localhost:8000/openapi.json
- **Python requests**: Direct API integration testing

## 🎯 Use Cases

### For Learners
- Aggregate all micro-credentials in one unified profile
- Share verifiable credentials with employers and institutions
- Track NSQF progression and career pathways
- Access multilingual content and support

### For Issuers (Training Providers/Universities)
- Issue professional-grade digital credentials
- Create reusable badge templates
- Track credential analytics and engagement
- Integrate with existing learning management systems

### For Employers
- Search and verify candidate qualifications
- Post job requirements with skill matching
- Access detailed skill analytics and reports
- Streamline recruitment with verified credentials

### For NCVET/Regulators
- Monitor national micro-credential ecosystem
- Generate compliance and quality reports
- Track NSQF alignment and progression
- Ensure standardization across providers

## 📈 NSQF Levels Integration

The platform fully supports all 10 NSQF levels with detailed mappings:

- **Level 1-2**: Basic operational roles with routine procedures
- **Level 3-4**: Roles requiring responsibility for quality and guidance
- **Level 5-6**: Technical and managerial positions
- **Level 7-8**: Senior technical and leadership roles
- **Level 9-10**: Executive and strategic positions

Each credential can be mapped to appropriate NSQF levels with:
- Credit hour calculations
- Learning outcome tracking
- Competency framework alignment
- Stackability analysis

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Granular permissions for different user types
- **Password Hashing**: bcrypt for secure password storage
- **Blockchain Verification**: Immutable credential verification
- **Data Encryption**: Sensitive data protection
- **API Rate Limiting**: Protection against abuse

## 🌐 Multilingual Support

Content available in 12+ Indian languages:
- English (en) - Primary
- Hindi (hi) - हिंदी
- Tamil (ta) - தமிழ்
- Telugu (te) - తెలుగు
- Bengali (bn) - বাংলা
- Gujarati (gu) - ગુજરાતી
- Kannada (kn) - ಕನ್ನಡ
- Malayalam (ml) - മലയാളം
- Marathi (mr) - मराठी
- Odia (or) - ଓଡ଼ିଆ
- Punjabi (pa) - ਪੰਜਾਬੀ
- Urdu (ur) - اردو

## 📱 Mobile Responsiveness

The platform is designed to be fully responsive and mobile-friendly, ensuring accessibility across all devices used by India's diverse learner population.

## 🔄 API Integration

Built-in support for integration with:
- **University Systems**: Seamless credential import from academic institutions
- **EdTech Platforms**: Direct integration with online learning platforms
- **Corporate Training**: Enterprise learning management systems
- **Government Platforms**: DigiLocker, Skill India Digital, PMKVY

## 📊 Analytics & Reporting

Comprehensive analytics for all stakeholders:
- **Learner Analytics**: Skill progression, credential analytics
- **Issuer Analytics**: Credential performance, engagement metrics
- **Employer Analytics**: Recruitment insights, skill demand trends
- **National Analytics**: Regulatory compliance, ecosystem health

## 🚦 Status & Roadmap

### Current Status: ✅ Backend API Complete
- ✅ Core platform functionality complete
- ✅ NCVET requirements implemented
- ✅ Multi-stakeholder API endpoints operational
- ✅ Integration APIs available
- ✅ Authentication and authorization working
- ✅ Database schema with all NCVET features
- ✅ Comprehensive API documentation
- ✅ 50+ API endpoints covering all use cases

### API Coverage
- ✅ User management and authentication
- ✅ Credential issuance and management
- ✅ Badge template system (Credly-like)
- ✅ Public credential verification
- ✅ NSQF integration and analysis
- ✅ Employer portal APIs
- ✅ Digital India integration endpoints
- ✅ Multilingual content support
- ✅ Blockchain verification APIs
- ✅ Admin and regulatory reporting

## 📁 Project Structure

```
MicroMerge/
├── app/                    # FastAPI application
│   ├── __init__.py
│   ├── main.py            # Main application entry point
│   ├── database.py        # Database configuration
│   ├── models.py          # SQLAlchemy database models
│   ├── schemas.py         # Pydantic models for API
│   ├── auth.py            # Authentication logic
│   └── api/               # API route modules
│       ├── __init__.py
│       ├── auth.py        # Authentication endpoints
│       ├── users.py       # User management endpoints
│       ├── credentials.py # Credential management endpoints
│       └── ...            # Other API modules
├── alembic/               # Database migrations
│   ├── versions/          # Migration files
│   └── env.py            # Alembic configuration
├── requirements.txt       # Python dependencies
├── .env                  # Environment variables
├── alembic.ini          # Alembic configuration
├── create_fresh_db.py   # Database setup script
└── README.md            # This file
```

### API Module Organization
- **auth.py**: User registration, login, JWT token management
- **users.py**: User profile management, role assignments
- **credentials.py**: Credential CRUD operations, issuance, verification
- **badge_templates.py**: Badge template management for issuers
- **employers.py**: Employer portal APIs, job postings, skill matching
- **public.py**: Public credential viewing and verification
- **admin.py**: Administrative functions, national statistics
- **integrations.py**: DigiLocker, Skill India Digital, blockchain APIs

### Future Enhancements
- 🚧 Frontend web application
- 🚧 Mobile app development
- 🚧 AI-powered career pathway recommendations
- 🚧 Advanced blockchain features
- 🚧 Advanced analytics and ML insights
- 🚧 International standard compliance (OpenBadges, IMS Global)
- 🚧 Performance optimization and caching
- 🚧 Microservices architecture scaling

## 📞 Support & Contact

For technical support, feature requests, or NCVET compliance questions:
- **Email**: support@micromerge.gov.in
- **Documentation**: [API Docs](http://localhost:8000/docs)
- **Issues**: GitHub Issues
- **NCVET Compliance**: compliance@ncvet.gov.in

## 📄 License

This project is developed for NCVET and the Government of India's Digital India initiative. Please refer to the LICENSE file for detailed terms and conditions.

---

**MicroMerge** - Empowering India's workforce through unified micro-credential management and NSQF-aligned skill recognition.