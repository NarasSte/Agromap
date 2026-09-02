import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Index from './pages/Index'
import Culturas from './pages/Culturas'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/culturas" element={<Culturas />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
