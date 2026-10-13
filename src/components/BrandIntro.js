/**
 * BrandIntro.js
 * Abertura Cinematográfica da Marca Alê para a Página Principal
 * 
 * Experiência imersiva editorial com a Logo Oficial:
 * - Halo de luz cósmica âmbar e cobre em expansão
 * - Órbitas geométricas em rotação com dados de probabilidade
 * - Revelação em escala ótica e desfoque da logo oficial de alta resolução
 * - Varredura de brilho especular metálico (Sheen Glint)
 * - Tagline icônica animada: "OS NÚMEROS FALAM ✦ O CONHECIMENTO TRADUZ"
 * - Barra de energia/carregamento sutil com transição fluida para o Hero
 */

export function renderBrandIntro({ onComplete, duration = 2800 } = {}) {
  const overlay = document.createElement('div');
  overlay.id = 'brand-intro-overlay';
  overlay.className = 'brand-intro-screen';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Abertura oficial Alê — Análise de Decisões');

  overlay.innerHTML = `
    <!-- Camada de Vinheta e Ruído Estético -->
    <div class="brand-intro-backdrop" aria-hidden="true"></div>

    <!-- Feixe e Halo Radiante Central -->
    <div class="brand-intro-aura" aria-hidden="true"></div>

    <!-- Geometria Numérica de Fundo em Vetor Nítido -->
    <div class="brand-intro-geometry" aria-hidden="true">
      <div class="intro-geom-ring ring-outer"></div>
      <div class="intro-geom-ring ring-mid"></div>
      <div class="intro-geom-ring ring-inner"></div>
      
      <!-- Partículas de Luz Flutuantes -->
      <span class="intro-sparkle s1"></span>
      <span class="intro-sparkle s2"></span>
      <span class="intro-sparkle s3"></span>
      <span class="intro-sparkle s4"></span>

      <!-- Fórmulas Sutis em Segundo Plano -->
      <svg class="intro-math-svg" viewBox="0 0 500 500" fill="none">
        <circle cx="250" cy="250" r="180" stroke="rgba(230, 115, 55, 0.12)" stroke-dasharray="4 6" />
        <ellipse cx="250" cy="250" rx="220" ry="110" transform="rotate(-25 250 250)" stroke="rgba(215, 154, 98, 0.09)" />
        <text x="35" y="80" font-family="'JetBrains Mono', monospace" font-size="11" fill="rgba(215, 154, 98, 0.22)">P(DECISÃO | DADOS)</text>
        <text x="340" y="440" font-family="'JetBrains Mono', monospace" font-size="11" fill="rgba(215, 154, 98, 0.22)">dE/dt = σ · √Δt</text>
      </svg>
    </div>

    <!-- Conteúdo Central da Abertura -->
    <div class="brand-intro-content">
      
      <!-- Palco da Logo com Efeito de Luz -->
      <div class="brand-intro-logo-stage">
        <div class="brand-intro-logo-glow" aria-hidden="true"></div>
        <div class="brand-intro-logo-wrap">
          <img 
            src="/images/logo-ale-oficial.png" 
            alt="Alê — Os Números Falam. O Conhecimento Traduz."
            class="brand-intro-logo-img"
            loading="eager"
          />
          <!-- Varredura de Brilho Metálico Cobre -->
          <div class="brand-intro-sheen" aria-hidden="true"></div>
        </div>
      </div>

      <!-- Tagline Editorial da Marca -->
      <div class="brand-intro-tagline-wrap">
        <div class="intro-sig-divider intro-divider-left"></div>
        <div class="intro-tagline-text">
          <span class="intro-tagline-word word-1">OS NÚMEROS FALAM</span>
          <span class="intro-tagline-diamond">✦</span>
          <span class="intro-tagline-word word-2">O CONHECIMENTO TRADUZ</span>
        </div>
        <div class="intro-sig-divider intro-divider-right"></div>
      </div>

      <!-- Barra de Inicialização Analítica de Precisão -->
      <div class="brand-intro-status-box">
        <div class="intro-status-label">
          <span class="intro-pulse-indicator"></span>
          <span id="intro-status-text">INICIALIZANDO DIAGNÓSTICO DECISÓRIO...</span>
        </div>
        <div class="intro-progress-bar-wrap">
          <div class="intro-progress-bar-fill" id="intro-progress-fill"></div>
        </div>
      </div>
    </div>

    <!-- Botão de Pular Abertura -->
    <button 
      class="brand-intro-skip-btn" 
      id="brand-intro-skip"
      type="button"
      title="Pular abertura e ir para o início"
    >
      <span>Pular abertura</span>
      <span class="intro-skip-arrow">➔</span>
    </button>
  `;

  let isClosed = false;
  let animTimer = null;
  let progressInterval = null;

  const closeIntro = () => {
    if (isClosed) return;
    isClosed = true;

    // Limpar timers
    if (animTimer) clearTimeout(animTimer);
    if (progressInterval) clearInterval(progressInterval);

    // Efeito de saída cinematográfico
    overlay.classList.add('intro-leaving');

    // Remover ouvintes de teclado
    document.removeEventListener('keydown', handleKeyDown);

    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
      if (typeof onComplete === 'function') {
        onComplete();
      }
    }, 550);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      closeIntro();
    }
  };

  // Botão Pular
  const skipBtn = overlay.querySelector('#brand-intro-skip');
  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeIntro();
    });
  }

  // Clicar em qualquer parte do overlay também avança suavemente
  overlay.addEventListener('click', () => {
    closeIntro();
  });

  document.addEventListener('keydown', handleKeyDown);

  // Barra de progresso visual fluida
  const progressFill = overlay.querySelector('#intro-progress-fill');
  const statusText = overlay.querySelector('#intro-status-text');
  const startTime = Date.now();

  progressInterval = setInterval(() => {
    if (isClosed) return;
    const elapsed = Date.now() - startTime;
    const pct = Math.min((elapsed / duration) * 100, 100);
    
    if (progressFill) {
      progressFill.style.width = `${pct}%`;
    }

    if (pct > 65 && statusText && statusText.textContent !== 'PREPARANDO ANÁLISE EXECUTIVA...') {
      statusText.textContent = 'PREPARANDO ANÁLISE EXECUTIVA...';
    }

    if (elapsed >= duration) {
      clearInterval(progressInterval);
      closeIntro();
    }
  }, 35);

  return overlay;
}
