import { DIMENSIONS, QUESTIONS } from './questions.js';
import { getProfileByScore } from './profiles.js';

/**
 * Motor de Pontuação Ponderado
 * Calcula a maturidade em cada uma das 5 dimensões e o Índice Geral de Consistência
 */
export function calculateAssessmentResults(answersMap) {
  // answersMap: { [questionId]: optionLetter }
  
  // Acumuladores por dimensão: soma dos pontos obtidos e contagem/peso máximo
  const dimensionTotals = {
    comportamento: { earned: 0, count: 0 },
    gestao: { earned: 0, count: 0 },
    probabilidade: { earned: 0, count: 0 },
    analise: { earned: 0, count: 0 },
    disciplina: { earned: 0, count: 0 }
  };

  QUESTIONS.forEach(q => {
    const selectedLetter = answersMap[q.id];
    if (!selectedLetter) return;

    const chosenOption = q.options.find(opt => opt.letter === selectedLetter);
    if (!chosenOption || !chosenOption.scores) return;

    // Distribuir para cada dimensão impactada pela alternativa
    Object.entries(chosenOption.scores).forEach(([dimKey, score]) => {
      if (dimensionTotals[dimKey]) {
        dimensionTotals[dimKey].earned += score;
        dimensionTotals[dimKey].count += 1;
      }
    });
  });

  // Normalização de 0 a 100 para cada dimensão
  const dimensionScores = {};
  Object.keys(DIMENSIONS).forEach(dimKey => {
    const { earned, count } = dimensionTotals[dimKey];
    if (count > 0) {
      // Média dos scores recebidos nas perguntas pertinentes (cada score vai de 5 a 100)
      const avg = earned / count;
      dimensionScores[dimKey] = Math.min(100, Math.max(0, Math.round(avg)));
    } else {
      dimensionScores[dimKey] = 50; // Fallback neutro
    }
  });

  // Cálculo do Índice Geral Ponderado
  let overallScore = 0;
  let totalWeights = 0;

  Object.entries(DIMENSIONS).forEach(([dimKey, meta]) => {
    const weight = meta.weight || 0.20;
    overallScore += dimensionScores[dimKey] * weight;
    totalWeights += weight;
  });

  const finalScore = Math.min(100, Math.max(0, Math.round(overallScore / (totalWeights || 1))));
  const profile = getProfileByScore(finalScore);

  return {
    overallScore: finalScore,
    profile,
    dimensions: dimensionScores
  };
}
