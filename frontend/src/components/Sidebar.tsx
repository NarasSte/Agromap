import { Link } from 'react-router-dom'

interface SidebarProps {
  active?: 'dashboard' | 'culturas' | 'clima' | 'irrigacao' | 'pragas' | 'financeiro'
}

export default function Sidebar({ active = 'dashboard' }: SidebarProps) {
  const items = [
    {
      id: 'dashboard',
      to: '/',
      label: 'Dashboard',
      icon: (
        <svg viewBox="0 0 20 20" fill="none">
          <rect x="2" y="2" width="7" height="7" rx="1.5" fill="currentColor" />
          <rect x="11" y="2" width="7" height="7" rx="1.5" fill="currentColor" opacity=".5" />
          <rect x="2" y="11" width="7" height="7" rx="1.5" fill="currentColor" opacity=".5" />
          <rect x="11" y="11" width="7" height="7" rx="1.5" fill="currentColor" opacity=".5" />
        </svg>
      ),
    },
    {
      id: 'culturas',
      to: '/culturas',
      label: 'Culturas',
      icon: (
        <svg viewBox="0 0 20 20" fill="none">
          <path
            d="M10 2C6.5 2 3.5 5 3.5 8.5c0 4.5 6.5 10 6.5 10s6.5-5.5 6.5-10C16.5 5 13.5 2 10 2Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle cx="10" cy="8.5" r="2.5" fill="currentColor" opacity=".6" />
        </svg>
      ),
    },
    {
      id: 'clima',
      to: '#',
      label: 'Clima & Solo',
      icon: (
        <svg viewBox="0 0 20 20" fill="none">
          <path d="M3 14s1.5-5 7-5 7 5 7 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M10 9V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="10" cy="3" r="1" fill="currentColor" />
          <path d="M6 6l-2-2M14 6l2-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: 'irrigacao',
      to: '#',
      label: 'Irrigação',
      icon: (
        <svg viewBox="0 0 20 20" fill="none">
          <path d="M5 16V8l5-5 5 5v8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M8 16v-4h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M3 16h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: 'pragas',
      to: '#',
      label: 'Pragas',
      icon: (
        <svg viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10 6v4l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: 'financeiro',
      to: '#',
      label: 'Financeiro',
      icon: (
        <svg viewBox="0 0 20 20" fill="none">
          <rect x="2.5" y="4.5" width="15" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M2.5 8h15" stroke="currentColor" strokeWidth="1.5" />
          <path d="M6.5 2v2M13.5 2v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="brand-icon">
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
        <div className="brand-text">
          <span className="brand-name">
            Agro<strong>Map</strong>
          </span>
          <span className="brand-tagline">Controle Agrícola</span>
        </div>
      </div>

      <nav className="sidebar__nav">
        <span className="nav-label">Principal</span>
        <ul>
          {items.slice(0, 5).map((item) => (
            <li key={item.id} className={`nav-item${active === (item.id as SidebarProps['active']) ? ' nav-item--active' : ''}`}>
              <Link to={item.to} className="nav-link">
                <span className="nav-icon">{item.icon}</span>
                {item.label}
                {active === item.id && <span className="nav-indicator" />}
              </Link>
            </li>
          ))}
        </ul>

        <span className="nav-label" style={{ marginTop: '1.5rem' }}>Gestão</span>
        <ul>
          {items.slice(5).map((item) => (
            <li key={item.id} className={`nav-item${active === (item.id as SidebarProps['active']) ? ' nav-item--active' : ''}`}>
              <Link to={item.to} className="nav-link">
                <span className="nav-icon">{item.icon}</span>
                {item.label}
                {active === item.id && <span className="nav-indicator" />}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar__farm">
        <div className="farm-avatar">FA</div>
        <div className="farm-info">
          <span className="farm-name">Fazenda Aurora</span>
          <span className="farm-size">842 ha · MT</span>
        </div>
      </div>
    </aside>
  )
}
