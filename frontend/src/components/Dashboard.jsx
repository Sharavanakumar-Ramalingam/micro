import { useState, useEffect } from 'react'
import CredentialsList from './CredentialsList'
import IssueCredential from './IssueCredential'
import BadgeTemplates from './BadgeTemplates'
import IssuerProfile from './IssuerProfile'

export default function Dashboard({ user }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [user])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      let endpoint = '/api/v1/analytics/learner'
      
      if (user?.role === 'issuer') {
        endpoint = '/api/v1/analytics/issuer'
      } else if (user?.role === 'employer') {
        endpoint = '/api/v1/analytics/employer'
      }

      const response = await fetch(endpoint, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown'
    try {
      return new Date(dateString).toLocaleDateString()
    } catch (e) {
      return 'Unknown'
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="overview-content">
            <div className="welcome-section">
              <div className="user-avatar">
                <span className="avatar-icon">{user?.email?.charAt(0).toUpperCase() || 'U'}</span>
              </div>
              <div className="welcome-text">
                <h2>Welcome back, {user?.email?.split('@')[0] || 'User'}</h2>
                <p className="user-role">
                  {user?.role === 'learner' && '🎓 Learner'}
                  {user?.role === 'issuer' && '🏢 Credential Issuer'}
                  {user?.role === 'employer' && '💼 Employer'}
                  {user?.role === 'admin' && '⚙️ Administrator'}
                </p>
                <p className="member-since">Member since {formatDate(user?.created_at)}</p>
              </div>
            </div>

            {stats && (
              <div className="metrics-section">
                <h3 className="section-title">Your Dashboard Metrics</h3>
                <div className="metrics-grid">
                  {user?.role === 'learner' && (
                    <>
                      <div className="metric-item">
                        <div className="metric-number">{stats.total_credentials || 0}</div>
                        <div className="metric-label">Total Credentials</div>
                      </div>
                      <div className="metric-item">
                        <div className="metric-number">{stats.active_credentials || 0}</div>
                        <div className="metric-label">Active Credentials</div>
                      </div>
                      <div className="metric-item">
                        <div className="metric-number">{stats.unique_skills || 0}</div>
                        <div className="metric-label">Skills Earned</div>
                      </div>
                      <div className="metric-item">
                        <div className="metric-number">{stats.total_credit_hours || 0}</div>
                        <div className="metric-label">Credit Hours</div>
                      </div>
                    </>
                  )}

                  {user?.role === 'issuer' && (
                    <>
                      <div className="metric-item">
                        <div className="metric-number">{stats.total_credentials_issued || 0}</div>
                        <div className="metric-label">Credentials Issued</div>
                      </div>
                      <div className="metric-item">
                        <div className="metric-number">{stats.badge_templates || 0}</div>
                        <div className="metric-label">Badge Templates</div>
                      </div>
                      <div className="metric-item">
                        <div className="metric-number">{stats.unique_learners || 0}</div>
                        <div className="metric-label">Active Learners</div>
                      </div>
                      <div className="metric-item">
                        <div className="metric-number">{stats.credentials_this_month || 0}</div>
                        <div className="metric-label">This Month</div>
                      </div>
                    </>
                  )}

                  {user?.role === 'employer' && (
                    <>
                      <div className="metric-item">
                        <div className="metric-number">{stats.job_requirements || 0}</div>
                        <div className="metric-label">Job Requirements</div>
                      </div>
                      <div className="metric-item">
                        <div className="metric-number">{stats.candidates_verified || 0}</div>
                        <div className="metric-label">Candidates Verified</div>
                      </div>
                      <div className="metric-item">
                        <div className="metric-number">{stats.skills_in_demand || 0}</div>
                        <div className="metric-label">Skills in Demand</div>
                      </div>
                      <div className="metric-item">
                        <div className="metric-number">{stats.avg_nsqf_level || 0}</div>
                        <div className="metric-label">Avg NSQF Level</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="quick-actions-section">
              <h3 className="section-title">Quick Actions</h3>
              <div className="action-buttons">
                {user?.role === 'learner' && (
                  <>
                    <button onClick={() => setActiveTab('credentials')} className="action-btn primary">
                      <span className="btn-icon">🏆</span>
                      View My Credentials
                    </button>
                    <button className="action-btn secondary">
                      <span className="btn-icon">📊</span>
                      Skills Progress
                    </button>
                  </>
                )}
                {user?.role === 'issuer' && (
                  <>
                    <button onClick={() => setActiveTab('issue')} className="action-btn primary">
                      <span className="btn-icon">➕</span>
                      Issue New Credential
                    </button>
                    <button onClick={() => setActiveTab('templates')} className="action-btn secondary">
                      <span className="btn-icon">🎖️</span>
                      Manage Templates
                    </button>
                    <button onClick={() => setActiveTab('profile')} className="action-btn tertiary">
                      <span className="btn-icon">🏢</span>
                      Organization Profile
                    </button>
                  </>
                )}
                {user?.role === 'employer' && (
                  <>
                    <button className="action-btn primary">
                      <span className="btn-icon">✅</span>
                      Verify Credentials
                    </button>
                    <button className="action-btn secondary">
                      <span className="btn-icon">💼</span>
                      Job Requirements
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )

      case 'credentials':
        return <CredentialsList userRole={user?.role} />

      case 'issue':
        return user?.role === 'issuer' ? <IssueCredential /> : <div>Access denied</div>

      case 'templates':
        return user?.role === 'issuer' ? <BadgeTemplates /> : <div>Access denied</div>

      case 'profile':
        return user?.role === 'issuer' ? <IssuerProfile /> : <div>Access denied</div>

      default:
        return <div>Tab not found</div>
    }
  }

  const getTabs = () => {
    const baseTabs = [
      { id: 'overview', label: 'Overview', icon: '📊' }
    ]

    if (user?.role === 'learner') {
      baseTabs.push(
        { id: 'credentials', label: 'My Credentials', icon: '🏆' }
      )
    }

    if (user?.role === 'issuer') {
      baseTabs.push(
        { id: 'credentials', label: 'Issued Credentials', icon: '🏆' },
        { id: 'issue', label: 'Issue Credential', icon: '➕' },
        { id: 'templates', label: 'Badge Templates', icon: '🎖️' },
        { id: 'profile', label: 'Issuer Profile', icon: '🏢' }
      )
    }

    if (user?.role === 'employer') {
      baseTabs.push(
        { id: 'verify', label: 'Verify Credentials', icon: '✅' },
        { id: 'jobs', label: 'Job Requirements', icon: '💼' }
      )
    }

    return baseTabs
  }

  if (loading) return <div className="loading">Loading dashboard...</div>

  return (
    <div className="dashboard">
      <div className="dashboard-tabs">
        {getTabs().map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="dashboard-content">
        {renderTabContent()}
      </div>
    </div>
  )
}