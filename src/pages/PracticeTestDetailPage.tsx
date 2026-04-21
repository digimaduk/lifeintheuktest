import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

type ApiQuestion = {
  question?: string
  options?: string[]
  answers?: string[]
  answer?: string
  correctAnswer?: number | string
  explanation?: string
  [key: string]: unknown
}

function extractQuestions(data: unknown): ApiQuestion[] | null {
  if (Array.isArray(data)) return data as ApiQuestion[]
  if (!data || typeof data !== 'object') return null

  const obj = data as Record<string, unknown>
  if (Array.isArray(obj.questions)) return obj.questions as ApiQuestion[]

  const dataObj = obj.data
  if (dataObj && typeof dataObj === 'object') {
    const inner = dataObj as Record<string, unknown>
    if (Array.isArray(inner.questions)) return inner.questions as ApiQuestion[]
  }

  const resultObj = obj.result
  if (resultObj && typeof resultObj === 'object') {
    const inner = resultObj as Record<string, unknown>
    if (Array.isArray(inner.questions)) return inner.questions as ApiQuestion[]
  }

  return null
}

function normalizeOptions(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((v) => String(v ?? '').trim())
      .filter((v) => v.length > 0)
  }
  return []
}

function getQuestionText(q: ApiQuestion): string {
  const candidate =
    (typeof q.question === 'string' && q.question) ||
    (typeof (q as { text?: unknown }).text === 'string' ? String((q as { text?: unknown }).text) : '')
  return candidate.trim() || 'Question'
}

