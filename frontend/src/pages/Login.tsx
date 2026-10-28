import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import '../cadastro.css'
import { homePathFor, useAuth } from '../auth'

export default function Login() {
  const { usuario, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  if (usuario) return <Navigate to={homePathFor(usuario)} replace />

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErro(null)
    setEnviando(true)
    try {
      const logado = await login(email.trim(), senha)
      const home = homePathFor(logado)
      const podeVoltar = from && (logado.tipo === 'admin' || from === home)
      navigate(podeVoltar ? from : home, { replace: true })
    } catch (err) {
      setErro(err instanceof TypeError ? 'Não foi possível conectar ao servidor.' : (err as Error).message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="cadastro-page">
      <header className="topbar">
        <Link to="/" className="topbar-brand">
          <div className="topbar-brand-icon">
            <svg viewBox="0 0 36 36" fill="none">
              <line x1="12" y1="4" x2="12" y2="32" stroke="currentColor" strokeWidth="1.2" opacity=".5" />
              <line x1="24" y1="4" x2="24" y2="32" stroke="currentColor" strokeWidth="1.2" opacity=".5" />
              <line x1="4" y1="12" x2="32" y2="12" stroke="currentColor" strokeWidth="1.2" opacity=".5" />
              <line x1="4" y1="24" x2="32" y2="24" stroke="currentColor" strokeWidth="1.2" opacity=".5" />
              <circle cx="18" cy="18" r="3.5" fill="var(--accent-green)" />
              <circle cx="8" cy="8" r="2" fill="var(--accent-blue)" opacity=".8" />
              <circle cx="28" cy="8" r="2" fill="var(--accent-blue)" opacity=".8" />
              <circle cx="8" cy="28" r="2" fill="var(--accent-blue)" opacity=".8" />
              <circle cx="28" cy="28" r="2" fill="var(--accent-blue)" opacity=".8" />
            </svg>
          </div>
          <span className="topbar-brand-name">Agro<em>Map</em></span>
          <span className="topbar-brand-sp">SP</span>
        </Link>
        <div className="topbar-right">
          <Link to="/cadastro" className="topbar-login">
            Cadastrar propriedade
          </Link>
        </div>
      </header>

      <div className="login-wrap">
        <form className="login-card" onSubmit={handleSubmit}>
          <div>
            <h1 className="login-title">Entrar no AgroMap</h1>
            <p className="login-sub">
              Administradores acessam a listagem de fazendas. Produtores acessam a página da sua fazenda.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-email">E-mail</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="voce@exemplo.com"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-senha">Senha</label>
            <input
              id="login-senha"
              type="password"
              className="form-input"
              placeholder="••••••••"
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          {erro && <div className="login-error" role="alert">{erro}</div>}

          <button type="submit" className="btn-submit" disabled={enviando || !email.trim() || !senha}>
            {enviando ? 'Entrando...' : 'Entrar'}
          </button>

          <p className="login-foot">
            Ainda não tem acesso? <Link to="/cadastro">Cadastre sua propriedade</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
