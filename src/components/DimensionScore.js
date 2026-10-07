import { DIMENSIONS } from '../data/questions.js';

/**
 * Componente DimensionScore — Editorial Cobre & Bronze
 * Gráfico Radar SVG com linha cobre, área translúcida, grid marrom escuro e labels off-white,
 * combinado com exibição dos valores individuais por dimensão.
 */

export function renderDimensionScore({ dimensions }) {
  const container = document.createElement('div');
  container.className = 'dimensions-editorial-grid';

  // 1. Gráfico Radar SVG
  const radarCard = document.createElement('div');
  radarCard.className = 'radar-editorial-card';

  const radarSvg = createRadarSvg(dimensions);
  radarCard.appendChild(radarSvg);

  const radarLegend = document.createElement('div');
  radarLegend.style.marginTop = '1rem';
  radarLegend.style.fontFamily = "'Oswald', sans-serif";
  radarLegend.style.fontSize = '0.75rem';
  radarLegend.style.color = 'var(--metal-gold-aged)';
  radarLegend.style.letterSpacing = '0.15em';
  radarLegend.style.textTransform = 'uppercase';
  radarLegend.textContent = 'MAPEAMENTO PENTAGONAL DE MATURIDADE';
  radarCard.appendChild(radarLegend);

  // 2. Apresentação Individual dos Valores (82 COMPORTAMENTO, etc.)
  const listContainer = document.createElement('div');
  listContainer.className = 'dimensions-editorial-list';

  const dimKeys = ['comportamento', 'gestao', 'probabilidade', 'analise', 'disciplina'];
  dimKeys.forEach(key => {
    const meta = DIMENSIONS[key];
    const score = dimensions[key] || 0;

    const item = document.createElement('div');
    item.className = 'dim-editorial-item';
    item.innerHTML = `
      <div class="dim-editorial-header">
        <span class="dim-editorial-name">${meta.name}</span>
        <span class="dim-editorial-score">${score}%</span>
      </div>
      <div class="dim-copper-track">
        <div class="dim-copper-fill" style="width: 0%;" data-target="${score}"></div>
      </div>
      <div class="dim-editorial-desc">${meta.description}</div>
    `;

    listContainer.appendChild(item);
  });

  container.appendChild(radarCard);
  container.appendChild(listContainer);

  // Trigger para animação das barras após montagem
  setTimeout(() => {
    listContainer.querySelectorAll('.dim-copper-fill').forEach(fill => {
      const target = fill.getAttribute('data-target');
      fill.style.width = `${target}%`;
    });
  }, 100);

  return container;
}

/**
 * Cria o Gráfico Radar SVG nos padrões estéticos pedidos:
 * - Linha de valor em cobre (#E96C32)
 * - Área interna translúcida com preenchimento sutil âmbar
 * - Grid marrom escuro (#35150C e rgba(230, 115, 55, 0.12))
 * - Labels em off-white (#F7F3EE)
 */
function createRadarSvg(dimensions) {
  const size = 300;
  const center = size / 2;
  const radius = 95;

  const dimKeys = ['comportamento', 'gestao', 'probabilidade', 'analise', 'disciplina'];
  const totalAxes = dimKeys.length;
  const angleStep = (Math.PI * 2) / totalAxes;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');

  // Defs para gradiente e glow cobre
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  defs.innerHTML = `
    <linearGradient id="radarCopperFill" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E96C32" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#35150C" stop-opacity="0.1" />
    </linearGradient>
    <filter id="copperGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  `;
  svg.appendChild(defs);

  // Círculos/Polígonos concêntricos do grid em marrom escuro
  [0.25, 0.5, 0.75, 1].forEach((level) => {
    const polygonPts = [];
    for (let i = 0; i < totalAxes; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = center + Math.cos(angle) * (radius * level);
      const y = center + Math.sin(angle) * (radius * level);
      polygonPts.push(`${x},${y}`);
    }

    const ring = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    ring.setAttribute('points', polygonPts.join(' '));
    ring.setAttribute('fill', 'none');
    ring.setAttribute('stroke', level === 1 ? 'rgba(230, 115, 55, 0.28)' : 'rgba(74, 29, 14, 0.45)');
    ring.setAttribute('stroke-width', level === 1 ? '1.5' : '1');
    if (level === 0.5) ring.setAttribute('stroke-dasharray', '3 3');
    svg.appendChild(ring);
  });

  // Eixos radiais e labels off-white
  const dataPoints = [];
  dimKeys.forEach((key, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const endX = center + Math.cos(angle) * radius;
    const endY = center + Math.sin(angle) * radius;

    // Linha do eixo
    const axisLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    axisLine.setAttribute('x1', center);
    axisLine.setAttribute('y1', center);
    axisLine.setAttribute('x2', endX);
    axisLine.setAttribute('y2', endY);
    axisLine.setAttribute('stroke', 'rgba(74, 29, 14, 0.6)');
    axisLine.setAttribute('stroke-width', '1');
    svg.appendChild(axisLine);

    // Label off-white
    const labelRadius = radius + 26;
    const lx = center + Math.cos(angle) * labelRadius;
    const ly = center + Math.sin(angle) * labelRadius;

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', lx);
    text.setAttribute('y', ly + 4);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', '#F7F3EE');
    text.setAttribute('font-size', '10');
    text.setAttribute('font-family', 'Oswald, sans-serif');
    text.setAttribute('letter-spacing', '0.08em');
    text.setAttribute('font-weight', '600');
    text.textContent = DIMENSIONS[key].name.toUpperCase();
    svg.appendChild(text);

    // Ponto do valor do usuário
    const scoreVal = dimensions[key] || 0;
    const scoreFrac = Math.max(0.12, scoreVal / 100);
    const dataX = center + Math.cos(angle) * (radius * scoreFrac);
    const dataY = center + Math.sin(angle) * (radius * scoreFrac);
    dataPoints.push({ x: dataX, y: dataY, score: scoreVal });
  });

  // Polígono dos valores do usuário com linha cobre e glow
  const ptsString = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  const dataPolygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  dataPolygon.setAttribute('points', ptsString);
  dataPolygon.setAttribute('fill', 'url(#radarCopperFill)');
  dataPolygon.setAttribute('stroke', '#E96C32');
  dataPolygon.setAttribute('stroke-width', '2.5');
  dataPolygon.setAttribute('filter', 'url(#copperGlow)');
  svg.appendChild(dataPolygon);

  // Vértices cobre metálico
  dataPoints.forEach(p => {
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', p.x);
    dot.setAttribute('cy', p.y);
    dot.setAttribute('r', '4.5');
    dot.setAttribute('fill', '#F7F3EE');
    dot.setAttribute('stroke', '#E96C32');
    dot.setAttribute('stroke-width', '2.5');
    svg.appendChild(dot);
  });

  return svg;
}
