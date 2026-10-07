/**
 * Componente SectionTransition
 * Tela cinematográfica de transição entre blocos com número gigante translúcido ao fundo
 */

export function renderSectionTransition({ block, onContinue }) {
  const container = document.createElement('section');
  container.className = 'container animate-fade-in';

  const blockNumber = String(block.id).padStart(2, '0');

  // Citações reflexivas por bloco
  const blockQuotes = {
    1: '“A primeira barreira entre o investidor e o erro reside na reação aos primeiros cinco minutos após o resultado.”',
    2: '“Até onde você segue o plano quando o resultado imediato pressiona sua decisão?”',
    3: '“A independência dos eventos não negocia com intuição. Números não possuem memória emocional.”',
    4: '“Confluência sem método é apenas confirmação do próprio desejo. Análise é filtro de proteção.”',
    5: '“Consistência não é prever o próximo movimento; é executar a mesma disciplina repetidamente.”'
  };

  const quote = blockQuotes[block.id] || block.subtitle;

  container.innerHTML = `
    <div class="transition-cinematic-card glass-card">
      <!-- Número gigante e translúcido ao fundo -->
      <div class="transition-bg-number" aria-hidden="true">${blockNumber}</div>

      <div class="transition-inner-content">
        <div class="section-meta-label">
          <span class="label-num">${blockNumber}</span>
          <span>NOVO BLOCO • DIMENSÃO EM AVALIAÇÃO</span>
        </div>

        <h2 class="transition-block-title">${block.title}</h2>

        <div class="transition-quote-text">
          ${quote}
        </div>

        <p class="transition-subtitle-note">${block.subtitle}</p>

        <button id="btn-transition-continue" class="btn btn-primary" type="button" style="margin-top: 1.5rem;">
          <span>PROSSEGUIR</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </div>
  `;

  const btn = container.querySelector('#btn-transition-continue');
  btn.addEventListener('click', () => {
    onContinue();
  });

  return container;
}
