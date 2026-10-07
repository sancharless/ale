/**
 * Componente InsightCard — Editorial
 * Três cards de interpretação executiva com numeração editorial 01, 02, 03
 */

export function renderInsightCards({ strongPoint, evolutionPoint, attentionPoint }) {
  const container = document.createElement('div');
  container.className = 'insights-editorial-grid';

  // Card 01: Ponto Forte
  const card1 = document.createElement('div');
  card1.className = 'insight-editorial-card';
  card1.innerHTML = `
    <div>
      <div class="insight-editorial-num">01</div>
      <div class="insight-editorial-type">PONTO FORTE</div>
      <h4 class="insight-editorial-title">${strongPoint.title}</h4>
    </div>
    <p class="insight-editorial-body">${strongPoint.description}</p>
  `;

  // Card 02: Ponto de Evolução
  const card2 = document.createElement('div');
  card2.className = 'insight-editorial-card';
  card2.innerHTML = `
    <div>
      <div class="insight-editorial-num">02</div>
      <div class="insight-editorial-type">PONTO DE EVOLUÇÃO</div>
      <h4 class="insight-editorial-title">${evolutionPoint.title}</h4>
    </div>
    <p class="insight-editorial-body">${evolutionPoint.description}</p>
  `;

  // Card 03: Atenção Operacional
  const card3 = document.createElement('div');
  card3.className = 'insight-editorial-card';
  card3.innerHTML = `
    <div>
      <div class="insight-editorial-num">03</div>
      <div class="insight-editorial-type">ATENÇÃO OPERACIONAL</div>
      <h4 class="insight-editorial-title">${attentionPoint.title}</h4>
    </div>
    <p class="insight-editorial-body">${attentionPoint.description}</p>
  `;

  container.appendChild(card1);
  container.appendChild(card2);
  container.appendChild(card3);

  return container;
}
