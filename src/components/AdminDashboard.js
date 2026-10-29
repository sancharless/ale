import { supabaseClient } from '../services/supabaseClient.js';
import { QUESTIONS, DIMENSIONS } from '../data/questions.js';
import { PROFILES } from '../data/profiles.js';

/**
 * Componente AdminDashboard — Central Executiva de Cadastros e Diagnósticos
 * Acesso exclusivo via rota dedicada (/admin, /admin.html ou #admin) com autenticação por Login e Senha
 */

const ADMIN_AUTH_STORAGE_KEY = 'ale_admin_auth_session_v1';

const DEFAULT_VALID_USERS = ['admin', 'ale', 'admin@ale.com'];
const DEFAULT_VALID_PASSWORDS = ['ale2026', 'Ale@2026', 'admin2026'];

function isAdminAuthenticated() {
  try {
    return (
      sessionStorage.getItem(ADMIN_AUTH_STORAGE_KEY) === 'authenticated' ||
      localStorage.getItem(ADMIN_AUTH_STORAGE_KEY) === 'authenticated'
    );
  } catch {
    return false;
  }
}

function setAdminAuthenticated(remember = true) {
  try {
    sessionStorage.setItem(ADMIN_AUTH_STORAGE_KEY, 'authenticated');
    if (remember) {
      localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, 'authenticated');
    } else {
      localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
    }
  } catch {
    // Ignora falha de storage
  }
}

function clearAdminAuthentication() {
  try {
    sessionStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
    localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
  } catch {
    // Ignora falha de storage
  }
}

function verifyAdminCredentials(usernameInput, passwordInput) {
  const userClean = (usernameInput || '').trim().toLowerCase();
  const passClean = (passwordInput || '').trim();

  const envUser = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ADMIN_USER)
    ? import.meta.env.VITE_ADMIN_USER.trim().toLowerCase()
    : null;
  const envPass = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ADMIN_PASSWORD)
    ? import.meta.env.VITE_ADMIN_PASSWORD.trim()
    : null;

  const validUsers = envUser ? [envUser, ...DEFAULT_VALID_USERS] : DEFAULT_VALID_USERS;
  const validPasswords = envPass ? [envPass, ...DEFAULT_VALID_PASSWORDS] : DEFAULT_VALID_PASSWORDS;

  return validUsers.includes(userClean) && validPasswords.includes(passClean);
}

export function renderAdminDashboard() {
  const rootWrapper = document.createElement('div');
  rootWrapper.className = 'admin-page-wrapper animate-fade-in';

  function mountView() {
    rootWrapper.innerHTML = '';
    if (!isAdminAuthenticated()) {
      rootWrapper.appendChild(renderAdminLoginGate(() => {
        mountView();
      }));
    } else {
      rootWrapper.appendChild(renderAuthenticatedAdminPanel(() => {
        clearAdminAuthentication();
        mountView();
      }));
    }
  }

  mountView();
  return rootWrapper;
}

function renderAdminLoginGate(onSuccess) {
  const loginSection = document.createElement('section');
  loginSection.className = 'container admin-login-container animate-fade-in';

  loginSection.innerHTML = `
    <div class="admin-login-card glass-card">
      <div class="admin-login-logo-wrap">
        <img
          src="/images/logo-ale-oficial.png"
          alt="Alê — Logo Oficial"
          class="admin-login-logo"
        />
      </div>

      <div class="admin-login-badge">
        <span class="admin-brand-dot"></span>
        <span>ÁREA RESTRITA • ADMINISTRAÇÃO ALÊ</span>
      </div>

      <h1 class="admin-login-title">
        PAINEL DE <span class="text-highlight-copper">CADASTROS</span>
      </h1>

      <p class="admin-login-subtitle">
        Insira suas credenciais de administrador para acessar os dados e diagnósticos dos alunos.
      </p>

      <form id="admin-login-form" class="admin-login-form" novalidate>
        <div class="form-group-editorial">
          <label class="form-editorial-label" for="admin-login-user">LOGIN / USUÁRIO</label>
          <input
            type="text"
            id="admin-login-user"
            name="username"
            class="form-editorial-input"
            placeholder="Digite seu usuário (ex: admin)"
            autocomplete="username"
            required
          />
        </div>

        <div class="form-group-editorial">
          <label class="form-editorial-label" for="admin-login-pass">SENHA DE ACESSO</label>
          <div class="admin-password-field-wrap">
            <input
              type="password"
              id="admin-login-pass"
              name="password"
              class="form-editorial-input admin-password-input"
              placeholder="Digite sua senha"
              autocomplete="current-password"
              required
            />
            <button
              type="button"
              id="btn-toggle-pass"
              class="admin-toggle-pass-btn"
              aria-label="Mostrar ou ocultar senha"
              title="Mostrar/ocultar senha"
            >
              VER
            </button>
          </div>
        </div>

        <label class="form-checkbox-editorial" style="margin-top: 0.25rem;">
          <input type="checkbox" id="admin-login-remember" checked />
          <span>Manter conectado neste dispositivo</span>
        </label>

        <div id="admin-login-error" class="lead-error-banner" style="display: none;"></div>

        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 0.5rem;">
          <span>ACESSAR PAINEL ADMIN</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </button>
      </form>
    </div>
  `;

  const form = loginSection.querySelector('#admin-login-form');
  const userInput = loginSection.querySelector('#admin-login-user');
  const passInput = loginSection.querySelector('#admin-login-pass');
  const rememberInput = loginSection.querySelector('#admin-login-remember');
  const togglePassBtn = loginSection.querySelector('#btn-toggle-pass');
  const errorBanner = loginSection.querySelector('#admin-login-error');

  if (togglePassBtn && passInput) {
    togglePassBtn.addEventListener('click', () => {
      const isHidden = passInput.type === 'password';
      passInput.type = isHidden ? 'text' : 'password';
      togglePassBtn.textContent = isHidden ? 'OCULTAR' : 'VER';
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      errorBanner.style.display = 'none';

      const username = userInput.value;
      const password = passInput.value;

      if (!username.trim() || !password.trim()) {
        errorBanner.textContent = 'Preencha o usuário e a senha para continuar.';
        errorBanner.style.display = 'block';
        return;
      }

      if (!verifyAdminCredentials(username, password)) {
        errorBanner.textContent = 'Usuário ou senha inválidos. Verifique suas credenciais.';
        errorBanner.style.display = 'block';
        passInput.value = '';
        passInput.focus();
        return;
      }

      setAdminAuthenticated(Boolean(rememberInput?.checked));
      onSuccess();
    });
  }

  setTimeout(() => {
    userInput?.focus();
  }, 80);

  return loginSection;
}

