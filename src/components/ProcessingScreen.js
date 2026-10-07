/**
 * Componente ProcessingScreen
 * Tela de processamento editorial com órbita em tons de cobre/bronze
 */

export function renderProcessingScreen({ onComplete }) {
  const container = document.createElement('div');
  container.className = 'processing-container-copper animate-fade-in';

  const steps = [
    "Analisando suas decisões...",
    "Identificando padrões comportamentais...",
    "Cruzando suas respostas...",
    "Construindo seu perfil..."
  ];

  container.innerHTML = `
    <div class="processing-orbit-wrapper">
      <div class="orbit-ring-copper"></div>
      <div class="orbit-ring-bronze"></div>
      <div class="orbit-core-copper">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      </div>
    </div>

    <div class="section-meta-label">
      <span class="label-num">04</span>
      <span>PROCESSAMENTO DE DADOS</span>
    </div>

    <div id="processing-step-label" class="processing-step-editorial">
      ${steps[0]}
    </div>

    <p class="processing-sub-editorial">
      Cruzando modelo de maturidade estatística e consistência operacional...
    </p>
  `;

  const labelEl = container.querySelector('#processing-step-label');

  let currentStepIdx = 0;
  const interval = setInterval(() => {
    currentStepIdx++;
    if (currentStepIdx < steps.length) {
      if (labelEl) {
        labelEl.style.opacity = '0';
        setTimeout(() => {
          labelEl.textContent = steps[currentStepIdx];
          labelEl.style.opacity = '1';
        }, 120);
      }
    } else {
      clearInterval(interval);
      setTimeout(() => {
        onComplete();
      }, 500);
    }
  }, 700);

  return container;
}
