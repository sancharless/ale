import { renderAnswerCard } from './AnswerCard.js';

/**
 * Componente QuestionCard
 * Exibe a questão atual com estilo editorial analítico e orquestra o auto-avanço suave
 */

export function renderQuestionCard({ question, selectedOptionLetter, onAnswer }) {
  const container = document.createElement('div');
  container.className = 'question-editorial-wrapper animate-fade-in';

  const titleEl = document.createElement('h2');
  titleEl.className = 'question-editorial-headline';
  titleEl.textContent = question.question;

  const answersGrid = document.createElement('div');
  answersGrid.className = 'answers-editorial-grid';
  answersGrid.setAttribute('role', 'radiogroup');

  let isHandling = false;

  question.options.forEach(option => {
    const isSelected = selectedOptionLetter === option.letter;
    const answerCard = renderAnswerCard({
      option,
      isSelected,
      onSelect: (chosen) => {
        if (isHandling) return;
        isHandling = true;

        // Destaque visual
        answersGrid.querySelectorAll('.answer-decision-card').forEach(el => el.classList.remove('is-selected'));
        answerCard.classList.add('is-selected');

        // Avanço suave para percepção da decisão
        setTimeout(() => {
          onAnswer(question.id, chosen.letter);
        }, 280);
      }
    });
    answersGrid.appendChild(answerCard);
  });

  container.appendChild(titleEl);
  container.appendChild(answersGrid);

  return container;
}