export default function PracticeTestDetailPage() {
  const { testId } = useParams()

  const isTest1 = useMemo(() => {
    const raw = String(testId ?? '')
      .trim()
      .toLowerCase()
    return raw === 'test1'
  }, [testId])

  const [questions, setQuestions] = useState<ApiQuestion[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({})

  useEffect(() => {
    if (!isTest1) return

    let cancelled = false

    async function load() {
      try {
        setIsLoading(true)
        setError(null)

        const res = await fetch('https://mongodb-nodejs-service.onrender.com/api/questions')
        if (!res.ok) throw new Error(`Failed to load questions (HTTP ${res.status})`)

        const json = (await res.json()) as unknown
        const list = extractQuestions(json)
        if (!list) throw new Error('Unexpected API response for questions')

        if (!cancelled) {
          setQuestions(list.slice(0, 24))
          setCurrentIndex(0)
          setSelectedOptions({})
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load questions')
          setQuestions(null)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [isTest1])

  return (
    <div style={{ maxWidth: 900, margin: '32px auto', padding: 16 }}>
      <h1 style={{ marginBottom: 8 }}>{testId ? testId : 'Practice Test'}</h1>

      {isTest1 ? (
        <>
          {isLoading ? (
            <p style={{ marginTop: 0, opacity: 0.85 }}>Loading questions...</p>
          ) : error ? (
            <p style={{ marginTop: 0, opacity: 0.85 }}>{error}</p>
          ) : questions && questions.length > 0 ? (
            (() => {
              const idx = Math.min(Math.max(currentIndex, 0), questions.length - 1)
              const q = questions[idx]
              const options = normalizeOptions(q.answers ?? q.options).slice(0, 4)
              const canGoBack = idx > 0
              const canGoNext = idx < questions.length - 1
              const selectedIndex = selectedOptions[idx]
              const correctIndexRaw = q.correctAnswer
              const correctIndex = Number.isFinite(Number(correctIndexRaw))
                ? Number(correctIndexRaw)
                : null
              const isCorrect =
                selectedIndex !== undefined &&
                correctIndex !== null &&
                selectedIndex === correctIndex
              const isIncorrect =
                selectedIndex !== undefined &&
                correctIndex !== null &&
                selectedIndex !== correctIndex

              return (
                <div
                  style={{
                    marginTop: 16,
                    padding: 14,
                    borderRadius: 12,
                    border: '1px solid rgba(0,0,0,0.12)',
                    background: '#fff',
                  }}
                >
                  <div style={{ opacity: 0.75, fontSize: 14, marginBottom: 8 }}>
                    Question {idx + 1} of {questions.length}
                  </div>
                  <div style={{ fontWeight: 800, marginBottom: 10 }}>
                    {idx + 1}. {getQuestionText(q)}
                  </div>

                  {options.length > 0 ? (
                    <div style={{ display: 'grid', gap: 8, opacity: 0.92 }}>
                      {options.map((opt, optIdx) => {
                        const id = `q-${idx}-opt-${optIdx}`
                        const checked = selectedIndex === optIdx
                        const isSelectedCorrect =
                          checked && correctIndex !== null && optIdx === correctIndex

                        const isSelectedIncorrect =
                          checked && correctIndex !== null && optIdx !== correctIndex

                        const optionBackground = isSelectedCorrect
                          ? '#e6f4ea'
                          : isSelectedIncorrect
                            ? '#fce8e6'
                            : checked
                            ? '#fff6d0'
                            : '#fafafa'

                        const optionBorder = isSelectedCorrect
                          ? '1px solid rgba(26, 115, 46, 0.45)'
                          : isSelectedIncorrect
                            ? '1px solid rgba(176, 0, 32, 0.35)'
                          : '1px solid rgba(0,0,0,0.12)'

                        return (
                          <label
                            key={`${optIdx}-${opt}`}
                            htmlFor={id}
                            style={{
                              display: 'flex',
                              gap: 10,
                              alignItems: 'flex-start',
                              padding: '10px 12px',
                              borderRadius: 10,
                              border: optionBorder,
                              background: optionBackground,
                              cursor: 'pointer',
                            }}
                          >
                            <input
                              id={id}
                              type="radio"
                              name={`question-${idx}`}
                              checked={checked}
                              onChange={() =>
                                setSelectedOptions((prev) => ({
                                  ...prev,
                                  [idx]: optIdx,
                                }))
                              }
                              style={{ marginTop: 2 }}
                            />
                            <div>
                              <div>{opt}</div>
                            </div>
                          </label>
                        )
                      })}
                    </div>
                  ) : (
                    <div style={{ opacity: 0.85 }}>No options provided.</div>
                  )}

                  {isCorrect ? (
                    <div
                      style={{
                        marginTop: 12,
                        padding: 12,
                        borderRadius: 12,
                        border: '1px solid rgba(26, 115, 46, 0.35)',
                        background: '#e6f4ea',
                      }}
                    >
                      <div style={{ fontWeight: 800, color: '#1e7e34', marginBottom: 6 }}>
                        Correct
                      </div>
                      {q.explanation && String(q.explanation).trim() !== '' ? (
                        <div style={{ opacity: 0.95, lineHeight: 1.6 }}>
                          {String(q.explanation)}
                        </div>
                      ) : null}
                    </div>
                  ) : isIncorrect ? (
                    <div
                      style={{
                        marginTop: 12,
                        padding: 12,
                        borderRadius: 12,
                        border: '1px solid rgba(176, 0, 32, 0.25)',
                        background: '#fce8e6',
                      }}
                    >
                      <div style={{ fontWeight: 800, color: '#b00020', marginBottom: 6 }}>
                        Incorrect
                      </div>
                      {q.explanation && String(q.explanation).trim() !== '' ? (
                        <div style={{ opacity: 0.95, lineHeight: 1.6 }}>
                          {String(q.explanation)}
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 12,
                      marginTop: 14,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setCurrentIndex((v) => Math.max(0, v - 1))}
                      disabled={!canGoBack}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 10,
                        border: '1px solid rgba(0,0,0,0.18)',
                        background: canGoBack ? '#fff' : '#f2f2f2',
                        cursor: canGoBack ? 'pointer' : 'not-allowed',
                        fontWeight: 700,
                      }}
                    >
                      Back
                    </button>

                    <button
                      type="button"
                      onClick={() => setCurrentIndex((v) => Math.min(questions.length - 1, v + 1))}
                      disabled={!canGoNext}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 10,
                        border: '1px solid rgba(0,0,0,0.18)',
                        background: canGoNext ? '#000' : '#444',
                        color: '#fff',
                        cursor: canGoNext ? 'pointer' : 'not-allowed',
                        fontWeight: 700,
                        opacity: canGoNext ? 1 : 0.7,
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )
            })()
          ) : (
            <p style={{ marginTop: 0, opacity: 0.85 }}>No questions found.</p>
          )}
        </>
      ) : (
        <p style={{ marginTop: 0, opacity: 0.85 }}>
          This is a placeholder page for {testId ?? 'the selected test'}.
        </p>
      )}

      <div style={{ marginTop: 16 }}>
        <Link to="/practice-tests">Back to Practice Tests</Link>
      </div>
    </div>
  )
}
