import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Index from './pages/Index'
import Culturas from './pages/Culturas'
import Cadastro from './pages/Cadastro'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/culturas" element={<Culturas />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
