import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
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
  century?: number | string
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

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function sanitizeFactHtml(value: string): string {
  if (typeof window === 'undefined' || !('DOMParser' in window)) {
    return escapeHtml(value)
  }

  const doc = new window.DOMParser().parseFromString(value, 'text/html')

  function serialize(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return escapeHtml(node.textContent ?? '')
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return ''

    const el = node as HTMLElement
    const tag = el.tagName.toLowerCase()

    if (tag === 'br') return '<br />'

    const children = Array.from(el.childNodes)
      .map((c) => serialize(c))
      .join('')

    if (tag === 'strong' || tag === 'b') {
      return `<strong>${children}</strong>`
    }

    return children
  }

  return Array.from(doc.body.childNodes)
    .map((n) => serialize(n))
    .join('')
}

function renderFactLine(line: string): ReactNode {
  if (!/[<>]/.test(line)) return line
  const safeHtml = sanitizeFactHtml(line)
  if (!safeHtml.includes('<strong>') && !safeHtml.includes('<br')) return line
  return <span dangerouslySetInnerHTML={{ __html: safeHtml }} />
}

const CATEGORIES: FactsCategory[] = [
  {
    slug: 'battle',
    title: 'Battle',
    subtitle: 'Key battles and conflicts to remember.',
  },
  {
    slug: 'act',
    title: 'Act',
    subtitle: 'Key Acts of Parliament and legal milestones.',
  },
  {
    slug: 'court',
    title: 'Court',
    subtitle: 'Courts, justice, and legal system facts.',
  },
  {
    slug: 'castle',
    title: 'Castle',
    subtitle: 'Castles, fortifications, and historic sites.',
  },
  {
    slug: 'flag',
    title: 'Flag',
    subtitle: 'Flags, symbols, and national identity.',
  },
  {
    slug: 'charity',
    title: 'Charity',
    subtitle: 'UK charity and volunteering facts.',
  },
  {
    slug: 'flower',
    title: 'Flower',
    subtitle: 'National flowers, symbols, and meanings.',
  },
  {
    slug: 'food',
    title: 'Food',
    subtitle: 'Traditional foods and UK food facts.',
  },
  {
    slug: 'festival',
    title: 'Festival',
    subtitle: 'Festivals and major cultural events.',
  },
  {
    slug: 'map',
    title: 'Map',
    subtitle: 'Geography, regions, and map-related facts.',
  },
  {
    slug: 'movie',
    title: 'Movie',
    subtitle: 'Films, cinema, and UK cultural references.',
  },
  {
    slug: 'olympics',
    title: 'Olympics',
    subtitle: 'Olympic Games and UK Olympic history.',
  },
  {
    slug: 'people',
    title: 'People',
    subtitle: 'Important people and key figures.',
  },
  {
    slug: 'prime minister',
    title: 'Prime Minister',
    subtitle: 'Prime Ministers and political leadership facts.',
  },
  {
    slug: 'population',
    title: 'Population',
    subtitle: 'Population, demographics, and key numbers.',
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
  {
    slug: 'world war',
    title: 'World War',
    subtitle: 'World War I and II facts and key events.',
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

          {activeCategory.slug === 'prime minister' ? (
            <p style={{ marginTop: 0, marginBottom: 16, opacity: 0.8, fontSize: 14 }}>
              (C) for Conservative Party, (L) for Labour Party
            </p>
          ) : null}

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
                      {f.year !== undefined &&
                      f.year !== null &&
                      String(f.year).trim() !== '' ? (
                        <div style={{ opacity: 0.7 }}>({String(f.year)})</div>
                      ) : f.century !== undefined &&
                        f.century !== null &&
                        String(f.century).trim() !== '' ? (
                        <div style={{ opacity: 0.7 }}>({String(f.century)})</div>
                      ) : null}
                    </div>

                    {normalizeFactsList(f.facts).length > 0 ? (
                      <div style={{ marginTop: 8, lineHeight: 1.6 }}>
                        {normalizeFactsList(f.facts).map((line, lineIdx) => (
                          <div key={`${lineIdx}-${line}`} style={{ opacity: 0.92 }}>
                            - {renderFactLine(line)}
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