function renderAuthenticatedAdminPanel(onLogout) {
  const wrapper = document.createElement('div');

  const state = {
    loading: true,
    connected: false,
    errorMessage: null,
    lastSyncAt: null,
    submissions: [],
    searchQuery: '',
    profileFilter: 'ALL',
    sortBy: 'newest',
    selectedSubmission: null
  };

  wrapper.innerHTML = `
    <div class="container admin-main-container">
      <!-- Cabeçalho Executivo do Painel Admin -->
      <header class="admin-hero-header">
        <div class="admin-hero-top-bar">
          <div class="admin-brand-pill">
            <span class="admin-brand-dot"></span>
            <span>ACESSO ADMINISTRATIVO • GESTÃO DE ALUNOS ALÊ</span>
          </div>

          <div class="admin-top-status-group">
            <div class="admin-connection-status" id="admin-conn-badge">
              <span class="conn-indicator is-loading" id="admin-conn-dot"></span>
              <span id="admin-conn-text">Conectando ao Supabase...</span>
            </div>

            <button type="button" id="btn-admin-logout" class="btn-admin-logout" title="Encerrar sessão administrativa">
              <span>SAIR</span>
            </button>
          </div>
        </div>

        <div class="admin-hero-title-row">
          <div>
            <h1 class="admin-main-title">
              CENTRAL DE <span class="text-highlight-copper">CADASTROS</span> & DIAGNÓSTICOS
            </h1>
            <p class="admin-main-subtitle">
              Acompanhamento em tempo real dos alunos avaliados, índices de consistência, respostas individuais e contato direto.
            </p>
          </div>

          <div class="admin-header-actions">
            <button type="button" id="btn-admin-refresh" class="btn btn-secondary admin-action-btn">
              <svg id="icon-refresh-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 4 23 10 17 10"></polyline>
                <polyline points="1 20 1 14 7 14"></polyline>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
              <span id="label-admin-refresh">ATUALIZAR</span>
            </button>

            <button type="button" id="btn-admin-export" class="btn btn-primary admin-action-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>EXPORTAR CSV / EXCEL</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Cards de KPIs Estratégicos -->
      <section class="admin-kpi-grid" id="admin-kpi-grid">
        <div class="admin-kpi-card">
          <div class="admin-kpi-meta">01 • BASE DE LEADS</div>
          <div class="admin-kpi-value" id="kpi-total-leads">--</div>
          <div class="admin-kpi-sub" id="kpi-recent-leads">Carregando cadastros...</div>
        </div>

        <div class="admin-kpi-card">
          <div class="admin-kpi-meta">02 • ÍNDICE MÉDIO GERAL</div>
          <div class="admin-kpi-value" id="kpi-avg-score">--<span class="kpi-unit">/100</span></div>
          <div class="admin-kpi-sub" id="kpi-avg-score-sub">Maturidade média da turma</div>
        </div>

        <div class="admin-kpi-card">
          <div class="admin-kpi-meta">03 • PERFIL PREDOMINANTE</div>
          <div class="admin-kpi-value admin-kpi-value-text" id="kpi-top-profile">--</div>
          <div class="admin-kpi-sub" id="kpi-top-profile-sub">Maior concentração atual</div>
        </div>

        <div class="admin-kpi-card">
          <div class="admin-kpi-meta">04 • GARGALO DA TURMA</div>
          <div class="admin-kpi-value admin-kpi-value-text" id="kpi-weakest-dim">--</div>
          <div class="admin-kpi-sub" id="kpi-weakest-dim-sub">Dimensão de menor média</div>
        </div>
      </section>

      <!-- Barra de Distribuição por Nível de Perfil (Clicável para Filtrar) -->
      <section class="admin-distribution-card">
        <div class="admin-section-header-inline">
          <span class="admin-section-tag">DISTRIBUIÇÃO POR PERFIL DECISÓRIO (CLIQUE PARA FILTRAR)</span>
          <span class="admin-sync-timestamp" id="admin-last-sync-label"></span>
        </div>
        <div class="admin-profile-pills-row" id="admin-profile-pills"></div>
      </section>

      <!-- Barra de Ferramentas: Busca, Filtro de Perfil e Ordenação -->
      <section class="admin-toolbar-card">
        <div class="admin-search-box">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="search"
            id="admin-search-input"
            class="admin-search-input"
            placeholder="Buscar aluno por nome, e-mail ou WhatsApp..."
            autocomplete="off"
          />
        </div>

        <div class="admin-filters-group">
          <select id="admin-filter-profile" class="admin-select-control" aria-label="Filtrar por perfil">
            <option value="ALL">Todos os Perfis (5 Níveis)</option>
            ${PROFILES.map(p => `<option value="${p.id}">${p.code} — ${p.name}</option>`).join('')}
          </select>

          <select id="admin-sort-by" class="admin-select-control" aria-label="Ordenar cadastros">
            <option value="newest">Mais recentes primeiro</option>
            <option value="oldest">Mais antigos primeiro</option>
            <option value="score_desc">Maior pontuação (100 → 0)</option>
            <option value="score_asc">Menor pontuação (0 → 100)</option>
            <option value="name_asc">Nome (A → Z)</option>
          </select>
        </div>
      </section>

      <!-- Contagem de Resultados e Tabela / Lista de Alunos -->
      <section class="admin-table-section">
        <div class="admin-results-bar">
          <span id="admin-results-count">Carregando registros...</span>
        </div>

        <div id="admin-submissions-container" class="admin-submissions-container"></div>
      </section>
    </div>

    <!-- Container para Modal de Dossiê Individual do Aluno -->
    <div id="admin-modal-root"></div>
  `;

  // Referências DOM
  const connDot = wrapper.querySelector('#admin-conn-dot');
  const connText = wrapper.querySelector('#admin-conn-text');
  const lastSyncLabel = wrapper.querySelector('#admin-last-sync-label');
  const btnRefresh = wrapper.querySelector('#btn-admin-refresh');
  const labelRefresh = wrapper.querySelector('#label-admin-refresh');
  const btnExport = wrapper.querySelector('#btn-admin-export');
  const btnLogout = wrapper.querySelector('#btn-admin-logout');
  const searchInput = wrapper.querySelector('#admin-search-input');
  const profileSelect = wrapper.querySelector('#admin-filter-profile');
  const sortSelect = wrapper.querySelector('#admin-sort-by');
  const profilePillsEl = wrapper.querySelector('#admin-profile-pills');
  const submissionsContainer = wrapper.querySelector('#admin-submissions-container');
  const resultsCountEl = wrapper.querySelector('#admin-results-count');
  const modalRoot = wrapper.querySelector('#admin-modal-root');

  // KPIs DOM
  const kpiTotalLeads = wrapper.querySelector('#kpi-total-leads');
  const kpiRecentLeads = wrapper.querySelector('#kpi-recent-leads');
  const kpiAvgScore = wrapper.querySelector('#kpi-avg-score');
  const kpiAvgScoreSub = wrapper.querySelector('#kpi-avg-score-sub');
  const kpiTopProfile = wrapper.querySelector('#kpi-top-profile');
  const kpiTopProfileSub = wrapper.querySelector('#kpi-top-profile-sub');
  const kpiWeakestDim = wrapper.querySelector('#kpi-weakest-dim');
  const kpiWeakestDimSub = wrapper.querySelector('#kpi-weakest-dim-sub');

  // Carregar dados do Supabase
  async function loadSubmissions() {
    state.loading = true;
    if (btnRefresh) btnRefresh.disabled = true;
    if (labelRefresh) labelRefresh.textContent = 'SINCRONIZANDO...';
    if (connDot) connDot.className = 'conn-indicator is-loading';
    if (connText) connText.textContent = 'Sincronizando com Supabase...';

    renderList();

    const response = await supabaseClient.fetchDiagnosticSubmissions(1000);
    state.loading = false;
    state.connected = response.success;
    state.errorMessage = response.success ? null : response.message;
    state.submissions = Array.isArray(response.data) ? response.data : [];
    state.lastSyncAt = new Date();

    if (btnRefresh) btnRefresh.disabled = false;
    if (labelRefresh) labelRefresh.textContent = 'ATUALIZAR';

    if (state.connected) {
      connDot.className = 'conn-indicator is-online';
      connText.textContent = 'SUPABASE CONECTADO • TEMPO REAL';
    } else {
      connDot.className = 'conn-indicator is-offline';
      connText.textContent = 'CONTINGÊNCIA LOCAL • VERIFICAR TABELA';
    }

    if (lastSyncLabel && state.lastSyncAt) {
      lastSyncLabel.textContent = `Última atualização: ${state.lastSyncAt.toLocaleTimeString('pt-BR')}`;
    }

    updateKPIsAndDistribution();
    renderList();
  }

  function updateKPIsAndDistribution() {
    const list = state.submissions;
    const total = list.length;

    kpiTotalLeads.textContent = String(total);

    if (total === 0) {
      kpiRecentLeads.textContent = 'Aguardando o primeiro cadastro';
      kpiAvgScore.innerHTML = `0<span class="kpi-unit">/100</span>`;
      kpiAvgScoreSub.textContent = 'Sem avaliações registradas';
      kpiTopProfile.textContent = '—';
      kpiTopProfileSub.textContent = 'Sem dados suficientes';
      kpiWeakestDim.textContent = '—';
      kpiWeakestDimSub.textContent = 'Sem dados suficientes';
      renderProfilePills({});
      return;
    }

    // Cadastros nas últimas 24h
    const now = Date.now();
    const last24hCount = list.filter(item => {
      const dt = new Date(item.created_at || item.submitted_at || 0).getTime();
      return now - dt <= 24 * 60 * 60 * 1000;
    }).length;
    kpiRecentLeads.textContent = `+${last24hCount} nas últimas 24 horas`;

    // Média geral
    const sumScore = list.reduce((acc, item) => acc + (Number(item.overall_score) || 0), 0);
    const avgScore = Math.round(sumScore / total);
    kpiAvgScore.innerHTML = `${avgScore}<span class="kpi-unit">/100</span>`;
    kpiAvgScoreSub.textContent = `Baseado em ${total} ${total === 1 ? 'diagnóstico' : 'diagnósticos'}`;

    // Contagem por perfil
    const profileCounts = {};
    list.forEach(item => {
      const pid = item.profile_id || 'indefinido';
      profileCounts[pid] = (profileCounts[pid] || 0) + 1;
    });

    let topProfileId = null;
    let topProfileCount = 0;
    Object.entries(profileCounts).forEach(([pid, count]) => {
      if (count > topProfileCount) {
        topProfileCount = count;
        topProfileId = pid;
      }
    });

    const foundProfile = PROFILES.find(p => p.id === topProfileId);
    const topPct = Math.round((topProfileCount / total) * 100);
    kpiTopProfile.textContent = foundProfile ? foundProfile.name.replace('PERFIL ', '') : (topProfileId || '—');
    kpiTopProfileSub.textContent = `${topProfileCount} ${topProfileCount === 1 ? 'aluno' : 'alunos'} (${topPct}% do total)`;

    // Dimensão com menor média
    const dimSums = {
      comportamento: 0,
      gestao: 0,
      probabilidade: 0,
      analise: 0,
      disciplina: 0
    };

    list.forEach(item => {
      const dims = item.dimensions || {};
      dimSums.comportamento += Number(item.score_comportamento ?? dims.comportamento ?? 0);
      dimSums.gestao += Number(item.score_gestao ?? dims.gestao ?? 0);
      dimSums.probabilidade += Number(item.score_probabilidade ?? dims.probabilidade ?? 0);
      dimSums.analise += Number(item.score_analise ?? dims.analise ?? 0);
      dimSums.disciplina += Number(item.score_disciplina ?? dims.disciplina ?? 0);
    });

    const dimAvgs = Object.entries(dimSums).map(([key, sum]) => ({
      key,
      name: DIMENSIONS[key]?.name || key,
      avg: Math.round(sum / total)
    })).sort((a, b) => a.avg - b.avg);

    const weakest = dimAvgs[0];
    kpiWeakestDim.textContent = weakest ? weakest.name.toUpperCase() : '—';
    kpiWeakestDimSub.textContent = weakest ? `Média geral de ${weakest.avg}% nesta dimensão` : '';

    renderProfilePills(profileCounts);
  }

  function renderProfilePills(profileCounts) {
    const total = state.submissions.length || 1;

    const allActive = state.profileFilter === 'ALL' ? 'is-active' : '';
    let html = `
      <button type="button" class="admin-profile-pill ${allActive}" data-profile-filter="ALL">
        <span class="pill-code">TODOS</span>
        <span class="pill-name">Base Completa</span>
        <span class="pill-count">${state.submissions.length}</span>
      </button>
    `;

    PROFILES.forEach(prof => {
      const count = profileCounts[prof.id] || 0;
      const pct = state.submissions.length > 0 ? Math.round((count / total) * 100) : 0;
      const activeClass = state.profileFilter === prof.id ? 'is-active' : '';

      html += `
        <button type="button" class="admin-profile-pill ${activeClass}" data-profile-filter="${prof.id}">
          <span class="pill-code">${prof.code}</span>
          <span class="pill-name">${prof.name.replace('PERFIL ', '')}</span>
          <span class="pill-count">${count} <small>(${pct}%)</small></span>
        </button>
      `;
    });

    profilePillsEl.innerHTML = html;

    profilePillsEl.querySelectorAll('.admin-profile-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.getAttribute('data-profile-filter') || 'ALL';
        state.profileFilter = val;
        if (profileSelect) profileSelect.value = val;
        renderProfilePills(profileCounts);
        renderList();
      });
    });
  }

  function getFilteredAndSortedSubmissions() {
    const q = state.searchQuery.trim().toLowerCase();

    const filtered = state.submissions.filter(item => {
      if (state.profileFilter !== 'ALL' && item.profile_id !== state.profileFilter) {
        return false;
      }

      if (!q) return true;

      const nameMatch = (item.name || '').toLowerCase().includes(q);
      const emailMatch = (item.email || '').toLowerCase().includes(q);
      const smsVal = getSmsPhone(item);
      const phoneMatch =
        (item.phone || '').toLowerCase().includes(q) ||
        (item.phone_digits || '').includes(q) ||
        smsVal.toLowerCase().includes(q) ||
        smsVal.replace(/\D/g, '').includes(q);
      const profileMatch = (item.profile_name || '').toLowerCase().includes(q);

      return nameMatch || emailMatch || phoneMatch || profileMatch;
    });

    filtered.sort((a, b) => {
      if (state.sortBy === 'oldest') {
        return new Date(a.created_at || a.submitted_at || 0) - new Date(b.created_at || b.submitted_at || 0);
      }
      if (state.sortBy === 'score_desc') {
        return (Number(b.overall_score) || 0) - (Number(a.overall_score) || 0);
      }
      if (state.sortBy === 'score_asc') {
        return (Number(a.overall_score) || 0) - (Number(b.overall_score) || 0);
      }
      if (state.sortBy === 'name_asc') {
        return (a.name || '').localeCompare(b.name || '', 'pt-BR');
      }
      // newest (default)
      return new Date(b.created_at || b.submitted_at || 0) - new Date(a.created_at || a.submitted_at || 0);
    });

    return filtered;
  }

  function renderList() {
    if (state.loading && state.submissions.length === 0) {
      resultsCountEl.textContent = 'Buscando cadastros no banco de dados...';
      submissionsContainer.innerHTML = `
        <div class="admin-empty-state">
          <div class="admin-spinner"></div>
          <p>Sincronizando cadastros dos alunos com o Supabase...</p>
        </div>
      `;
      return;
    }

    const filtered = getFilteredAndSortedSubmissions();
    resultsCountEl.textContent = `Exibindo ${filtered.length} de ${state.submissions.length} ${state.submissions.length === 1 ? 'aluno cadastrado' : 'alunos cadastrados'}`;

    if (filtered.length === 0) {
      submissionsContainer.innerHTML = `
        <div class="admin-empty-state">
          <div class="admin-empty-icon">✦</div>
          <h3>NENHUM CADASTRO ENCONTRADO</h3>
          <p>
            ${state.submissions.length === 0
              ? 'Assim que o primeiro aluno concluir o diagnóstico e preencher o formulário, os dados aparecerão aqui automaticamente.'
              : 'Nenhum aluno corresponde aos filtros de busca selecionados.'}
          </p>
        </div>
      `;
      return;
    }

    const rowsHtml = filtered.map((item, idx) => {
      const score = Number(item.overall_score) || 0;
      const dims = item.dimensions || {};
      const cScore = Number(item.score_comportamento ?? dims.comportamento ?? 0);
      const gScore = Number(item.score_gestao ?? dims.gestao ?? 0);
      const pScore = Number(item.score_probabilidade ?? dims.probabilidade ?? 0);
      const aScore = Number(item.score_analise ?? dims.analise ?? 0);
      const dScore = Number(item.score_disciplina ?? dims.disciplina ?? 0);

      const dateStr = formatDateTime(item.created_at || item.submitted_at);
      const waUrl = buildWhatsAppLink(item);
      const profileCode = item.profile_code || 'PERFIL';
      const profileName = item.profile_name || 'NÃO IDENTIFICADO';

      return `
        <article class="admin-student-row" data-row-index="${idx}">
          <!-- Coluna 1: Identificação do Aluno e Data -->
          <div class="student-col-main">
            <div class="student-avatar-circle">${getInitials(item.name)}</div>
            <div class="student-info-text">
              <div class="student-name-line">
                <h4 class="student-name">${escapeHtml(item.name || 'Aluno sem nome')}</h4>
                <span class="student-date-badge">${dateStr}</span>
              </div>
              <div class="student-contacts-line">
                <span class="student-contact-item" title="E-mail do aluno">
                  ✉ ${escapeHtml(item.email || '—')}
                </span>
                <span class="student-contact-sep">•</span>
                <span class="student-contact-item" title="WhatsApp">
                  ✆ WA: ${escapeHtml(item.phone || '—')}
                </span>
                ${getSmsPhone(item) ? `
                  <span class="student-contact-sep">•</span>
                  <span class="student-contact-item" title="Celular SMS">
                    SMS: ${escapeHtml(getSmsPhone(item))}
                  </span>
                ` : ''}
              </div>
            </div>
          </div>

          <!-- Coluna 2: Perfil & Índice de Consistência -->
          <div class="student-col-profile">
            <div class="student-profile-badge">
              <span class="badge-level-code">${escapeHtml(profileCode)}</span>
              <span class="badge-level-name">${escapeHtml(profileName)}</span>
            </div>
            <div class="student-score-bar-wrap">
              <div class="student-score-label">
                <span>ÍNDICE DE CONSISTÊNCIA</span>
                <strong>${score}/100</strong>
              </div>
              <div class="student-score-track">
                <div class="student-score-fill" style="width: ${Math.min(100, Math.max(0, score))}%;"></div>
              </div>
            </div>
          </div>

          <!-- Coluna 3: Mini-Matriz das 5 Dimensões -->
          <div class="student-col-dims" title="Pontuação nas 5 Dimensões Estratégicas">
            <div class="mini-dim-chip">
              <span class="mini-dim-lbl">COMP</span>
              <span class="mini-dim-val">${cScore}%</span>
            </div>
            <div class="mini-dim-chip">
              <span class="mini-dim-lbl">GEST</span>
              <span class="mini-dim-val">${gScore}%</span>
            </div>
            <div class="mini-dim-chip">
              <span class="mini-dim-lbl">PROB</span>
              <span class="mini-dim-val">${pScore}%</span>
            </div>
            <div class="mini-dim-chip">
              <span class="mini-dim-lbl">ANÁL</span>
              <span class="mini-dim-val">${aScore}%</span>
            </div>
            <div class="mini-dim-chip">
              <span class="mini-dim-lbl">DISC</span>
              <span class="mini-dim-val">${dScore}%</span>
            </div>
          </div>

          <!-- Coluna 4: Ações Rápidas (WhatsApp + Ver Ficha Completa) -->
          <div class="student-col-actions">
            ${waUrl ? `
              <a
                href="${waUrl}"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-student-whatsapp"
                title="Chamar aluno no WhatsApp"
              >
                <span>WHATSAPP</span>
              </a>
            ` : ''}

            <button
              type="button"
              class="btn-student-detail"
              data-open-detail="${idx}"
            >
              <span>VER FICHA</span>
            </button>
          </div>
        </article>
      `;
    }).join('');

    submissionsContainer.innerHTML = `<div class="admin-students-stack">${rowsHtml}</div>`;

    submissionsContainer.querySelectorAll('[data-open-detail]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-open-detail'));
        const chosen = filtered[idx];
        if (chosen) {
          openStudentModal(chosen);
        }
      });
    });
  }

  // Modal com a Ficha Completa do Aluno (Scores, Insights e todas as 20 respostas)
  function openStudentModal(item) {
    state.selectedSubmission = item;
    const score = Number(item.overall_score) || 0;
    const dims = item.dimensions || {};
    const dimEntries = [
      { key: 'comportamento', label: 'Comportamento & Autocontrole', val: Number(item.score_comportamento ?? dims.comportamento ?? 0) },
      { key: 'gestao', label: 'Gestão de Risco & Limites', val: Number(item.score_gestao ?? dims.gestao ?? 0) },
      { key: 'probabilidade', label: 'Probabilidade & Aleatoriedade', val: Number(item.score_probabilidade ?? dims.probabilidade ?? 0) },
      { key: 'analise', label: 'Análise & Critérios Decisórios', val: Number(item.score_analise ?? dims.analise ?? 0) },
      { key: 'disciplina', label: 'Disciplina & Execução', val: Number(item.score_disciplina ?? dims.disciplina ?? 0) }
    ];

    const insights = item.insights || {};
    const detailedAnswers = resolveDetailedAnswers(item);
    const waUrl = buildWhatsAppLink(item);

    modalRoot.innerHTML = `
      <div class="admin-modal-overlay animate-fade-in" id="admin-detail-overlay" role="dialog" aria-modal="true">
        <div class="admin-modal-dialog">
          <!-- Topo do Modal -->
          <div class="admin-modal-header">
            <div>
              <div class="admin-modal-tag">DOSSIÊ INDIVIDUAL DO ALUNO • ${formatDateTime(item.created_at || item.submitted_at)}</div>
              <h2 class="admin-modal-student-name">${escapeHtml(item.name || 'Aluno')}</h2>
              <div class="admin-modal-contacts">
                <span><strong>E-mail:</strong> ${escapeHtml(item.email || '—')}</span>
                <span>•</span>
                <span><strong>WhatsApp:</strong> ${escapeHtml(item.phone || '—')}</span>
                <span>•</span>
                <span><strong>Celular (SMS):</strong> ${escapeHtml(getSmsPhone(item) || item.phone || '—')}</span>
              </div>
            </div>

            <div class="admin-modal-top-actions">
              ${waUrl ? `
                <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary admin-modal-wa-btn">
                  <span>CHAMAR NO WHATSAPP</span>
                </a>
              ` : ''}
              <button type="button" id="btn-close-student-modal" class="admin-modal-close-btn" aria-label="Fechar ficha">
                ✕
              </button>
            </div>
          </div>

          <div class="admin-modal-body">
            <!-- Resumo do Perfil e Índice Geral -->
            <div class="admin-modal-summary-grid">
              <div class="admin-modal-score-card">
                <div class="modal-score-meta">${escapeHtml(item.profile_code || 'DIAGNÓSTICO')}</div>
                <div class="modal-score-profile">${escapeHtml(item.profile_name || 'PERFIL IDENTIFICADO')}</div>
                <div class="modal-score-big">${score}<span>/100</span></div>
                <div class="modal-score-caption">ÍNDICE DE CONSISTÊNCIA</div>
              </div>

              <div class="admin-modal-dims-card">
                <div class="modal-card-title">DESEMPENHO NAS 5 DIMENSÕES ESTRATÉGICAS</div>
                <div class="modal-dims-bars">
                  ${dimEntries.map(d => `
                    <div class="modal-dim-row">
                      <div class="modal-dim-row-top">
                        <span>${d.label}</span>
                        <strong>${d.val}%</strong>
                      </div>
                      <div class="modal-dim-track">
                        <div class="modal-dim-fill" style="width: ${Math.min(100, Math.max(0, d.val))}%;"></div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>

            <!-- Insights Gerados para o Aluno -->
            ${insights.strongPoint || insights.evolutionPoint || insights.attentionPoint ? `
              <div class="admin-modal-insights-grid">
                ${insights.strongPoint ? `
                  <div class="admin-modal-insight-box">
                    <span class="modal-insight-tag">01 • PONTO FORTE</span>
                    <h4>${escapeHtml(insights.strongPoint.title || '')}</h4>
                    <p>${escapeHtml(insights.strongPoint.description || '')}</p>
                  </div>
                ` : ''}
                ${insights.evolutionPoint ? `
                  <div class="admin-modal-insight-box">
                    <span class="modal-insight-tag">02 • PONTO DE EVOLUÇÃO</span>
                    <h4>${escapeHtml(insights.evolutionPoint.title || '')}</h4>
                    <p>${escapeHtml(insights.evolutionPoint.description || '')}</p>
                  </div>
                ` : ''}
                ${insights.attentionPoint ? `
                  <div class="admin-modal-insight-box">
                    <span class="modal-insight-tag">03 • ATENÇÃO OPERACIONAL</span>
                    <h4>${escapeHtml(insights.attentionPoint.title || '')}</h4>
                    <p>${escapeHtml(insights.attentionPoint.description || '')}</p>
                  </div>
                ` : ''}
              </div>
            ` : ''}

            <!-- Respostas Detalhadas das 20 Questões -->
            <div class="admin-modal-answers-section">
              <div class="modal-card-title">RESPOSTAS INDIVIDUAIS NAS 20 QUESTÕES DO DIAGNÓSTICO</div>
              <div class="modal-answers-list">
                ${detailedAnswers.map(ans => `
                  <div class="modal-answer-item">
                    <div class="modal-answer-q">
                      <span class="modal-answer-qnum">Q${String(ans.questionId).padStart(2, '0')}</span>
                      <span class="modal-answer-qtext">${escapeHtml(ans.question)}</span>
                    </div>
                    <div class="modal-answer-chosen">
                      <span class="modal-answer-letter">[${escapeHtml(ans.selectedLetter || '—')}]</span>
                      <span class="modal-answer-text">${escapeHtml(ans.selectedText || 'Não respondida')}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Rodapé do Modal -->
          <div class="admin-modal-footer">
            ${item.id ? `
              <button type="button" id="btn-delete-submission" class="btn-admin-danger">
                EXCLUIR REGISTRO
              </button>
            ` : '<div></div>'}
            <button type="button" id="btn-close-modal-footer" class="btn btn-secondary">
              FECHAR FICHA
            </button>
          </div>
        </div>
      </div>
    `;

    const overlay = modalRoot.querySelector('#admin-detail-overlay');
    const closeBtn1 = modalRoot.querySelector('#btn-close-student-modal');
    const closeBtn2 = modalRoot.querySelector('#btn-close-modal-footer');
    const deleteBtn = modalRoot.querySelector('#btn-delete-submission');

    const closeModal = () => {
      modalRoot.innerHTML = '';
      state.selectedSubmission = null;
    };

    if (closeBtn1) closeBtn1.addEventListener('click', closeModal);
    if (closeBtn2) closeBtn2.addEventListener('click', closeModal);
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
      });
    }

    if (deleteBtn && item.id) {
      deleteBtn.addEventListener('click', async () => {
        if (!confirm(`Deseja realmente excluir o cadastro de "${item.name}"?`)) return;
        deleteBtn.disabled = true;
        deleteBtn.textContent = 'EXCLUINDO...';
        const ok = await supabaseClient.deleteDiagnosticSubmission(item.id);
        if (ok) {
          state.submissions = state.submissions.filter(s => s.id !== item.id);
          closeModal();
          updateKPIsAndDistribution();
          renderList();
        } else {
          alert('Não foi possível excluir este registro no Supabase.');
          deleteBtn.disabled = false;
          deleteBtn.textContent = 'EXCLUIR REGISTRO';
        }
      });
    }
  }

  // Exportação CSV compatível com Excel (UTF-8 BOM)
  function exportToCSV() {
    const rows = getFilteredAndSortedSubmissions();
    if (rows.length === 0) {
      alert('Não há cadastros para exportar no momento.');
      return;
    }

    const headers = [
      'Data/Hora',
      'Nome Completo',
      'E-mail',
      'WhatsApp',
      'Celular (SMS)',
      'Indice Geral (0-100)',
      'Nivel',
      'Perfil Identificado',
      'Comportamento (%)',
      'Gestao (%)',
      'Probabilidade (%)',
      'Analise (%)',
      'Disciplina (%)'
    ];

    for (let i = 1; i <= 20; i++) {
      headers.push(`Q${String(i).padStart(2, '0')}`);
    }

    const csvLines = [headers.map(escapeCsvCell).join(';')];

    rows.forEach(item => {
      const dims = item.dimensions || {};
      const answers = item.answers || {};
      const line = [
        formatDateTime(item.created_at || item.submitted_at),
        item.name || '',
        item.email || '',
        item.phone || '',
        getSmsPhone(item) || item.phone || '',
        item.overall_score ?? 0,
        item.profile_code || '',
        item.profile_name || '',
        item.score_comportamento ?? dims.comportamento ?? 0,
        item.score_gestao ?? dims.gestao ?? 0,
        item.score_probabilidade ?? dims.probabilidade ?? 0,
        item.score_analise ?? dims.analise ?? 0,
        item.score_disciplina ?? dims.disciplina ?? 0
      ];

      for (let i = 1; i <= 20; i++) {
        line.push(answers[i] || answers[String(i)] || '');
      }

      csvLines.push(line.map(escapeCsvCell).join(';'));
    });

    const csvContent = '\uFEFF' + csvLines.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    const dateStamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `cadastros-alunos-ale-${dateStamp}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Listeners de interface
  if (btnRefresh) {
    btnRefresh.addEventListener('click', () => loadSubmissions());
  }

  if (btnExport) {
    btnExport.addEventListener('click', () => exportToCSV());
  }

  if (btnLogout && typeof onLogout === 'function') {
    btnLogout.addEventListener('click', () => {
      onLogout();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value || '';
      renderList();
    });
  }

  if (profileSelect) {
    profileSelect.addEventListener('change', (e) => {
      state.profileFilter = e.target.value || 'ALL';
      updateKPIsAndDistribution();
      renderList();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value || 'newest';
      renderList();
    });
  }

  // Inicializa carregamento
  loadSubmissions();

  return wrapper;
}

function getSmsPhone(item) {
  if (!item) return '';
  return (
    item.sms_phone ||
    item.insights?.leadContact?.smsPhone ||
    ''
  );
}

function resolveDetailedAnswers(item) {
  if (Array.isArray(item.answers_detailed) && item.answers_detailed.length > 0) {
    return item.answers_detailed;
  }
  const answersMap = item.answers || {};
  return QUESTIONS.map(q => {
    const letter = answersMap[q.id] || answersMap[String(q.id)] || null;
    const opt = q.options.find(o => o.letter === letter);
    return {
      questionId: q.id,
      question: q.question,
      selectedLetter: letter,
      selectedText: opt ? opt.text : null
    };
  });
}

function buildWhatsAppLink(item) {
  const digits = (item.phone_digits || item.phone || '').replace(/\D/g, '');
  if (!digits) return null;
  const fullPhone = digits.startsWith('55') && digits.length >= 12 ? digits : `55${digits}`;
  const firstName = (item.name || '').trim().split(' ')[0] || 'aluno';
  const msg = `Olá, ${firstName}! Vi seu Diagnóstico de Tomada de Decisão (${item.profile_name || 'Perfil'} — Índice ${item.overall_score ?? 0}/100).`;
  return `https://wa.me/${fullPhone}?text=${encodeURIComponent(msg)}`;
}

function formatDateTime(isoString) {
  if (!isoString) return '—';
  const dt = new Date(isoString);
  if (isNaN(dt.getTime())) return '—';
  return dt.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getInitials(name) {
  if (!name) return 'AL';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeCsvCell(val) {
  const str = String(val ?? '').replace(/"/g, '""');
  return `"${str}"`;
}

