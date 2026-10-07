import { QUESTIONS, BLOCKS } from './data/questions.js';
import { calculateAssessmentResults } from './data/scoring.js';
import { generateSmartInsights } from './data/insights.js';

import { renderNavbar } from './components/Navbar.js';
import { renderHero } from './components/Hero.js';
import { renderIntroAssessment } from './components/IntroAssessment.js';
import { renderProgressHeader } from './components/ProgressHeader.js';
import { renderQuestionCard } from './components/QuestionCard.js';
import { renderSectionTransition } from './components/SectionTransition.js';
import { renderProcessingScreen } from './components/ProcessingScreen.js';
import { renderLeadCapture } from './components/LeadCapture.js';
import { renderResultDashboard } from './components/ResultDashboard.js';

/**
 * Orquestrador da Aplicação Web de Diagnóstico de Perfil
 */
class AssessmentApp {
  constructor() {
    this.appEl = document.getElementById('app');

    // Estado da Aplicação
    this.state = {
      step: 'hero', // 'hero' | 'intro' | 'transition' | 'question' | 'processing' | 'lead' | 'result'
      currentQuestionIndex: 0,
      answers: {},
      leadData: null,
      results: null,
      insights: null,
      pendingBlock: null,
      shownBlocks: new Set([1])
    };

    this.init();
  }

  init() {
    this.render();
  }

  setState(partialState) {
    this.state = { ...this.state, ...partialState };
    this.render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  render() {
    if (!this.appEl) return;
    this.appEl.innerHTML = '';

    // Renderizar Navbar fixa com a logo oficial Alê em todas as telas
    const navbar = renderNavbar({
      onLogoClick: () => {
        if (this.state.step !== 'hero') {
          if (confirm('Deseja retornar ao início do diagnóstico?')) {
            this.handleRestart();
          }
        }
      }
    });
    this.appEl.appendChild(navbar);

    const { step } = this.state;

    switch (step) {
      case 'hero':
        this.renderHeroView();
        break;

      case 'intro':
        this.renderIntroView();
        break;

      case 'transition':
        this.renderTransitionView();
        break;

      case 'question':
        this.renderQuestionView();
        break;

      case 'processing':
        this.renderProcessingView();
        break;

      case 'lead':
        this.renderLeadView();
        break;

      case 'result':
        this.renderResultView();
        break;

      default:
        this.renderHeroView();
    }
  }

  // 1. Tela Inicial Hero
  renderHeroView() {
    const hero = renderHero({
      onStart: () => {
        this.setState({ step: 'intro' });
      }
    });
    const mainContainer = document.createElement('main');
    mainContainer.className = 'container';
    mainContainer.appendChild(hero);
    this.appEl.appendChild(mainContainer);
  }

  // 2. Tela de Introdução Reflexiva
  renderIntroView() {
    const intro = renderIntroAssessment({
      onProceed: () => {
        this.setState({ 
          step: 'question', 
          currentQuestionIndex: 0,
          shownBlocks: new Set([1])
        });
      }
    });
    this.appEl.appendChild(intro);
  }

  // 3. Transição entre Blocos
  renderTransitionView() {
    const block = this.state.pendingBlock || BLOCKS[0];
    const transition = renderSectionTransition({
      block,
      onContinue: () => {
        this.state.shownBlocks.add(block.id);
        this.setState({ step: 'question', pendingBlock: null });
      }
    });
    this.appEl.appendChild(transition);
  }

  // 4. Questão do Diagnóstico (Uma por tela)
  renderQuestionView() {
    const currentQ = QUESTIONS[this.state.currentQuestionIndex];
    if (!currentQ) {
      this.finishQuestions();
      return;
    }

    // Header com Barra de Progresso
    const header = renderProgressHeader({
      currentIndex: this.state.currentQuestionIndex,
      totalCount: QUESTIONS.length,
      onBack: () => this.handleBack()
    });

    const mainContainer = document.createElement('main');
    mainContainer.className = 'container question-main-container';

    // Card da Questão com alternativas
    const questionCard = renderQuestionCard({
      question: currentQ,
      selectedOptionLetter: this.state.answers[currentQ.id],
      onAnswer: (qId, optionLetter) => this.handleAnswer(qId, optionLetter)
    });

    mainContainer.appendChild(questionCard);

    this.appEl.appendChild(header);
    this.appEl.appendChild(mainContainer);
  }

  handleAnswer(questionId, optionLetter) {
    const updatedAnswers = {
      ...this.state.answers,
      [questionId]: optionLetter
    };

    const nextIndex = this.state.currentQuestionIndex + 1;

    // Se concluiu todas as 20 questões
    if (nextIndex >= QUESTIONS.length) {
      this.state.answers = updatedAnswers;
      this.finishQuestions();
      return;
    }

    // Verificar transição de bloco
    const nextQ = QUESTIONS[nextIndex];
    if (nextQ && !this.state.shownBlocks.has(nextQ.blockId)) {
      const blockToPresent = BLOCKS.find(b => b.id === nextQ.blockId);
      this.setState({
        answers: updatedAnswers,
        currentQuestionIndex: nextIndex,
        step: 'transition',
        pendingBlock: blockToPresent
      });
      return;
    }

    this.setState({
      answers: updatedAnswers,
      currentQuestionIndex: nextIndex
    });
  }

  handleBack() {
    if (this.state.currentQuestionIndex > 0) {
      this.setState({
        currentQuestionIndex: this.state.currentQuestionIndex - 1
      });
    } else {
      this.setState({ step: 'intro' });
    }
  }

  finishQuestions() {
    const results = calculateAssessmentResults(this.state.answers);
    const insights = generateSmartInsights(results.dimensions, results.overallScore);

    this.setState({
      results,
      insights,
      step: 'processing'
    });
  }

  // 5. Tela de Processamento
  renderProcessingView() {
    const processing = renderProcessingScreen({
      onComplete: () => {
        this.setState({ step: 'lead' });
      }
    });
    this.appEl.appendChild(processing);
  }

  // 6. Captura de Lead
  renderLeadView() {
    const leadCapture = renderLeadCapture({
      privacyPolicyUrl: '#politica-de-privacidade',
      onSubmitLead: (leadData) => {
        this.setState({
          leadData,
          step: 'result'
        });
      }
    });
    this.appEl.appendChild(leadCapture);
  }

  // 7. Dashboard Final de Resultados
  renderResultView() {
    const dashboard = renderResultDashboard({
      results: this.state.results,
      insights: this.state.insights,
      leadData: this.state.leadData,
      onRestart: () => this.handleRestart()
    });

    const mainContainer = document.createElement('main');
    mainContainer.className = 'container';
    mainContainer.appendChild(dashboard);

    this.appEl.appendChild(mainContainer);
  }

  handleRestart() {
    this.setState({
      step: 'hero',
      currentQuestionIndex: 0,
      answers: {},
      leadData: null,
      results: null,
      insights: null,
      pendingBlock: null,
      shownBlocks: new Set([1])
    });
  }
}

// Inicializar a aplicação ao carregar o DOM
document.addEventListener('DOMContentLoaded', () => {
  new AssessmentApp();
});
