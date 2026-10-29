/**
 * Componente SectionTransition — Transição Cinematográfica entre Blocos
 * Utiliza a logo animada oficial com varredura de luz, partículas orbitais e tipografia editorial
 * Proporciona uma experiência imersiva e de alto impacto para mobile (iOS/Android) e desktop
 */

export function renderSectionTransition({ block, onContinue, autoAdvanceDelay = 5500 }) {
  const overlay = document.createElement('div');
  overlay.id = 'block-transition-screen';
  overlay.className = 'block-transition-screen animate-fade-in';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', `Transição de dimensão: Bloco ${block.id}`);

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

  overlay.innerHTML = `
    <!-- Camada de Vinheta e Fundo Cinematográfico -->
    <div class="block-trans-backdrop" aria-hidden="true"></div>

    <!-- Feixe e Halo Radiante Cobre / Âmbar -->
    <div class="block-trans-aura" aria-hidden="true"></div>

    <!-- Geometria Numérica de Fundo em Vetor Nítido -->
    <div class="block-trans-geometry" aria-hidden="true">
      <div class="intro-geom-ring ring-outer"></div>
      <div class="intro-geom-ring ring-mid"></div>
      <div class="intro-geom-ring ring-inner"></div>
      
      <!-- Partículas de Luz Flutuantes -->
      <span class="intro-sparkle s1"></span>
      <span class="intro-sparkle s2"></span>
      <span class="intro-sparkle s3"></span>
      <span class="intro-sparkle s4"></span>

      <!-- Fórmulas Sutis em Segundo Plano -->
      <svg class="block-trans-math-svg" viewBox="0 0 500 500" fill="none">
        <circle cx="250" cy="250" r="180" stroke="rgba(230, 115, 55, 0.12)" stroke-dasharray="4 6" />
        <ellipse cx="250" cy="250" rx="220" ry="110" transform="rotate(-25 250 250)" stroke="rgba(215, 154, 98, 0.09)" />
        <text x="35" y="80" font-family="'JetBrains Mono', monospace" font-size="11" fill="rgba(215, 154, 98, 0.22)">P(DECISÃO | DADOS)</text>
        <text x="340" y="440" font-family="'JetBrains Mono', monospace" font-size="11" fill="rgba(215, 154, 98, 0.22)">dE/dt = σ · √Δt</text>
      </svg>
    </div>

    <!-- Número gigante translúcido da dimensão -->
    <div class="block-trans-bg-number" aria-hidden="true">${blockNumber}</div>

    <!-- Conteúdo Central da Transição -->
    <div class="block-trans-content">
      
      <!-- Palco da Logo Oficial Animada -->
      <div class="block-trans-logo-stage">
        <div class="block-trans-logo-glow" aria-hidden="true"></div>
        <div class="block-trans-logo-wrap">
          <img 
            src="/images/logo-ale-oficial.png" 
            alt="Alê — Os Números Falam. O Conhecimento Traduz."
            class="block-trans-logo-img"
            loading="eager"
          />
          <!-- Varredura de Brilho Metálico Cobre (Sheen Glint) -->
          <div class="block-trans-sheen" aria-hidden="true"></div>
        </div>
      </div>

      <!-- Tag / Selo da Dimensão -->
      <div class="block-trans-badge">
        <span class="block-trans-badge-diamond">✦</span>
        <span>DIMENSÃO ${blockNumber} DE 05</span>
        <span class="block-trans-badge-diamond">✦</span>
      </div>

      <!-- Título de Alto Impacto da Dimensão -->
      <h2 class="block-trans-title">${block.title}</h2>

      <!-- Citação Reflexiva Editorial -->
      <blockquote class="block-trans-quote">
        ${quote}
      </blockquote>

      <!-- Subtítulo / Foco da Avaliação -->
      <p class="block-trans-subtitle">${block.subtitle}</p>

      <!-- Botão de Ação Imediata & Barra de Transição Automática -->
      <div class="block-trans-actions">
        <button id="btn-trans-continue" class="btn btn-primary block-trans-btn" type="button">
          <span>ENTRAR NA DIMENSÃO ${blockNumber}</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>

        <div class="block-trans-timer-box">
          <span class="block-trans-timer-text">Avanço automático em instantes...</span>
          <div class="block-trans-progress-wrap">
            <div class="block-trans-progress-fill" id="block-trans-progress-fill"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  let isClosed = false;
  let timerId = null;

  const handleContinue = () => {
    if (isClosed) return;
    isClosed = true;

    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }

    document.removeEventListener('keydown', handleKey);

    overlay.classList.add('block-trans-leaving');

    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
      if (typeof onContinue === 'function') {
        onContinue();
      }
    }, 420);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
      e.preventDefault();
      handleContinue();
    }
  };

  // Botão de avanço manual
  const btnContinue = overlay.querySelector('#btn-trans-continue');
  if (btnContinue) {
    btnContinue.addEventListener('click', (e) => {
      e.stopPropagation();
      handleContinue();
    });
  }

  // Teclado
  document.addEventListener('keydown', handleKey);

  // Auto-avanço com timer
  if (autoAdvanceDelay > 0) {
    timerId = setTimeout(() => {
      handleContinue();
    }, autoAdvanceDelay);
  }

  return overlay;
}
