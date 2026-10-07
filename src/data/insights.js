import { DIMENSIONS } from './questions.js';

/**
 * Biblioteca de Insights Inteligentes Combináveis
 * Avalia interações entre dimensões, identifica ponto forte, ponto de evolução,
 * card de atenção e o Mapa de Evolução (Mantenha, Desenvolva, Priorize).
 */

export function generateSmartInsights(dimensions, overallScore) {
  const { comportamento, gestao, probabilidade, analise, disciplina } = dimensions;

  // Ordenar dimensões por pontuação
  const sortedDims = Object.entries(dimensions)
    .map(([key, score]) => ({ key, score, meta: DIMENSIONS[key] }))
    .sort((a, b) => b.score - a.score);

  const highestDim = sortedDims[0];
  const lowestDim = sortedDims[sortedDims.length - 1];

  // 1. Ponto Forte
  let strongPoint = {
    title: `Capacidade de ${highestDim.meta.name}`,
    description: ''
  };

  if (highestDim.key === 'analise') {
    strongPoint.description = 'Você demonstra facilidade e precisão para organizar informações, identificar confluências e estruturar racionalmente seus critérios de decisão.';
  } else if (highestDim.key === 'comportamento') {
    strongPoint.description = 'Você possui alto autocontrole e estabilidade emocional, mantendo o discernimento mesmo após sequências inesperadas de ganhos ou perdas.';
  } else if (highestDim.key === 'gestao') {
    strongPoint.description = 'Você demonstra clareza na fixação de limites e preservação de capital, compreendendo que a longevidade depende de administrar riscos com firmeza.';
  } else if (highestDim.key === 'probabilidade') {
    strongPoint.description = 'Você compreende com lucidez a independência dos eventos e a natureza estatística dos resultados, evitando falácias comuns de compensação.';
  } else {
    strongPoint.description = 'Sua força reside na capacidade de executar aquilo que foi planejado sem ceder a impulsos imediatos, gerando estabilidade operacional.';
  }

  // 2. Principal Ponto de Evolução
  let evolutionPoint = {
    title: `Desenvolvimento em ${lowestDim.meta.name}`,
    description: ''
  };

  if (lowestDim.key === 'disciplina') {
    evolutionPoint.description = 'Você compreende a teoria e os limites, mas ainda permite que momentos de empolgação ou frustração causem pequenos desvios na execução do plano.';
  } else if (lowestDim.key === 'probabilidade') {
    evolutionPoint.description = 'Há uma tendência a buscar certezas onde há apenas probabilidades. É fundamental internalizar a variância e a independência de eventos repetidos.';
  } else if (lowestDim.key === 'comportamento') {
    evolutionPoint.description = 'Seu principal obstáculo é o impacto emocional dos resultados recentes. Reações de frustração ou euforia ainda contaminam o próximo movimento.';
  } else if (lowestDim.key === 'gestao') {
    evolutionPoint.description = 'A definição e respeito rígido a limites financeiros necessitam de reforço. Evite qualquer aumento de exposição para compensar desvios rápidos.';
  } else {
    evolutionPoint.description = 'Aprofundar a confluência de critérios e evitar decisões baseadas exclusivamente em intuição sem validação prévia de parâmetros.';
  }

  // 3. Card de Atenção com Regras Cruzadas Inteligentes
  let attentionPoint = {
    title: 'Descompasso Operacional Detectado',
    description: 'Conhecimento e execução ainda não estão completamente alinhados no mesmo nível de maturidade.'
  };

  if (analise >= 70 && disciplina < 60) {
    attentionPoint = {
      title: 'Conhecimento à Frente da Execução',
      description: 'Você sabe exatamente o que deveria fazer na teoria, mas sob calor operacional algumas decisões ainda são influenciadas pelo resultado imediatamente anterior.'
    };
  } else if (probabilidade < 60 && analise >= 65) {
    attentionPoint = {
      title: 'Confusão entre Padrão e Certeza',
      description: 'Você demonstra boa capacidade de observar dados e gráficos, mas precisa fortalecer a fronteira conceitual entre padrão observado e probabilidade futura independente.'
    };
  } else if (comportamento < 60 && analise >= 65) {
    attentionPoint = {
      title: 'Gargalo no Autocontrole Emocional',
      description: 'Seu maior desafio não reside na leitura técnica ou inteligência analítica, mas na forma visceral como seu estado interno reage a oscilações momentâneas.'
    };
  } else if (gestao > 75 && disciplina < 60) {
    attentionPoint = {
      title: 'Limites Definidos, Mas Flexibilizados',
      description: 'Você sabe calcular e estipular tetos saudáveis, porém ainda encontra justificativas momentâneas para não encerrar quando o limite estabelecido é tocado.'
    };
  } else if (comportamento >= 75 && gestao >= 75 && disciplina >= 75) {
    attentionPoint = {
      title: 'Consistência de Alta Blindagem',
      description: 'Excelente sinergia entre equilíbrio, gestão e execução. Seu ponto de vigilância contínua deve ser evitar o excesso de complacência em fases muito favoráveis.'
    };
  } else if (overallScore < 45) {
    attentionPoint = {
      title: 'Urgência em Blindagem Básica',
      description: 'Recomenda-se interromper decisões automáticas e criar uma lista de regras restritivas simples com apenas 2 passos antes de qualquer ação prática.'
    };
  }

  // 4. Mapa de Evolução: Mantenha, Desenvolva, Priorize
  const mantenha = [];
  const desenvolva = [];
  const priorize = [];

  sortedDims.forEach(item => {
    const detail = {
      key: item.key,
      name: item.meta.name,
      score: item.score,
      shortDescription: item.meta.shortDescription,
      icon: item.meta.icon
    };

    if (item.score >= 70) {
      mantenha.push({
        ...detail,
        guidance: `Excelente nível de maturidade (${item.score}%). Mantenha este padrão como sua âncora de segurança.`
      });
    } else if (item.score >= 50) {
      desenvolva.push({
        ...detail,
        guidance: `Nível intermediário (${item.score}%). Oportunidade clara de lapidação para transformar em ponto forte.`
      });
    } else {
      priorize.push({
        ...detail,
        guidance: `Zona crítica de vulnerabilidade (${item.score}%). Concentre seu foco inicial aqui para estancar desvios.`
      });
    }
  });

  // Garantir que pelo menos 1 item fique em cada bloco do mapa caso a distribuição seja uniforme
  if (priorize.length === 0) {
    const lowest = desenvolva.pop() || mantenha.pop();
    if (lowest) {
      priorize.push({
        ...lowest,
        guidance: `Sua dimensão relativa de menor pontuação (${lowest.score}%). Reforço contínuo gera saltos de performance.`
      });
    }
  }

  if (mantenha.length === 0) {
    const highest = desenvolva.shift();
    if (highest) {
      mantenha.push({
        ...highest,
        guidance: `Sua dimensão mais destacada atualmente (${highest.score}%). Use como alavanca de confiança.`
      });
    }
  }

  return {
    strongPoint,
    evolutionPoint,
    attentionPoint,
    evolutionMap: {
      mantenha,
      desenvolva,
      priorize
    }
  };
}
