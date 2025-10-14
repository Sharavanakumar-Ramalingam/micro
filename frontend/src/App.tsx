import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { PrivateRoute } from './components/PrivateRoute';
import { PublicRoute } from './components/PublicRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Credentials from './pages/Credentials';
import BadgeTemplates from './pages/BadgeTemplates';
import VerifyCredential from './pages/VerifyCredential';
import AdminDashboard from './pages/admin/AdminDashboard';
import IssuerDashboard from './pages/issuer/IssuerDashboard';
import EmployerDashboard from './pages/employer/EmployerDashboard';
import EmployerTalentSearch from './pages/employer/EmployerTalentSearch';
import EmployerCredentialVerification from './pages/employer/EmployerCredentialVerification';
import EmployerJobPosting from './pages/employer/EmployerJobPosting';
import EmployerAnalytics from './pages/employer/EmployerAnalytics';
import EmployerProfile from './pages/employer/EmployerProfile';
import LearnerDashboard from './pages/learner/LearnerDashboard';
import LearnerProfile from './pages/learner/LearnerProfile';
import LearnerCredentials from './pages/learner/LearnerCredentials';
import CredentialDetail from './pages/learner/CredentialDetail';
import LearnerSkills from './pages/learner/LearnerSkills';
import LearnerSharing from './pages/learner/LearnerSharing';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                } 
              />
              <Route path="/verify/:verificationCode" element={<VerifyCredential />} />
              
              {/* Private Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/credentials" 
                element={
                  <PrivateRoute>
                    <Credentials />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/badge-templates" 
                element={
                  <PrivateRoute>
                    <BadgeTemplates />
                  </PrivateRoute>
                } 
              />
              
              {/* Role-specific Dashboards */}
              <Route 
                path="/admin" 
                element={
                  <PrivateRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/issuer" 
                element={
                  <PrivateRoute allowedRoles={['issuer']}>
                    <IssuerDashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/employer" 
                element={
                  <PrivateRoute allowedRoles={['employer']}>
                    <EmployerDashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/employer/talent-search" 
                element={
                  <PrivateRoute allowedRoles={['employer']}>
                    <EmployerTalentSearch />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/employer/verify-credential" 
                element={
                  <PrivateRoute allowedRoles={['employer']}>
                    <EmployerCredentialVerification />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/employer/post-job" 
                element={
                  <PrivateRoute allowedRoles={['employer']}>
                    <EmployerJobPosting />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/employer/analytics" 
                element={
                  <PrivateRoute allowedRoles={['employer']}>
                    <EmployerAnalytics />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/employer/profile" 
                element={
                  <PrivateRoute allowedRoles={['employer']}>
                    <EmployerProfile />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/learner" 
                element={
                  <PrivateRoute allowedRoles={['learner']}>
                    <LearnerDashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/learner/credentials" 
                element={
                  <PrivateRoute allowedRoles={['learner']}>
                    <LearnerCredentials />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/credentials/:id" 
                element={
                  <PrivateRoute allowedRoles={['learner']}>
                    <CredentialDetail />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/learner/skills" 
                element={
                  <PrivateRoute allowedRoles={['learner']}>
                    <LearnerSkills />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/learner/sharing" 
                element={
                  <PrivateRoute allowedRoles={['learner']}>
                    <LearnerSharing />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute allowedRoles={['learner']}>
                    <LearnerProfile />
                  </PrivateRoute>
                } 
              />
            </Routes>
            
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </div>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;