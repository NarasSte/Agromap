import type { ReactNode } from 'react'
import { Navigate, useLocation, useParams } from 'react-router-dom'
import { homePathFor, useAuth, type TipoUsuario } from '../auth'

interface RequireAuthProps {
  children: ReactNode
  roles?: TipoUsuario[]
  /** Usuários do tipo fazenda só acessam a fazenda do parâmetro :id se ela for a sua. */
  ownFazenda?: boolean
}

export default function RequireAuth({ children, roles, ownFazenda }: RequireAuthProps) {
  const { usuario } = useAuth()
  const location = useLocation()
  const { id } = useParams()

  if (!usuario) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (roles && !roles.includes(usuario.tipo)) return <Navigate to={homePathFor(usuario)} replace />
  if (ownFazenda && usuario.tipo === 'fazenda' && String(usuario.fazenda_id) !== id) {
    return <Navigate to={homePathFor(usuario)} replace />
  }
  return <>{children}</>
}
