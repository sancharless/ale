/**
 * Componente Navbar — Header Global com Logo Oficial Alê
 */

export function renderNavbar({ onLogoClick }) {
  const nav = document.createElement('header');
  nav.className = 'global-navbar-editorial';

  nav.innerHTML = `
    <div class="navbar-container">
      <div class="navbar-brand" id="navbar-brand-link" style="cursor: pointer;" title="Voltar ao início">
        <div class="navbar-logo-wrap">
          <img 
            src="/images/logo-ale-oficial.png" 
            alt="Alê Logo Oficial" 
            class="navbar-logo-symbol"
          />
          <div class="navbar-logo-glint" aria-hidden="true"></div>
        </div>
        <div class="navbar-brand-divider"></div>
        <span class="navbar-brand-tag">ANÁLISE DE DECISÕES</span>
      </div>

      <div class="navbar-right-badge">
        <span class="nav-pulse-dot"></span>
        <span class="nav-status-txt">AVALIAÇÃO EXECUTIVA</span>
      </div>
    </div>
  `;

  const brandLink = nav.querySelector('#navbar-brand-link');
  if (brandLink && onLogoClick) {
    brandLink.addEventListener('click', onLogoClick);
  }

  return nav;
}
