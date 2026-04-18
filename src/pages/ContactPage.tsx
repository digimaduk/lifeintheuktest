import { useState } from 'react'
import type { FormEvent } from 'react'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'submitted'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()

    try {
      setStatus('submitting')
      setError(null)

      const res = await fetch(
        'https://mongodb-nodejs-service.onrender.com/api/contacts',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            subject,
            message,
          }),
        }
      )

      if (!res.ok) {
        let messageFromServer = ''
        try {
          const data = (await res.json()) as unknown
          messageFromServer =
            data && typeof data === 'object' && 'message' in data
              ? String((data as { message?: unknown }).message ?? '')
              : ''
        } catch {
          messageFromServer = ''
        }

        throw new Error(
          messageFromServer || `Failed to submit (HTTP ${res.status})`
        )
      }

      setStatus('submitted')
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to submit')
      setStatus('idle')
    }
  }

  return (
    <>
      <h1 style={{ margin: '0 0 18px' }}>Contact Us</h1>

      <div
        style={{
          background: '#f2f2f2',
          border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: 12,
          padding: 16,
        }}
      >
        <form
          onSubmit={onSubmit}
          style={{
            background: '#fff',
            border: '1px solid rgba(0,0,0,0.12)',
            borderRadius: 12,
            padding: 18,
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 12,
            }}
          >
            <label style={{ display: 'grid', gap: 6 }}>
              <div style={{ fontWeight: 600 }}>Your Name</div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                style={{
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: '1px solid rgba(0,0,0,0.2)',
                  fontSize: 14,
                }}
              />
            </label>

            <label style={{ display: 'grid', gap: 6 }}>
              <div style={{ fontWeight: 600 }}>Your Email</div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                style={{
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: '1px solid rgba(0,0,0,0.2)',
                  fontSize: 14,
                }}
              />
            </label>
          </div>

          <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
            <label style={{ display: 'grid', gap: 6 }}>
              <div style={{ fontWeight: 600 }}>Subject</div>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter subject"
                required
                style={{
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: '1px solid rgba(0,0,0,0.2)',
                  fontSize: 14,
                }}
              />
            </label>

            <label style={{ display: 'grid', gap: 6 }}>
              <div style={{ fontWeight: 600 }}>Message</div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message"
                required
                rows={7}
                style={{
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: '1px solid rgba(0,0,0,0.2)',
                  fontSize: 14,
                  resize: 'vertical',
                }}
              />
            </label>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                type="submit"
                disabled={status === 'submitting'}
                style={{
                  padding: '10px 16px',
                  borderRadius: 10,
                  border: '1px solid rgba(0,0,0,0.18)',
                  background: status === 'submitting' ? '#444' : '#000',
                  color: '#fff',
                  fontWeight: 700,
                  cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                  opacity: status === 'submitting' ? 0.85 : 1,
                }}
              >
                {status === 'submitting' ? 'Submitting...' : 'Submit'}
              </button>

              {status === 'submitted' ? (
                <div style={{ opacity: 0.85 }}>
                  Thanks! Your message has been submitted.
                </div>
              ) : null}
            </div>

            {error ? (
              <div style={{ opacity: 0.85, color: '#b00020' }}>{error}</div>
            ) : null}
          </div>
        </form>
      </div>
    </>
  )
}
