/**
 * Componente EvolutionMap — Editorial Monocromático
 * Três blocos: 01 MANTENHA, 02 DESENVOLVA, 03 PRIORIZE
 * Sem semáforo colorido; identidade estrita em cobre, bronze, marrom e off-white.
 */

export function renderEvolutionMap({ evolutionMap }) {
  const container = document.createElement('section');
  container.className = 'evolution-editorial-section';

  container.innerHTML = `
    <div class="section-meta-label">
      <span class="label-num">06</span>
      <span>MATRIZ TÁTICA DE EVOLUÇÃO</span>
    </div>

    <h3 style="font-family: 'Bebas Neue', 'Oswald', sans-serif; font-size: 2rem; letter-spacing: 0.04em; color: var(--text-main); margin-bottom: 0.5rem; text-transform: uppercase;">
      SEU MAPA DE EVOLUÇÃO
    </h3>

    <p style="font-size: 0.95rem; color: var(--text-muted); margin-bottom: 1.5rem; max-width: 580px;">
      Plano estruturado para transformar desvios comportamentais e pontos cegos em consistência permanente.
    </p>

    <div class="evolution-editorial-grid">
      <!-- Bloco 01: Mantenha -->
      <div class="evolution-editorial-col">
        <div class="evolution-col-top">
          <span class="evolution-col-num">01</span>
          <span class="evolution-col-heading">MANTENHA</span>
        </div>
        <div class="evolution-items-stack">
          ${renderItemsStack(evolutionMap.mantenha)}
        </div>
      </div>

      <!-- Bloco 02: Desenvolva -->
      <div class="evolution-editorial-col">
        <div class="evolution-col-top">
          <span class="evolution-col-num">02</span>
          <span class="evolution-col-heading">DESENVOLVA</span>
        </div>
        <div class="evolution-items-stack">
          ${renderItemsStack(evolutionMap.desenvolva)}
        </div>
      </div>

      <!-- Bloco 03: Priorize -->
      <div class="evolution-editorial-col">
        <div class="evolution-col-top">
          <span class="evolution-col-num">03</span>
          <span class="evolution-col-heading">PRIORIZE</span>
        </div>
        <div class="evolution-items-stack">
          ${renderItemsStack(evolutionMap.priorize)}
        </div>
      </div>
    </div>
  `;

  return container;
}

function renderItemsStack(items) {
  if (!items || items.length === 0) {
    return `
      <div class="evolution-box-item" style="color: var(--text-dim); font-size: 0.8rem; font-style: italic;">
        Nenhum item nesta faixa no momento.
      </div>
    `;
  }

  return items.map(item => `
    <div class="evolution-box-item">
      <div class="evolution-box-header">
        <span class="evolution-box-name">${item.name}</span>
        <span class="evolution-box-score">${item.score}%</span>
      </div>
      <p class="evolution-box-text">${item.guidance}</p>
    </div>
  `).join('');
}
