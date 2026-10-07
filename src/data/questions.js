/**
 * Catálogo Central de Perguntas do Diagnóstico de Tomada de Decisão
 * 20 Questões ponderadas distribuídas pelas 5 dimensões estratégicas:
 * - Comportamento (comportamento)
 * - Gestão (gestao)
 * - Probabilidade (probabilidade)
 * - Análise (analise)
 * - Disciplina (disciplina)
 */

export const DIMENSIONS = {
  comportamento: {
    id: 'comportamento',
    name: 'Comportamento',
    shortDescription: 'Racionalidade emocional',
    description: 'Capacidade de manter a racionalidade e estabilidade diante de resultados positivos e negativos.',
    weight: 0.22,
    icon: 'brain'
  },
  gestao: {
    id: 'gestao',
    name: 'Gestão',
    shortDescription: 'Administração de exposição',
    description: 'Capacidade de estabelecer limites claros, administrar riscos e honrar o plano financeiro.',
    weight: 0.20,
    icon: 'shield'
  },
  probabilidade: {
    id: 'probabilidade',
    name: 'Probabilidade',
    shortDescription: 'Compreensão estatística',
    description: 'Compreensão real sobre independência dos eventos, aleatoriedade, variância e probabilidades.',
    weight: 0.20,
    icon: 'percent'
  },
  analise: {
    id: 'analise',
    name: 'Análise',
    shortDescription: 'Estruturação de critérios',
    description: 'Capacidade de utilizar critérios objetivos e confluência de dados para fundamentar decisões.',
    weight: 0.18,
    icon: 'crosshair'
  },
  disciplina: {
    id: 'disciplina',
    name: 'Disciplina',
    shortDescription: 'Execução consistente',
    description: 'Capacidade de executar rigorosamente o que foi planejado, sem desvios impulsivos.',
    weight: 0.20,
    icon: 'compass'
  }
};

export const BLOCKS = [
  {
    id: 1,
    title: 'Comportamento & Autocontrole',
    dimensionKey: 'comportamento',
    range: [1, 4],
    subtitle: 'Avaliando sua reação diante de ganhos, perdas e estados emocionais'
  },
  {
    id: 2,
    title: 'Gestão de Risco & Limites',
    dimensionKey: 'gestao',
    range: [5, 8],
    subtitle: 'Avaliando como você define barreiras de exposição e preservação de capital'
  },
  {
    id: 3,
    title: 'Probabilidade & Aleatoriedade',
    dimensionKey: 'probabilidade',
    range: [9, 12],
    subtitle: 'Avaliando sua interpretação de sequências, padrões e independência estatística'
  },
  {
    id: 4,
    title: 'Análise & Critérios Decisórios',
    dimensionKey: 'analise',
    range: [13, 16],
    subtitle: 'Avaliando confluência de informações e objetividade na tomada de decisão'
  },
  {
    id: 5,
    title: 'Disciplina & Execução',
    dimensionKey: 'disciplina',
    range: [17, 20],
    subtitle: 'Avaliando adesão ao método planejado e consistência a longo prazo'
  }
];

