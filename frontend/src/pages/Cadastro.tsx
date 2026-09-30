import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import '../cadastro.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

/* ══════════════════════════════════════════════════
   BASE DE DADOS DE CULTURAS E REGIÕES SP
   (Fonte: IAC - Instituto Agronômico de Campinas,
    CATI - Coordenadoria de Assistência Técnica Integral,
    IEA - Instituto de Economia Agrícola de SP)
══════════════════════════════════════════════════ */

const CULTURAS = [
  { id: 'soja', emoji: '🌱', nome: 'Soja', ciclo: '90–130 dias', key: 'soja' },
  { id: 'milho', emoji: '🌽', nome: 'Milho', ciclo: '110–150 dias', key: 'milho' },
  { id: 'cana', emoji: '🎋', nome: 'Cana-de-açúcar', ciclo: '12–18 meses', key: 'cana' },
  { id: 'laranja', emoji: '🍊', nome: 'Laranja', ciclo: 'Perene', key: 'laranja' },
  { id: 'cafe', emoji: '☕', nome: 'Café', ciclo: 'Perene', key: 'cafe' },
  { id: 'algodao', emoji: '☁️', nome: 'Algodão', ciclo: '140–160 dias', key: 'algodao' },
  { id: 'feijao', emoji: '🫘', nome: 'Feijão', ciclo: '65–100 dias', key: 'feijao' },
  { id: 'mandioca', emoji: '🌿', nome: 'Mandioca', ciclo: '10–18 meses', key: 'mandioca' },
  { id: 'tomate', emoji: '🍅', nome: 'Tomate', ciclo: '90–120 dias', key: 'tomate' },
  { id: 'trigo', emoji: '🌾', nome: 'Trigo', ciclo: '90–130 dias', key: 'trigo' },
  { id: 'eucalipto', emoji: '🌳', nome: 'Eucalipto', ciclo: '7 anos', key: 'eucalipto' },
  { id: 'amendoim', emoji: '🥜', nome: 'Amendoim', ciclo: '90–130 dias', key: 'amendoim' },
]

const INFRA = [
  { id: 'irrigacao', emoji: '💧', nome: 'Irrigação' },
  { id: 'armazem', emoji: '🏚', nome: 'Armazém' },
  { id: 'maquinas', emoji: '🚜', nome: 'Maquinário' },
  { id: 'energia', emoji: '⚡', nome: 'Energia Elét.' },
  { id: 'agua', emoji: '🌊', nome: 'Rio / Açude' },
  { id: 'estrada', emoji: '🛤', nome: 'Acesso Rural' },
]

/* ═══════════════════════════════════════════
   REGIÕES DE SÃO PAULO — Perfis agroclimáticos
   Baseado em: altitude, pluviosidade, temp média,
   tipo de solo predominante.
═══════════════════════════════════════════ */
interface RegionCultura {
  score: number
  motivo: string
}

interface Region {
  name: string
  altMin: number
  altMax: number
  precip: number
  tempMed: number
  soloTipo: string
  soilPH: string
  soilOrg: string
  soilCEC: string
  bounds: { latMin: number; latMax: number; lonMin: number; lonMax: number }
  culturas: Record<string, RegionCultura>
}

