import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

type ApiSubtopic = {
  title: string
  facts: unknown
}

type ApiTopicResponse = {
  topic?: string
  subtopics?: ApiSubtopic[]
  [key: string]: unknown
}

type FactItem = {
  text: string
  reference?: string
}

function normalizeFactItems(value: unknown): FactItem[] {
  if (Array.isArray(value)) {
    return value
      .map((v) => {
        if (v && typeof v === 'object') {
          const obj = v as Record<string, unknown>
          const text = String(obj.text ?? '').trim()
          const reference = String(obj.reference ?? '').trim()
          return {
            text,
            reference: reference ? reference : undefined,
          }
        }

        const text = String(v ?? '').trim()
        return { text }
      })
      .filter((v) => v.text.length > 0)
  }

  if (typeof value === 'string') {
    const v = value.trim()
    return v ? [{ text: v }] : []
  }

  return []
}

function extractTopicPayload(data: unknown): ApiTopicResponse | null {
  if (!data || typeof data !== 'object') return null
  const obj = data as Record<string, unknown>

  if ('topic' in obj || 'subtopics' in obj) return obj as ApiTopicResponse

  const dataObj = obj.data
  if (dataObj && typeof dataObj === 'object') return dataObj as ApiTopicResponse

  const resultObj = obj.result
  if (resultObj && typeof resultObj === 'object') return resultObj as ApiTopicResponse

  return null
}

export default function StudyGuidePage() {
  const [searchParams] = useSearchParams()
  const topicSlug = useMemo(() => {
    const v = String(searchParams.get('topic') ?? '').trim()
    return v || null
  }, [searchParams])

  const [payload, setPayload] = useState<ApiTopicResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!topicSlug) {
      setPayload(null)
      setError(null)
      setIsLoading(false)
      return
    }

    const slug = topicSlug

    let cancelled = false

    async function load() {
      try {
        setIsLoading(true)
        setError(null)

        const res = await fetch(
          `https://mongodb-nodejs-service.onrender.com/api/topics/${encodeURIComponent(slug)}`
        )

        if (!res.ok) {
          throw new Error(`Failed to load topic (HTTP ${res.status})`)
        }

        const json = (await res.json()) as unknown
        const p = extractTopicPayload(json)
        if (!p) throw new Error('Unexpected API response for topic')

        if (!cancelled) setPayload(p)
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load topic')
          setPayload(null)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [topicSlug])

  const subtopics = useMemo(() => {
    if (!payload?.subtopics) return []
    return payload.subtopics
      .filter((s) => s && typeof s === 'object')
      .map((s) => ({
        title: String(s.title ?? '').trim(),
        facts: normalizeFactItems(s.facts),
      }))
      .filter((s) => s.title.length > 0)
  }, [payload])

  return (
    <div style={{ maxWidth: 900, margin: '32px auto', padding: 16 }}>
      {!topicSlug ? <h1 style={{ marginBottom: 8 }}>Study Guide</h1> : null}

      {!topicSlug ? (
        <p style={{ marginTop: 0, opacity: 0.85 }}>
          Study guide content will appear here.
        </p>
      ) : isLoading ? (
        <p style={{ marginTop: 0, opacity: 0.85 }}>Loading...</p>
      ) : error ? (
        <p style={{ marginTop: 0, opacity: 0.85 }}>{error}</p>
      ) : (
        <>
          <h2 style={{ margin: '14px 0 10px' }}>{payload?.topic ? payload.topic : topicSlug}</h2>

          {subtopics.length === 0 ? (
            <p style={{ marginTop: 0, opacity: 0.85 }}>No subtopics found.</p>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {subtopics.map((s, idx) => (
                <section
                  key={`${idx}-${s.title}`}
                  style={{
                    padding: 14,
                    borderRadius: 12,
                    border: '1px solid rgba(0,0,0,0.12)',
                    background: '#fff',
                    color: '#111',
                  }}
                >
                  <div style={{ fontWeight: 800, marginBottom: 8 }}>{s.title}</div>
                  {s.facts.length > 0 ? (
                    <div style={{ lineHeight: 1.7, opacity: 0.92 }}>
                      {s.facts.map((f, fIdx) => (
                        <div key={`${fIdx}-${f.text}`} style={{ marginTop: fIdx === 0 ? 0 : 8 }}>
                          <div>- {f.text}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ opacity: 0.85 }}>No facts provided.</div>
                  )}
                </section>
              ))}
            </div>
          )}

          <div style={{ marginTop: 16 }}>
            <Link to="/study-guide">Back</Link>
          </div>
        </>
      )}
    </div>
  )
}
