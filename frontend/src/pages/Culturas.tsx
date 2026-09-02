import { useEffect, useMemo, useState } from 'react'
import Sidebar from '../components/Sidebar'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

interface Culture {
  id: number
  nome: string
  nomeCientifico: string
  tipo: string
  area: number
  talhoes: number
  diasColheita: number
  desenvolvimento: number
  status: string
}

interface CulturaApi {
  id: number
  nome: string
  nome_cientifico?: string
  ciclo_medio_dias?: number | null
  graus_dia_acumulados?: number | null
  coeficiente_kc?: string | null
  temperatura_otima_min?: string | null
  temperatura_otima_max?: string | null
  tipo?: string
  area?: number | string | null
  talhoes?: number | null
  dias_colheita?: number | null
  desenvolvimento?: number | null
  status?: string
}

const inferTipo = (nome: string): string => {
  const n = nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  if (n.includes('soja')) return 'soy'
  if (n.includes('milho')) return 'corn'
  if (n.includes('algodao')) return 'cotton'
  if (n.includes('trigo')) return 'wheat'
  if (n.includes('arroz')) return 'rice'
  if (n.includes('feijao')) return 'beans'
  if (n.includes('cafe')) return 'coffee'
  if (n.includes('cana')) return 'sugarcane'
  return 'other'
}

const toCulture = (c: CulturaApi): Culture => ({
  id: c.id,
  nome: c.nome,
  nomeCientifico: c.nome_cientifico || '',
  tipo: c.tipo || inferTipo(c.nome),
  area: Number(c.area ?? 0),
  talhoes: Number(c.talhoes ?? 0),
  diasColheita: c.dias_colheita ?? c.ciclo_medio_dias ?? 0,
  desenvolvimento: Number(c.desenvolvimento ?? 0),
  status: c.status || 'ativa',
})

const emptyForm = {
  nome: '',
  nomeCientifico: '',
  tipo: '',
  area: '',
  talhoes: '',
  diasColheita: '',
  desenvolvimento: 0,
  status: 'ativa',
}

const iconByType: Record<string, React.ReactNode> = {
  soy: <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" fill="currentColor" />,
  corn: (
    <>
      <circle cx="12" cy="12" r="8" fill="currentColor" />
      <path d="M12 4v4M12 16v4M4 12h4M16 12h4" stroke="var(--bg-surface)" strokeWidth="2" />
    </>
  ),
  cotton: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="currentColor" />,
  wheat: <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" fill="currentColor" />,
  rice: (
    <>
      <circle cx="12" cy="12" r="8" fill="currentColor" />
      <path d="M12 4v4M12 16v4M4 12h4M16 12h4" stroke="var(--bg-surface)" strokeWidth="2" />
    </>
  ),
  beans: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="currentColor" />,
  coffee: <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" fill="currentColor" />,
  sugarcane: (
    <>
      <circle cx="12" cy="12" r="8" fill="currentColor" />
      <path d="M12 4v4M12 16v4M4 12h4M16 12h4" stroke="var(--bg-surface)" strokeWidth="2" />
    </>
  ),
  other: (
    <>
      <circle cx="12" cy="12" r="8" fill="currentColor" />
      <path d="M12 4v4M12 16v4M4 12h4M16 12h4" stroke="var(--bg-surface)" strokeWidth="2" />
    </>
  ),
}

const formatStatus = (status: string) => {
  const map: Record<string, string> = {
    ativa: 'Ativa',
    planejada: 'Planejada',
    'em-pausa': 'Em Pausa',
    finalizada: 'Finalizada',
  }
  return map[status] || status
}

