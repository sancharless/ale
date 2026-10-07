/**
 * Componente LeadCapture
 * Captura executiva em estilo editorial de luxo
 */

export function renderLeadCapture({ onSubmitLead, privacyPolicyUrl = '#' }) {
  const container = document.createElement('section');
  container.className = 'container animate-fade-in';

  container.innerHTML = `
    <div class="lead-card-editorial glass-card">
      <div class="section-meta-label">
        <span class="label-num">05</span>
        <span>RELATÓRIO PRONTO PARA EMISSÃO</span>
      </div>

      <h2 class="lead-editorial-title">
        SEU DIAGNÓSTICO ESTÁ CONCLUÍDO.
      </h2>

      <p class="lead-editorial-subtitle">
        Informe seus dados para acessar a análise completa, com índice de consistência, matriz pentagonal e mapa tático de evolução.
      </p>

      <form id="lead-form" novalidate>
        <div class="form-group-editorial">
          <label class="form-editorial-label" for="lead-name">NOME COMPLETO</label>
          <input 
            type="text" 
            id="lead-name" 
            name="name" 
            class="form-editorial-input" 
            placeholder="Ex: Alexandre Silva" 
            required
            autocomplete="name"
          />
        </div>

        <div class="form-group-editorial">
          <label class="form-editorial-label" for="lead-email">E-MAIL PROFISSIONAL</label>
          <input 
            type="email" 
            id="lead-email" 
            name="email" 
            class="form-editorial-input" 
            placeholder="seuemail@exemplo.com" 
            required
            autocomplete="email"
          />
        </div>

        <div class="form-group-editorial">
          <label class="form-editorial-label" for="lead-phone">WHATSAPP / CELULAR</label>
          <input 
            type="tel" 
            id="lead-phone" 
            name="phone" 
            class="form-editorial-input" 
            placeholder="(11) 99999-9999" 
            required
            autocomplete="tel"
          />
        </div>

        <label class="form-checkbox-editorial">
          <input type="checkbox" id="lead-consent" name="consent" checked required />
          <span>
            Concordo em receber meu diagnóstico e conteúdos estratégicos. Consulte nossa 
            <a href="${privacyPolicyUrl}" target="_blank" rel="noopener noreferrer">Política de Privacidade</a>.
          </span>
        </label>

        <div id="lead-error-msg" class="lead-error-banner" style="display: none;"></div>

        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 0.5rem;">
          <span>VER MEU DIAGNÓSTICO</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </form>
    </div>
  `;

  const form = container.querySelector('#lead-form');
  const nameInput = container.querySelector('#lead-name');
  const emailInput = container.querySelector('#lead-email');
  const phoneInput = container.querySelector('#lead-phone');
  const consentInput = container.querySelector('#lead-consent');
  const errorMsg = container.querySelector('#lead-error-msg');

  // Máscara dinâmica (XX) XXXXX-XXXX
  phoneInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 11) val = val.substring(0, 11);
    if (val.length > 6) {
      val = `(${val.substring(0, 2)}) ${val.substring(2, 7)}-${val.substring(7)}`;
    } else if (val.length > 2) {
      val = `(${val.substring(0, 2)}) ${val.substring(2)}`;
    } else if (val.length > 0) {
      val = `(${val}`;
    }
    e.target.value = val;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorMsg.style.display = 'none';

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const consent = consentInput.checked;

    if (!name || name.length < 3) {
      showError('Informe seu nome completo.');
      nameInput.focus();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showError('Informe um e-mail válido.');
      emailInput.focus();
      return;
    }

    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      showError('Informe um número de WhatsApp válido com DDD.');
      phoneInput.focus();
      return;
    }

    if (!consent) {
      showError('É necessário consentir para visualizar o relatório.');
      consentInput.focus();
      return;
    }

    const leadData = {
      name,
      email,
      phone,
      consent,
      submittedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem('diagnostico_lead', JSON.stringify(leadData));
    } catch {
      // Ignora falha de localstorage
    }

    onSubmitLead(leadData);
  });

  function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.style.display = 'block';
  }

  return container;
}
