import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import ResourceList from './components/ResourceList.tsx'
import CulturaList from './components/CulturaList.tsx'

const resources = [
  { key: 'fazendas', label: 'Fazendas' },
  { key: 'talhoes', label: 'Talhões' },
  { key: 'culturas', label: 'Culturas' },
  { key: 'solos', label: 'Solos' },
  { key: 'plantios', label: 'Plantios' },
  { key: 'produtos', label: 'Produtos' },
  { key: 'equipamentos', label: 'Equipamentos' },
  { key: 'aplicacoes', label: 'Aplicações' },
  { key: 'monitoramentos', label: 'Monitoramentos' },
  { key: 'irrigacoes', label: 'Irrigações' },
  { key: 'colheitas', label: 'Colheitas' },
  { key: 'custos-producao', label: 'Custos de Produção' },
  { key: 'clima-registros', label: 'Registros de Clima' },
  { key: 'previsoes-climaticas', label: 'Previsões Climáticas' },
  { key: 'alertas', label: 'Alertas' },
  { key: 'manutencoes-equipamentos', label: 'Manutenções de Equipamentos' },
  { key: 'usos-equipamentos', label: 'Usos de Equipamentos' },
  { key: 'talhoes-solos', label: 'Talhões x Solos' },
  { key: 'recomendacoes-clima', label: 'Recomendações de Clima' },
]

function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Agromap</h1>
      <p>Selecione um recurso para visualizar os dados do backend.</p>
      <nav className="resource-grid">
        {resources.map((r) => (
          <Link key={r.key} to={`/${r.key}`} className="resource-card">
            {r.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/culturas" element={<CulturaList />} />
        <Route path="/:resource" element={<ResourceList resources={resources} />} />
      </Routes>
    </BrowserRouter>
  )
}
