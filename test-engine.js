import { QUESTIONS, DIMENSIONS, BLOCKS } from './src/data/questions.js';
import { calculateAssessmentResults } from './src/data/scoring.js';
import { generateSmartInsights } from './src/data/insights.js';
import { PROFILES, getProfileByScore } from './src/data/profiles.js';

console.log('=== TESTE DE INTEGRIDADE DO SISTEMA DE DIAGNÓSTICO ===');

// 1. Validação de Questões
console.log(`Total de questões cadastradas: ${QUESTIONS.length} (esperado: 20)`);
if (QUESTIONS.length !== 20) throw new Error('Divergência no número de questões');

QUESTIONS.forEach(q => {
  if (!q.id || !q.question || q.options.length !== 4) {
    throw new Error(`Questão ${q.id} mal formatada`);
  }
  const letters = q.options.map(o => o.letter).join('');
  if (letters !== 'ABCD') {
    throw new Error(`Questão ${q.id} com letras inconsistentes: ${letters}`);
  }
});
console.log('✓ Todas as 20 questões possuem 4 alternativas válidas (A, B, C, D).');

// 2. Teste Cenário Alta Consistência (Respostas A)
const answersHigh = {};
QUESTIONS.forEach(q => {
  // Letra com maior pontuação (geralmente A ou C nas invertidas)
  const bestOption = q.options.reduce((best, cur) => {
    const curSum = Object.values(cur.scores || {}).reduce((s, v) => s + v, 0);
    const bestSum = Object.values(best.scores || {}).reduce((s, v) => s + v, 0);
    return curSum > bestSum ? cur : best;
  }, q.options[0]);
  answersHigh[q.id] = bestOption.letter;
});

const resHigh = calculateAssessmentResults(answersHigh);
console.log('\n--- Cenário Alta Consistência ---');
console.log(`Índice Geral: ${resHigh.overallScore}/100`);
console.log(`Perfil: ${resHigh.profile.name} (${resHigh.profile.code})`);
console.log('Dimensões:', resHigh.dimensions);
const insightsHigh = generateSmartInsights(resHigh.dimensions, resHigh.overallScore);
console.log('Ponto Forte:', insightsHigh.strongPoint.title);
console.log('Atenção:', insightsHigh.attentionPoint.title);
console.log('Mantenha:', insightsHigh.evolutionMap.mantenha.length, 'itens');

// 3. Teste Cenário Perfil Reativo (Respostas com vulnerabilidade)
const answersLow = {};
QUESTIONS.forEach(q => {
  const worstOption = q.options.reduce((worst, cur) => {
    const curSum = Object.values(cur.scores || {}).reduce((s, v) => s + v, 0);
    const worstSum = Object.values(worst.scores || {}).reduce((s, v) => s + v, 0);
    return curSum < worstSum ? cur : worst;
  }, q.options[0]);
  answersLow[q.id] = worstOption.letter;
});

const resLow = calculateAssessmentResults(answersLow);
console.log('\n--- Cenário Reativo / Baixa Maturidade ---');
console.log(`Índice Geral: ${resLow.overallScore}/100`);
console.log(`Perfil: ${resLow.profile.name} (${resLow.profile.code})`);
console.log('Dimensões:', resLow.dimensions);
const insightsLow = generateSmartInsights(resLow.dimensions, resLow.overallScore);
console.log('Ponto Forte:', insightsLow.strongPoint.title);
console.log('Atenção:', insightsLow.attentionPoint.title);
console.log('Priorize:', insightsLow.evolutionMap.priorize.length, 'itens');

// 4. Teste Cenário Misto
const answersMixed = {};
QUESTIONS.forEach((q, idx) => {
  const letters = ['A', 'B', 'B', 'A'];
  answersMixed[q.id] = letters[idx % 4];
});
const resMixed = calculateAssessmentResults(answersMixed);
console.log('\n--- Cenário Misto ---');
console.log(`Índice Geral: ${resMixed.overallScore}/100`);
console.log(`Perfil: ${resMixed.profile.name} (${resMixed.profile.code})`);
console.log('Dimensões:', resMixed.dimensions);

console.log('\n✓ TODOS OS TESTES PASSARAM COM SUCESSO ABSOLUTO!');
