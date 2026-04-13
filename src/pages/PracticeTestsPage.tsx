import { Link } from 'react-router-dom'
import ukFlag from '../assets/uk_flag.png'

export default function PracticeTestsPage() {
  return (
    <div style={{ maxWidth: 900, margin: '32px auto', padding: 16 }}>
      <h1 style={{ marginBottom: 8 }}>Practice Tests</h1>
      <div
        style={{
          marginTop: 16,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 12,
          textAlign: 'left',
        }}
      >
        {Array.from({ length: 30 }, (_, i) => {
          const n = i + 1
          const label = `Test${n}`
          const to = `/practice-tests/${label.toLowerCase()}`

          return (
            <Link
              key={label}
              to={to}
              style={{
                display: 'block',
                padding: 12,
                border: '1px solid rgba(0,0,0,0.15)',
                borderRadius: 10,
                textDecoration: 'none',
                color: '#111',
                background: '#fff',
              }}
            >
              <img
                src={ukFlag}
                alt=""
                aria-hidden="true"
                style={{ width: 18, height: 12, marginRight: 8, verticalAlign: 'middle' }}
              />
              {label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