const SP_REGIONS: Region[] = [
  {
    name: 'Região Metropolitana de SP', altMin: 700, altMax: 900,
    precip: 1400, tempMed: 19, soloTipo: 'Argissolo / Latossolo vermelho-amarelo',
    soilPH: '5.5–6.2', soilOrg: '3.2%', soilCEC: '12 cmolc/dm³',
    bounds: { latMin: -24.0, latMax: -23.3, lonMin: -47.0, lonMax: -46.3 },
    culturas: {
      soja: { score: 40, motivo: 'Temperatura amena e altitude elevada são desafios para soja' },
      milho: { score: 65, motivo: 'Viável com irrigação; período chuvoso favorável' },
      cana: { score: 35, motivo: 'Altitude muito alta e temperatura baixa desfavorecem cana' },
      laranja: { score: 70, motivo: 'Histórico citricultor na região metropolitana expandida' },
      cafe: { score: 75, motivo: 'Altitude e temperatura ideais para café arábica de qualidade' },
      algodao: { score: 30, motivo: 'Clima úmido e altitude inadequados para o algodão' },
      feijao: { score: 72, motivo: 'Cultivo tradicional na RMSP e arredores' },
      mandioca: { score: 60, motivo: 'Adapta-se bem, mas solo argiloso pode dificultar' },
      tomate: { score: 80, motivo: 'Clima serrano é ideal para tomate de mesa e indústria' },
      trigo: { score: 55, motivo: 'Altitude favorece, mas chuvas excessivas prejudicam' },
      eucalipto: { score: 85, motivo: 'Ótimo para reflorestamento e biomassa na região' },
      amendoim: { score: 45, motivo: 'Período seco insuficiente compromete a produção' },
    },
  },
  {
    name: 'Interior Paulista — Ribeirão Preto', altMin: 450, altMax: 750,
    precip: 1500, tempMed: 23, soloTipo: 'Latossolo Roxo / Terra Roxa Estruturada',
    soilPH: '5.8–6.5', soilOrg: '4.1%', soilCEC: '16 cmolc/dm³',
    bounds: { latMin: -22.0, latMax: -20.5, lonMin: -48.5, lonMax: -47.0 },
    culturas: {
      soja: { score: 90, motivo: 'Solo e clima perfeitos — maior produtividade de SP' },
      milho: { score: 88, motivo: 'Terra Roxa é referência para milho no Brasil' },
      cana: { score: 95, motivo: 'Região canavieira histórica — maior polo sucroalcooleiro' },
      laranja: { score: 60, motivo: 'Competição com cana reduziu área, mas ainda viável' },
      cafe: { score: 45, motivo: 'Temperatura alta demais para arábica de qualidade' },
      algodao: { score: 75, motivo: 'Condições favoráveis, boa drenagem do solo' },
      feijao: { score: 80, motivo: 'Excelente para safrinha pós-cana ou pós-milho' },
      mandioca: { score: 70, motivo: 'Solo profundo facilita colheita mecanizada' },
      tomate: { score: 55, motivo: 'Calor intenso pode reduzir frutificação' },
      trigo: { score: 40, motivo: 'Temperatura acima do ideal para o cereal de inverno' },
      eucalipto: { score: 82, motivo: 'Alta produtividade madeireira na região' },
      amendoim: { score: 92, motivo: 'SP/interior é o maior produtor nacional de amendoim' },
    },
  },
  {
    name: 'Noroeste Paulista — Araçatuba', altMin: 300, altMax: 500,
    precip: 1200, tempMed: 26, soloTipo: 'Latossolo Vermelho Eutrófico / Argissolo',
    soilPH: '5.4–6.0', soilOrg: '2.8%', soilCEC: '9 cmolc/dm³',
    bounds: { latMin: -21.5, latMax: -20.0, lonMin: -51.0, lonMax: -49.5 },
    culturas: {
      soja: { score: 80, motivo: 'Boa adaptação com variedades de ciclo curto' },
      milho: { score: 78, motivo: 'Safrinha com bom potencial; déficit hídrico pontual' },
      cana: { score: 88, motivo: 'Importante polo canavieiro em expansão' },
      laranja: { score: 55, motivo: 'Clima quente e seco pode gerar stress hídrico' },
      cafe: { score: 30, motivo: 'Temperatura demasiado alta e altitude baixa' },
      algodao: { score: 85, motivo: 'Condições ideais — segunda janela agrícola importante' },
      feijao: { score: 72, motivo: 'Viável nas duas safras; atenção ao período seco' },
      mandioca: { score: 82, motivo: 'Temperatura alta favorece amido; boa produtividade' },
      tomate: { score: 42, motivo: 'Calor intenso requer irrigação pesada e estrutura' },
      trigo: { score: 25, motivo: 'Clima tropical quente inviabiliza trigo de inverno' },
      eucalipto: { score: 78, motivo: 'Rápido crescimento no calor; boa opção para APP' },
      amendoim: { score: 88, motivo: 'Clima quente e solo arenoso são favoráveis' },
    },
  },
  {
    name: 'Vale do Paraíba', altMin: 550, altMax: 1100,
    precip: 1600, tempMed: 20, soloTipo: 'Cambissolo / Latossolo amarelo',
    soilPH: '4.8–5.5', soilOrg: '2.5%', soilCEC: '8 cmolc/dm³',
    bounds: { latMin: -23.5, latMax: -22.5, lonMin: -45.5, lonMax: -44.5 },
    culturas: {
      soja: { score: 50, motivo: 'Topografia acidentada limita mecanização' },
      milho: { score: 62, motivo: 'Viável em várzeas e áreas planas do vale' },
      cana: { score: 40, motivo: 'Relevo e solo menos profundo são barreiras' },
      laranja: { score: 55, motivo: 'Micro-climas favoráveis em altitudes medianas' },
      cafe: { score: 88, motivo: 'Região histórica de café — altitude e clima perfeitos' },
      algodao: { score: 28, motivo: 'Alta umidade e solo ácido desfavorecem algodão' },
      feijao: { score: 70, motivo: 'Cultivo familiar tradicionaal no Vale' },
      mandioca: { score: 65, motivo: 'Solo ácido requer calcário; produção viável' },
      tomate: { score: 78, motivo: 'Altitude e amplitude térmica favorecem qualidade' },
      trigo: { score: 60, motivo: 'Inverno frio suficiente; chuvas devem ser controladas' },
      eucalipto: { score: 80, motivo: 'Plantios em encostas viáveis para recuperação' },
      amendoim: { score: 38, motivo: 'Solo ácido e relevo limitam o cultivo' },
    },
  },
  {
    name: 'Sul Paulista — Sorocaba / Botucatu', altMin: 700, altMax: 900,
    precip: 1450, tempMed: 20, soloTipo: 'Latossolo Vermelho / Nitossolo',
    soilPH: '5.6–6.3', soilOrg: '3.8%', soilCEC: '14 cmolc/dm³',
    bounds: { latMin: -24.0, latMax: -22.5, lonMin: -48.5, lonMax: -47.0 },
    culturas: {
      soja: { score: 82, motivo: 'Solo fértil e boa distribuição pluviométrica' },
      milho: { score: 85, motivo: 'Polo histórico de pesquisa em Botucatu — excelente' },
      cana: { score: 60, motivo: 'Altitude e temperatura limitam o rendimento sacarino' },
      laranja: { score: 75, motivo: 'Microclima favorável para citros de qualidade' },
      cafe: { score: 80, motivo: 'Temperatura e altitude propícias para arábica fino' },
      algodao: { score: 55, motivo: 'Clima úmido aumenta incidência de fungos' },
      feijao: { score: 85, motivo: 'Solos férteis e clima favorável — alta produtividade' },
      mandioca: { score: 68, motivo: 'Adapta-se bem; solo mais argiloso pode limitar' },
      tomate: { score: 82, motivo: 'Clima serrano ideal para produção de tomate' },
      trigo: { score: 70, motivo: 'Inverno frio; boa opção de safrinha pós-soja' },
      eucalipto: { score: 88, motivo: 'Região de grande produção de eucalipto industrial' },
      amendoim: { score: 70, motivo: 'Solo e clima favoráveis; competição com outras culturas' },
    },
  },
  {
    name: 'Litoral Paulista', altMin: 0, altMax: 200,
    precip: 2200, tempMed: 25, soloTipo: 'Espodossolo / Argissolo arenoso',
    soilPH: '4.5–5.2', soilOrg: '1.8%', soilCEC: '5 cmolc/dm³',
    bounds: { latMin: -24.5, latMax: -23.5, lonMin: -46.5, lonMax: -44.5 },
    culturas: {
      soja: { score: 18, motivo: 'Solo arenoso, alta umidade e salinidade são barreiras' },
      milho: { score: 30, motivo: 'Viável apenas em hortas familiares' },
      cana: { score: 25, motivo: 'Solo inadequado e excesso de chuvas prejudicam' },
      laranja: { score: 22, motivo: 'Brisa marinha e solo pobre limitam citricultura' },
      cafe: { score: 12, motivo: 'Alta umidade e temperatura inadequada' },
      algodao: { score: 10, motivo: 'Totalmente inadequado — excesso de umidade' },
      feijao: { score: 40, motivo: 'Cultivo de subsistência possível; baixa escala' },
      mandioca: { score: 65, motivo: 'Adapta-se bem em solo arenoso; uso típico da região' },
      tomate: { score: 35, motivo: 'Umidade eleva pressão de doenças fúngicas' },
      trigo: { score: 15, motivo: 'Temperatura e umidade incompatíveis' },
      eucalipto: { score: 55, motivo: 'Planta-se em restingas com espécies tolerantes' },
      amendoim: { score: 20, motivo: 'Solo drenante mas salinidade e umidade são problemas' },
    },
  },
]

