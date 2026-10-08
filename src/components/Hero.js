/**
 * Componente Hero — Estética Editorial com Logo Oficial Alê
 * Posição refinada do texto principal e layout mobile-first com a marca oficial
 */

export function renderHero({ onStart }) {
  const container = document.createElement('section');
  container.className = 'hero-section-editorial animate-slide-up';

  container.innerHTML = `
    <!-- Topo Editorial com a Logo Oficial Alê -->
    <div class="hero-brand-top">
      <img 
        src="/images/logo-ale-oficial.png" 
        alt="Alê — Os Números Falam. O Conhecimento Traduz."
        class="hero-brand-logo-img"
        loading="eager"
      />
    </div>

    <div class="hero-split-grid">
      <!-- Coluna de Texto: Hierarquia e Alinhamento Otimizados -->
      <div class="hero-content-col">
        <div class="section-meta-label">
          <span class="label-num">01</span>
          <span>DIAGNÓSTICO EXECUTIVO DE PERFIL</span>
        </div>

        <h1 class="hero-editorial-title">
          COMO VOCÊ TOMA <span class="text-highlight-copper">DECISÕES</span> DIANTE DOS NÚMEROS?
        </h1>

        <p class="hero-editorial-sub">
          Uma análise personalizada sobre comportamento, disciplina, gestão de risco, probabilidade e processo decisório.
        </p>

        <!-- Indicadores Rápidos -->
        <div class="hero-indicators-bar">
          <div class="ind-pill">
            <span class="ind-pill-num">20</span>
            <span class="ind-pill-txt">SITUAÇÕES</span>
          </div>
          <div class="ind-pill-divider"></div>
          <div class="ind-pill">
            <span class="ind-pill-num">05</span>
            <span class="ind-pill-txt">DIMENSÕES</span>
          </div>
          <div class="ind-pill-divider"></div>
          <div class="ind-pill">
            <span class="ind-pill-num">100%</span>
            <span class="ind-pill-txt">PERSONALIZADO</span>
          </div>
        </div>

        <!-- Bloco de Ação / CTA -->
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

      <!-- Coluna Visual: Fotografia Conceitual com Glow Suave -->
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
            <span>PROBABILIDADE • COMPORTAMENTO • TREINAMENTO</span>
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
