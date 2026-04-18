import type { ReactNode } from 'react'
import SupportThisPlatformCard from './SupportThisPlatformCard'

export default function WithSupportSidebar({ children }: { children: ReactNode }) {
  return (
    <div style={{ padding: '28px 16px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 360px',
            gap: 16,
            alignItems: 'start',
          }}
        >
          <div style={{ minWidth: 0 }}>{children}</div>
          <div style={{ maxWidth: 360, justifySelf: 'end' }}>
            <SupportThisPlatformCard />
          </div>
        </div>
      </div>
    </div>
  )
}
