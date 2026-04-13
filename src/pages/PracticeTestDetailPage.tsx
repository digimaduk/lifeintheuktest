import { Link, useParams } from 'react-router-dom'

export default function PracticeTestDetailPage() {
  const { testId } = useParams()

  return (
    <div style={{ maxWidth: 900, margin: '32px auto', padding: 16 }}>
      <h1 style={{ marginBottom: 8 }}>{testId ? testId : 'Practice Test'}</h1>
      <p style={{ marginTop: 0, opacity: 0.85 }}>
        This is a placeholder page for {testId ?? 'the selected test'}.
      </p>

      <div style={{ marginTop: 16 }}>
        <Link to="/practice-tests">Back to Practice Tests</Link>
      </div>
    </div>
  )
}
