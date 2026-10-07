/**
 * Componente IntroAssessment
 * Alinhamento de autenticidade pré-diagnóstico com estética editorial
 */

export function renderIntroAssessment({ onProceed }) {
  const container = document.createElement('section');
  container.className = 'container animate-fade-in';

  container.innerHTML = `
    <div class="intro-modal-card glass-card">
      <div class="section-meta-label" style="justify-content: center; margin-bottom: 1.25rem;">
        <span class="label-num">02</span>
        <span>DIRETRIZ DE AVALIAÇÃO</span>
      </div>

      <h2 class="intro-editorial-title">
        NÃO EXISTEM RESPOSTAS PERFEITAS.
      </h2>

      <p class="intro-editorial-body">
        Responda considerando como você <strong class="text-copper">realmente costuma agir</strong>, e não como acredita que deveria agir.
      </p>

      <div class="intro-quote-box">
        “Não estamos avaliando sorte ou intuição passageira. Estamos analisando a estrutura do seu método decisório.”
      </div>

      <button id="btn-intro-proceed" class="btn btn-primary" type="button" style="width: 100%; max-width: 320px; margin: 0 auto;">
        <span>COMEÇAR AVALIAÇÃO</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>
    </div>
  `;

  const btnProceed = container.querySelector('#btn-intro-proceed');
  btnProceed.addEventListener('click', () => {
    onProceed();
  });

  return container;
}
