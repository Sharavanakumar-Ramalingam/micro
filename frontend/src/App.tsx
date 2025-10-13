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
import Profile from './pages/Profile';
import Credentials from './pages/Credentials';
import BadgeTemplates from './pages/BadgeTemplates';
import VerifyCredential from './pages/VerifyCredential';
import AdminDashboard from './pages/admin/AdminDashboard';
import IssuerDashboard from './pages/issuer/IssuerDashboard';
import EmployerDashboard from './pages/employer/EmployerDashboard';
import LearnerDashboard from './pages/learner/LearnerDashboard';

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
                path="/profile" 
                element={
                  <PrivateRoute>
                    <Profile />
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
                path="/learner" 
                element={
                  <PrivateRoute allowedRoles={['learner']}>
                    <LearnerDashboard />
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