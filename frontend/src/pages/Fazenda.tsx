import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import '../cadastro.css'
import { CULTURAS, INFRA } from './Cadastro'
import { useAuth, useAuthFetch } from '../auth'
import UserMenu from '../components/UserMenu'

const TILES = {
  standard: { url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attr: '© <a href="https://openstreetmap.org">OSM</a>' },
  satellite: { url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attr: '© <a href="https://esri.com">Esri</a>' },
  terrain: { url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', attr: '© <a href="https://opentopomap.org">OpenTopoMap</a>' },
}

type LayerType = keyof typeof TILES

interface Infraestrutura {
  id: number
  codigo: string
  nome: string
  descricao?: string
}

interface FazendaInfraestrutura {
  fazenda_id: number
  infraestrutura_id: number
  infraestrutura: Infraestrutura
}

interface FazendaCultura {
  fazenda_id: number
  codigo: string
}

export interface FazendaData {
  id: number
  nome: string
  proprietario_nome: string | null
  documento: string | null
  telefone: string | null
  email: string | null
  cidade: string | null
  estado: string | null
  pais: string | null
  latitude: number | string | null
  longitude: number | string | null
  area_total_hectares: number | string | null
  area_produtiva_hectares: number | string | null
  altitude_metros: number | null
  car: string | null
  nirf_incra: string | null
  data_cadastro: string
  infraestruturas: FazendaInfraestrutura[]
  culturas: FazendaCultura[]
}

function DetailField({ label, value, mono }: { label: string; value?: string | number | null; mono?: boolean }) {
  const empty = value === null || value === undefined || value === ''
  return (
    <div className="form-group">
      <span className="form-label">{label}</span>
      <span className={`detail-val${mono ? ' detail-val--mono' : ''}${empty ? ' detail-val--empty' : ''}`}>
        {empty ? '—' : value}
      </span>
    </div>
  )
}

export default function Fazenda() {
  const { id } = useParams()
  const location = useLocation()
  const { usuario } = useAuth()
  const authFetch = useAuthFetch()
  const isAdmin = usuario?.tipo === 'admin'
  const stateFazenda = (location.state as { fazenda?: FazendaData } | null)?.fazenda ?? null

  const mapEl = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const layerRef = useRef<L.TileLayer | null>(null)

  const [fazenda, setFazenda] = useState<FazendaData | null>(stateFazenda)
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>(stateFazenda ? 'ok' : 'loading')
  const [activeLayer, setActiveLayer] = useState<LayerType>('standard')

  const lat = fazenda?.latitude != null ? Number(fazenda.latitude) : NaN
  const lon = fazenda?.longitude != null ? Number(fazenda.longitude) : NaN
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lon)
  const area = fazenda?.area_total_hectares != null ? Number(fazenda.area_total_hectares) : null

  /* ══════════════════════════════════════════════════
     CARREGAMENTO DA FAZENDA
  ══════════════════════════════════════════════════ */
  useEffect(() => {
    if (fazenda || !id) return
    let cancelled = false
    authFetch(`/fazendas/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao carregar fazenda')
        return res.json()
      })
      .then((data: FazendaData) => {
        if (!cancelled) {
          setFazenda(data)
          setStatus('ok')
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [id, fazenda, authFetch])

  /* ══════════════════════════════════════════════════
     MAPA (somente leitura)
  ══════════════════════════════════════════════════ */
  useEffect(() => {
    if (!fazenda || !mapEl.current || !hasCoords) return

    const map = L.map(mapEl.current, {
      center: [lat, lon],
      zoom: 13,
      zoomControl: true,
      attributionControl: true,
    })
    mapRef.current = map

    layerRef.current = L.tileLayer(TILES.standard.url, {
      attribution: TILES.standard.attr,
      maxZoom: 19,
    }).addTo(map)

    const customIcon = L.divIcon({
      className: '',
      html: `<div style="
        width:32px;height:32px;background:var(--accent-green);
        border:3px solid #fff;border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);box-shadow:0 3px 12px rgba(61,214,140,.5);
      "></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    })

    L.marker([lat, lon], { icon: customIcon })
      .addTo(map)
      .bindPopup(
        `<div style="min-width:160px">
          <div style="font-weight:700;font-size:.9rem;margin-bottom:4px">📍 ${fazenda.nome}</div>
          <div style="font-size:.75rem;color:#8B949E">${fazenda.cidade || 'São Paulo'} · ${fazenda.estado || 'SP'}</div>
        </div>`,
      )
      .openPopup()

    return () => {
      map.remove()
      mapRef.current = null
      layerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fazenda, hasCoords])

  const setLayer = (type: LayerType) => {
    const map = mapRef.current
    if (!map) return
    if (layerRef.current) map.removeLayer(layerRef.current)
    const t = TILES[type]
    layerRef.current = L.tileLayer(t.url, { attribution: t.attr, maxZoom: 19 }).addTo(map)
    setActiveLayer(type)
  }

  const dataCadastro = fazenda
    ? new Date(fazenda.data_cadastro).toLocaleDateString('pt-BR')
    : ''

  /* ═══════════ RENDER ═══════════ */
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
          <div className="step-indicator">
            <div className="step">
              <div className="step-num done">✓</div>
              <span className="step-label">Dados pessoais</span>
            </div>
            <div className="step-sep" />
            <div className="step">
              <div className="step-num done">✓</div>
              <span className="step-label">Localização &amp; Culturas</span>
            </div>
            <div className="step-sep" />
            <div className="step">
              <div className="step-num active">✓</div>
              <span className="step-label active">Confirmação</span>
            </div>
          </div>
          <UserMenu />
        </div>
      </header>

      {/* ════════════════════ LAYOUT ════════════════════ */}
      <div className="page-wrap">

        {/* ══ COLUNA RESUMO ══ */}
        <div className="form-col">

          {/* Progresso */}
          <div>
            <div className="progress-label">
              <span>Cadastro da Propriedade</span>
              <strong>Etapa 3 de 3 — Concluído</strong>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: '100%' }} />
            </div>
          </div>

          {status === 'loading' && (
            <div className="result-placeholder" style={{ opacity: 1 }}>
              <div className="spinner" />
              <span className="result-placeholder-text">Carregando dados da fazenda...</span>
            </div>
          )}

          {status === 'error' && (
            <>
              <div className="out-of-sp">
                <span className="out-of-sp-icon">⚠️</span>
                <div className="out-of-sp-text">
                  <strong>Não foi possível carregar a fazenda.</strong>
                  <br />
                  Verifique se o servidor está rodando ou cadastre uma nova propriedade.
                </div>
              </div>
              <Link to="/cadastro" className="btn-submit">Ir para o cadastro</Link>
            </>
          )}

          {status === 'ok' && fazenda && (
            <>
              {/* Banner de sucesso */}
              <div className="confirm-banner">
                <span className="confirm-banner-icon">✓</span>
                <div>
                  <div className="confirm-banner-title">Cadastro concluído!</div>
                  <div className="confirm-banner-sub">A propriedade foi registrada com sucesso no AgroMap SP.</div>
                </div>
              </div>

              {/* Título */}
              <div>
                <h1 className="confirm-title">{fazenda.nome}</h1>
                <span className="confirm-sub">ID #{fazenda.id} · Cadastrada em {dataCadastro}</span>
              </div>

              {/* SEÇÃO 1: PRODUTOR */}
              <div className="form-section">
                <div className="section-title">
                  <span className="section-title-num">1</span>
                  Dados do Produtor
                </div>
                <div className="form-row">
                  <DetailField label="Nome Completo" value={fazenda.proprietario_nome} />
                  <DetailField label="CPF / CNPJ" value={fazenda.documento} mono />
                </div>
                <div className="form-row">
                  <DetailField label="E-mail" value={fazenda.email} />
                  <DetailField label="Telefone" value={fazenda.telefone} mono />
                </div>
              </div>

              {/* SEÇÃO 2: PROPRIEDADE */}
              <div className="form-section">
                <div className="section-title">
                  <span className="section-title-num">2</span>
                  Dados da Propriedade
                </div>
                <div className="form-row">
                  <DetailField label="CAR (Cadastro Ambiental Rural)" value={fazenda.car} mono />
                  <DetailField label="NIRF / INCRA" value={fazenda.nirf_incra} mono />
                </div>
                <div className="form-row">
                  <DetailField label="Área Total" value={area !== null ? `${area.toLocaleString('pt-BR')} ha` : null} />
                  <DetailField label="Município" value={fazenda.cidade} />
                </div>
              </div>

              {/* SEÇÃO 3: LOCALIZAÇÃO */}
              <div className="form-section">
                <div className="section-title">
                  <span className="section-title-num">3</span>
                  Localização
                </div>
                <div className="coords-display">
                  <div className="coord-item">
                    <span className="coord-label">Latitude</span>
                    <span className={`coord-val${hasCoords ? '' : ' empty'}`}>
                      {hasCoords ? lat.toFixed(6) + '°' : '—'}
                    </span>
                  </div>
                  <div className="coord-item">
                    <span className="coord-label">Longitude</span>
                    <span className={`coord-val${hasCoords ? '' : ' empty'}`}>
                      {hasCoords ? lon.toFixed(6) + '°' : '—'}
                    </span>
                  </div>
                  <div className="coord-item">
                    <span className="coord-label">Altitude</span>
                    <span className={`coord-val${fazenda.altitude_metros !== null ? '' : ' empty'}`}>
                      {fazenda.altitude_metros !== null ? `${fazenda.altitude_metros} m` : '— m'}
                    </span>
                  </div>
                  <div className={`coords-status${hasCoords ? ' has-coords' : ''}`}>
                    {hasCoords ? <><span className="pulse-dot" /> Registrada</> : <span>Sem localização</span>}
                  </div>
                </div>
              </div>

              {/* SEÇÃO 4: CULTURAS DESEJADAS */}
              <div className="form-section">
                <div className="section-title">
                  <span className="section-title-num">4</span>
                  Culturas Cultivadas
                </div>
                {fazenda.culturas?.length ? (
                  <div className="infra-chips">
                    {fazenda.culturas.map((fc) => {
                      const cultura = CULTURAS.find((c) => c.id === fc.codigo)
                      return (
                        <span className="infra-chip" key={fc.codigo}>
                          <span className="infra-chip-emoji">{cultura?.emoji || '🌱'}</span>
                          {cultura?.nome || fc.codigo}
                        </span>
                      )
                    })}
                  </div>
                ) : (
                  <span className="empty-note">Nenhuma cultura informada.</span>
                )}
              </div>

              {/* SEÇÃO 5: INFRAESTRUTURA */}
              <div className="form-section">
                <div className="section-title">
                  <span className="section-title-num">5</span>
                  Infraestrutura Disponível
                </div>
                {fazenda.infraestruturas?.length ? (
                  <div className="infra-chips">
                    {fazenda.infraestruturas.map((fi) => (
                      <span className="infra-chip" key={fi.infraestrutura_id}>
                        <span className="infra-chip-emoji">{INFRA.find((i) => i.id === fi.infraestrutura.codigo)?.emoji || '📦'}</span>
                        {fi.infraestrutura.nome}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="empty-note">Nenhuma infraestrutura informada.</span>
                )}
              </div>

              {/* AÇÕES */}
              <div className="form-section confirm-actions">
                {isAdmin && (
                  <Link to="/culturas" className="btn-submit">
                    <svg viewBox="0 0 16 16" fill="none" style={{ width: '15px', height: '15px' }}><path d="M2 8h12M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    Ir para o painel de culturas
                  </Link>
                )}
                {isAdmin && (
                  <>
                    <Link to="/cadastro" className="btn-outline">Cadastrar nova propriedade</Link>
                    <Link to="/fazendas" className="btn-outline">Ver todas as fazendas</Link>
                  </>
                )}
                <Link to="/" className="confirm-back">← Voltar ao início</Link>
              </div>
            </>
          )}

        </div>{/* /form-col */}

        {/* ══ COLUNA MAPA + RESUMO ══ */}
        <div className="map-col">

          {/* Toolbar do mapa */}
          <div className="map-toolbar">
            <div className="map-toolbar-title">
              <svg viewBox="0 0 16 16" fill="none"><path d="M8 2C5.2 2 3 4.2 3 7c0 4 5 8 5 8s5-4 5-8c0-2.8-2.2-5-5-5Z" stroke="currentColor" strokeWidth="1.3" /><circle cx="8" cy="7" r="1.5" fill="currentColor" opacity=".6" /></svg>
              Localização da propriedade
            </div>
            <div className="map-layer-chips" style={{ marginLeft: 'auto' }}>
              <button className={`map-chip${activeLayer === 'standard' ? ' active' : ''}`} onClick={() => setLayer('standard')}>Padrão</button>
              <button className={`map-chip${activeLayer === 'satellite' ? ' active' : ''}`} onClick={() => setLayer('satellite')}>Satélite</button>
              <button className={`map-chip${activeLayer === 'terrain' ? ' active' : ''}`} onClick={() => setLayer('terrain')}>Terreno</button>
            </div>
          </div>

          {/* Mapa Leaflet */}
          <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
            {hasCoords ? (
              <div id="map" ref={mapEl} />
            ) : (
              <div className="result-placeholder" style={{ minHeight: '40vh' }}>
                <span className="result-placeholder-icon">🗺️</span>
                <span className="result-placeholder-text">
                  {status === 'loading' ? 'Carregando mapa...' : 'Esta propriedade não possui coordenadas registradas.'}
                </span>
              </div>
            )}
          </div>

          {/* Painel de resumo */}
          <div className="result-panel">
            <div className="result-header">
              <span className="result-badge result-badge--viable">✅ Propriedade registrada</span>
              <span className="result-location">
                📍 <strong>{fazenda?.cidade || 'São Paulo'}</strong> &nbsp;·&nbsp; {fazenda?.estado || 'SP'}
              </span>
            </div>
            <div className="result-region-info">
              <div className="region-stat">
                <span className="region-stat-label">Município</span>
                <span className="region-stat-val">{fazenda?.cidade || '—'}</span>
              </div>
              <div className="region-stat">
                <span className="region-stat-label">Área total</span>
                <span className="region-stat-val">{area !== null ? `${area.toLocaleString('pt-BR')} ha` : '—'}</span>
              </div>
              <div className="region-stat">
                <span className="region-stat-label">Altitude</span>
                <span className="region-stat-val">{fazenda?.altitude_metros != null ? `${fazenda.altitude_metros} m` : '—'}</span>
              </div>
              <div className="region-stat">
                <span className="region-stat-label">Culturas</span>
                <span className="region-stat-val">{fazenda?.culturas?.length ?? 0}</span>
              </div>
              <div className="region-stat">
                <span className="region-stat-label">Infraestruturas</span>
                <span className="region-stat-val">{fazenda?.infraestruturas?.length ?? 0}</span>
              </div>
              <div className="region-stat">
                <span className="region-stat-label">Cadastrada em</span>
                <span className="region-stat-val">{dataCadastro || '—'}</span>
              </div>
            </div>
          </div>

        </div>{/* /map-col */}

      </div>{/* /page-wrap */}
    </div>
  )
}