export const QUESTIONS = [
  {
    id: 1,
    blockId: 1,
    dimension: 'comportamento',
    question: "Quando algo não acontece como você esperava, qual é sua reação mais comum?",
    options: [
      {
        letter: 'A',
        text: "Paro e tento entender o que aconteceu.",
        level: 'high',
        scores: { comportamento: 100, analise: 80, disciplina: 85 }
      },
      {
        letter: 'B',
        text: "Ajusto rapidamente e continuo.",
        level: 'medium',
        scores: { comportamento: 65, analise: 60, disciplina: 60 }
      },
      {
        letter: 'C',
        text: "Tento compensar o resultado anterior.",
        level: 'low',
        scores: { comportamento: 30, gestao: 25, disciplina: 30 }
      },
      {
        letter: 'D',
        text: "Fico frustrado e minha decisão seguinte costuma ser afetada.",
        level: 'critical',
        scores: { comportamento: 10, gestao: 15, disciplina: 10 }
      }
    ]
  },
  {
    id: 2,
    blockId: 1,
    dimension: 'comportamento',
    question: "Depois de uma sequência de bons resultados, você tende a:",
    options: [
      {
        letter: 'A',
        text: "Manter exatamente os mesmos critérios.",
        level: 'high',
        scores: { comportamento: 100, disciplina: 100, gestao: 90 }
      },
      {
        letter: 'B',
        text: "Ficar mais confiante, mas manter os limites.",
        level: 'medium',
        scores: { comportamento: 75, disciplina: 70, gestao: 70 }
      },
      {
        letter: 'C',
        text: "Aumentar um pouco minha exposição.",
        level: 'low',
        scores: { comportamento: 35, gestao: 30, disciplina: 35 }
      },
      {
        letter: 'D',
        text: "Aproveitar o momento e arriscar mais.",
        level: 'critical',
        scores: { comportamento: 10, gestao: 10, disciplina: 15 }
      }
    ]
  },
  {
    id: 3,
    blockId: 1,
    dimension: 'comportamento',
    question: "Quando você percebe que está emocionalmente alterado:",
    options: [
      {
        letter: 'A',
        text: "Interrompo imediatamente.",
        level: 'high',
        scores: { comportamento: 100, disciplina: 95, gestao: 90 }
      },
      {
        letter: 'B',
        text: "Faço uma pausa e reavalio.",
        level: 'high',
        scores: { comportamento: 85, disciplina: 80, gestao: 80 }
      },
      {
        letter: 'C',
        text: "Tento continuar com mais atenção.",
        level: 'low',
        scores: { comportamento: 35, disciplina: 35, gestao: 30 }
      },
      {
        letter: 'D',
        text: "Normalmente percebo somente depois.",
        level: 'critical',
        scores: { comportamento: 15, disciplina: 15, gestao: 20 }
      }
    ]
  },
  {
    id: 4,
    blockId: 1,
    dimension: 'comportamento',
    question: "Qual frase mais representa você?",
    options: [
      {
        letter: 'A',
        text: "“Uma boa decisão não precisa gerar um bom resultado imediatamente.”",
        level: 'high',
        scores: { comportamento: 100, probabilidade: 95, analise: 90 }
      },
      {
        letter: 'B',
        text: "“Se estou acertando, devo aproveitar o momento.”",
        level: 'low',
        scores: { comportamento: 35, gestao: 30, probabilidade: 30 }
      },
      {
        letter: 'C',
        text: "“Depois de vários erros, a chance de acertar aumenta.”",
        level: 'critical',
        scores: { probabilidade: 10, comportamento: 20, analise: 25 }
      },
      {
        letter: 'D',
        text: "“Minha intuição costuma me dizer quando é a hora.”",
        level: 'low',
        scores: { analise: 25, comportamento: 30, disciplina: 30 }
      }
    ]
  },
  {
    id: 5,
    blockId: 2,
    dimension: 'gestao',
    question: "Antes de iniciar uma atividade que envolve dinheiro e decisões, você define um limite?",
    options: [
      {
        letter: 'A',
        text: "Sempre, e respeito esse limite.",
        level: 'high',
        scores: { gestao: 100, disciplina: 95, comportamento: 90 }
      },
      {
        letter: 'B',
        text: "Defino, mas às vezes modifico.",
        level: 'medium',
        scores: { gestao: 65, disciplina: 55, comportamento: 60 }
      },
      {
        letter: 'C',
        text: "Tenho um valor aproximado em mente.",
        level: 'low',
        scores: { gestao: 35, disciplina: 30, comportamento: 35 }
      },
      {
        letter: 'D',
        text: "Decido conforme as coisas acontecem.",
        level: 'critical',
        scores: { gestao: 10, disciplina: 10, comportamento: 15 }
      }
    ]
  },
  {
    id: 6,
    blockId: 2,
    dimension: 'gestao',
    question: "Se você atingir o limite que havia determinado:",
    options: [
      {
        letter: 'A',
        text: "Encerro sem exceção.",
        level: 'high',
        scores: { gestao: 100, disciplina: 100, comportamento: 95 }
      },
      {
        letter: 'B',
        text: "Normalmente encerro.",
        level: 'medium',
        scores: { gestao: 70, disciplina: 65, comportamento: 70 }
      },
      {
        letter: 'C',
        text: "Analiso se vale a pena continuar.",
        level: 'low',
        scores: { gestao: 30, disciplina: 30, comportamento: 30 }
      },
      {
        letter: 'D',
        text: "Tento recuperar antes de parar.",
        level: 'critical',
        scores: { gestao: 10, disciplina: 10, comportamento: 10 }
      }
    ]
  },
  {
    id: 7,
    blockId: 2,
    dimension: 'gestao',
    question: "Você costuma registrar seus resultados e decisões?",
    options: [
      {
        letter: 'A',
        text: "Sim, de maneira organizada.",
        level: 'high',
        scores: { gestao: 100, disciplina: 100, analise: 90 }
      },
      {
        letter: 'B',
        text: "Registro apenas o que considero importante.",
        level: 'medium',
        scores: { gestao: 65, disciplina: 60, analise: 65 }
      },
      {
        letter: 'C',
        text: "Raramente.",
        level: 'low',
        scores: { gestao: 30, disciplina: 25, analise: 30 }
      },
      {
        letter: 'D',
        text: "Nunca.",
        level: 'critical',
        scores: { gestao: 10, disciplina: 10, analise: 15 }
      }
    ]
  },
  {
    id: 8,
    blockId: 2,
    dimension: 'gestao',
    question: "Qual dessas situações representa maior risco?",
    options: [
      {
        letter: 'A',
        text: "Aumentar a exposição para recuperar uma perda.",
        level: 'high',
        scores: { gestao: 100, comportamento: 95, probabilidade: 90 }
      },
      {
        letter: 'B',
        text: "Fazer várias análises antes de decidir.",
        level: 'critical',
        scores: { gestao: 25, analise: 20, comportamento: 30 }
      },
      {
        letter: 'C',
        text: "Encerrar antes do planejado.",
        level: 'low',
        scores: { gestao: 35, disciplina: 30, comportamento: 40 }
      },
      {
        letter: 'D',
        text: "Manter o mesmo valor durante toda a sessão.",
        level: 'critical',
        scores: { gestao: 20, analise: 25, probabilidade: 25 }
      }
    ]
  },
  {
    id: 9,
    blockId: 3,
    dimension: 'probabilidade',
    question: "Um determinado resultado não aparece há bastante tempo. Isso significa que:",
    options: [
      {
        letter: 'A',
        text: "Sua probabilidade necessariamente aumentou.",
        level: 'critical',
        scores: { probabilidade: 10, analise: 20 }
      },
      {
        letter: 'B',
        text: "Ele está “atrasado”.",
        level: 'low',
        scores: { probabilidade: 25, analise: 30 }
      },
      {
        letter: 'C',
        text: "O histórico, sozinho, não obriga o próximo resultado.",
        level: 'high',
        scores: { probabilidade: 100, analise: 95, comportamento: 90 }
      },
      {
        letter: 'D',
        text: "É um bom momento para aumentar a exposição nele.",
        level: 'critical',
        scores: { probabilidade: 5, gestao: 15, comportamento: 15 }
      }
    ]
  },
  {
    id: 10,
    blockId: 3,
    dimension: 'probabilidade',
    question: "Se um evento independente aconteceu três vezes consecutivas, o próximo evento:",
    options: [
      {
        letter: 'A',
        text: "Precisa ser diferente.",
        level: 'critical',
        scores: { probabilidade: 10, analise: 20 }
      },
      {
        letter: 'B',
        text: "Tem maior chance de repetir.",
        level: 'low',
        scores: { probabilidade: 25, analise: 30 }
      },
      {
        letter: 'C',
        text: "Continua obedecendo às probabilidades do próprio evento.",
        level: 'high',
        scores: { probabilidade: 100, analise: 95, comportamento: 90 }
      },
      {
        letter: 'D',
        text: "Depende do histórico anterior.",
        level: 'low',
        scores: { probabilidade: 25, analise: 25 }
      }
    ]
  },
  {
    id: 11,
    blockId: 3,
    dimension: 'probabilidade',
    question: "Ao analisar uma sequência de números, o mais importante é:",
    options: [
      {
        letter: 'A',
        text: "Separar padrão observado de certeza futura.",
        level: 'high',
        scores: { probabilidade: 100, analise: 95, disciplina: 90 }
      },
      {
        letter: 'B',
        text: "Encontrar o número que está atrasado.",
        level: 'critical',
        scores: { probabilidade: 15, analise: 20 }
      },
      {
        letter: 'C',
        text: "Identificar o que está “devendo aparecer”.",
        level: 'critical',
        scores: { probabilidade: 20, analise: 25 }
      },
      {
        letter: 'D',
        text: "Confiar no padrão que mais se repetiu.",
        level: 'low',
        scores: { probabilidade: 35, analise: 40 }
      }
    ]
  },
  {
    id: 12,
    blockId: 3,
    dimension: 'probabilidade',
    question: "Qual afirmação está mais correta?",
    options: [
      {
        letter: 'A',
        text: "Probabilidade prevê exatamente o próximo resultado.",
        level: 'critical',
        scores: { probabilidade: 10, analise: 15 }
      },
      {
        letter: 'B',
        text: "Probabilidade mede possibilidades, não certezas.",
        level: 'high',
        scores: { probabilidade: 100, analise: 95, comportamento: 90 }
      },
      {
        letter: 'C',
        text: "Uma sequência longa sempre precisa ser compensada.",
        level: 'critical',
        scores: { probabilidade: 15, analise: 20 }
      },
      {
        letter: 'D',
        text: "Quanto mais observamos, mais fácil fica prever o próximo evento.",
        level: 'low',
        scores: { probabilidade: 35, analise: 35 }
      }
    ]
  },
  {
    id: 13,
    blockId: 4,
    dimension: 'analise',
    question: "Quando diferentes critérios apontam para a mesma região ou conjunto de números, temos:",
    options: [
      {
        letter: 'A',
        text: "Uma confirmação absoluta.",
        level: 'low',
        scores: { analise: 35, probabilidade: 25 }
      },
      {
        letter: 'B',
        text: "Uma confluência de informações.",
        level: 'high',
        scores: { analise: 100, probabilidade: 95, gestao: 90 }
      },
      {
        letter: 'C',
        text: "Uma garantia estatística.",
        level: 'low',
        scores: { analise: 30, probabilidade: 20 }
      },
      {
        letter: 'D',
        text: "Uma compensação matemática.",
        level: 'critical',
        scores: { analise: 15, probabilidade: 15 }
      }
    ]
  },
  {
    id: 14,
    blockId: 4,
    dimension: 'analise',
    question: "Uma boa análise deve servir principalmente para:",
    options: [
      {
        letter: 'A',
        text: "Eliminar o risco.",
        level: 'critical',
        scores: { analise: 20, gestao: 25, probabilidade: 20 }
      },
      {
        letter: 'B',
        text: "Prever exatamente o próximo resultado.",
        level: 'low',
        scores: { analise: 30, probabilidade: 25 }
      },
      {
        letter: 'C',
        text: "Organizar critérios para uma tomada de decisão.",
        level: 'high',
        scores: { analise: 100, disciplina: 95, gestao: 90 }
      },
      {
        letter: 'D',
        text: "Encontrar uma sequência infalível.",
        level: 'critical',
        scores: { analise: 10, probabilidade: 10 }
      }
    ]
  },
  {
    id: 15,
    blockId: 4,
    dimension: 'analise',
    question: "Quando nenhum dos seus critérios de entrada está presente, a melhor decisão é:",
    options: [
      {
        letter: 'A',
        text: "Procurar um critério diferente.",
        level: 'low',
        scores: { analise: 35, disciplina: 30 }
      },
      {
        letter: 'B',
        text: "Reduzir a exposição e participar mesmo assim.",
        level: 'low',
        scores: { gestao: 40, disciplina: 30, analise: 35 }
      },
      {
        letter: 'C',
        text: "Aguardar.",
        level: 'high',
        scores: { disciplina: 100, analise: 95, gestao: 95, comportamento: 90 }
      },
      {
        letter: 'D',
        text: "Utilizar apenas a intuição.",
        level: 'critical',
        scores: { analise: 15, disciplina: 10, comportamento: 20 }
      }
    ]
  },
  {
    id: 16,
    blockId: 4,
    dimension: 'analise',
    question: "Dois critérios diferentes apontam para a mesma possibilidade. Isso significa que:",
    options: [
      {
        letter: 'A',
        text: "O resultado está garantido.",
        level: 'critical',
        scores: { analise: 15, probabilidade: 10, gestao: 15 }
      },
      {
        letter: 'B',
        text: "Existe uma confluência, mas o risco continua existindo.",
        level: 'high',
        scores: { analise: 100, probabilidade: 100, gestao: 95, comportamento: 90 }
      },
      {
        letter: 'C',
        text: "É necessário aumentar o valor.",
        level: 'low',
        scores: { gestao: 30, comportamento: 35, analise: 40 }
      },
      {
        letter: 'D',
        text: "A probabilidade passa a ser de 100%.",
        level: 'critical',
        scores: { probabilidade: 10, analise: 15 }
      }
    ]
  },
  {
    id: 17,
    blockId: 5,
    dimension: 'disciplina',
    question: "Você teve três decisões negativas consecutivas. O que faz?",
    options: [
      {
        letter: 'A',
        text: "Aumento para recuperar mais rapidamente.",
        level: 'critical',
        scores: { disciplina: 10, gestao: 10, comportamento: 10 }
      },
      {
        letter: 'B',
        text: "Repito exatamente a mesma decisão automaticamente.",
        level: 'low',
        scores: { analise: 35, disciplina: 35, comportamento: 40 }
      },
      {
        letter: 'C',
        text: "Paro, verifico meu estado emocional e reavalio meus critérios.",
        level: 'high',
        scores: { comportamento: 100, disciplina: 100, gestao: 95, analise: 90 }
      },
      {
        letter: 'D',
        text: "Mudo completamente meu método.",
        level: 'low',
        scores: { disciplina: 30, analise: 35, comportamento: 35 }
      }
    ]
  },
  {
    id: 18,
    blockId: 5,
    dimension: 'disciplina',
    question: "Você teve uma sequência muito positiva e está acima da sua meta. Qual decisão considera mais racional?",
    options: [
      {
        letter: 'A',
        text: "Aumentar porque estou em um bom momento.",
        level: 'critical',
        scores: { gestao: 15, disciplina: 15, comportamento: 15 }
      },
      {
        letter: 'B',
        text: "Continuar até aparecer o primeiro resultado negativo.",
        level: 'low',
        scores: { gestao: 35, disciplina: 35, comportamento: 35 }
      },
      {
        letter: 'C',
        text: "Respeitar o planejamento definido anteriormente.",
        level: 'high',
        scores: { gestao: 100, disciplina: 100, comportamento: 95 }
      },
      {
        letter: 'D',
        text: "Dobrar a meta.",
        level: 'low',
        scores: { gestao: 30, disciplina: 30, comportamento: 30 }
      }
    ]
  },
  {
    id: 19,
    blockId: 5,
    dimension: 'disciplina',
    question: "Você identifica uma possibilidade interessante, mas ela não atende completamente aos seus critérios. Você:",
    options: [
      {
        letter: 'A',
        text: "Aguarda.",
        level: 'high',
        scores: { disciplina: 100, analise: 90, gestao: 90 }
      },
      {
        letter: 'B',
        text: "Entra com valor menor.",
        level: 'medium',
        scores: { gestao: 65, analise: 60, disciplina: 55 }
      },
      {
        letter: 'C',
        text: "Entra porque pode não aparecer novamente.",
        level: 'critical',
        scores: { disciplina: 20, comportamento: 25, analise: 25 }
      },
      {
        letter: 'D',
        text: "Confia na experiência.",
        level: 'low',
        scores: { analise: 35, disciplina: 35, comportamento: 35 }
      }
    ]
  },
  {
    id: 20,
    blockId: 5,
    dimension: 'disciplina',
    question: "Qual dessas habilidades você considera mais importante para obter consistência?",
    options: [
      {
        letter: 'A',
        text: "Prever resultados.",
        level: 'low',
        scores: { probabilidade: 30, analise: 35, disciplina: 30 }
      },
      {
        letter: 'B',
        text: "Encontrar padrões rapidamente.",
        level: 'medium',
        scores: { analise: 65, probabilidade: 60, disciplina: 55 }
      },
      {
        letter: 'C',
        text: "Tomar boas decisões repetidamente.",
        level: 'high',
        scores: { disciplina: 100, comportamento: 100, analise: 95, gestao: 95 }
      },
      {
        letter: 'D',
        text: "Aproveitar os momentos de sorte.",
        level: 'critical',
        scores: { probabilidade: 10, comportamento: 10, disciplina: 10, gestao: 10 }
      }
    ]
  }
];
