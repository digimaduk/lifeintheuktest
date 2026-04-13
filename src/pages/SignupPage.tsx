import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SignupPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div style={{ maxWidth: 420, margin: '72px auto', padding: 16 }}>
      <h1 style={{ marginBottom: 8 }}>Signup</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>
        Signup is a placeholder screen for now.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          navigate('/login')
        }}
      >
        <label style={{ display: 'block', marginBottom: 12 }}>
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            style={{ width: '100%', padding: 10, marginTop: 6 }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 12 }}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            style={{ width: '100%', padding: 10, marginTop: 6 }}
          />
        </label>

        <button type="submit" style={{ width: '100%', padding: 10 }}>
          Create account
        </button>
      </form>
    </div>
  )
}
