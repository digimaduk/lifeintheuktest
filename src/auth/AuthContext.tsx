import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type AuthUser = {
  username: string
  email: string
}

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (identifier: string, password: string) => Promise<boolean>
  register: (payload: { email: string; username: string; password: string }) => Promise<boolean>
  logout: () => void
}

const STORAGE_KEY = 'lifeintheuktest.auth.user'
const API_BASE_URL = 'https://mongodb-nodejs-service.onrender.com'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function loadUserFromStorage(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

function saveUserToStorage(user: AuthUser | null) {
  try {
    if (!user) {
      localStorage.removeItem(STORAGE_KEY)
      return
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  } catch {
    // ignore
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => loadUserFromStorage())

  const login = useCallback(async (identifier: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) return false

      const users = (await res.json()) as Array<{
        email?: string
        username?: string
        password?: string
        name?: string
      }>

      const normalizedIdentifier = identifier.trim().toLowerCase()
      const match = users.find((u) => {
        const email = (u.email ?? '').trim().toLowerCase()
        const username = (u.username ?? u.name ?? '').trim().toLowerCase()
        const okId = normalizedIdentifier === email || normalizedIdentifier === username
        const okPw = (u.password ?? '') === password
        return okId && okPw
      })

      if (!match) return false

      const nextUser: AuthUser = {
        username: match.username ?? match.name ?? identifier,
        email: match.email ?? '',
      }
      setUser(nextUser)
      saveUserToStorage(nextUser)
      return true
    } catch {
      return false
    }
  }, [])

  const register = useCallback(
    async (payload: { email: string; username: string; password: string }) => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        return res.ok
      } catch {
        return false
      }
    },
    [],
  )

  const logout = useCallback(() => {
    setUser(null)
    saveUserToStorage(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
    }),
    [user, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
