import { Link, useParams } from 'react-router-dom'

const TITLES: Record<string, string> = {
  'british-values': 'British Values',
  'uk-history': 'UK History',
  'government-law': 'Government & Law',
  'everyday-life': 'Everyday Life',
}

export default function TopicPage() {
  const { topicId } = useParams()
  const title = (topicId && TITLES[topicId]) || 'Study Topic'

  return (
    <div style={{ maxWidth: 900, margin: '32px auto', padding: 16 }}>
      <h1 style={{ marginBottom: 8 }}>{title}</h1>
      <p style={{ marginTop: 0, opacity: 0.85 }}>
        Topic content will appear here.
      </p>

      <div style={{ marginTop: 16 }}>
        <Link to="/">Back to Home</Link>
      </div>
    </div>
  )
}
