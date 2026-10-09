import { renderDimensionScore } from './DimensionScore.js';
import { renderInsightCards } from './InsightCard.js';
import { renderEvolutionMap } from './EvolutionMap.js';
import { renderFinalCTA } from './FinalCTA.js';
import { renderShareModal } from './ShareResult.js';

/**
 * Componente ResultDashboard — Editorial
 * Relatório executivo de performance com estética cinematográfica em cobre e marrom profundo
 */

export function renderResultDashboard({ results, insights, onRestart, leadData }) {
  const container = document.createElement('div');
  container.className = 'dashboard-editorial-wrapper animate-slide-up';

  const { overallScore, profile, dimensions } = results;
  const { strongPoint, evolutionPoint, attentionPoint, evolutionMap } = insights;

  // Formatação do nome do perfil com uma palavra destacada em cobre
  const nameParts = profile.name.split(' ');
  const formattedProfileName = nameParts.map((word, i) => {
    if (i === nameParts.length - 1 || word === 'ESTRATÉGICO' || word === 'CONSISTÊNCIA' || word === 'DESENVOLVIMENTO') {
      return `<span class="text-highlight-copper">${word}</span>`;
    }
    return word;
  }).join(' ');

  // 1. Hero Card do Resultado
  const heroCard = document.createElement('section');
  heroCard.className = 'result-editorial-card';

  heroCard.innerHTML = `
    <div class="result-editorial-content">
      <!-- Selo de Autenticidade da Avaliação Oficial Alê -->
      <div class="result-brand-seal">
        <img 
          src="/images/logo-ale-oficial.png" 
          alt="Alê Logo Oficial" 
          class="result-brand-seal-img" 
        />
        <span class="result-brand-seal-tag">DIAGNÓSTICO OFICIAL • MATURIDADE DECISÓRIA</span>
      </div>

      <div class="section-meta-label" style="justify-content: center;">
        <span class="label-num">${profile.code}</span>
        <span>RELATÓRIO DE PERFORMANCE PESSOAL</span>
      </div>

      <div style="font-family: 'Oswald', sans-serif; font-size: 0.88rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--text-dim); margin-bottom: 0.35rem;">
        SEU PERFIL IDENTIFICADO
      </div>

      <h1 class="result-profile-editorial-name">
        ${formattedProfileName}
      </h1>

      <p class="result-profile-editorial-tagline">
        ${profile.tagline}
      </p>

      <!-- Placar Central Editorial -->
      <div class="score-editorial-box">
        <div class="score-editorial-numbers">
          <span id="score-counter-val" class="score-number-giant">0</span>
          <span class="score-max-giant">/100</span>
        </div>
        <div class="score-editorial-label">
          SEU ÍNDICE DE CONSISTÊNCIA
        </div>
      </div>

      <div class="profile-editorial-summary-box">
        ${leadData?.name ? `<strong style="color: var(--accent-copper);">${leadData.name}</strong>, seu perfil revela que: ` : ''}
        ${profile.summary}
      </div>

      <div style="display: flex; justify-content: center; margin-top: 1.75rem;">
        <button id="btn-trigger-share" class="btn btn-secondary" type="button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
          <span>COMPARTILHAR MEU PERFIL</span>
        </button>
      </div>
    </div>
  `;

  // 2. Seção das 5 Dimensões (Radar + Valores Individuais)
  const dimensionsSection = document.createElement('section');
  dimensionsSection.className = 'container'
  dimensionsSection.style.padding = '0';

  const dimHeading = document.createElement('div');
  dimHeading.innerHTML = `
    <div class="section-meta-label">
      <span class="label-num">02</span>
      <span>ANÁLISE PENTAGONAL DE COMPETÊNCIAS</span>
    </div>
    <h3 style="font-family: 'Bebas Neue', 'Oswald', sans-serif; font-size: 2rem; letter-spacing: 0.04em; color: var(--text-main); margin-bottom: 0.5rem; text-transform: uppercase;">
      AS CINCO DIMENSÕES DECISÓRIAS
    </h3>
    <p style="font-size: 0.95rem; color: var(--text-muted); margin-bottom: 1.5rem; max-width: 580px;">
      Avaliação comparativa entre racionalidade emocional, exposição, compreensão estatística, critérios e disciplina.
    </p>
  `;
  dimensionsSection.appendChild(dimHeading);

  const dimScoreComponent = renderDimensionScore({ dimensions });
  dimensionsSection.appendChild(dimScoreComponent);

  // 3. Seção dos Insights (01 Ponto Forte, 02 Ponto de Evolução, 03 Atenção)
  const insightsSection = document.createElement('section');
  insightsSection.className = 'container';
  insightsSection.style.padding = '0';

  const insightsHeading = document.createElement('div');
  insightsHeading.innerHTML = `
    <div class="section-meta-label">
      <span class="label-num">03</span>
      <span>DIAGNÓSTICO INTERPRETATIVO</span>
    </div>
    <h3 style="font-family: 'Bebas Neue', 'Oswald', sans-serif; font-size: 2rem; letter-spacing: 0.04em; color: var(--text-main); margin-bottom: 0.5rem; text-transform: uppercase;">
      DIAGNÓSTICO DE CONGRUÊNCIA
    </h3>
    <p style="font-size: 0.95rem; color: var(--text-muted); margin-bottom: 1.5rem; max-width: 580px;">
      Análise de confluência entre o que você compreende na teoria e como você reage sob pressão prática.
    </p>
  `;
  insightsSection.appendChild(insightsHeading);

  const insightsComponent = renderInsightCards({ strongPoint, evolutionPoint, attentionPoint });
  insightsSection.appendChild(insightsComponent);

  // 4. Mapa de Evolução
  const evolutionComponent = renderEvolutionMap({ evolutionMap });

  // 5. CTA Final
  const ctaComponent = renderFinalCTA({
    onRestart,
    targetUrl: 'https://wa.me/?text=Olá!%20Realizei%20meu%20Diagnóstico%20de%20Perfil%20e%20gostaria%20de%20evoluir%20minha%20consistência%20decisória.'
  });

  // Montagem do painel
  container.appendChild(heroCard);
  container.appendChild(dimensionsSection);
  container.appendChild(insightsSection);
  container.appendChild(evolutionComponent);
  container.appendChild(ctaComponent);

  // Evento do botão compartilhar
  const shareBtn = heroCard.querySelector('#btn-trigger-share');
  shareBtn.addEventListener('click', () => {
    const modal = renderShareModal({
      profile,
      overallScore,
      onClose: () => {}
    });
    document.body.appendChild(modal);
  });

  // Contagem crescente suave do placar
  const scoreCounterEl = heroCard.querySelector('#score-counter-val');
  if (scoreCounterEl) {
    animateScoreCounter(scoreCounterEl, overallScore);
  }

  return container;
}

function animateScoreCounter(el, targetScore) {
  const duration = 1300;
  const frameRate = 1000 / 60;
  const totalFrames = Math.round(duration / frameRate);
  let frame = 0;

  const timer = setInterval(() => {
    frame++;
    const progress = frame / totalFrames;
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentVal = Math.round(easeProgress * targetScore);

    el.textContent = currentVal;

    if (frame >= totalFrames) {
      clearInterval(timer);
      el.textContent = targetScore;
    }
  }, frameRate);
}
