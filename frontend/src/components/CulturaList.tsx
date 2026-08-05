import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchResource, createResource } from '../services/api.ts'

interface Cultura {
  id?: number
  nome: string
  nome_cientifico: string
  ciclo_medio_dias: number | ''
  graus_dia_acumulados: number | ''
  coeficiente_kc: number | ''
  temperatura_otima_min: number | ''
  temperatura_otima_max: number | ''
}

const initialForm: Cultura = {
  nome: '',
  nome_cientifico: '',
  ciclo_medio_dias: '',
  graus_dia_acumulados: '',
  coeficiente_kc: '',
  temperatura_otima_min: '',
  temperatura_otima_max: '',
}

export default function CulturaList() {
  const [data, setData] = useState<Cultura[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<Cultura>(initialForm)
  const [saving, setSaving] = useState(false)

  console.log('hello world')

  const load = () => {
    setLoading(true)
    setError(null)
    fetchResource('culturas')
      .then((res) => setData(Array.isArray(res) ? (res as Cultura[]) : [res as Cultura]))
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro desconhecido'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nome.trim()) return
    setSaving(true)
    try {
      await createResource('culturas', form)
      setForm(initialForm)
      setShowModal(false)
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar cultura')
    } finally {
      setSaving(false)
    }
  }

  const columns = data.length > 0 ? Object.keys(data[0]) : []

  return (
    <div className="resource-list">
      <header>
        <Link to="/">← Voltar</Link>
        <h1>Culturas</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          Nova Cultura
        </button>
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

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Nova Cultura</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Nome *
                <input name="nome" value={form.nome} onChange={handleChange} required />
              </label>
              <label>
                Nome Científico
                <input name="nome_cientifico" value={form.nome_cientifico} onChange={handleChange} />
              </label>
              <label>
                Ciclo Médio (dias)
                <input name="ciclo_medio_dias" type="number" value={form.ciclo_medio_dias} onChange={handleChange} />
              </label>
              <label>
                Graus-dia Acumulados
                <input name="graus_dia_acumulados" type="number" value={form.graus_dia_acumulados} onChange={handleChange} />
              </label>
              <label>
                Coeficiente Kc
                <input name="coeficiente_kc" type="number" step="0.01" value={form.coeficiente_kc} onChange={handleChange} />
              </label>
              <label>
                Temperatura Ótima Mínima
                <input name="temperatura_otima_min" type="number" step="0.01" value={form.temperatura_otima_min} onChange={handleChange} />
              </label>
              <label>
                Temperatura Ótima Máxima
                <input name="temperatura_otima_max" type="number" step="0.01" value={form.temperatura_otima_max} onChange={handleChange} />
              </label>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
