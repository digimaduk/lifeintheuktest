import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

type LocationState = {
  from?: { pathname?: string }
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const fromPath = useMemo(() => {
    const state = location.state as LocationState | null
    return state?.from?.pathname ?? '/'
  }, [location.state])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <div style={{ maxWidth: 420, margin: '72px auto', padding: 16 }}>
      <h1 style={{ marginBottom: 8 }}>Login</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>
        Use <code>admin</code> / <code>password</code>
      </p>

      <form
        onSubmit={async (e) => {
          e.preventDefault()
          setError(null)
          setIsSubmitting(true)

          try {
            const ok = await login(username, password)
            if (!ok) {
              setError('Invalid username or password')
              return
            }
            navigate(fromPath, { replace: true })
          } finally {
            setIsSubmitting(false)
          }
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '160px 1fr',
            gap: 12,
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <label htmlFor="username" style={{ justifySelf: 'start' }}>
            Username or Email <span aria-hidden="true">*</span>
          </label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            style={{ width: '100%', padding: 10 }}
          />

          <label htmlFor="password" style={{ justifySelf: 'start' }}>
            Password <span aria-hidden="true">*</span>
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            style={{ width: '100%', padding: 10 }}
          />
        </div>

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
          style={{ width: '100%', padding: 10 }}
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
