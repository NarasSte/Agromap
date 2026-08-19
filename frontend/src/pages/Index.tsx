export default function Index() {
  return (
    <>
      <header className="hub-topbar">
        <div className="hub-topbar-icon">
          <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <line x1="12" y1="4" x2="12" y2="32" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
            <line x1="24" y1="4" x2="24" y2="32" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
            <line x1="4" y1="12" x2="32" y2="12" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
            <line x1="4" y1="24" x2="32" y2="24" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
            <circle cx="18" cy="18" r="3.5" fill="var(--accent-green)" />
            <circle cx="8" cy="8" r="2" fill="var(--accent-blue)" opacity="0.8" />
            <circle cx="28" cy="8" r="2" fill="var(--accent-blue)" opacity="0.8" />
            <circle cx="8" cy="28" r="2" fill="var(--accent-blue)" opacity="0.8" />
            <circle cx="28" cy="28" r="2" fill="var(--accent-blue)" opacity="0.8" />
            <line x1="18" y1="18" x2="8" y2="8" stroke="var(--accent-green)" strokeWidth="1" strokeOpacity="0.5" />
            <line x1="18" y1="18" x2="28" y2="8" stroke="var(--accent-green)" strokeWidth="1" strokeOpacity="0.5" />
            <line x1="18" y1="18" x2="8" y2="28" stroke="var(--accent-green)" strokeWidth="1" strokeOpacity="0.5" />
            <line x1="18" y1="18" x2="28" y2="28" stroke="var(--accent-green)" strokeWidth="1" strokeOpacity="0.5" />
          </svg>
        </div>
        <span className="hub-topbar-name">
          Agro<strong>Map</strong>
        </span>
        <span className="hub-topbar-tag">Central de Acesso</span>
      </header>

      <section className="hub-hero">
        <span className="hub-eyebrow">
          <span className="hub-eyebrow-dot" />
          2 sistemas · 1 ponto de entrada
        </span>
        <h1 className="hub-title">
          Escolha para onde ir: <em>controle da fazenda</em> ou{' '}
          <em>cadastro de propriedade</em>.
        </h1>
        <p className="hub-subtitle">
          Esta página não substitui nem altera nenhum dos dois projetos — ela apenas os conecta.
          Cada cartão abaixo leva direto ao sistema original, exatamente como ele já funciona hoje.
        </p>
      </section>

      <div className="bridge-wrap" aria-hidden="true">
        <div className="bridge-line">
          <svg viewBox="0 0 900 46" preserveAspectRatio="none">
            <path
              d="M 60 23 C 300 23, 350 6, 450 6 C 550 6, 600 23, 840 23"
              fill="none"
              stroke="var(--accent-green)"
              strokeWidth="1.4"
              strokeOpacity="0.45"
              strokeDasharray="1 7"
              strokeLinecap="round"
            />
            <path
              d="M 60 23 C 300 23, 350 40, 450 40 C 550 40, 600 23, 840 23"
              fill="none"
              stroke="var(--accent-blue)"
              strokeWidth="1.4"
              strokeOpacity="0.45"
              strokeDasharray="1 7"
              strokeLinecap="round"
            />
            <circle cx="60" cy="23" r="4" fill="var(--accent-green)" />
            <circle cx="840" cy="23" r="4" fill="var(--accent-blue)" />
            <circle cx="450" cy="23" r="3" fill="var(--text-muted)" />
          </svg>
        </div>
      </div>

      <main className="hub-main">
        <div className="access-grid">
          <a className="access-card access-card--culturas" href="/culturas">
            <div className="access-card-top">
              <div className="access-card-icon">
                <svg viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 2C6.5 2 3.5 5 3.5 8.5c0 4.5 6.5 10 6.5 10s6.5-5.5 6.5-10C16.5 5 13.5 2 10 2Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle cx="10" cy="8.5" r="2.5" fill="currentColor" opacity=".6" />
                </svg>
              </div>
              <span className="access-card-badge">Painel interno</span>
            </div>
            <div>
              <div className="access-card-name">AgroMap — Culturas</div>
              <p className="access-card-desc">
                Dashboard de controle agrícola: gestão de culturas ativas, talhões, área plantada e saúde média da fazenda.
              </p>
            </div>
            <div className="access-card-meta">
              <span className="access-card-meta-item">
                <span className="access-card-meta-dot" />
                Sidebar &amp; dashboard
              </span>
              <span className="access-card-meta-item">
                <span className="access-card-meta-dot" />
                Cadastro de culturas
              </span>
            </div>
            <span className="access-card-cta">
              Abrir o painel
              <svg viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </a>

          <a className="access-card access-card--sp" href="/cadastro">
            <div className="access-card-top">
              <div className="access-card-icon">
                <svg viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 2C6.5 2 3.5 5 3.5 8.5c0 4.5 6.5 10 6.5 10s6.5-5.5 6.5-10C16.5 5 13.5 2 10 2Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle cx="10" cy="8.5" r="2.5" fill="currentColor" opacity=".6" />
                </svg>
              </div>
              <span className="access-card-badge">Cadastro público</span>
            </div>
            <div>
              <div className="access-card-name">AgroMap SP — Cadastro</div>
              <p className="access-card-desc">
                Fluxo de cadastro de propriedades rurais no estado de SP, com mapa interativo e análise de viabilidade por cultura.
              </p>
            </div>
            <div className="access-card-meta">
              <span className="access-card-meta-item">
                <span className="access-card-meta-dot" />
                Mapa Leaflet
              </span>
              <span className="access-card-meta-item">
                <span className="access-card-meta-dot" />
                Análise de solo/clima
              </span>
            </div>
            <span className="access-card-cta">
              Iniciar cadastro
              <svg viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </a>
        </div>
      </main>

      <footer className="hub-footer">
        <span className="hub-footer-text">Página de integração — não faz parte de nenhum dos dois projetos originais.</span>
        <div className="hub-footer-links">
          <a href="/culturas">Culturas</a>
          <a href="/cadastro">Cadastro SP</a>
        </div>
      </footer>
    </>
  )
}
