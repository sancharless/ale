/**
 * Componente Hero — Estética Editorial Cobre & Ampulheta de Decisão
 * Layout split no desktop: tipografia editorial forte à esquerda e fotografia cinematográfica da ampulheta à direita
 */

export function renderHero({ onStart }) {
  const container = document.createElement('section');
  container.className = 'hero-section-editorial animate-slide-up';

  container.innerHTML = `
    <div class="hero-split-grid">
      <!-- Coluna Esquerda: Conteúdo Editorial -->
      <div class="hero-content-col">
        <div class="section-meta-label">
          <span class="label-num">01</span>
          <span>AVALIAÇÃO EXECUTIVA DE PERFIL DECISÓRIO</span>
        </div>

        <h1 class="hero-editorial-title">
          COMO VOCÊ TOMA <span class="text-highlight-copper">DECISÕES</span> DIANTE DOS NÚMEROS?
        </h1>

        <p class="hero-editorial-sub">
          Descubra o seu perfil através de uma análise aprofundada sobre comportamento, disciplina, gestão de risco, probabilidade e método.
        </p>

        <div class="hero-indicators-bar">
          <div class="ind-pill">
            <span class="ind-pill-num">20</span>
            <span class="ind-pill-txt">SITUAÇÕES REAIS</span>
          </div>
          <div class="ind-pill-divider"></div>
          <div class="ind-pill">
            <span class="ind-pill-num">05</span>
            <span class="ind-pill-txt">DIMENSÕES ANALISADAS</span>
          </div>
          <div class="ind-pill-divider"></div>
          <div class="ind-pill">
            <span class="ind-pill-num">100%</span>
            <span class="ind-pill-txt">PERSONALIZADO</span>
          </div>
        </div>

        <div class="hero-cta-wrapper">
          <button id="btn-hero-start" class="btn btn-primary" type="button">
            <span>INICIAR MEU DIAGNÓSTICO</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
          
          <div class="hero-time-note">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>Leva aproximadamente 5 minutos.</span>
          </div>
        </div>
      </div>

      <!-- Coluna Direita: Fotografia Cinematográfica da Ampulheta -->
      <div class="hero-visual-col">
        <div class="visual-frame-container">
          <div class="visual-glow-halo"></div>
          <img 
            src="/images/hourglass-hero.jpg" 
            alt="Ampulheta executiva representando tempo, números e disciplina decisória"
            class="hero-hourglass-img"
            loading="eager"
          />
          <div class="visual-badge-floating">
            <span class="floating-badge-dot"></span>
            <span>TEMPO • DISCIPLINA • NÚMEROS</span>
          </div>
        </div>
      </div>
    </div>
  `;

  const btnStart = container.querySelector('#btn-hero-start');
  btnStart.addEventListener('click', () => {
    onStart();
  });

  return container;
}
