import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'

export default function UserMenu() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  if (!usuario) {
    return (
      <Link to="/login" className="topbar-login">
        Já tenho conta
      </Link>
    )
  }

  return (
    <div className="user-menu">
      <div className="user-menu-info">
        <span className="user-menu-name">{usuario.nome}</span>
        <span className="user-menu-role">{usuario.tipo === 'admin' ? 'Administrador' : 'Fazenda'}</span>
      </div>
      <button
        className="topbar-login"
        onClick={() => {
          logout()
          navigate('/login', { replace: true })
        }}
      >
        Sair
      </button>
    </div>
  )
}
