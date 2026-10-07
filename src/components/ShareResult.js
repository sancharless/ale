/**
 * Componente ShareResult — Editorial
 * Modal de compartilhamento visual contendo apenas as métricas solicitadas sem dados sensíveis
 */

export function renderShareModal({ profile, overallScore, onClose }) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay animate-fade-in';

  const shareText = `Realizei meu Diagnóstico de Tomada de Decisão: meu perfil é ${profile.name} com Índice de Consistência ${overallScore}/100. Descubra também como você decide diante dos números!`;
  const shareUrl = window.location.href;

  overlay.innerHTML = `
    <div class="share-card-editorial animate-slide-up">
      <div class="card-brand">
        DIAGNÓSTICO DE PERFIL DECISÓRIO
      </div>

      <div style="font-family: 'Oswald', sans-serif; font-size: 0.8rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-dim); margin-bottom: 0.4rem;">
        MEU PERFIL
      </div>

      <h3 class="card-profile-title">
        ${profile.name}
      </h3>

      <div class="card-score-box">
        <div style="font-family: 'Oswald', sans-serif; font-size: 0.82rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--metal-gold-aged); margin-bottom: 0.35rem;">
          ÍNDICE DE CONSISTÊNCIA
        </div>
        <div class="card-score-num">
          ${overallScore}<span style="font-size: 1.4rem; color: var(--text-dim);">/100</span>
        </div>
      </div>

      <p class="card-invite-txt">
        “Descubra também o seu perfil.”
      </p>

      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <button id="btn-copy-share" class="btn btn-primary" type="button" style="width: 100%;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span id="copy-btn-text">COPIAR LINK E PERFIL</span>
        </button>

        <a 
          href="https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="btn btn-secondary"
          style="text-decoration: none; width: 100%;"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
          </svg>
          COMPARTILHAR NO WHATSAPP
        </a>

        <button id="btn-close-share" class="btn btn-ghost" type="button" style="width: 100%;">
          FECHAR
        </button>
      </div>
    </div>
  `;

  // Copiar para clipboard
  const copyBtn = overlay.querySelector('#btn-copy-share');
  const copyBtnText = overlay.querySelector('#copy-btn-text');
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      copyBtnText.textContent = 'COPIADO COM SUCESSO!';
      setTimeout(() => {
        copyBtnText.textContent = 'COPIAR LINK E PERFIL';
      }, 2500);
    } catch {
      copyBtnText.textContent = 'LINK PRONTO PARA ENVIO!';
    }
  });

  const closeBtn = overlay.querySelector('#btn-close-share');
  closeBtn.addEventListener('click', () => {
    overlay.remove();
    if (onClose) onClose();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
      if (onClose) onClose();
    }
  });

  return overlay;
}
