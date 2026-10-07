/**
 * Componente AnswerCard
 * Card de decisão editorial: box de letra em bronze/cobre, borda fina, seleção com glow âmbar e check minimalista
 */

export function renderAnswerCard({ option, isSelected, onSelect }) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = `answer-decision-card ${isSelected ? 'is-selected' : ''}`;
  card.setAttribute('role', 'radio');
  card.setAttribute('aria-checked', isSelected ? 'true' : 'false');

  card.innerHTML = `
    <div class="decision-letter-box">
      <span>[${option.letter}]</span>
    </div>

    <div class="decision-text-content">
      ${option.text}
    </div>

    <div class="decision-check-indicator" aria-hidden="true">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </div>
  `;

  card.addEventListener('click', (e) => {
    e.preventDefault();
    onSelect(option);
  });

  return card;
}
