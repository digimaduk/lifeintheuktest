import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function SignupPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    marginTop: 6,
    borderRadius: 10,
    border: '1px solid rgba(0,0,0,0.18)',
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ maxWidth: 520, margin: '32px auto', padding: 16 }}>
      <div
        style={{
          background: '#fff',
          border: '1px solid rgba(0,0,0,0.12)',
          borderRadius: 14,
          padding: 18,
        }}
      >

        <h1 style={{ marginTop: 0, marginBottom: 4, fontSize: 32, color: '#111' }}>
          Create your account
        </h1>
        <p style={{ marginTop: 0, marginBottom: 16, opacity: 0.75 }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            style={{
              padding: 0,
              border: 'none',
              background: 'transparent',
              color: '#111',
              textDecoration: 'underline',
              cursor: 'pointer',
              font: 'inherit',
            }}
          >
            Login
          </button>
        </p>

        <form
          onSubmit={async (e) => {
            e.preventDefault()

            if (!email || !username || !password || !repeatPassword) {
              setError('Please fill in all fields')
              return
            }

            if (password !== repeatPassword) {
              setError('Passwords do not match')
              return
            }

            setError(null)
            setIsSubmitting(true)
            try {
              const ok = await register({ email, username, password })
              if (!ok) {
                setError('Signup failed. Please try again.')
                return
              }
              navigate('/login')
            } finally {
              setIsSubmitting(false)
            }
          }}
        >
          <label style={{ display: 'block', marginBottom: 12, color: '#111' }}>
            Email address
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              style={inputStyle}
            />
          </label>

          <label style={{ display: 'block', marginBottom: 12, color: '#111' }}>
            Username
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              style={inputStyle}
            />
          </label>

          <label style={{ display: 'block', marginBottom: 12, color: '#111' }}>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              style={inputStyle}
            />
          </label>

          <label style={{ display: 'block', marginBottom: 12, color: '#111' }}>
            Repeat password
            <input
              type="password"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              autoComplete="new-password"
              style={inputStyle}
            />
          </label>

        {error && (
          <div
            role="alert"
            style={{
              marginBottom: 12,
              padding: 10,
              background: '#2a1a1a',
              border: '1px solid #7a2a2a',
              borderRadius: 6,
            }}
          >
            {error}
          </div>
        )}

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 12,
              border: '1px solid rgba(0,0,0,0.12)',
              background: '#111',
              color: '#fff',
              fontWeight: 700,
              cursor: 'pointer',
              opacity: isSubmitting ? 0.75 : 1,
            }}
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  )
}
