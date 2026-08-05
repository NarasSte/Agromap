import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchResource } from '../services/api.ts'

interface Resource {
  key: string
  label: string
}

interface ResourceListProps {
  resources: Resource[]
}

export default function ResourceList({ resources }: ResourceListProps) {
  const { resource } = useParams<{ resource: string }>()
  const label = resources.find((r) => r.key === resource)?.label ?? resource
  const [data, setData] = useState<unknown[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!resource) return
    setLoading(true)
    setError(null)
    fetchResource(resource)
      .then((res) => setData(Array.isArray(res) ? res : [res]))
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro desconhecido'))
      .finally(() => setLoading(false))
  }, [resource])

  const columns = data.length > 0 ? Object.keys(data[0] as object) : []

  return (
    <div className="resource-list">
      <header>
        <Link to="/">← Voltar</Link>
        <h1>{label}</h1>
      </header>

      {loading && <p>Carregando...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && data.length === 0 && <p>Nenhum dado encontrado.</p>}

      {!loading && !error && data.length > 0 && (
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td key={col}>{String((row as Record<string, unknown>)[col])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
