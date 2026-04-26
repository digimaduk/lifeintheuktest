import ukFlag from '../assets/uk_flag.png'
import londonLandmarks from '../assets/london_landmarks.png'
import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div style={{ margin: '32px auto', padding: 16 }}> {/* Container for the entire page,  maxWidth: 720 */}
      <div
        style={{
          position: 'relative',
          borderRadius: 16,
          overflow: 'hidden',
          padding: '16px 16px 20px',
          minHeight: 260,
          marginBottom: 18,
        }}
      >
        <img
          src={londonLandmarks}
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            opacity: 0.18,
            filter: 'grayscale(0.25) blur(0px)',
            transform: 'scale(1.08)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: 18,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 16,
            maxWidth: 640,
            margin: '0 auto',
          }}
        >
          <div style={{ textAlign: 'left' }}>
            <h1 style={{ marginBottom: 8, marginTop: 0 }}>Life in the UK Test</h1>
            <p style={{ marginTop: 0, marginBottom: 0, opacity: 0.85, fontSize: 20 }}>
              Prepare smarter. Pass with confidence.
            </p>
          </div>

          <img
            src={ukFlag}
            alt=""
            aria-hidden="true"
            style={{ width: 150, maxWidth: '35%', height: 'auto' }}
          />
        </div>
      </div>
      <div style={{ marginTop: 0, opacity: 0.92, lineHeight: 1.6, textAlign: 'left' }}>
        <p style={{ marginTop: 0 }}>
          The Life in the UK Test is an official exam required for people applying for
          British citizenship or indefinite leave to remain (ILR). It’s designed to
          check your understanding of life, history, values, and traditions in the
          United Kingdom.
        </p>
        <p style={{ marginTop: 12 }}>
          You must pass this test to show that you have sufficient knowledge of
          British society and culture before becoming a permanent resident or citizen.
        </p>

        <div
          style={{
            marginTop: 16,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 12,
          }}
        >
          <section
            style={{
              padding: 14,
              borderRadius: 12,
              border: '1px solid rgba(0,0,0,0.12)',
              background: '#fff',
              color: '#111',
            }}
          >
            <h3 style={{ margin: '0 0 10px' }}>🧠 Test Format</h3>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>
                <strong>Duration:</strong> 45 minutes
              </li>
              <li>
                <strong>Questions:</strong> 24 multiple-choice questions
              </li>
              <li>
                <strong>Passing score:</strong> at least 18 correct answers (75%)
              </li>
              <li>
                <strong>Topics covered:</strong>
                <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
                  <li>British values and principles</li>
                  <li>UK history and key events</li>
                  <li>Government, law, and your role as a citizen</li>
                  <li>Everyday life in modern Britain</li>
                </ul>
              </li>
            </ul>
            <p style={{ marginTop: 12, marginBottom: 0, opacity: 0.8, fontSize: 14 }}>
              All questions are based on the official handbook: <em>Life in the United
              Kingdom: A Guide for New Residents (3rd Edition)</em>.
            </p>
          </section>

          <section
            style={{
              padding: 14,
              borderRadius: 12,
              border: '1px solid rgba(0,0,0,0.12)',
              background: '#fff',
              color: '#111',
            }}
          >
            <h3 style={{ margin: '0 0 10px' }}>💻 Booking Details</h3>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>
                <a
                  href="https://www.lituktestbooking.co.uk/lituk-web/login"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#0b57d0', textDecoration: 'none', fontWeight: 600 }}
                >
                  Book online through the official GOV.UK website
                </a>
              </li>
              <li>
                <strong>Fee:</strong> £50
              </li>
              <li>
                <strong>Requirements:</strong>
                <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
                  <li>Valid ID (passport, BRP, or EU ID card)</li>
                  <li>Email address</li>
                  <li>Debit or credit card</li>
                </ul>
              </li>
              <li>Choose from 30+ test centres across the UK</li>
              <li>Book at least 3 days in advance</li>
            </ul>
          </section>
        </div>

        <section
          style={{
            marginTop: 12,
            padding: 14,
            borderRadius: 12,
            border: '1px solid rgba(0,0,0,0.12)',
            background: '#fff',
            color: '#111',
          }}
        >
          <h3 style={{ margin: '0 0 10px' }}>🏁 After the Test</h3>
          <p style={{ marginTop: 0, marginBottom: 10, opacity: 0.9 }}>
            If you pass, you’ll receive a pass notification email — keep it safe,
            as you’ll need it for your citizenship or ILR application.
          </p>
          <p style={{ marginTop: 0, marginBottom: 0, opacity: 0.9 }}>
            If you fail, you can retake the test after a few days (each attempt costs
            £50).
          </p>
        </section>
      </div>

      <section
        style={{
          marginTop: 28,
          padding: 14,
          borderRadius: 12,
          border: '1px solid rgba(0,0,0,0.12)',
          background: '#fff',
          color: '#111',
        }}
      >
        <h2 style={{ margin: '0 0 12px', textAlign: 'center' }}>
          QUICK ACCESS CARDS
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 12,
            textAlign: 'left',
          }}
        >
          <Link
            to="/practice-tests"
            style={{
              display: 'block',
              padding: 14,
              borderRadius: 12,
              border: '1px solid rgba(0,0,0,0.12)',
              background: '#fff',
              textDecoration: 'none',
              color: '#111',
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Practice Tests</div>
            <div style={{ opacity: 0.75, fontSize: 14 }}>
              Start a full timed practice test.
            </div>
          </Link>

          <Link
            to="/chapter-wise-questions"
            style={{
              display: 'block',
              padding: 14,
              borderRadius: 12,
              border: '1px solid rgba(0,0,0,0.12)',
              background: '#fff',
              textDecoration: 'none',
              color: '#111',
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 6 }}>
              Chapter-wise Questions
            </div>
            <div style={{ opacity: 0.75, fontSize: 14 }}>
              Practice by chapter and topic.
            </div>
          </Link>

          <Link
            to="/progress-tracker"
            style={{
              display: 'block',
              padding: 14,
              borderRadius: 12,
              border: '1px solid rgba(0,0,0,0.12)',
              background: '#fff',
              textDecoration: 'none',
              color: '#111',
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Progress Tracker</div>
            <div style={{ opacity: 0.75, fontSize: 14 }}>
              Track your scores and improvement.
            </div>
          </Link>

          <Link
            to="/important-facts"
            style={{
              display: 'block',
              padding: 14,
              borderRadius: 12,
              border: '1px solid rgba(0,0,0,0.12)',
              background: '#fff',
              textDecoration: 'none',
              color: '#111',
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Important facts</div>
            <div style={{ opacity: 0.75, fontSize: 14 }}>
              Key facts to revise quickly.
            </div>
          </Link>
        </div>
      </section>

      <div style={{ marginTop: 32, textAlign: 'left' }}>
        <h2 style={{ margin: '0 0 12px', textAlign: 'center' }}>
          WHY THIS APP HELPS YOU PASS
        </h2>
        <ul style={{ margin: 0, paddingLeft: 22, lineHeight: 1.7 }}>
          <li>Updated question bank</li>
          <li>Real exam-style mock tests</li>
          <li>Instant feedback</li>
          <li>Track your progress</li>
          <li>Clean, simple interface</li>
        </ul>
      </div>
    </div>
  )
}
