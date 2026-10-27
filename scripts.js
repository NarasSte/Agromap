// ══════════════════════════════════════════════
// AGROMAP - JavaScript Functions (Corrigido)
// ══════════════════════════════════════════════

// LocalStorage Management
const CULTURES_KEY = 'agromap_cultures';

// Get cultures from localStorage
function getCultures() {
  const stored = localStorage.getItem(CULTURES_KEY);
  return stored ? JSON.parse(stored) : getDefaultCultures();
}

// Save cultures to localStorage
function saveCultures(cultures) {
  localStorage.setItem(CULTURES_KEY, JSON.stringify(cultures));
}

// Get default mock cultures (for initialization)
function getDefaultCultures() {
  return [
    {
      id: 1,
      nome: 'Soja',
      nomeCientifico: 'Glycine max',
      tipo: 'soy',
      area: 320,
      talhoes: 8,
      diasColheita: 12,
      desenvolvimento: 78,
      status: 'ativa'
    },
    {
      id: 2,
      nome: 'Milho',
      nomeCientifico: 'Zea mays',
      tipo: 'corn',
      area: 185,
      talhoes: 5,
      diasColheita: 28,
      desenvolvimento: 45,
      status: 'ativa'
    },
    {
      id: 3,
      nome: 'Algodão',
      nomeCientifico: 'Gossypium hirsutum',
      tipo: 'cotton',
      area: 95,
      talhoes: 3,
      diasColheita: 45,
      desenvolvimento: 32,
      status: 'ativa'
    }
  ];
}

