import { NavLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import ukFlag from '../assets/uk_flag.png'

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        textDecoration: 'none',
        padding: '8px 10px',
        borderRadius: 8,
        color: '#fff',
        opacity: isActive ? 1 : 0.9,
        background: isActive ? 'rgba(255,255,255,0.14)' : 'transparent',
        fontWeight: isActive ? 600 : 500,
      })}
    >
      {label}
    </NavLink>
  )
}

export default function TopNav() {
  const { isAuthenticated, logout, user } = useAuth()

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: '#000',
        color: '#fff',
        borderBottom: '1px solid rgba(255,255,255,0.18)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: 12,
          maxWidth: 1100,
          margin: '0 auto',
          padding: '10px 16px',
        }}
      >
        <div style={{ justifySelf: 'start', fontWeight: 700 }}>
          LifeInTheUK
        </div>

        <nav
          aria-label="Primary"
          style={{
            justifySelf: 'center',
            display: 'flex',
            gap: 6,
            flexWrap: 'wrap',
          }}
        >
          <NavItem to="/" label="Home" />
          <NavItem to="/about" label="About" />
          <NavItem to="/contact" label="Contact" />
          <NavItem to="/practice-tests" label="Practice Tests" />
          <NavItem to="/study-guide" label="Study Guide" />
        </nav>

        <div style={{ justifySelf: 'end', display: 'flex', gap: 6 }}>
          {!isAuthenticated ? (
            <>
              <NavItem to="/signup" label="Signup" />
              <NavItem to="/login" label="Login" />
            </>
          ) : (
            <>
              <span
                aria-hidden="true"
                title={user?.username ?? ''}
                style={{
                  alignSelf: 'center',
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.25)',
                  display: 'inline-flex',
                }}
              >
                <img
                  src={ukFlag}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </span>
              <button
                onClick={() => logout()}
                style={{
                  padding: '8px 10px',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.18)',
                  background: 'transparent',
                  color: 'inherit',
                  cursor: 'pointer',
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
