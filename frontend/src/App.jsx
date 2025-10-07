import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './components/Login'
import Signup from './components/Signup'
import Dashboard from './components/Dashboard'
import './App.css'
import './styles.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Verify token and get user info
      fetch('/api/v1/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        if (!res.ok) {
          throw new Error('Token invalid')
        }
        return res.json()
      })
      .then(data => {
        console.log('User data loaded:', data) // Debug log
        if (data.id) {
          setUser(data)
        }
      })
      .catch((error) => {
        console.error('Auth error:', error)
        localStorage.removeItem('token')
      })
      .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <Router>
      <div className="app">
        <nav className="nav">
          <div className="nav-content">
            <Link to="/" className="logo">
              🏆 MicroMerge
            </Link>
            {user ? (
              <div className="nav-links">
                <span className="user-welcome">
                  Welcome, {user.email} 
                  <span className="role-badge">{user.role}</span>
                </span>
                <button onClick={logout} className="logout-btn">Logout</button>
              </div>
            ) : (
              <div className="nav-links">
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
              </div>
            )}
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={
              user ? <Dashboard user={user} /> : <Home />
            } />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/signup" element={<Signup setUser={setUser} />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

function Home() {
  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to MicroMerge</h1>
          <p className="hero-subtitle">
            India's First NCVET Compliant Centralized Micro-Credential Aggregator Platform
          </p>
          <div className="hero-badges">
            <span className="ncvet-badge">🇮🇳 NCVET Compliant</span>
            <span className="digital-india-badge">🚀 Digital India</span>
          </div>
        </div>
      </div>
      
      <div className="features-section">
        <h2>Empowering India's Digital Workforce</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎓</div>
            <h3>For Learners</h3>
            <p>Collect, manage, and showcase all your micro-credentials in one secure, 
               blockchain-verified platform. Track your skills progression across NSQF levels 1-10.</p>
            <ul>
              <li>Secure digital wallet for credentials</li>
              <li>NSQF level tracking</li>
              <li>Skills progression analytics</li>
              <li>Public verification links</li>
            </ul>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🏢</div>
            <h3>For Issuers</h3>
            <p>Issue and manage digital credentials with complete compliance to NCVET standards. 
               Create badge templates and streamline your certification process.</p>
            <ul>
              <li>NCVET compliant templates</li>
              <li>Blockchain verification</li>
              <li>Batch credential issuance</li>
              <li>Analytics and reporting</li>
            </ul>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💼</div>
            <h3>For Employers</h3>
            <p>Verify candidate credentials instantly with trust and transparency. 
               Create job requirements mapped to NSQF standards and find qualified talent.</p>
            <ul>
              <li>Instant verification</li>
              <li>Skills-based matching</li>
              <li>NSQF aligned requirements</li>
              <li>Talent analytics</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Join thousands of learners, issuers, and employers building India's digital skills ecosystem.</p>
        <div className="cta-buttons">
          <Link to="/signup" className="cta-btn primary">Get Started Today</Link>
          <Link to="/login" className="cta-btn secondary">Already have an account?</Link>
        </div>
      </div>
    </div>
  )
}

export default App