// Modal functionality
function openModal() {
  const modal = document.getElementById('modal-nova-cultura');
  if (modal) {
    modal.classList.remove('modal--hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  const modal = document.getElementById('modal-nova-cultura');
  if (modal) {
    modal.classList.add('modal--hidden');
    document.body.style.overflow = '';
    const form = document.querySelector('.modal__form');
    if (form) form.reset();
    const rangeVal = document.querySelector('.form-range-value');
    if (rangeVal) rangeVal.textContent = '0%';
  }
}

function updateRangeValue(input) {
  const value = input.value;
  const nextEl = input.nextElementSibling;
  if (nextEl) nextEl.textContent = value + '%';
}

function saveCulture(event) {
  event.preventDefault();
  
  const formData = {
    id: Date.now(),
    nome: document.getElementById('nome-cultura')?.value || '',
    nomeCientifico: document.getElementById('nome-cientifico')?.value || '',
    tipo: document.getElementById('tipo-cultura')?.value || 'other',
    area: parseInt(document.getElementById('area-plantada')?.value) || 0,
    talhoes: parseInt(document.getElementById('num-talhoes')?.value) || 0,
    diasColheita: parseInt(document.getElementById('dias-colheita')?.value) || 0,
    desenvolvimento: parseInt(document.getElementById('desenvolvimento')?.value) || 0,
    status: document.getElementById('status-cultura')?.value || 'ativa'
  };

  const cultures = getCultures();
  cultures.push(formData);
  saveCultures(cultures);
  
  renderCultures();
  updateSummary();
  closeModal();
}

// Render cultures dynamically
function renderCultures() {
  const cultures = getCultures();
  const grid = document.querySelector('.culture-grid');
  
  if (!grid) return; // Se não estiver na página de culturas, sai da função sem quebrar
  
  grid.innerHTML = '';
  
  cultures.forEach(culture => {
    const card = createCultureCard(culture);
    grid.appendChild(card);
  });
}

// Create culture card HTML
function createCultureCard(culture) {
  const article = document.createElement('article');
  article.className = 'culture-card';
  article.innerHTML = `
    <div class="culture-card__header">
      <div class="culture-icon culture-icon--${culture.tipo}">
        <svg viewBox="0 0 24 24" fill="none">${getIconSvg(culture.tipo)}</svg>
      </div>
      <div class="culture-info">
        <h3 class="culture-name">${culture.nome}</h3>
        <span class="culture-scientific">${culture.nomeCientifico}</span>
      </div>
      <div class="culture-status culture-status--${culture.status === 'ativa' ? 'active' : 'inactive'}">${formatStatus(culture.status)}</div>
    </div>
    
    <div class="culture-stats">
      <div class="stat-item">
        <span class="stat-label">Área Plantada</span>
        <span class="stat-value">${culture.area} ha</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Talhões</span>
        <span class="stat-value">${culture.talhoes}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Próxima Colheita</span>
        <span class="stat-value">${culture.diasColheita} dias</span>
      </div>
    </div>
    
    <div class="culture-progress">
      <div class="progress-header">
        <span class="progress-label">Desenvolvimento</span>
        <span class="progress-value">${culture.desenvolvimento}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="--progress: ${culture.desenvolvimento}%"></div>
      </div>
    </div>
    
    <div class="culture-actions">
      <button class="btn btn--outline btn--sm" onclick="viewDetails(${culture.id})">Ver Detalhes</button>
      <button class="btn btn--outline btn--sm" onclick="manageCulture(${culture.id})">Gerenciar</button>
      <button class="btn btn--outline btn--sm btn--danger" onclick="deleteCulture(${culture.id})">Excluir</button>
    </div>
  `;
  return article;
}

// Get icon SVG based on culture type
function getIconSvg(tipo) {
  const icons = {
    soy: '<path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" fill="currentColor"/>',
    corn: '<circle cx="12" cy="12" r="8" fill="currentColor"/><path d="M12 4v4M12 16v4M4 12h4M16 12h4" stroke="var(--bg-surface)" stroke-width="2"/>',
    cotton: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="currentColor"/>',
    wheat: '<path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" fill="currentColor"/>',
    rice: '<circle cx="12" cy="12" r="8" fill="currentColor"/><path d="M12 4v4M12 16v4M4 12h4M16 12h4" stroke="var(--bg-surface)" stroke-width="2"/>',
    beans: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="currentColor"/>',
    coffee: '<path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" fill="currentColor"/>',
    sugarcane: '<circle cx="12" cy="12" r="8" fill="currentColor"/><path d="M12 4v4M12 16v4M4 12h4M16 12h4" stroke="var(--bg-surface)" stroke-width="2"/>',
    other: '<circle cx="12" cy="12" r="8" fill="currentColor"/><path d="M12 4v4M12 16v4M4 12h4M16 12h4" stroke="var(--bg-surface)" stroke-width="2"/>'
  };
  return icons[tipo] || icons.other;
}

// Format status for display
function formatStatus(status) {
  const statusMap = {
    'ativa': 'Ativa',
    'planejada': 'Planejada',
    'em-pausa': 'Em Pausa',
    'finalizada': 'Finalizada'
  };
  return statusMap[status] || status;
}

// Update summary section
function updateSummary() {
  const cultures = getCultures();
  const activeCultures = cultures.filter(c => c.status === 'ativa');
  const totalArea = cultures.reduce((sum, c) => sum + c.area, 0);
  const totalTalhoes = cultures.reduce((sum, c) => sum + c.talhoes, 0);
  const avgDevelopment = activeCultures.length > 0 
    ? Math.round(activeCultures.reduce((sum, c) => sum + c.desenvolvimento, 0) / activeCultures.length)
    : 0;

  const summaryStats = document.querySelectorAll('.summary-stat');
  if (summaryStats.length >= 4) {
    if (summaryStats[0].querySelector('.summary-value')) summaryStats[0].querySelector('.summary-value').textContent = activeCultures.length;
    if (summaryStats[1].querySelector('.summary-value')) summaryStats[1].querySelector('.summary-value').textContent = totalArea + ' ha';
    if (summaryStats[2].querySelector('.summary-value')) summaryStats[2].querySelector('.summary-value').textContent = totalTalhoes;
    if (summaryStats[3].querySelector('.summary-value')) summaryStats[3].querySelector('.summary-value').textContent = avgDevelopment + '%';
  }
}

// Delete culture
function deleteCulture(id) {
  if (confirm('Tem certeza que deseja excluir esta cultura?')) {
    const cultures = getCultures();
    const filtered = cultures.filter(c => c.id !== id);
    saveCultures(filtered);
    renderCultures();
    updateSummary();
  }
}

// View culture details
function viewDetails(id) {
  const cultures = getCultures();
  const culture = cultures.find(c => c.id === id);
  if (culture) {
    alert(`Detalhes da cultura: ${culture.nome}\n\nNome Científico: ${culture.nomeCientifico}\nÁrea: ${culture.area} ha\nTalhões: ${culture.talhoes}\nStatus: ${formatStatus(culture.status)}`);
  }
}

// Manage culture
function manageCulture(id) {
  const cultures = getCultures();
  const culture = cultures.find(c => c.id === id);
  if (culture) {
    alert(`Gerenciar cultura: ${culture.nome}\n\nFuncionalidade de gerenciamento será implementada em breve.`);
  }
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
  renderCultures();
  updateSummary();
  
  const novaCulturaBtn = document.querySelector('.btn--primary');
  if (novaCulturaBtn) {
    novaCulturaBtn.addEventListener('click', openModal);
  }

  const modalOverlay = document.querySelector('.modal__overlay');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', closeModal);
  }

  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      const modal = document.getElementById('modal-nova-cultura');
      if (modal && !modal.classList.contains('modal--hidden')) {
        closeModal();
      }
    }
  });
});
