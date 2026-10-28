import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Index from './pages/Index'
import Culturas from './pages/Culturas'
import Cadastro from './pages/Cadastro'
import Fazenda from './pages/Fazenda'
import Fazendas from './pages/Fazendas'
import Login from './pages/Login'
import CadastroAdmin from './pages/CadastroAdmin'
import RequireAuth from './components/RequireAuth'
import { AuthProvider } from './auth'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/culturas"
            element={
              <RequireAuth roles={['admin']}>
                <Culturas />
              </RequireAuth>
            }
          />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route
            path="/usuarios/novo"
            element={
              <RequireAuth roles={['admin']}>
                <CadastroAdmin />
              </RequireAuth>
            }
          />
          <Route
            path="/fazenda/:id"
            element={
              <RequireAuth ownFazenda>
                <Fazenda />
              </RequireAuth>
            }
          />
          <Route
            path="/fazendas"
            element={
              <RequireAuth roles={['admin']}>
                <Fazendas />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
