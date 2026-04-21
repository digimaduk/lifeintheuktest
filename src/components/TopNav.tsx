import { NavLink } from 'react-router-dom'
import { useMemo, useState } from 'react'
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
  const [isStudyGuideOpen, setIsStudyGuideOpen] = useState(false)

  const studyGuideTopics = useMemo(
    () => [
      { label: 'Early Britain', topic: 'early-britain' },
      { label: 'Roman Britain', topic: 'roman-britain' },
      { label: 'Early Medieval / Anglo‑Saxon Britain', topic: 'medieval-britain' },
      { label: 'Viking Age', topic: 'vikings' },
      { label: 'Norman & Medieval Britain', topic: 'norman-conquest' },
      { label: 'Tudor Britain', topic: 'tudor-britain' },
      { label: 'Stuart Britain', topic: 'stuart-britain' },
      { label: 'Georgian Britain', topic: 'georgian-britain' },
      { label: 'Victorian Britain', topic: 'victorian-britain' },
      { label: 'Modern Britain', topic: 'modern-britain' }
    ],
    []
  )

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
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              paddingBottom: 8,
            }}
            onMouseEnter={() => setIsStudyGuideOpen(true)}
            onMouseLeave={() => setIsStudyGuideOpen(false)}
          >
            <NavItem to="/study-guide" label="Study Guide" />

            {isStudyGuideOpen ? (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  minWidth: 240,
                  background: '#0b0b0b',
                  border: '1px solid rgba(255,255,255,0.18)',
                  borderRadius: 12,
                  padding: 8,
                  boxShadow: '0 10px 24px rgba(0,0,0,0.35)',
                }}
              >
                {studyGuideTopics.map((t) => (
                  <NavLink
                    key={t.topic}
                    to={`/study-guide?topic=${encodeURIComponent(t.topic)}`}
                    style={({ isActive }) => ({
                      display: 'block',
                      padding: '10px 10px',
                      borderRadius: 10,
                      textDecoration: 'none',
                      color: '#fff',
                      opacity: isActive ? 1 : 0.9,
                      background: isActive ? 'rgba(255,255,255,0.14)' : 'transparent',
                      fontWeight: 600,
                    })}
                  >
                    {t.label}
                  </NavLink>
                ))}
              </div>
            ) : null}
          </div>
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
