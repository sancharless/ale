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
      <div class="processing-logo-core">
        <img 
          src="/images/logo-ale-oficial.png" 
          alt="Alê Logo Oficial" 
          class="processing-logo-img" 
        />
        <div class="processing-logo-glow" aria-hidden="true"></div>
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
