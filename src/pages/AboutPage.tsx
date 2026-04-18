export default function AboutPage() {
  return (
    <div style={{ maxWidth: 900, margin: '32px auto', padding: 16 }}>
      <h1 style={{ marginBottom: 16 }}>About</h1>
      <section
        style={{
          padding: 16,
          borderRadius: 12,
          border: '1px solid rgba(0,0,0,0.12)',
          background: '#fff',
          color: '#111',
        }}
      >
        <div style={{ opacity: 0.9, lineHeight: 1.7, marginTop: 4 }}>
          <p style={{ marginTop: 0 }}>
            This platform was created by someone who has personally completed the Life
            in the UK Test as part of the ILR process. Having gone through the journey
            myself, I realised that the test itself is not difficult — the challenge
            lies in organising the information, understanding what truly matters, and
            memorising it effectively.
          </p>
          <p>This website is designed to simplify your preparation.</p>
          <p>
            With structured study tools, clear explanations, and practical guidance, my
            aim is to help you learn efficiently and pass with confidence.
          </p>
          <p style={{ marginBottom: 0 }}>
            Whether you're preparing for ILR or British citizenship, this resource is
            built to support you every step of the way. Good luck!
          </p>
        </div>
      </section>
    </div>
  )
}
