/**
 * Catálogo dos 5 Perfis de Tomada de Decisão
 * Faixas configuráveis e descrições com acabamento editorial monocromático
 */

export const PROFILES = [
  {
    id: 'reativo',
    range: [0, 39],
    code: 'NÍVEL 01',
    name: 'PERFIL REATIVO',
    tagline: 'Decisões guiadas pelo momento e forte influência dos resultados imediatos.',
    badgeColor: '#D85B28',
    badgeGlow: 'rgba(216, 91, 40, 0.35)',
    summary: 'Suas decisões ainda são fortemente impactadas pelo resultado imediatamente anterior. Há tendência a tentar recuperar perdas de forma acelerada ou assumir riscos desproporcionais após sequências, gerando alta volatilidade emocional e financeira.',
    keyChallenge: 'Estabelecer barreiras inegociáveis de contenção e dissociar o estado emocional do próximo movimento.',
    strengthsFocus: 'Potencial de aprendizado inicial acelerado se adotar limites simples e rígidos de exposição.',
    nextLevelAction: 'Implementar um protocolo de parada obrigatória após metas atingidas ou perdas limite, sem exceções.'
  },
  {
    id: 'em_construcao',
    range: [40, 54],
    code: 'NÍVEL 02',
    name: 'PERFIL EM CONSTRUÇÃO',
    tagline: 'Percepção dos riscos existente, mas a execução ainda oscila sob pressão.',
    badgeColor: '#B76832',
    badgeGlow: 'rgba(183, 104, 50, 0.35)',
    summary: 'Você já compreende a importância de regras e limites, mas a adesão prática ainda é inconsistente. Em momentos de estabilidade tudo corre conforme o plano, porém sob pressão ou após sequências atípicas ocorrem concessões arriscadas.',
    keyChallenge: 'Fechar o abismo entre o que você sabe que deve fazer e o que você realmente executa no calor do momento.',
    strengthsFocus: 'Consciência dos próprios erros e capacidade de reconhecer quando a decisão foi subótima.',
    nextLevelAction: 'Adotar um checklist formal pré-decisão e registrar fielmente 100% das operações e motivos.'
  },
  {
    id: 'analista',
    range: [55, 69],
    code: 'NÍVEL 03',
    name: 'ANALISTA EM DESENVOLVIMENTO',
    tagline: 'Boa base analítica e leitura de dados; o gargalo reside na disciplina operacional.',
    badgeColor: '#E96C32',
    badgeGlow: 'rgba(233, 108, 50, 0.4)',
    summary: 'Você possui boa capacidade de leitura de cenários, filtros técnicos e critérios racionais. O conhecimento teórico já está consolidado. Contudo, em situações específicas, o excesso de confiança ou a impaciência geram desvios sutis que corroem a consistência global.',
    keyChallenge: 'Manter a mesma disciplina monótona e rigorosa tanto na sequência de ganhos quanto na sequência de perdas.',
    strengthsFocus: 'Interpretação lúcida de confluências e capacidade de diferenciar decisões fundamentadas de impulsos aleatórios.',
    nextLevelAction: 'Padronizar critérios de entrada sem flexibilização e focar no processo em vez de no resultado de curto prazo.'
  },
  {
    id: 'estrategico',
    range: [70, 84],
    code: 'NÍVEL 04',
    name: 'PERFIL ESTRATÉGICO',
    tagline: 'Alta maturidade decisória, domínio da aleatoriedade e gestão estruturada.',
    badgeColor: '#C97C45',
    badgeGlow: 'rgba(201, 124, 69, 0.4)',
    summary: 'Você opera com base em processos claros, gestão sólida de risco e compreensão avançada sobre probabilidades. Reconhece que bons processos podem ter resultados negativos imediatos sem que isso signifique falha do método. Sua tomada de decisão é previsível e profissional.',
    keyChallenge: 'Eliminar os últimos 15% de desvios inconscientes que ocorrem em cenários extremos ou de cansaço prolongado.',
    strengthsFocus: 'Excelente autocontrole, leitura de confluências probabilísticas e blindagem contra armadilhas da mente.',
    nextLevelAction: 'Refinar a gestão de energia mental e otimizar pequenos detalhes de dimensionamento de exposição.'
  },
  {
    id: 'alta_consistencia',
    range: [85, 100],
    code: 'NÍVEL 05',
    name: 'PERFIL DE ALTA CONSISTÊNCIA',
    tagline: 'Execução cirúrgica, alinhamento absoluto entre probabilidade, gestão e conduta.',
    badgeColor: '#D79A62',
    badgeGlow: 'rgba(215, 154, 98, 0.45)',
    summary: 'Você atua no mais alto patamar de clareza decisória. Compreende a aleatoriedade em sua essência, nunca busca vingança contra números ou mercados, respeita rigorosamente seus limites e trata a tomada de decisão como uma maratona estatística.',
    keyChallenge: 'Manutenção contínua do rigor sem complacência ou excesso de auto-satisfação.',
    strengthsFocus: 'Disciplina inabalável, visão probabilística desapegada de resultados imediatos e domínio total do processo.',
    nextLevelAction: 'Mentoria, revisão contínua de métricas de longo prazo e preservação do ecossistema de alta performance.'
  }
];

export function getProfileByScore(score) {
  const normalized = Math.min(100, Math.max(0, Math.round(score)));
  const found = PROFILES.find(p => normalized >= p.range[0] && normalized <= p.range[1]);
  return found || PROFILES[PROFILES.length - 1];
}
