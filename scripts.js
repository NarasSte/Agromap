// ══════════════════════════════════════════════
// AGROMAP - JavaScript Functions
// ══════════════════════════════════════════════

// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Get cultures from API
async function getCultures() {
  try {
    const response = await fetch(`${API_BASE_URL}/culturas`);
    if (!response.ok) {
      throw new Error('Failed to fetch cultures');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching cultures:', error);
    return [];
  }
}


// Modal functionality
function openModal() {
  const modal = document.getElementById('modal-nova-cultura');
  modal.classList.remove('modal--hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('modal-nova-cultura');
  modal.classList.add('modal--hidden');
  document.body.style.overflow = '';
  // Reset form
  document.querySelector('.modal__form').reset();
  document.querySelector('.form-range-value').textContent = '0%';
}

function updateRangeValue(input) {
  const value = input.value;
  input.nextElementSibling.textContent = value + '%';
}

async function saveCulture(event) {
  event.preventDefault();
  
  // Get form values and map to backend fields
  const formData = {
    nome: document.getElementById('nome-cultura').value,
    nome_cientifico: document.getElementById('nome-cientifico').value,
    ciclo_medio_dias: parseInt(document.getElementById('dias-colheita').value),
    graus_dia_acumulados: parseInt(document.getElementById('desenvolvimento').value),
    coeficiente_kc: parseFloat(document.getElementById('area-plantada').value) / 100,
    temperatura_otima_min: 20,
    temperatura_otima_max: 30
  };

  try {
    const response = await fetch(`${API_BASE_URL}/culturas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Failed to save culture');
    }

    // Refresh display
    renderCultures();
    updateSummary();
    
    // Close modal
    closeModal();
  } catch (error) {
    console.error('Error saving culture:', error);
    alert('Erro ao salvar cultura. Tente novamente.');
  }
}

// Render cultures dynamically
async function renderCultures() {
  const cultures = await getCultures();
  const grid = document.querySelector('.culture-grid');
  
  // Clear existing content
  grid.innerHTML = '';
  
  // Render each culture
  cultures.forEach(culture => {
    const card = createCultureCard(culture);
    grid.appendChild(card);
  });
}

// Create culture card HTML
function createCultureCard(culture) {
  const article = document.createElement('article');
  article.className = 'culture-card';
  
  // Map backend fields to frontend display
  const area = culture.coeficiente_kc ? Math.round(culture.coeficiente_kc * 100) : 0;
  const diasColheita = culture.ciclo_medio_dias || 0;
  const desenvolvimento = culture.graus_dia_acumulados || 0;
  
  article.innerHTML = `
    <div class="culture-card__header">
      <div class="culture-icon culture-icon--other">
        <svg viewBox="0 0 24 24" fill="none">${getIconSvg('other')}</svg>
      </div>
      <div class="culture-info">
        <h3 class="culture-name">${culture.nome}</h3>
        <span class="culture-scientific">${culture.nome_cientifico || 'N/A'}</span>
      </div>
      <div class="culture-status culture-status--active">Ativa</div>
    </div>
    
    <div class="culture-stats">
      <div class="stat-item">
        <span class="stat-label">Área Plantada</span>
        <span class="stat-value">${area} ha</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Ciclo Médio</span>
        <span class="stat-value">${diasColheita} dias</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Graus Dia</span>
        <span class="stat-value">${desenvolvimento}</span>
      </div>
    </div>
    
    <div class="culture-progress">
      <div class="progress-header">
        <span class="progress-label">Coeficiente Kc</span>
        <span class="progress-value">${culture.coeficiente_kc || 0}</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="--progress: ${(culture.coeficiente_kc || 0) * 100}%"></div>
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
async function updateSummary() {
  const cultures = await getCultures();
  const totalArea = cultures.reduce((sum, c) => sum + (c.coeficiente_kc ? Math.round(c.coeficiente_kc * 100) : 0), 0);
  const avgCiclo = cultures.length > 0 
    ? Math.round(cultures.reduce((sum, c) => sum + (c.ciclo_medio_dias || 0), 0) / cultures.length)
    : 0;
  const avgGrausDia = cultures.length > 0 
    ? Math.round(cultures.reduce((sum, c) => sum + (c.graus_dia_acumulados || 0), 0) / cultures.length)
    : 0;

  const summaryStats = document.querySelectorAll('.summary-stat');
  if (summaryStats.length >= 4) {
    summaryStats[0].querySelector('.summary-value').textContent = cultures.length;
    summaryStats[1].querySelector('.summary-value').textContent = totalArea + ' ha';
    summaryStats[2].querySelector('.summary-value').textContent = avgCiclo + ' dias';
    summaryStats[3].querySelector('.summary-value').textContent = avgGrausDia;
  }
}

// Delete culture
async function deleteCulture(id) {
  if (confirm('Tem certeza que deseja excluir esta cultura?')) {
    try {
      const response = await fetch(`${API_BASE_URL}/culturas/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete culture');
      }

      renderCultures();
      updateSummary();
    } catch (error) {
      console.error('Error deleting culture:', error);
      alert('Erro ao excluir cultura. Tente novamente.');
    }
  }
}

// View culture details (placeholder)
async function viewDetails(id) {
  const cultures = await getCultures();
  const culture = cultures.find(c => c.id === id);
  if (culture) {
    const area = culture.coeficiente_kc ? Math.round(culture.coeficiente_kc * 100) : 0;
    alert(`Detalhes da cultura: ${culture.nome}\n\nNome Científico: ${culture.nome_cientifico || 'N/A'}\nCiclo Médio: ${culture.ciclo_medio_dias || 0} dias\nGraus Dia Acumulados: ${culture.graus_dia_acumulados || 0}\nCoeficiente Kc: ${culture.coeficiente_kc || 0}\nTemp. Ótima Min: ${culture.temperatura_otima_min || 0}°C\nTemp. Ótima Max: ${culture.temperatura_otima_max || 0}°C`);
  }
}

// Manage culture (placeholder)
async function manageCulture(id) {
  const cultures = await getCultures();
  const culture = cultures.find(c => c.id === id);
  if (culture) {
    alert(`Gerenciar cultura: ${culture.nome}\n\nFuncionalidade de gerenciamento será implementada em breve.`);
  }
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Initialize cultures from localStorage
  renderCultures();
  updateSummary();
  
  // Connect button to modal
  const novaCulturaBtn = document.querySelector('.btn--primary');
  if (novaCulturaBtn) {
    novaCulturaBtn.addEventListener('click', openModal);
  }

  // Close modal when clicking on overlay
  const modalOverlay = document.querySelector('.modal__overlay');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', closeModal);
  }

  // Close modal when pressing Escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      const modal = document.getElementById('modal-nova-cultura');
      if (!modal.classList.contains('modal--hidden')) {
        closeModal();
      }
    }
  });
});
