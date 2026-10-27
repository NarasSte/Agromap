import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const STORAGE_KEY = 'agromap.auth'

export type TipoUsuario = 'admin' | 'fazenda'

export interface Usuario {
  id: number
  nome: string
  email: string
  tipo: TipoUsuario
  fazenda_id: number | null
}

interface Session {
  token: string
  usuario: Usuario
}

interface AuthContextValue {
  usuario: Usuario | null
  token: string | null
  login: (email: string, senha: string) => Promise<Usuario>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

export function homePathFor(usuario: Usuario): string {
  if (usuario.tipo === 'fazenda' && usuario.fazenda_id != null) return `/fazenda/${usuario.fazenda_id}`
  return '/fazendas'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(readSession)

  const login = useCallback(async (email: string, senha: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    })
    if (!res.ok) {
      throw new Error(res.status === 401 ? 'E-mail ou senha inválidos.' : 'Não foi possível entrar. Tente novamente.')
    }
    const data: { access_token: string; usuario: Usuario } = await res.json()
    const next = { token: data.access_token, usuario: data.usuario }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setSession(next)
    return data.usuario
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setSession(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ usuario: session?.usuario ?? null, token: session?.token ?? null, login, logout }),
    [session, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}

/** fetch autenticado: envia o token e encerra a sessão se o backend responder 401. */
export function useAuthFetch() {
  const { token, logout } = useAuth()
  return useCallback(
    async (path: string, init: RequestInit = {}) => {
      const headers = new Headers(init.headers)
      if (token) headers.set('Authorization', `Bearer ${token}`)
      const res = await fetch(`${API_URL}${path}`, { ...init, headers })
      if (res.status === 401) logout()
      return res
    },
    [token, logout],
  )
}
