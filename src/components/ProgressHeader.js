/**
 * Componente ProgressHeader
 * Indicador de progresso editorial em tons de cobre e marrom profundo, sem verde ou azul
 */

export function renderProgressHeader({ currentIndex, totalCount, onBack }) {
  const container = document.createElement('header');
  container.className = 'progress-header-editorial';

  const currentNumberFormatted = String(currentIndex + 1).padStart(2, '0');
  const totalNumberFormatted = String(totalCount).padStart(2, '0');
  const percent = Math.round(((currentIndex + 1) / totalCount) * 100);

  const isFirst = currentIndex === 0;

  container.innerHTML = `
    <div class="container" style="padding-top: 0; padding-bottom: 0;">
      <div class="progress-bar-top-row">
        ${!isFirst ? `
          <button id="btn-step-back" class="btn-editorial-back" type="button" aria-label="Voltar para a questão anterior">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            <span>VOLTAR</span>
          </button>
        ` : `<div style="width: 80px;"></div>`}

        <div class="progress-editorial-counter">
          <span class="counter-step-label">DIAGNÓSTICO</span>
          <span class="counter-step-value">${currentNumberFormatted}</span>
          <span class="counter-step-sep">/</span>
          <span class="counter-step-total">${totalNumberFormatted}</span>
        </div>

        <div style="width: 80px; text-align: right; font-family: 'Oswald', sans-serif; font-size: 0.85rem; color: var(--accent-copper); letter-spacing: 0.05em;">
          ${percent}%
        </div>
      </div>

      <!-- Barra de progresso: ativa cobre, restante marrom escuro -->
      <div class="progress-copper-track">
        <div class="progress-copper-fill" style="width: ${percent}%;"></div>
      </div>
    </div>
  `;

  if (!isFirst) {
    const btnBack = container.querySelector('#btn-step-back');
    if (btnBack) {
      btnBack.addEventListener('click', () => {
        onBack();
      });
    }
  }

  return container;
}
