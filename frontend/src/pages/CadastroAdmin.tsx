import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import '../cadastro.css'
import { useAuthFetch } from '../auth'
import UserMenu from '../components/UserMenu'

export default function CadastroAdmin() {
  const authFetch = useAuthFetch()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [senhaConfirm, setSenhaConfirm] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  const senhaValida = senha.length >= 6 && senha === senhaConfirm
  const canSubmit = !!(nome.trim() && email.trim() && senhaValida)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setErro(null)
    setSucesso(null)
    setEnviando(true)
    try {
      const res = await authFetch('/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim(),
          senha,
          tipo: 'admin',
        }),
      })
      if (!res.ok) {
        setErro(
          res.status === 409
            ? 'Já existe um usuário cadastrado com este e-mail.'
            : 'Erro ao cadastrar o administrador. Verifique os dados e tente novamente.',
        )
        return
      }
      setSucesso(`Administrador "${nome.trim()}" cadastrado com sucesso.`)
      setNome('')
      setEmail('')
      setSenha('')
      setSenhaConfirm('')
    } catch {
      setErro('Não foi possível conectar ao servidor. Verifique se o backend está rodando.')
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
              <line x1="18" y1="18" x2="8" y2="8" stroke="var(--accent-green)" strokeWidth="1" opacity=".5" />
              <line x1="18" y1="18" x2="28" y2="8" stroke="var(--accent-green)" strokeWidth="1" opacity=".5" />
              <line x1="18" y1="18" x2="8" y2="28" stroke="var(--accent-green)" strokeWidth="1" opacity=".5" />
              <line x1="18" y1="18" x2="28" y2="28" stroke="var(--accent-green)" strokeWidth="1" opacity=".5" />
            </svg>
          </div>
          <span className="topbar-brand-name">Agro<em>Map</em></span>
          <span className="topbar-brand-sp">SP</span>
        </Link>
        <div className="topbar-right">
          <Link to="/fazendas" className="topbar-login">
            Fazendas
          </Link>
          <UserMenu />
        </div>
      </header>

      <div className="login-wrap">
        <form className="login-card" onSubmit={handleSubmit}>
          <div>
            <h1 className="login-title">Novo administrador</h1>
            <p className="login-sub">
              Cadastre um usuário com acesso de administrador ao painel interno e à listagem de fazendas.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="admin-nome">Nome completo</label>
            <input
              id="admin-nome"
              type="text"
              className="form-input"
              placeholder="Maria Souza"
              autoComplete="name"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="admin-email">E-mail</label>
            <input
              id="admin-email"
              type="email"
              className="form-input"
              placeholder="admin@agromap.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="admin-senha">Senha de acesso</label>
            <input
              id="admin-senha"
              type="password"
              className="form-input"
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="admin-senha-confirm">Confirmar senha</label>
            <input
              id="admin-senha-confirm"
              type="password"
              className="form-input"
              placeholder="Repita a senha"
              autoComplete="new-password"
              value={senhaConfirm}
              onChange={(e) => setSenhaConfirm(e.target.value)}
              required
            />
            {senhaConfirm && senha !== senhaConfirm && (
              <span className="form-hint">As senhas não conferem.</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Tipo de usuário</label>
            <input className="form-input" value="Administrador" disabled readOnly />
          </div>

          {erro && <div className="login-error" role="alert">{erro}</div>}
          {sucesso && <div className="login-success" role="status">{sucesso}</div>}

          <button type="submit" className="btn-submit" disabled={enviando || !canSubmit}>
            {enviando ? 'Cadastrando...' : 'Cadastrar administrador'}
          </button>

          <p className="login-foot">
            <Link to="/fazendas">← Voltar para a listagem de fazendas</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
