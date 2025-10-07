import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Signup({ setUser }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'learner'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/v1/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (response.ok) {
        // Auto-login after signup
        const loginResponse = await fetch('/api/v1/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        })

        const loginResult = await loginResponse.json()
        
        if (loginResponse.ok) {
          localStorage.setItem('token', loginResult.access_token)
          
          // Get user info after login
          const userResponse = await fetch('/api/v1/auth/me', {
            headers: { 'Authorization': `Bearer ${loginResult.access_token}` }
          })
          
          if (userResponse.ok) {
            const userData = await userResponse.json()
            setUser(userData)
            navigate('/')
          } else {
            setError('Failed to get user information')
          }
        }
      } else {
        setError(data.detail || 'Signup failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-form">
      <h2>Sign Up</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
          minLength="6"
        />
        <select
          value={formData.role}
          onChange={(e) => setFormData({...formData, role: e.target.value})}
        >
          <option value="learner">Learner</option>
          <option value="issuer">Issuer</option>
          <option value="employer">Employer</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
    </div>
  )
}