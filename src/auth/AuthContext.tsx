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
}

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const STORAGE_KEY = 'lifeintheuktest.auth.user'

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

  const login = useCallback(async (username: string, password: string) => {
    const valid = username === 'admin' && password === 'password'

    if (!valid) return false

    const nextUser: AuthUser = { username }
    setUser(nextUser)
    saveUserToStorage(nextUser)
    return true
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    saveUserToStorage(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user, login, logout],
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