/* ══════════════════════════════════════════════════
   LEAFLET MAP SETUP
══════════════════════════════════════════════════ */

// Limites aproximados de SP para validação
const SP_BBOX = { latMin: -25.4, latMax: -19.7, lonMin: -53.2, lonMax: -44.1 }
// Centro de SP
const SP_CENTER: [number, number] = [-22.5, -48.5]

// Tiles
const TILES = {
  standard: { url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attr: '© <a href="https://openstreetmap.org">OSM</a>' },
  satellite: { url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attr: '© <a href="https://esri.com">Esri</a>' },
  terrain: { url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', attr: '© <a href="https://opentopomap.org">OpenTopoMap</a>' },
}

type LayerType = keyof typeof TILES

function isInsideSP(lat: number, lon: number) {
  return lat >= SP_BBOX.latMin && lat <= SP_BBOX.latMax
    && lon >= SP_BBOX.lonMin && lon <= SP_BBOX.lonMax
}

/* ══════════════════════════════════════════════════
   GEOCODING — Nominatim (OSM) — busca município
══════════════════════════════════════════════════ */
interface GeoData {
  city: string
  state: string
  display: string
}

async function reverseGeocode(lat: number, lon: number): Promise<GeoData> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=pt-BR&zoom=10`
    const res = await fetch(url)
    const data = await res.json()
    const addr = data.address
    const city = addr.city || addr.town || addr.village || addr.municipality || addr.county || ''
    const state = addr.state || ''
    return { city, state, display: data.display_name }
  } catch {
    return { city: 'Não detectado', state: 'SP', display: '' }
  }
}

/* ══════════════════════════════════════════════════
   ELEVATION — Open-Meteo
══════════════════════════════════════════════════ */
async function getElevation(lat: number, lon: number): Promise<number | null> {
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lon}`)
    const data = await res.json()
    return data.elevation?.[0] ?? null
  } catch {
    return null
  }
}

function detectRegion(lat: number, lon: number, alt: number | null): Region {
  // Tenta encaixar na região mais próxima por bounding box
  for (const r of SP_REGIONS) {
    if (lat >= r.bounds.latMin && lat <= r.bounds.latMax &&
      lon >= r.bounds.lonMin && lon <= r.bounds.lonMax) {
      return r
    }
  }
  // Fallback: determina por altitude
  if (alt !== null) {
    if (alt > 600) return SP_REGIONS[4] // Sul paulista
    if (alt > 400) return SP_REGIONS[1] // Ribeirão Preto
    return SP_REGIONS[2] // Noroeste
  }
  return SP_REGIONS[1] // default interior
}

function scoreToClass(score: number) {
  if (score >= 75) return { cls: 'viable', label: 'Viável', scoreCls: 'score--viable', cardCls: 'culture-result-card--viable', badgeCls: 'result-badge--viable' }
  if (score >= 55) return { cls: 'partial', label: 'Parcialmente', scoreCls: 'score--partial', cardCls: 'culture-result-card--partial', badgeCls: 'result-badge--partial' }
  if (score >= 35) return { cls: 'warn', label: 'Atenção', scoreCls: 'score--warn', cardCls: 'culture-result-card--warn', badgeCls: 'result-badge--warn' }
  return { cls: 'notviable', label: 'Não viável', scoreCls: 'score--notviable', cardCls: 'culture-result-card--notviable', badgeCls: 'result-badge--notviable' }
}