export default function Culturas() {
  const [cultures, setCultures] = useState<Culture[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch(`${API_URL}/culturas`)
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao carregar culturas')
        return res.json()
      })
      .then((data: CulturaApi[]) => {
        if (!cancelled) setCultures(data.map(toCulture))
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const active = useMemo(() => cultures.filter((c) => c.status === 'ativa'), [cultures])
  const totalArea = useMemo(() => cultures.reduce((sum, c) => sum + c.area, 0), [cultures])
  const totalTalhoes = useMemo(() => cultures.reduce((sum, c) => sum + c.talhoes, 0), [cultures])
  const avgDev = useMemo(() => (active.length > 0 ? Math.round(active.reduce((sum, c) => sum + c.desenvolvimento, 0) / active.length) : 0), [active])

  const open = () => {
    setForm(emptyForm)
    setIsOpen(true)
  }

  const close = () => {
    setIsOpen(false)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      nome: form.nome,
      nome_cientifico: form.nomeCientifico,
      tipo: form.tipo,
      area: Number(form.area) || null,
      talhoes: Number(form.talhoes) || null,
      dias_colheita: Number(form.diasColheita) || null,
      desenvolvimento: form.desenvolvimento,
      status: form.status,
    }
    try {
      const res = await fetch(`${API_URL}/culturas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Erro ao salvar cultura')
      const saved: CulturaApi = await res.json()
      setCultures((prev) => [...prev, toCulture(saved)])
      setForm(emptyForm)
      close()
    } catch (err) {
      console.error(err)
      alert('Não foi possível salvar a cultura')
    }
  }

  const remove = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta cultura?')) return
    try {
      const res = await fetch(`${API_URL}/culturas/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Erro ao excluir cultura')
      setCultures((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      console.error(err)
      alert('Não foi possível excluir a cultura')
    }
  }

  const view = (c: Culture) => {
    alert(`Detalhes da cultura: ${c.nome}\n\nNome Científico: ${c.nomeCientifico}\nÁrea: ${c.area} ha\nTalhões: ${c.talhoes}\nDias para colheita: ${c.diasColheita} dias\nStatus: ${formatStatus(c.status)}`)
  }

  const manage = (c: Culture) => {
    alert(`Gerenciar cultura: ${c.nome}\n\nFuncionalidade de gerenciamento será implementada em breve.`)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar active="culturas" />

      <main className="main">
        <header className="topbar">
          <div className="topbar__left">
            <h1 className="page-title">Culturas</h1>
            <span className="page-date">Gerenciamento de culturas agrícolas</span>
          </div>
          <div className="topbar__right">
            <div className="search-bar">
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M11.5 11.5 14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <input type="text" placeholder="Buscar cultura..." />
            </div>
            <button className="btn btn--primary" onClick={open}>
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Nova Cultura
            </button>
          </div>
        </header>

        <section className="culture-grid">
          {isLoading ? (
            <article className="culture-card">
              <p>Carregando culturas...</p>
            </article>
          ) : (
            cultures.map((culture) => (
              <article className="culture-card" key={culture.id}>
                <div className="culture-card__header">
                  <div className={`culture-icon culture-icon--${culture.tipo}`}>
                    <svg viewBox="0 0 24 24" fill="none">
                      {iconByType[culture.tipo] || iconByType.other}
                    </svg>
                  </div>
                  <div className="culture-info">
                    <h3 className="culture-name">{culture.nome}</h3>
                    <span className="culture-scientific">{culture.nomeCientifico}</span>
                  </div>
                  <div className={`culture-status culture-status--${culture.status === 'ativa' ? 'active' : 'inactive'}`}>
                    {formatStatus(culture.status)}
                  </div>
                </div>

                <div className="culture-stats">
                  <div className="stat-item">
                    <span className="stat-label">Área Plantada</span>
                    <span className="stat-value">{culture.area} ha</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Talhões</span>
                    <span className="stat-value">{culture.talhoes}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Próxima Colheita</span>
                    <span className="stat-value">{culture.diasColheita} dias</span>
                  </div>
                </div>

                <div className="culture-progress">
                  <div className="progress-header">
                    <span className="progress-label">Desenvolvimento</span>
                    <span className="progress-value">{culture.desenvolvimento}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${culture.desenvolvimento}%` }} />
                  </div>
                </div>

                <div className="culture-actions">
                  <button className="btn btn--outline btn--sm" onClick={() => view(culture)}>
                    Ver Detalhes
                  </button>
                  <button className="btn btn--outline btn--sm" onClick={() => manage(culture)}>
                    Gerenciar
                  </button>
                  <button className="btn btn--outline btn--sm btn--danger" onClick={() => remove(culture.id)}>
                    Excluir
                  </button>
                </div>
              </article>
            ))
          )}
        </section>

        <section className="culture-summary">
          <div className="summary-card">
            <h3 className="summary-title">Resumo Geral</h3>
            <div className="summary-stats">
              <div className="summary-stat">
                <span className="summary-value">{active.length}</span>
                <span className="summary-label">Culturas Ativas</span>
              </div>
              <div className="summary-stat">
                <span className="summary-value">{totalArea} ha</span>
                <span className="summary-label">Área Total</span>
              </div>
              <div className="summary-stat">
                <span className="summary-value">{totalTalhoes}</span>
                <span className="summary-label">Talhões</span>
              </div>
              <div className="summary-stat">
                <span className="summary-value">{avgDev}%</span>
                <span className="summary-label">Saúde Média</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {isOpen && (
        <div className="modal">
          <div className="modal__overlay" onClick={close} />
          <div className="modal__content">
            <div className="modal__header">
              <h2 className="modal__title">Cadastrar Nova Cultura</h2>
              <button className="modal__close" onClick={close} aria-label="Fechar modal">
                <svg viewBox="0 0 20 20" fill="none">
                  <path d="M4 4l12 12M4 16L16 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <form className="modal__form" onSubmit={submit}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="nome-cultura">Nome da Cultura</label>
                  <input
                    id="nome-cultura"
                    type="text"
                    className="form-input"
                    placeholder="Ex: Trigo"
                    required
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="nome-cientifico">Nome Científico</label>
                  <input
                    id="nome-cientifico"
                    type="text"
                    className="form-input"
                    placeholder="Ex: Triticum aestivum"
                    required
                    value={form.nomeCientifico}
                    onChange={(e) => setForm({ ...form, nomeCientifico: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="tipo-cultura">Tipo de Cultura</label>
                  <select
                    id="tipo-cultura"
                    className="form-select"
                    required
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                  >
                    <option value="">Selecione...</option>
                    <option value="soy">Soja</option>
                    <option value="corn">Milho</option>
                    <option value="cotton">Algodão</option>
                    <option value="wheat">Trigo</option>
                    <option value="rice">Arroz</option>
                    <option value="beans">Feijão</option>
                    <option value="coffee">Café</option>
                    <option value="sugarcane">Cana-de-açúcar</option>
                    <option value="other">Outra</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="area-plantada">Área Plantada (ha)</label>
                  <input
                    id="area-plantada"
                    type="number"
                    className="form-input"
                    placeholder="100"
                    min="1"
                    required
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="num-talhoes">Número de Talhões</label>
                  <input
                    id="num-talhoes"
                    type="number"
                    className="form-input"
                    placeholder="5"
                    min="1"
                    required
                    value={form.talhoes}
                    onChange={(e) => setForm({ ...form, talhoes: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="dias-colheita">Dias para Próxima Colheita</label>
                  <input
                    id="dias-colheita"
                    type="number"
                    className="form-input"
                    placeholder="30"
                    min="1"
                    required
                    value={form.diasColheita}
                    onChange={(e) => setForm({ ...form, diasColheita: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label" htmlFor="desenvolvimento">Desenvolvimento (%)</label>
                  <div className="form-range">
                    <input
                      id="desenvolvimento"
                      type="range"
                      className="form-range-input"
                      min="0"
                      max="100"
                      value={form.desenvolvimento}
                      onChange={(e) => setForm({ ...form, desenvolvimento: Number(e.target.value) })}
                    />
                    <span className="form-range-value">{form.desenvolvimento}%</span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="status-cultura">Status</label>
                  <select
                    id="status-cultura"
                    className="form-select"
                    required
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="ativa">Ativa</option>
                    <option value="planejada">Planejada</option>
                    <option value="em-pausa">Em Pausa</option>
                    <option value="finalizada">Finalizada</option>
                  </select>
                </div>
              </div>
            </form>

            <div className="modal__actions">
              <button className="btn btn--outline" onClick={close}>
                Cancelar
              </button>
              <button className="btn btn--primary" onClick={submit}>
                Cadastrar Cultura
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
