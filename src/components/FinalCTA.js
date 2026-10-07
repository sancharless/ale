/**
 * Componente FinalCTA — Editorial
 * Chamada de fechamento executiva com citação e botões em gradiente cobre
 */

export function renderFinalCTA({ onRestart, onEvolveClick, targetUrl = 'https://wa.me/?text=Olá!%20Fiz%20meu%20diagnóstico%20e%20gostaria%20de%20evoluir%20meu%20perfil.' }) {
  const container = document.createElement('section');
  container.className = 'final-cta-editorial-card';

  container.innerHTML = `
    <div class="section-meta-label">
      <span class="label-num">07</span>
      <span>PRÓXIMO NÍVEL</span>
    </div>

    <h2 class="final-cta-editorial-quote">
      “SEU PRÓXIMO NÍVEL NÃO DEPENDE DE PREVER MELHOR. DEPENDE DE <span class="text-highlight-copper">DECIDIR MELHOR</span>.”
    </h2>

    <p class="final-cta-editorial-sub">
      Agora que você conhece seu perfil, o próximo passo é transformar conhecimento em consistência.
    </p>

    <div class="final-buttons-editorial-row">
      <a 
        id="btn-final-evolve" 
        href="${targetUrl}" 
        target="_blank" 
        rel="noopener noreferrer" 
        class="btn btn-primary"
      >
        <span>QUERO EVOLUIR MEU PERFIL</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </a>

      <button id="btn-final-restart" class="btn btn-secondary" type="button">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 2v6h-6"></path>
          <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
          <path d="M3 22v-6h6"></path>
          <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
        </svg>
        <span>REFAZER DIAGNÓSTICO</span>
      </button>
    </div>
  `;

  const btnRestart = container.querySelector('#btn-final-restart');
  btnRestart.addEventListener('click', () => {
    onRestart();
  });

  const btnEvolve = container.querySelector('#btn-final-evolve');
  if (onEvolveClick) {
    btnEvolve.addEventListener('click', (e) => {
      onEvolveClick(e);
    });
  }

  return container;
}