function getFactors(region: Region) {
  const factors: { dot: string; text: string }[] = []
  const temp = region.tempMed
  const precip = region.precip
  const alt = region.altMin

  if (temp >= 20 && temp <= 28) factors.push({ dot: 'dot-ok', text: `Temperatura média ideal (${temp}°C)` })
  else if (temp < 20) factors.push({ dot: 'dot-warn', text: `Temperatura abaixo do ideal (${temp}°C)` })
  else factors.push({ dot: 'dot-bad', text: `Temperatura elevada (${temp}°C)` })

  if (precip >= 1200 && precip <= 1800) factors.push({ dot: 'dot-ok', text: `Pluviosidade adequada (${precip} mm/ano)` })
  else if (precip > 1800) factors.push({ dot: 'dot-warn', text: `Chuvas excessivas (${precip} mm/ano)` })
  else factors.push({ dot: 'dot-bad', text: `Pluviosidade baixa (${precip} mm/ano)` })

  if (alt >= 400 && alt <= 900) factors.push({ dot: 'dot-ok', text: `Altitude favorável (${alt}–${region.altMax} m)` })
  else if (alt < 400) factors.push({ dot: 'dot-warn', text: `Altitude baixa (${alt} m)` })
  else factors.push({ dot: 'dot-warn', text: `Altitude elevada (${alt} m)` })

  return factors
}

type ResultView =
  | { type: 'result'; region: Region; city: string; lat: number; lon: number; elevation: number | null }
  | { type: 'out'; lat: number; lon: number }

