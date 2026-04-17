import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

type FactsCategory = {
  slug: string
  title: string
  subtitle: string
}

type ApiFact = {
  title: string
  facts: string[]
  year?: number | string
  type: string
}

function extractFacts(data: unknown): ApiFact[] | null {
  if (Array.isArray(data)) return data as ApiFact[]

  if (!data || typeof data !== 'object') return null

  const obj = data as Record<string, unknown>

  if (Array.isArray(obj.facts)) return obj.facts as ApiFact[]

  const dataObj = obj.data
  if (dataObj && typeof dataObj === 'object') {
    const inner = dataObj as Record<string, unknown>
    if (Array.isArray(inner.facts)) return inner.facts as ApiFact[]
  }

  const resultObj = obj.result
  if (resultObj && typeof resultObj === 'object') {
    const inner = resultObj as Record<string, unknown>
    if (Array.isArray(inner.facts)) return inner.facts as ApiFact[]
  }

  return null
}

function normalizeType(value: unknown): string {
  const raw = String(value ?? '')
    .trim()
    .toLowerCase()
  return raw.endsWith('s') ? raw.slice(0, -1) : raw
}

function normalizeFactsList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((v) => String(v ?? '').trim())
      .filter((v) => v.length > 0)
  }
  if (typeof value === 'string') {
    const v = value.trim()
    return v ? [v] : []
  }
  return []
}

const CATEGORIES: FactsCategory[] = [
  {
    slug: 'battle',
    title: 'Battle',
    subtitle: 'Key battles and conflicts to remember.',
  },
  {
    slug: 'charity',
    title: 'Charity',
    subtitle: 'UK charity and volunteering facts.',
  },
  {
    slug: 'place',
    title: 'Place',
    subtitle: 'Important places and landmarks.',
  },
  {
    slug: 'sports',
    title: 'Sports',
    subtitle: 'Popular sports and UK sporting history.',
  },
]

export default function ImportantFactsPage() {
  const { category } = useParams()

  const [facts, setFacts] = useState<ApiFact[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const activeCategory = category
    ? CATEGORIES.find((c) => c.slug === category)
    : null

  useEffect(() => {
    if (!category) return

    const controller = new AbortController()

    async function loadFacts() {
      try {
        setIsLoading(true)
        setError(null)

        const res = await fetch(
          'https://mongodb-nodejs-service.onrender.com/api/facts',
          { signal: controller.signal }
        )
        if (!res.ok) {
          throw new Error(`Failed to fetch facts (HTTP ${res.status})`)
        }

        const data = (await res.json()) as unknown
        const extracted = extractFacts(data)
        if (!extracted) {
          const details =
            data && typeof data === 'object'
              ? `keys: ${Object.keys(data as Record<string, unknown>).join(', ')}`
              : `type: ${typeof data}`
          throw new Error(`Unexpected API response (${details})`)
        }

        setFacts(extracted)
      } catch (e) {
        if ((e as { name?: string }).name === 'AbortError') return
        setError(e instanceof Error ? e.message : 'Failed to load facts')
        setFacts(null)
      } finally {
        setIsLoading(false)
      }
    }

    void loadFacts()

    return () => controller.abort()
  }, [category])

  const filteredFacts = useMemo(() => {
    if (!category || !facts) return []
    const categoryType = normalizeType(category)
    return facts
      .filter((f) => normalizeType(f.type) === categoryType)
      .sort((a, b) => {
        const ay = typeof a.year === 'number' ? a.year : Number(a.year)
        const by = typeof b.year === 'number' ? b.year : Number(b.year)
        const aValid = Number.isFinite(ay)
        const bValid = Number.isFinite(by)
        if (!aValid && !bValid) return 0
        if (!aValid) return 1
        if (!bValid) return -1
        return ay - by
      })
  }, [category, facts])

  const availableTypes = useMemo(() => {
    if (!facts) return []
    const set = new Set<string>()
    for (const f of facts) {
      const t = normalizeType(f.type)
      if (t) set.add(t)
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [facts])

  return (
    <div style={{ maxWidth: 900, margin: '32px auto', padding: 16 }}>
      <h1 style={{ margin: '0 0 16px' }}>Important Facts</h1>

      {!category ? (
        <>
          <p style={{ margin: '0 0 12px', opacity: 0.85 }}>
            Choose a category to view the related facts.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 12,
              marginTop: 16,
            }}
          >
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                to={`/important-facts/${c.slug}`}
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
                <div style={{ fontWeight: 800, marginBottom: 6 }}>{c.title}</div>
                <div style={{ opacity: 0.75, fontSize: 14 }}>{c.subtitle}</div>
              </Link>
            ))}
          </div>
        </>
      ) : activeCategory ? (
        <>
          <div style={{ marginTop: 6, marginBottom: 16 }}>
            <Link
              to="/important-facts"
              style={{
                display: 'inline-block',
                textDecoration: 'none',
                color: '#0b57d0',
                fontWeight: 600,
              }}
            >
              ← Back to categories
            </Link>
          </div>

          <h2 style={{ margin: '0 0 8px' }}>{activeCategory.title}</h2>
          <p style={{ marginTop: 0, opacity: 0.85 }}>{activeCategory.subtitle}</p>

          {isLoading ? (
            <p style={{ marginTop: 0, opacity: 0.85 }}>Loading facts...</p>
          ) : error ? (
            <p style={{ marginTop: 0, opacity: 0.85 }}>{error}</p>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {filteredFacts.length === 0 ? (
                <div>
                  <p style={{ marginTop: 0, opacity: 0.85 }}>
                    No facts found for this category.
                  </p>
                  <p style={{ marginTop: 8, opacity: 0.75, fontSize: 14 }}>
                    Loaded {facts ? facts.length : 0} facts from the API.
                    {availableTypes.length > 0
                      ? ` Available types: ${availableTypes.join(', ')}`
                      : ''}
                  </p>
                </div>
              ) : (
                filteredFacts.map((f, idx) => (
                  <div
                    key={`${f.title}-${String(f.year)}-${idx}`}
                    style={{
                      padding: 14,
                      borderRadius: 12,
                      border: '1px solid rgba(0,0,0,0.12)',
                      background: '#fff',
                    }}
                  >
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <div style={{ fontWeight: 800 }}>{f.title}</div>
                      {f.year !== undefined && f.year !== null && String(f.year).trim() !== '' ? (
                        <div style={{ opacity: 0.7 }}>(Year: {String(f.year)})</div>
                      ) : null}
                    </div>

                    {normalizeFactsList(f.facts).length > 0 ? (
                      <div style={{ marginTop: 8, lineHeight: 1.6 }}>
                        {normalizeFactsList(f.facts).map((line) => (
                          <div key={line} style={{ opacity: 0.92 }}>
                            - {line}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ marginTop: 6, opacity: 0.85 }}>
                        No facts provided.
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </>
      ) : (
        <>
          <p style={{ marginTop: 0, opacity: 0.85 }}>
            Category not found.
          </p>
          <Link
            to="/important-facts"
            style={{
              display: 'inline-block',
              textDecoration: 'none',
              color: '#0b57d0',
              fontWeight: 600,
            }}
          >
            Go back to categories
          </Link>
        </>
      )}
    </div>
  )
}
