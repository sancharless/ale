/**
 * HourglassVisual.js
 * Simulação física e visual cinematográfica da Ampulheta do Tempo
 * Loop perpétuo contínuo com simetria matemática pura de 180°:
 * - Areia dourada descendo com física de partículas realista a 60 FPS
 * - Rotação mecânica contínua de 180° que inverte a ampulheta com inércia real
 * - A areia acumulada na base é levada em arco até o topo e reinicia o fluxo
 */

export function renderHourglassVisual() {
  const container = document.createElement('div');
  container.className = 'visual-frame-container hourglass-interactive-card';
  container.setAttribute('role', 'img');
  container.setAttribute('aria-label', 'Ampulheta animada do tempo com areia em fluxo contínuo e rotação cíclica em loop perpétuo');

  container.innerHTML = `
    <!-- Camada de Fundo Estática com Fórmulas Matemáticas e Halo Quente -->
    <div class="hourglass-bg-layer" aria-hidden="true">
      <div class="visual-glow-halo"></div>
      
      <!-- Fórmulas e Geometria de Probabilidade em Vetor Nítido -->
      <svg class="hourglass-math-svg" viewBox="0 0 400 380" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="145" cy="170" r="95" stroke="rgba(215, 154, 98, 0.14)" stroke-width="1" />
        <ellipse cx="265" cy="215" rx="110" ry="65" transform="rotate(25 265 215)" stroke="rgba(233, 108, 50, 0.11)" stroke-width="1" />
        <line x1="20" y1="180" x2="380" y2="180" stroke="rgba(230, 115, 55, 0.08)" stroke-dasharray="3 4" />
        <line x1="200" y1="30" x2="200" y2="330" stroke="rgba(230, 115, 55, 0.08)" stroke-dasharray="3 4" />
        
        <text x="24" y="58" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="rgba(215, 154, 98, 0.32)">P(A|B) = P(B|A)P(A) / P(B)</text>
        <text x="270" y="70" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="rgba(215, 154, 98, 0.32)">∫ f(t) dt = 1.0</text>
        <text x="24" y="325" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="rgba(215, 154, 98, 0.32)">dE/dt = σ · √Δt</text>
        <text x="272" y="325" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="rgba(215, 154, 98, 0.32)">E[X] = ∑ x · p(x)</text>
      </svg>
    </div>

    <!-- O Aparelho Central da Ampulheta com Canvas de Alta Resolução -->
    <div class="hourglass-apparatus" id="hourglass-apparatus">
      <canvas class="hourglass-canvas" width="280" height="350"></canvas>
      <div class="hourglass-specular-sweep" aria-hidden="true"></div>
    </div>

    <!-- Badge Flutuante Editorial -->
    <div class="visual-badge-floating">
      <span class="floating-badge-dot"></span>
      <span>PROBABILIDADE • COMPORTAMENTO • TREINAMENTO</span>
    </div>
  `;

  const canvas = container.querySelector('.hourglass-canvas');
  if (!canvas) return container;

  const ctx = canvas.getContext('2d');
  if (!ctx) return container;

  // Ajuste Retina/DPR para máxima definição
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const displayW = 280;
  const displayH = 350;
  canvas.width = displayW * dpr;
  canvas.height = displayH * dpr;
  canvas.style.width = `${displayW}px`;
  canvas.style.height = `${displayH}px`;
  ctx.scale(dpr, dpr);

  const cx = displayW / 2;
  const cy = displayH / 2;

  // Geometria da Ampulheta
  const glassH = 224;
  const bulbRadius = 55;
  const neckRadius = 6.0;
  const frameH = 264;
  const plateW = 152;
  const plateH = 15;
  const bulbMaxH = 92;

  // Partículas de Areia Cadente
  const sandParticles = [];
  const maxSandParticles = 65;
  const splashParticles = [];

  // Temporização do Ciclo Contínuo (em ms)
  const DURATION_FLOW = 5200;
  const DURATION_PAUSE = 250;
  const DURATION_FLIP = 1500;
  const HALF_CYCLE = DURATION_FLOW + DURATION_PAUSE + DURATION_FLIP;

  let startTime = null;
  let isRunning = true;
  let animId = null;

  // Easing cúbico suave de alta inércia
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // Caminho do vidro de quartzo (centrado em 0,0)
  function createGlassPath(targetCtx) {
    targetCtx.beginPath();
    targetCtx.moveTo(-bulbRadius * 0.8, -glassH / 2 + 10);
    targetCtx.quadraticCurveTo(0, -glassH / 2 + 2, bulbRadius * 0.8, -glassH / 2 + 10);

    targetCtx.bezierCurveTo(
      bulbRadius * 1.08, -glassH / 2 + 46,
      neckRadius + 2.5, -24,
      neckRadius, 0
    );

    targetCtx.bezierCurveTo(
      neckRadius + 2.5, 24,
      bulbRadius * 1.08, glassH / 2 - 46,
      bulbRadius * 0.8, glassH / 2 - 10
    );

    targetCtx.quadraticCurveTo(0, glassH / 2 - 2, -bulbRadius * 0.8, glassH / 2 - 10);

    targetCtx.bezierCurveTo(
      -bulbRadius * 1.08, glassH / 2 - 46,
      -neckRadius - 2.5, 24,
      -neckRadius, 0
    );

    targetCtx.bezierCurveTo(
      -neckRadius - 2.5, -24,
      -bulbRadius * 1.08, -glassH / 2 + 46,
      -bulbRadius * 0.8, -glassH / 2 + 10
    );

    targetCtx.closePath();
  }

  // Desenhar armação torneada de cobre e bronze
  function drawFrame() {
    ctx.save();

    const colLeftX = -plateW / 2 + 14;
    const colRightX = plateW / 2 - 14;
    const colRearX = 0;

    // Coluna traseira
    drawPillar(colRearX, true);

    // Placas superior e inferior
    drawPlate(0, -frameH / 2, plateW, plateH, true);
    drawPlate(0, frameH / 2 - plateH, plateW, plateH, false);

    // Colunas frontais torneadas
    drawPillar(colLeftX, false);
    drawPillar(colRightX, false);

    ctx.restore();
  }

  function drawPillar(px, isRear) {
    ctx.save();
    const pW = isRear ? 6.5 : 8.5;
    const pH = frameH - plateH * 2;
    const pY = -frameH / 2 + plateH;

    const grad = ctx.createLinearGradient(px - pW / 2, 0, px + pW / 2, 0);
    if (isRear) {
      grad.addColorStop(0, '#1E0B04');
      grad.addColorStop(0.5, '#42170A');
      grad.addColorStop(1, '#180703');
    } else {
      grad.addColorStop(0, '#4A1B0A');
      grad.addColorStop(0.22, '#993E17');
      grad.addColorStop(0.48, '#FFAE73');
      grad.addColorStop(0.72, '#9E4119');
      grad.addColorStop(1, '#331004');
    }

    ctx.fillStyle = grad;
    ctx.fillRect(px - pW / 2, pY, pW, pH);

    // Anéis torneados dourados de reforço
    if (!isRear) {
      const rings = [-68, -64, -3, 3, 64, 68];
      ctx.fillStyle = '#F3BA58';
      rings.forEach(ry => {
        ctx.beginPath();
        ctx.ellipse(px, ry, pW * 0.72, 2.2, 0, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    ctx.restore();
  }

  function drawPlate(px, py, w, h, isTop) {
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = isTop ? -2 : 4;

    const plateGrad = ctx.createLinearGradient(px - w / 2, 0, px + w / 2, 0);
    plateGrad.addColorStop(0, '#381407');
    plateGrad.addColorStop(0.2, '#7D2F12');
    plateGrad.addColorStop(0.48, '#E67337');
    plateGrad.addColorStop(0.55, '#FFE2C6');
    plateGrad.addColorStop(0.72, '#9E4119');
    plateGrad.addColorStop(1, '#2B0E04');

    ctx.fillStyle = plateGrad;
    ctx.beginPath();
    ctx.roundRect(px - w / 2, py, w, h, 4);
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.fillStyle = 'rgba(18, 7, 3, 0.88)';
    ctx.fillRect(px - w / 2 + 10, py + (isTop ? 2 : h - 5), w - 20, 3);

    // Cúpula esférica torneada
    const domeY = isTop ? py - 4 : py + h - 1;
    ctx.fillStyle = plateGrad;
    ctx.beginPath();
    ctx.arc(px, domeY, 17, isTop ? Math.PI : 0, isTop ? 0 : Math.PI);
    ctx.fill();

    // Rebites dourados de latão
    const rivetX = [px - w / 2 + 16, px - w / 4, px, px + w / 4, px + w / 2 - 16];
    ctx.fillStyle = '#F3BA58';
    rivetX.forEach(rx => {
      ctx.beginPath();
      ctx.arc(rx, py + h / 2, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  // Atualização física das partículas
  function updateParticles(isStreaming, moundY) {
    if (isStreaming) {
      for (let i = 0; i < 3; i++) {
        if (sandParticles.length < maxSandParticles) {
          sandParticles.push({
            x: (Math.random() - 0.5) * (neckRadius * 0.7),
            y: 0,
            vx: (Math.random() - 0.5) * 0.35,
            vy: 3.2 + Math.random() * 2.6,
            size: 0.9 + Math.random() * 1.4,
            color: Math.random() > 0.4 ? '#F5C26B' : (Math.random() > 0.5 ? '#E67337' : '#FFE8A8'),
            alpha: 0.94
          });
        }
      }
    }

    for (let i = sandParticles.length - 1; i >= 0; i--) {
      const p = sandParticles[i];
      p.vy += 0.35;
      p.x += p.vx;
      p.y += p.vy;

      if (p.y >= moundY) {
        if (splashParticles.length < 18) {
          splashParticles.push({
            x: p.x,
            y: moundY,
            vx: (Math.random() - 0.5) * 1.6,
            vy: -(0.6 + Math.random() * 1.5),
            size: 0.8 + Math.random() * 1.1,
            life: 1.0,
            decay: 0.08 + Math.random() * 0.07,
            color: p.color
          });
        }
        sandParticles.splice(i, 1);
      }
    }

    for (let i = splashParticles.length - 1; i >= 0; i--) {
      const s = splashParticles[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.16;
      s.life -= s.decay;
      if (s.life <= 0) {
        splashParticles.splice(i, 1);
      }
    }
  }

  // Gradiente nobre de areia dourada
  function getSandGradient(y1, y2) {
    const g = ctx.createLinearGradient(0, y1, 0, y2);
    g.addColorStop(0, '#FFE8B0');   // Brilho na crista
    g.addColorStop(0.18, '#F5C26B');  // Ouro vivo
    g.addColorStop(0.52, '#E67337');  // Cobre editorial
    g.addColorStop(0.85, '#B75220');  // Âmbar
    g.addColorStop(1, '#662208');     // Sombra rica
    return g;
  }

  // Renderização universal de bulbo (definido nativamente no espaço superior y < 0)
  // mode: 'drain' (esvaziando no topo) ou 'fill' (enchendo na base, quando invertido por PI)
  function renderBulbGeometry(volume, mode) {
    if (volume <= 0.005) return;

    ctx.save();
    createGlassPath(ctx);
    ctx.clip();

    const h = bulbMaxH * Math.min(volume, 1.0);

    if (mode === 'drain') {
      // Esvaziando: apoiado contra o colo (y = 0) descendo da superfície livre (y = -h)
      const surfaceY = -h;
      const funnel = volume > 0.06 ? 6 : 2;

      ctx.fillStyle = getSandGradient(surfaceY, 0);
      ctx.beginPath();
      ctx.moveTo(-bulbRadius * 1.4, 2);
      ctx.lineTo(-bulbRadius * 1.4, surfaceY);
      ctx.quadraticCurveTo(0, surfaceY + funnel, bulbRadius * 1.4, surfaceY);
      ctx.lineTo(bulbRadius * 1.4, 2);
      ctx.closePath();
      ctx.fill();

      // Crista iluminada com poeira dourada
      ctx.strokeStyle = 'rgba(255, 235, 180, 0.55)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-bulbRadius * 0.75 * volume, surfaceY + 1);
      ctx.quadraticCurveTo(0, surfaceY + funnel + 1, bulbRadius * 0.75 * volume, surfaceY + 1);
      ctx.stroke();
    } else {
      // Enchendo: acumulando na extremidade do bulbo (y = -112) formando monte cônico
      const btmY = -112;
      const moundApex = btmY + h * 1.15;
      const moundBase = btmY + h * 0.65;

      ctx.fillStyle = getSandGradient(moundApex, btmY);
      ctx.beginPath();
      ctx.moveTo(-bulbRadius * 1.4, btmY - 10);
      ctx.lineTo(-bulbRadius * 1.4, moundBase);
      ctx.quadraticCurveTo(0, moundApex, bulbRadius * 1.4, moundBase);
      ctx.lineTo(bulbRadius * 1.4, btmY - 10);
      ctx.closePath();
      ctx.fill();

      // Crista cônica iluminada
      ctx.strokeStyle = 'rgba(255, 235, 180, 0.55)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(0, moundApex - 3, Math.min(bulbRadius * 0.45, 6 + h * 0.45), Math.PI * 0.15, Math.PI * 0.85, false);
      ctx.stroke();
    }

    ctx.restore();
  }

  // Desenhar fluxo e partículas cadentes
  function drawStream(isStreaming, moundY) {
    if (!isStreaming) return;

    ctx.save();
    createGlassPath(ctx);
    ctx.clip();

    // Jato central luminoso
    const streamGrad = ctx.createLinearGradient(0, -3, 0, moundY);
    streamGrad.addColorStop(0, 'rgba(255, 240, 190, 0.98)');
    streamGrad.addColorStop(0.3, 'rgba(243, 178, 80, 0.92)');
    streamGrad.addColorStop(0.75, 'rgba(230, 115, 55, 0.88)');
    streamGrad.addColorStop(1, 'rgba(255, 245, 210, 0.98)');

    ctx.strokeStyle = streamGrad;
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(0, -3);
    ctx.lineTo(0, moundY);
    ctx.stroke();

    // Núcleo branco cintilante
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, moundY);
    ctx.stroke();

    // Partículas em queda
    for (let i = 0; i < sandParticles.length; i++) {
      const p = sandParticles[i];
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Respingos de impacto
    for (let i = 0; i < splashParticles.length; i++) {
      const s = splashParticles[i];
      ctx.fillStyle = s.color;
      ctx.globalAlpha = s.life;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    ctx.restore();
  }

  // Reflexos de vidro transparente
  function drawGlassShading() {
    ctx.save();

    ctx.strokeStyle = 'rgba(255, 235, 210, 0.52)';
    ctx.lineWidth = 1.6;
    createGlassPath(ctx);
    ctx.stroke();

    // Destaque especular no bulbo superior
    const glintGrad = ctx.createLinearGradient(-bulbRadius, 0, -bulbRadius + 22, 0);
    glintGrad.addColorStop(0, 'rgba(255, 255, 255, 0.75)');
    glintGrad.addColorStop(0.4, 'rgba(255, 240, 210, 0.28)');
    glintGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.strokeStyle = glintGrad;
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.arc(-16, -glassH / 4, bulbRadius * 0.65, Math.PI * 0.88, Math.PI * 1.35);
    ctx.stroke();

    // Destaque no bulbo inferior
    ctx.beginPath();
    ctx.arc(-16, glassH / 4, bulbRadius * 0.65, Math.PI * 0.88, Math.PI * 1.35);
    ctx.stroke();

    // Brilho no colo
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(-neckRadius + 0.5, -12);
    ctx.lineTo(-neckRadius + 0.5, 12);
    ctx.stroke();

    ctx.restore();
  }

  // Loop de Renderização a 60 FPS
  function animate(now) {
    if (!isRunning) return;

    if (startTime === null) startTime = now;
    const elapsed = now - startTime;

    const cycleIndex = Math.floor(elapsed / HALF_CYCLE);
    const timeInCycle = elapsed % HALF_CYCLE;
    const isEven = (cycleIndex % 2 === 0);

    let sandDrainingRatio = 0.0;
    let sandFillingRatio = 0.0;
    let isStreaming = false;
    let turnAngle = 0.0;

    if (timeInCycle < DURATION_FLOW) {
      // 1. Fase de Fluxo: a areia desce
      const flowProgress = timeInCycle / DURATION_FLOW;
      isStreaming = flowProgress < 0.985;
      sandDrainingRatio = 1.0 - flowProgress;
      sandFillingRatio = flowProgress;
      turnAngle = cycleIndex * Math.PI;
    } else if (timeInCycle < DURATION_FLOW + DURATION_PAUSE) {
      // 2. Fase de Pausa: estabilização
      sandDrainingRatio = 0.0;
      sandFillingRatio = 1.0;
      isStreaming = false;
      turnAngle = cycleIndex * Math.PI;
    } else {
      // 3. Fase de Virada Mecânica: 180° contínuo com easing de inércia
      sandDrainingRatio = 0.0;
      sandFillingRatio = 1.0;
      isStreaming = false;
      const flipTime = timeInCycle - (DURATION_FLOW + DURATION_PAUSE);
      const flipNorm = flipTime / DURATION_FLIP;
      const easedFlip = easeInOutCubic(Math.min(flipNorm, 1.0));
      turnAngle = (cycleIndex * Math.PI) + (easedFlip * Math.PI);
    }

    // Altura do monte na base física (onde as partículas batem)
    const currentMoundH = bulbMaxH * Math.min(sandFillingRatio, 1.0);
    const moundApexY = 112 - currentMoundH * 1.15;

    updateParticles(isStreaming, moundApexY);

    ctx.clearRect(0, 0, displayW, displayH);

    // ==========================================
    // RENDERIZAÇÃO DA AMPULHETA COM ROTAÇÃO CONTÍNUA
    // ==========================================
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(turnAngle);

    // 1. Estrutura Nobre de Cobre Torneado
    drawFrame();

    // 2. Areia nos Bulbos (Simetria Perfeita de 180°)
    if (isEven) {
      // Ciclo par: Bulbo 1 (topo local) drena; Bulbo 2 (base local) enche
      renderBulbGeometry(sandDrainingRatio, 'drain');
      ctx.save();
      ctx.rotate(Math.PI);
      renderBulbGeometry(sandFillingRatio, 'fill');
      ctx.restore();
    } else {
      // Ciclo ímpar: Bulbo 2 (agora topo local) drena; Bulbo 1 (agora base local) enche
      ctx.save();
      ctx.rotate(Math.PI);
      renderBulbGeometry(sandDrainingRatio, 'drain');
      ctx.restore();
      renderBulbGeometry(sandFillingRatio, 'fill');
    }

    // 3. Reflexos de Vidro
    drawGlassShading();

    ctx.restore();

    // ==========================================
    // RENDERIZAÇÃO DO FLUXO NA DIREÇÃO DA GRAVIDADE REAL
    // (O fluxo só cai quando a ampulheta está em pé, em direção à base)
    // ==========================================
    if (isStreaming) {
      ctx.save();
      ctx.translate(cx, cy);
      drawStream(isStreaming, moundApexY);
      ctx.restore();
    }

    animId = requestAnimationFrame(animate);
  }

  // Iniciar loop a 60 FPS
  animId = requestAnimationFrame(animate);

  // Interatividade: 3D Tilt Parallax no card
  let cardBounds = null;
  container.addEventListener('mouseenter', () => {
    cardBounds = container.getBoundingClientRect();
  });

  container.addEventListener('mousemove', (e) => {
    if (!cardBounds) cardBounds = container.getBoundingClientRect();
    const x = e.clientX - cardBounds.left;
    const y = e.clientY - cardBounds.top;
    const midX = cardBounds.width / 2;
    const midY = cardBounds.height / 2;

    const tiltY = ((x - midX) / midX) * 9;
    const tiltX = -((y - midY) / midY) * 9;

    container.style.transform = `perspective(800px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.02, 1.02, 1)`;
  });

  container.addEventListener('mouseleave', () => {
    container.style.transform = '';
    cardBounds = null;
  });

  // Limpeza de recursos
  const observer = new MutationObserver(() => {
    if (!document.body.contains(container)) {
      isRunning = false;
      if (animId) cancelAnimationFrame(animId);
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  return container;
}
