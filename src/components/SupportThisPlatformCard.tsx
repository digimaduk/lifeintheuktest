export default function SupportThisPlatformCard() {
  return (
    <aside
      style={{
        background: '#fff',
        border: '1px solid rgba(0,0,0,0.12)',
        borderRadius: 12,
        padding: 16,
        lineHeight: 1.65,
      }}
    >
      <div style={{ fontWeight: 800, marginBottom: 10 }}>❤️ Support This Platform</div>
      <div style={{ opacity: 0.9, fontSize: 14 }}>
        <div>
          This project is created and maintained independently, with the aim of helping
          others pass the Life in the UK Test without stress or confusion. If this
          platform has helped you in your preparation, you can support its growth.
        </div>

        <div style={{ marginTop: 10, fontWeight: 700 }}>Your support helps with:</div>
        <div style={{ marginTop: 8, display: 'grid', gap: 6 }}>
          <div>- Hosting and server costs</div>
          <div>- Adding more questions, facts, and study tools</div>
          <div>- Improving the UI and user experience</div>
          <div>- Keeping the platform free for everyone</div>
        </div>

        <div style={{ marginTop: 10 }}>
          If you’d like to contribute, you can make a small donation.
        </div>
        <div style={{ marginTop: 10 }}>
          Every contribution — big or small — helps keep this platform running and
          improving.
        </div>
        <div style={{ marginTop: 10 }}>
          Thank you for supporting this mission and helping others succeed.
        </div>

        <div style={{ marginTop: 14 }}>
          <button
            type="button"
            style={{
              padding: '10px 14px',
              borderRadius: 10,
              border: '1px solid rgba(0,0,0,0.18)',
              background: '#000',
              color: '#fff',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Donate
          </button>
        </div>
      </div>
    </aside>
  )
}