export default function Cadastro() {
  const mapEl = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const layerRef = useRef<L.TileLayer | null>(null)
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [email, setEmail] = useState('')
  const [tel, setTel] = useState('')
  const [fazenda, setFazenda] = useState('')
  const [car, setCar] = useState('')
  const [nirf, setNirf] = useState('')
  const [area, setArea] = useState(100)
  const [municipio, setMunicipio] = useState('')
  const [coords, setCoords] = useState<{ lat: number | null; lon: number | null; alt: number | null }>({
    lat: null,
    lon: null,
    alt: null,
  })
  const [selectedCulturas, setSelectedCulturas] = useState<string[]>([])
  const [selectedInfra, setSelectedInfra] = useState<string[]>([])
  const [activeLayer, setActiveLayer] = useState<LayerType>('standard')
  const [searchQuery, setSearchQuery] = useState('')
  const [loaderText, setLoaderText] = useState<string | null>(null)
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [result, setResult] = useState<ResultView | null>(null)

  /* ══════════════════════════════════════════════════
     UI HELPERS
  ══════════════════════════════════════════════════ */
  const showLoader = (msg?: string) => setLoaderText(msg || 'Processando...')
  const hideLoader = () => setLoaderText(null)

  const showToast = (msg: string) => {
    setToastMsg(msg)
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current)
    toastTimeoutRef.current = setTimeout(() => setToastMsg(null), 4000)
  }

  /* ══════════════════════════════════════════════════
     MAPA
  ══════════════════════════════════════════════════ */
  const placeMarker = (lat: number, lon: number) => {
    const map = mapRef.current
    if (!map) return
    if (markerRef.current) map.removeLayer(markerRef.current)

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

    markerRef.current = L.marker([lat, lon], { icon: customIcon }).addTo(map)
    map.panTo([lat, lon])

    setCoords({ lat, lon, alt: null })
  }

  const showOutOfSP = (lat: number, lon: number) => {
    setResult({ type: 'out', lat, lon })
  }

  const analyzeLocation = async (lat: number, lon: number) => {
    showLoader('Identificando região...')

    const [geoData, elevation] = await Promise.all([
      reverseGeocode(lat, lon),
      getElevation(lat, lon),
    ])

    hideLoader()

    // Detecta a região de SP
    const region = detectRegion(lat, lon, elevation)

    // Preenche formulário
    setMunicipio(geoData.city || 'São Paulo')
    setCoords({ lat, lon, alt: elevation ?? null })

    // Popup no mapa
    const popupContent = `
      <div style="min-width:180px">
        <div style="font-weight:700;font-size:.9rem;margin-bottom:4px">📍 ${geoData.city || 'São Paulo'}</div>
        <div style="font-size:.75rem;color:#8B949E;margin-bottom:8px">${region.name}</div>
        <div style="display:flex;gap:12px;">
          <div><div style="font-size:.6rem;color:#484F58;text-transform:uppercase;letter-spacing:.06em">Lat</div><div style="font-family:DM Mono,monospace;font-size:.75rem;color:#3DD68C">${lat.toFixed(4)}°</div></div>
          <div><div style="font-size:.6rem;color:#484F58;text-transform:uppercase;letter-spacing:.06em">Lon</div><div style="font-family:DM Mono,monospace;font-size:.75rem;color:#3DD68C">${lon.toFixed(4)}°</div></div>
          <div><div style="font-size:.6rem;color:#484F58;text-transform:uppercase;letter-spacing:.06em">Alt</div><div style="font-family:DM Mono,monospace;font-size:.75rem;color:#4A9EFF">${elevation ? Math.round(elevation) + 'm' : '—'}</div></div>
        </div>
      </div>
    `
    if (markerRef.current) markerRef.current.bindPopup(popupContent).openPopup()

    // Renderiza resultado
    setResult({ type: 'result', region, city: geoData.city || 'São Paulo', lat, lon, elevation })

    showToast('✅ Localização analisada com sucesso!')
  }

  const handleMapClick = (lat: number, lon: number) => {
    if (!isInsideSP(lat, lon)) {
      showToast('⚠️ O ponto marcado está fora do estado de São Paulo. O sistema analisa apenas propriedades paulistas.')
      showOutOfSP(lat, lon)
      return
    }
    placeMarker(lat, lon)
    analyzeLocation(lat, lon)
  }

  useEffect(() => {
    if (!mapEl.current) return

    const map = L.map(mapEl.current, {
      center: SP_CENTER,
      zoom: 7,
      zoomControl: true,
      attributionControl: true,
    })
    mapRef.current = map

    // Tile layer padrão
    layerRef.current = L.tileLayer(TILES.standard.url, {
      attribution: TILES.standard.attr,
      maxZoom: 19,
    }).addTo(map)

    // Polígono suave do estado de SP (coordenadas reais simplificadas)
    const spCoords: [number, number][] = [
      [-20.07, -50.93], [-19.97, -49.87], [-20.05, -48.90], [-20.43, -48.09],
      [-20.77, -47.58], [-21.17, -47.43], [-21.50, -47.19], [-21.66, -46.50],
      [-22.01, -45.98], [-22.42, -45.38], [-22.87, -44.77], [-23.18, -44.53],
      [-23.68, -45.02], [-24.00, -45.57], [-24.29, -46.20], [-24.55, -46.73],
      [-24.62, -47.64], [-24.85, -48.09], [-25.06, -48.52], [-25.26, -49.07],
      [-25.32, -49.68], [-25.08, -50.45], [-24.53, -51.02], [-24.04, -51.30],
      [-23.44, -51.60], [-22.98, -51.85], [-22.45, -51.90], [-22.05, -51.75],
      [-21.75, -51.42], [-21.40, -51.10], [-21.13, -51.00], [-20.78, -51.30],
      [-20.52, -51.55], [-20.17, -51.62], [-19.91, -51.10], [-19.87, -50.51],
      [-20.07, -50.93],
    ]

    L.polygon(spCoords, {
      color: '#3DD68C',
      weight: 2,
      opacity: 0.6,
      fillColor: '#3DD68C',
      fillOpacity: 0.04,
      dashArray: '6 4',
    }).addTo(map)

    // Label de SP
    L.marker([-22.3, -49.2], {
      icon: L.divIcon({
        className: 'leaflet-sp-label',
        html: '<span style="font-family:DM Sans,sans-serif;font-size:11px;font-weight:700;color:rgba(61,214,140,.5);letter-spacing:.1em;text-transform:uppercase;white-space:nowrap;text-shadow:0 0 8px rgba(0,0,0,.8)">ESTADO DE SÃO PAULO</span>',
        iconAnchor: [60, 8],
      }),
    }).addTo(map)

    // Clique no mapa
    map.on('click', (e: L.LeafletMouseEvent) => {
      handleMapClick(e.latlng.lat, e.latlng.lng)
    })

    return () => {
      map.remove()
      mapRef.current = null
      markerRef.current = null
      layerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ══════════════════════════════════════════════════
     BUSCA DE MUNICÍPIO
  ══════════════════════════════════════════════════ */
  const searchCity = async () => {
    const q = searchQuery.trim()
    if (!q) return
    showLoader('Buscando ' + q + '...')
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q + ', São Paulo, Brasil')}&limit=1&accept-language=pt-BR`
      const res = await fetch(url)
      const data = await res.json()
      hideLoader()
      if (!data || !data.length) {
        showToast('🔍 Município não encontrado. Tente o nome completo.')
        return
      }
      const lat = parseFloat(data[0].lat)
      const lon = parseFloat(data[0].lon)
      if (!isInsideSP(lat, lon)) {
        showToast('⚠️ Município encontrado mas fora de São Paulo.')
        return
      }
      mapRef.current?.setView([lat, lon], 11)
      handleMapClick(lat, lon)
    } catch {
      hideLoader()
      showToast('❌ Erro na busca. Verifique a conexão.')
    }
  }

  /* ══════════════════════════════════════════════════
     GPS DO DISPOSITIVO
  ══════════════════════════════════════════════════ */
  const useGPS = () => {
    if (!navigator.geolocation) {
      showToast('❌ Geolocalização não suportada neste navegador.')
      return
    }
    showLoader('Obtendo localização GPS...')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        hideLoader()
        const lat = pos.coords.latitude
        const lon = pos.coords.longitude
        mapRef.current?.setView([lat, lon], 12)
        handleMapClick(lat, lon)
      },
      () => {
        hideLoader()
        showToast('❌ Não foi possível obter o GPS. Permita o acesso à localização.')
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  /* ══════════════════════════════════════════════════
     TILES DE MAPA
  ══════════════════════════════════════════════════ */
  const setLayer = (type: LayerType) => {
    const map = mapRef.current
    if (!map) return
    if (layerRef.current) map.removeLayer(layerRef.current)
    const t = TILES[type]
    layerRef.current = L.tileLayer(t.url, { attribution: t.attr, maxZoom: 19 }).addTo(map)
    setActiveLayer(type)
  }

  /* ══════════════════════════════════════════════════
     CULTURAS / INFRA SELECTOR
  ══════════════════════════════════════════════════ */
  const toggleCultura = (id: string) => {
    const next = selectedCulturas.includes(id)
      ? selectedCulturas.filter((c) => c !== id)
      : [...selectedCulturas, id]
    setSelectedCulturas(next)

    // Re-analisa se já tiver localização
    if (coords.lat !== null && coords.lon !== null) {
      const region = detectRegion(coords.lat, coords.lon, null)
      setResult({ type: 'result', region, city: municipio, lat: coords.lat, lon: coords.lon, elevation: null })
    }
  }

  const toggleInfra = (id: string) => {
    setSelectedInfra((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  /* ══════════════════════════════════════════════════
     SUBMIT
  ══════════════════════════════════════════════════ */
  const canSubmit = !!(nome.trim() && email.trim() && fazenda.trim() && coords.lat !== null && selectedCulturas.length > 0)

  const handleSubmit = async () => {
    if (!canSubmit) return
    showLoader('Cadastrando sua propriedade...')
    try {
      const res = await fetch(`${API_URL}/fazendas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: fazenda.trim(),
          proprietario_nome: nome.trim(),
          documento: cpf.trim() || undefined,
          email: email.trim(),
          telefone: tel.trim() || undefined,
          car: car.trim() || undefined,
          nirf_incra: nirf.trim() || undefined,
          area_total_hectares: area,
          cidade: municipio || undefined,
          estado: 'SP',
          latitude: coords.lat,
          longitude: coords.lon,
          altitude_metros: coords.alt !== null ? Math.round(coords.alt) : undefined,
          infraestruturas: selectedInfra,
        }),
      })
      hideLoader()
      if (!res.ok) {
        showToast('❌ Erro ao cadastrar a propriedade. Verifique os dados e tente novamente.')
        return
      }
      showToast(`✅ Propriedade "${fazenda.trim()}" de ${nome.trim()} cadastrada com sucesso!`)
    } catch {
      hideLoader()
      showToast('❌ Não foi possível conectar ao servidor. Verifique se o backend está rodando.')
    }
  }

  /* ═══════════ RENDER ═══════════ */
  const renderResult = () => {
    if (!result) return null

    if (result.type === 'out') {
      return (
        <div className="out-of-sp">
          <span className="out-of-sp-icon">🗺️</span>
          <div className="out-of-sp-text">
            <strong>Ponto fora do estado de São Paulo.</strong>
            <br />
            O AgroMap SP analisa exclusivamente propriedades paulistas. Clique dentro dos limites do estado ({result.lat.toFixed(3)}°, {result.lon.toFixed(3)}°).
          </div>
        </div>
      )
    }

    const { region, city, elevation } = result

    // Culturas selecionadas
    const allCulturas = selectedCulturas.length > 0
      ? CULTURAS.filter((c) => selectedCulturas.includes(c.id))
      : CULTURAS

    // Score geral
    const scores = allCulturas.map((c) => region.culturas[c.key]?.score ?? 50)
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    const overall = scoreToClass(avgScore)

    return (
      <>
        <div className="result-header">
          <span className={`result-badge ${overall.badgeCls}`}>
            {overall.cls === 'viable' ? '✅' : overall.cls === 'partial' ? '⚡' : overall.cls === 'warn' ? '⚠️' : '❌'}
            {overall.label} — Score {avgScore}/100
          </span>
          <span className="result-location">
            📍 <strong>{city || 'São Paulo'}</strong> &nbsp;·&nbsp; {region.name}
          </span>
        </div>

        <div className="result-region-info">
          <div className="region-stat">
            <span className="region-stat-label">Altitude</span>
            <span className="region-stat-val">{elevation ? Math.round(elevation) + 'm' : region.altMin + '–' + region.altMax + 'm'}</span>
          </div>
          <div className="region-stat">
            <span className="region-stat-label">Temp. média</span>
            <span className="region-stat-val">{region.tempMed}°C</span>
          </div>
          <div className="region-stat">
            <span className="region-stat-label">Pluviosidade</span>
            <span className="region-stat-val">{region.precip} mm/ano</span>
          </div>
          <div className="region-stat">
            <span className="region-stat-label">Solo predominante</span>
            <span className="region-stat-val" style={{ fontSize: '.78rem' }}>{region.soloTipo}</span>
          </div>
          <div className="region-stat">
            <span className="region-stat-label">pH do solo</span>
            <span className="region-stat-val">{region.soilPH}</span>
          </div>
          <div className="region-stat">
            <span className="region-stat-label">Mat. orgânica</span>
            <span className="region-stat-val">{region.soilOrg}</span>
          </div>
        </div>

        <div className="result-cultures-grid">
          {allCulturas.map((c) => {
            const data = region.culturas[c.key] || { score: 50, motivo: 'Dados insuficientes' }
            const st = scoreToClass(data.score)
            const facs = getFactors(region).slice(0, 2)
            return (
              <div className={`culture-result-card ${st.cardCls}`} key={c.id}>
                <div className="crc-top">
                  <span className="crc-emoji">{c.emoji}</span>
                  <span className={`crc-score ${st.scoreCls}`}>{data.score}pts</span>
                </div>
                <div className="crc-name">{c.nome}</div>
                <div className="crc-verdict">{data.motivo}</div>
                <div className="crc-factors">
                  {facs.map((f, i) => (
                    <div className="crc-factor" key={i}>
                      <span className={`crc-factor-dot ${f.dot}`} />
                      {f.text}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </>
    )
  }

  return (
    <div className="cadastro-page">
      {/* ════════════════════ TOP BAR ════════════════════ */}
      <header className="topbar">
        <a href="#" className="topbar-brand">
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
        </a>

        <div className="topbar-right">
          <div className="step-indicator">
            <div className="step">
              <div className="step-num done" id="step1-num">✓</div>
              <span className="step-label" id="step1-lbl">Dados pessoais</span>
            </div>
            <div className="step-sep" />
            <div className="step">
              <div className="step-num active" id="step2-num">2</div>
              <span className="step-label active" id="step2-lbl">Localização &amp; Culturas</span>
            </div>
            <div className="step-sep" />
            <div className="step">
              <div className="step-num" id="step3-num">3</div>
              <span className="step-label" id="step3-lbl">Confirmação</span>
            </div>
          </div>
          <button className="topbar-login">Já tenho conta</button>
        </div>
      </header>

      {/* ════════════════════ LAYOUT ════════════════════ */}
      <div className="page-wrap">

        {/* ══ COLUNA FORMULÁRIO ══ */}
        <div className="form-col">

          {/* Progresso */}
          <div>
            <div className="progress-label">
              <span>Cadastro da Propriedade</span>
              <strong id="progress-pct">Etapa 2 de 3</strong>
            </div>
            <div className="progress-track">
              <div className="progress-fill" id="progress-bar" />
            </div>
          </div>

          {/* SEÇÃO 1: PRODUTOR */}
          <div className="form-section">
            <div className="section-title">
              <span className="section-title-num">1</span>
              Dados do Produtor
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nome Completo <span className="required-dot" /></label>
                <input type="text" className="form-input" id="f-nome" placeholder="João da Silva" value={nome} onChange={(e) => setNome(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">CPF / CNPJ <span className="required-dot" /></label>
                <input type="text" className="form-input form-input--mono" id="f-cpf" placeholder="000.000.000-00" value={cpf} onChange={(e) => setCpf(e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">E-mail <span className="required-dot" /></label>
                <input type="email" className="form-input" id="f-email" placeholder="produtor@fazenda.com.br" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Telefone</label>
                <input type="tel" className="form-input form-input--mono" id="f-tel" placeholder="(11) 99000-0000" value={tel} onChange={(e) => setTel(e.target.value)} />
              </div>
            </div>
          </div>

          {/* SEÇÃO 2: PROPRIEDADE */}
          <div className="form-section">
            <div className="section-title">
              <span className="section-title-num">2</span>
              Dados da Propriedade
            </div>
            <div className="form-group">
              <label className="form-label">Nome da Fazenda / Sítio <span className="required-dot" /></label>
              <input type="text" className="form-input" id="f-fazenda" placeholder="Ex: Fazenda São Pedro" value={fazenda} onChange={(e) => setFazenda(e.target.value)} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">CAR (Cadastro Ambiental Rural)</label>
                <input type="text" className="form-input form-input--mono" id="f-car" placeholder="SP-3550308-..." value={car} onChange={(e) => setCar(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">NIRF / INCRA</label>
                <input type="text" className="form-input form-input--mono" id="f-nirf" placeholder="000.000.0000-0" value={nirf} onChange={(e) => setNirf(e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Área Total (hectares) <span className="required-dot" /></label>
              <div className="area-slider-wrap">
                <input type="range" className="area-slider" id="area-slider" min="1" max="5000" value={area} onChange={(e) => setArea(Number(e.target.value))} />
                <div className="area-slider-vals">
                  <span>1 ha</span>
                  <strong id="area-display" style={{ color: 'var(--accent-green)', fontSize: '.78rem' }}>{area} ha</strong>
                  <span>5.000 ha</span>
                </div>
              </div>
              <input
                type="number"
                className="form-input form-input--mono"
                id="f-area"
                value={area}
                style={{ marginTop: '4px' }}
                onChange={(e) => setArea(Math.min(5000, Math.max(1, parseInt(e.target.value) || 1)))}
              />
            </div>
          </div>

          {/* SEÇÃO 3: LOCALIZAÇÃO (via mapa) */}
          <div className="form-section">
            <div className="section-title">
              <span className="section-title-num">3</span>
              Localização no Mapa
            </div>

            <div className="map-instructions">
              <span className="map-instructions-icon">🗺️</span>
              <div className="map-instructions-text">
                <strong>Clique no mapa</strong> à direita para marcar a localização da sua propriedade dentro do estado de São Paulo. Você também pode <strong>buscar pelo nome do município</strong> na barra de pesquisa do mapa, ou usar o <strong>GPS do dispositivo</strong>.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button className="btn-gps" id="btn-gps" onClick={useGPS}>
                <svg viewBox="0 0 16 16" fill="none" style={{ width: '13px', height: '13px' }}><circle cx="8" cy="8" r="3" fill="currentColor" opacity=".4" /><circle cx="8" cy="8" r="1.5" fill="currentColor" /><path d="M8 1v2M8 13v2M1 8h2M13 8h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                Usar minha localização GPS
              </button>
            </div>

            {/* Coordenadas live */}
            <div className="coords-display">
              <div className="coord-item">
                <span className="coord-label">Latitude</span>
                <span className={`coord-val${coords.lat === null ? ' empty' : ''}`} id="disp-lat">
                  {coords.lat === null ? '— Aguardando' : coords.lat.toFixed(6) + '°'}
                </span>
              </div>
              <div className="coord-item">
                <span className="coord-label">Longitude</span>
                <span className={`coord-val${coords.lon === null ? ' empty' : ''}`} id="disp-lon">
                  {coords.lon === null ? '— Aguardando' : coords.lon.toFixed(6) + '°'}
                </span>
              </div>
              <div className="coord-item">
                <span className="coord-label">Altitude</span>
                <span className={`coord-val${coords.alt === null ? ' empty' : ''}`} id="disp-alt">
                  {coords.alt === null ? '— m' : Math.round(coords.alt) + ' m'}
                </span>
              </div>
              <div className={`coords-status${coords.lat !== null ? ' has-coords' : ''}`} id="coords-status">
                {coords.lat !== null ? <><span className="pulse-dot" /> Localização marcada</> : <span>Sem localização</span>}
              </div>
            </div>

            {/* Município detectado */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Município (detectado)</label>
                <input type="text" className="form-input" id="f-municipio" placeholder="— Marque no mapa" readOnly value={municipio} />
              </div>
              <div className="form-group">
                <label className="form-label">Estado</label>
                <input type="text" className="form-input" id="f-estado" value="São Paulo (SP)" readOnly />
              </div>
            </div>
            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">Latitude</label>
                <input type="text" className="form-input form-input--mono" id="f-lat" placeholder="—" readOnly value={coords.lat === null ? '' : coords.lat.toFixed(6)} />
              </div>
              <div className="form-group">
                <label className="form-label">Longitude</label>
                <input type="text" className="form-input form-input--mono" id="f-lon" placeholder="—" readOnly value={coords.lon === null ? '' : coords.lon.toFixed(6)} />
              </div>
              <div className="form-group">
                <label className="form-label">Altitude</label>
                <input type="text" className="form-input form-input--mono" id="f-alt" placeholder="— m" readOnly value={coords.alt === null ? '' : Math.round(coords.alt) + ' m'} />
              </div>
            </div>
          </div>

          {/* SEÇÃO 4: CULTURAS DESEJADAS */}
          <div className="form-section">
            <div className="section-title">
              <span className="section-title-num">4</span>
              Culturas que Deseja Plantar
            </div>
            <p style={{ fontSize: '.76rem', color: 'var(--text-secondary)', marginTop: '-6px' }}>Selecione uma ou mais. O sistema vai analisar a viabilidade para sua região.</p>

            <div className="cultura-select-grid" id="cultura-grid">
              {CULTURAS.map((c) => (
                <div className="cultura-opt" key={c.id}>
                  <input
                    type="checkbox"
                    id={`cult-${c.id}`}
                    name="culturas"
                    value={c.id}
                    checked={selectedCulturas.includes(c.id)}
                    onChange={() => toggleCultura(c.id)}
                  />
                  <label className="cultura-opt-label" htmlFor={`cult-${c.id}`}>
                    <span className="cultura-opt-emoji">{c.emoji}</span>
                    <span className="cultura-opt-name">{c.nome}</span>
                    <span className="cultura-opt-cycle">{c.ciclo}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* SEÇÃO 5: INFRAESTRUTURA */}
          <div className="form-section">
            <div className="section-title">
              <span className="section-title-num">5</span>
              Infraestrutura Disponível
            </div>
            <div className="cultura-select-grid" id="infra-grid">
              {INFRA.map((i) => (
                <div className="cultura-opt" key={i.id}>
                  <input
                    type="checkbox"
                    id={`infra-${i.id}`}
                    name="infra"
                    value={i.id}
                    checked={selectedInfra.includes(i.id)}
                    onChange={() => toggleInfra(i.id)}
                  />
                  <label className="cultura-opt-label" htmlFor={`infra-${i.id}`}>
                    <span className="cultura-opt-emoji">{i.emoji}</span>
                    <span className="cultura-opt-name">{i.nome}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* SUBMIT */}
          <div className="form-section">
            <button className="btn-submit" id="btn-submit" onClick={handleSubmit} disabled={!canSubmit}>
              <svg viewBox="0 0 16 16" fill="none" style={{ width: '15px', height: '15px' }}><path d="M2 8h12M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Analisar Viabilidade e Cadastrar
            </button>
            <p style={{ fontSize: '.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Ao cadastrar, você concorda com os <a href="#" style={{ color: 'var(--accent-green)' }}>Termos de Uso</a> e a <a href="#" style={{ color: 'var(--accent-green)' }}>Política de Privacidade</a> do AgroMap SP.
            </p>
          </div>

        </div>{/* /form-col */}

        {/* ══ COLUNA MAPA + RESULTADO ══ */}
        <div className="map-col">

          {/* Toolbar do mapa */}
          <div className="map-toolbar">
            <div className="map-toolbar-title">
              <svg viewBox="0 0 16 16" fill="none"><path d="M8 2C5.2 2 3 4.2 3 7c0 4 5 8 5 8s5-4 5-8c0-2.8-2.2-5-5-5Z" stroke="currentColor" strokeWidth="1.3" /><circle cx="8" cy="7" r="1.5" fill="currentColor" opacity=".6" /></svg>
              Mapa — São Paulo
            </div>
            <div className="map-search-wrap">
              <input
                type="text"
                className="map-search-input"
                id="map-search"
                placeholder="Buscar município paulista... (ex: Ribeirão Preto)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') searchCity()
                }}
              />
              <button className="map-search-btn" onClick={searchCity}>
                <svg viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.4" /><path d="M10 10l2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div className="map-layer-chips">
              <button className={`map-chip${activeLayer === 'standard' ? ' active' : ''}`} onClick={() => setLayer('standard')}>Padrão</button>
              <button className={`map-chip${activeLayer === 'satellite' ? ' active' : ''}`} onClick={() => setLayer('satellite')}>Satélite</button>
              <button className={`map-chip${activeLayer === 'terrain' ? ' active' : ''}`} onClick={() => setLayer('terrain')}>Terreno</button>
            </div>
          </div>

          {/* Mapa Leaflet */}
          <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
            <div id="map" ref={mapEl} />
            <div className={`loading-overlay${loaderText !== null ? ' active' : ''}`} id="map-loader">
              <div className="spinner" />
              <span className="loading-text" id="loader-text">{loaderText ?? 'Analisando região...'}</span>
            </div>
          </div>

          {/* Painel de resultado da análise */}
          <div className="result-panel" id="result-panel">
            {!result && (
              <div className="result-placeholder" id="result-placeholder">
                <span className="result-placeholder-icon">🌱</span>
                <span className="result-placeholder-text">Clique em um ponto do mapa de São Paulo<br />para ver a análise de viabilidade agrícola.</span>
              </div>
            )}
            {result && <div id="result-content">{renderResult()}</div>}
          </div>

        </div>{/* /map-col */}

      </div>{/* /page-wrap */}

      {/* Toast */}
      <div className={`toast${toastMsg !== null ? ' show' : ''}`} id="toast">
        <span className="toast-icon" id="toast-icon">ℹ️</span>
        <span id="toast-msg">{toastMsg ?? 'Mensagem'}</span>
      </div>
    </div>
  )
}
