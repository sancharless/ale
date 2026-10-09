/**
 * Componente Hero — Estética Editorial com Logo Oficial Alê
 * Posição refinada do texto principal e layout mobile-first com a marca oficial
 */

export function renderHero({ onStart }) {
  const container = document.createElement('section');
  container.className = 'hero-section-editorial animate-slide-up';

  container.innerHTML = `
    <div class="hero-split-grid">
      <!-- Coluna de Texto: Hierarquia e Alinhamento Otimizados -->
      <div class="hero-content-col">
        <!-- Showcase Impactante com a Logo Oficial Alê Animada -->
        <div class="hero-brand-showcase" id="hero-brand-showcase" role="region" aria-label="Logo Oficial Alê">
          <!-- Aura de Luz Radiante em Cobre & Âmbar -->
          <div class="hero-logo-aura" aria-hidden="true"></div>
          
          <!-- Geometria Numérica e Órbitas Sutis -->
          <div class="hero-logo-geometry" aria-hidden="true">
            <div class="logo-geom-ring geom-ring-outer"></div>
            <div class="logo-geom-ring geom-ring-inner"></div>
            <div class="logo-geom-particle p1"></div>
            <div class="logo-geom-particle p2"></div>
            <div class="logo-geom-particle p3"></div>
          </div>

          <!-- Palco 3D Interativo da Logo -->
          <div class="hero-logo-stage" id="hero-logo-stage" title="Alê — Os Números Falam. O Conhecimento Traduz.">
            <div class="hero-logo-wrapper">
              <img 
                src="/images/logo-ale-oficial.png" 
                alt="Alê — Os Números Falam. O Conhecimento Traduz."
                class="hero-brand-logo-img"
                id="hero-logo-image"
                loading="eager"
              />
              <!-- Varredura de Brilho Metálico Cobre (Sheen Glint) -->
              <div class="hero-logo-sheen-sweep" aria-hidden="true"></div>
              <!-- Spotlight Beam Interativo (segue o cursor na logo) -->
              <div class="hero-logo-spotlight-beam" id="hero-logo-spotlight" aria-hidden="true"></div>
            </div>
          </div>

          <!-- Assinatura Editorial da Marca -->
          <div class="hero-brand-signature">
            <span class="sig-line sig-line-left"></span>
            <span class="sig-tagline">
              <span>OS NÚMEROS FALAM</span>
              <span class="sig-diamond">✦</span>
              <span>O CONHECIMENTO TRADUZ</span>
            </span>
            <span class="sig-line sig-line-right"></span>
          </div>
        </div>

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

  // Lógica Interativa da Logo Oficial: Tilt 3D com LERP, Spotlight Especular e Pulso
  const showcase = container.querySelector('#hero-brand-showcase');
  const stage = container.querySelector('#hero-logo-stage');

  if (showcase && stage) {
    let bounds = null;
    let isHovering = false;
    let rafId = null;
    let targetRotateX = 0;
    let targetRotateY = 0;
    let currentRotateX = 0;
    let currentRotateY = 0;

    const updateTilt = () => {
      // Interpolação suave (LERP) para movimento sedoso
      currentRotateX += (targetRotateX - currentRotateX) * 0.12;
      currentRotateY += (targetRotateY - currentRotateY) * 0.12;

      stage.style.transform = `perspective(1000px) rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg) scale3d(${isHovering ? 1.04 : 1}, ${isHovering ? 1.04 : 1}, 1)`;

      if (isHovering || Math.abs(currentRotateX) > 0.05 || Math.abs(currentRotateY) > 0.05) {
        rafId = requestAnimationFrame(updateTilt);
      } else {
        stage.style.transform = '';
        rafId = null;
      }
    };

    showcase.addEventListener('mouseenter', () => {
      bounds = showcase.getBoundingClientRect();
      isHovering = true;
      if (!rafId) rafId = requestAnimationFrame(updateTilt);
    });

    showcase.addEventListener('mousemove', (e) => {
      if (!bounds) bounds = showcase.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const y = e.clientY - bounds.top;
      const centerX = bounds.width / 2;
      const centerY = bounds.height / 2;

      // Ângulos suaves de inclinação 3D (-10 a +10 graus)
      targetRotateY = ((x - centerX) / centerX) * 11;
      targetRotateX = -((y - centerY) / centerY) * 11;

      // Posição do feixe especular que acompanha o cursor
      const percentX = (x / bounds.width) * 100;
      const percentY = (y / bounds.height) * 100;
      stage.style.setProperty('--mouse-x', `${percentX.toFixed(1)}%`);
      stage.style.setProperty('--mouse-y', `${percentY.toFixed(1)}%`);

      if (!rafId) rafId = requestAnimationFrame(updateTilt);
    });

    showcase.addEventListener('mouseleave', () => {
      isHovering = false;
      targetRotateX = 0;
      targetRotateY = 0;
      bounds = null;
    });

    // Toque / clique com efeito de pulso e flare
    showcase.addEventListener('click', () => {
      stage.classList.remove('clicked');
      void stage.offsetWidth; // Forçar reflow para reiniciar animação
      stage.classList.add('clicked');
      setTimeout(() => stage.classList.remove('clicked'), 600);
    });
  }

  return container;
}
