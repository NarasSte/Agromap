import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Index from './pages/Index'
import Culturas from './pages/Culturas'
import Cadastro from './pages/Cadastro'
import Fazenda from './pages/Fazenda'
import Fazendas from './pages/Fazendas'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/culturas" element={<Culturas />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/fazenda/:id" element={<Fazenda />} />
        <Route path="/fazendas" element={<Fazendas />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
