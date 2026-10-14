import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../cadastro.css'
import { CULTURAS } from './Cadastro'
import type { FazendaData } from './Fazenda'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export default function Fazendas() {
  const [fazendas, setFazendas] = useState<FazendaData[]>([])
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading')
  const [query, setQuery] = useState('')

  useEffect(() => {
    let cancelled = false
    fetch(`${API_URL}/fazendas`)
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao carregar fazendas')
        return res.json()
      })
      .then((data: FazendaData[]) => {
        if (!cancelled) {
          setFazendas(data)
          setStatus('ok')
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const q = query.trim().toLowerCase()
  const filtered = q
    ? fazendas.filter((f) =>
        [f.nome, f.proprietario_nome, f.cidade]
          .filter(Boolean)
          .some((v) => v!.toLowerCase().includes(q)),
      )
    : fazendas

  return (
    <div className="cadastro-page">
      {/* ════════════════════ TOP BAR ════════════════════ */}
      <header className="topbar">
        <Link to="/" className="topbar-brand">
          <div className="topbar-brand-icon">
            <svg viewBox="0 0 36 36" fill="none">
              <line x1="12" y1="4" x2="12" y2="32" stroke="currentColor" strokeWidth="1.2" opacity=".5" />
              <line x1="24" y1="4" x2="24" y2="32" stroke="currentColor" strokeWidth="1.2" opacity=".5" />
              <line x1="4" y1="12" x2="32" y2="12" stroke="currentColor" strokeWidth="1.2" opacity=".5" />
              <line x1="4" y1="24" x2="32" y2="24" stroke="currentColor" strokeWidth="1.2" opacity=".5" />
              <circle cx="18" cy="18" r="3.5" fill="var(--accent-green)" />
              <circle cx="8" cy="8" r="2" fill="var(--accent-blue)" opacity=".8" />
              <circle cx="28" cy="8" r="2" fill="var(--accent-blue)" opacity=".8" />
              <circle cx="8" cy="28" r="2" fill="var(--accent-blue)" opacity=".8" />
              <circle cx="28" cy="28" r="2" fill="var(--accent-blue)" opacity=".8" />
              <line x1="18" y1="18" x2="8" y2="8" stroke="var(--accent-green)" strokeWidth="1" opacity=".5" />
              <line x1="18" y1="18" x2="28" y2="8" stroke="var(--accent-green)" strokeWidth="1" opacity=".5" />
              <line x1="18" y1="18" x2="8" y2="28" stroke="var(--accent-green)" strokeWidth="1" opacity=".5" />
              <line x1="18" y1="18" x2="28" y2="28" stroke="var(--accent-green)" strokeWidth="1" opacity=".5" />
            </svg>
          </div>
          <span className="topbar-brand-name">Agro<em>Map</em></span>
          <span className="topbar-brand-sp">SP</span>
        </Link>

        <div className="topbar-right">
          <Link to="/cadastro" className="topbar-login">
            + Nova propriedade
          </Link>
        </div>
      </header>

      {/* ════════════════════ LISTAGEM ════════════════════ */}
      <div className="fazendas-wrap">
        <div className="fazendas-head">
          <div>
            <h1 className="fazendas-title">Fazendas cadastradas</h1>
            <p className="fazendas-sub">Selecione uma propriedade para ver os detalhes.</p>
          </div>
          <div className="map-search-wrap" style={{ maxWidth: '340px', width: '100%' }}>
            <input
              type="text"
              className="map-search-input"
              placeholder="Buscar por nome, proprietário ou município..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {status === 'loading' && (
          <div className="result-placeholder" style={{ opacity: 1 }}>
            <div className="spinner" />
            <span className="result-placeholder-text">Carregando fazendas...</span>
          </div>
        )}

        {status === 'error' && (
          <div className="out-of-sp">
            <span className="out-of-sp-icon">⚠️</span>
            <div className="out-of-sp-text">
              <strong>Não foi possível carregar as fazendas.</strong>
              <br />
              Verifique se o servidor está rodando e tente novamente.
            </div>
          </div>
        )}

        {status === 'ok' && filtered.length === 0 && (
          <div className="result-placeholder" style={{ opacity: 1 }}>
            <span className="result-placeholder-icon">🌱</span>
            <span className="result-placeholder-text">
              {fazendas.length === 0 ? (
                <>Nenhuma fazenda cadastrada ainda.</>
              ) : (
                <>Nenhuma fazenda encontrada para &quot;{query}&quot;.</>
              )}
            </span>
            {fazendas.length === 0 && (
              <Link to="/cadastro" className="btn-outline" style={{ width: 'auto', padding: '10px 24px' }}>
                Cadastrar primeira propriedade
              </Link>
            )}
          </div>
        )}

        {status === 'ok' && filtered.length > 0 && (
          <div className="fazendas-grid">
            {filtered.map((f) => {
              const area = f.area_total_hectares != null ? Number(f.area_total_hectares) : null
              return (
                <Link to={`/fazenda/${f.id}`} className="fazenda-card" key={f.id}>
                  <div className="fazenda-card-top">
                    <div>
                      <div className="fazenda-card-name">{f.nome}</div>
                      <div className="fazenda-card-owner">{f.proprietario_nome || 'Proprietário não informado'}</div>
                    </div>
                    <span className="result-badge result-badge--viable">#{f.id}</span>
                  </div>

                  <div className="fazenda-card-loc">
                    📍 {f.cidade || '—'} · {f.estado || 'SP'}
                  </div>

                  {!!f.culturas?.length && (
                    <div className="infra-chips">
                      {f.culturas.map((fc) => {
                        const cultura = CULTURAS.find((c) => c.id === fc.codigo)
                        return (
                          <span className="infra-chip" key={fc.codigo}>
                            <span className="infra-chip-emoji">{cultura?.emoji || '🌱'}</span>
                            {cultura?.nome || fc.codigo}
                          </span>
                        )
                      })}
                    </div>
                  )}

                  <div className="fazenda-card-stats">
                    <div className="fazenda-card-stat">
                      <span className="fazenda-card-stat-label">Área</span>
                      <span className="fazenda-card-stat-val">
                        {area !== null ? `${area.toLocaleString('pt-BR')} ha` : '—'}
                      </span>
                    </div>
                    <div className="fazenda-card-stat">
                      <span className="fazenda-card-stat-label">Culturas</span>
                      <span className="fazenda-card-stat-val">{f.culturas?.length ?? 0}</span>
                    </div>
                    <div className="fazenda-card-stat">
                      <span className="fazenda-card-stat-label">Infraestrutura</span>
                      <span className="fazenda-card-stat-val">{f.infraestruturas?.length ?? 0}</span>
                    </div>
                    <div className="fazenda-card-stat">
                      <span className="fazenda-card-stat-label">Cadastrada em</span>
                      <span className="fazenda-card-stat-val">
                        {f.data_cadastro ? new Date(f.data_cadastro).toLocaleDateString('pt-BR') : '—'}
                      </span>
                    </div>
                  </div>

                  <span className="fazenda-card-cta">
                    Ver detalhes
                    <svg viewBox="0 0 16 16" fill="none" style={{ width: '13px', height: '13px' }}>
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
