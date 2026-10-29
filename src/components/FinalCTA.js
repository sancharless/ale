import { generateAndDownloadReportPDF } from '../utils/pdfReportGenerator.js';

/**
 * Componente FinalCTA — Botão de Download do Relatório em PDF
 */

export function renderFinalCTA({ results, insights, leadData }) {
  const container = document.createElement('section');
  container.className = 'final-pdf-download-section';

  container.innerHTML = `
    <div style="display: flex; justify-content: center; width: 100%; padding: 1.5rem 0 2.5rem 0;">
      <button id="btn-download-pdf" class="btn btn-primary" type="button" style="min-width: 280px; padding: 1.1rem 2.2rem;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        <span id="label-download-pdf">BAIXAR RELATÓRIO EM PDF</span>
      </button>
    </div>
  `;

  const btnDownload = container.querySelector('#btn-download-pdf');
  const labelDownload = container.querySelector('#label-download-pdf');

  if (btnDownload) {
    btnDownload.addEventListener('click', async () => {
      if (btnDownload.disabled) return;
      btnDownload.disabled = true;
      if (labelDownload) labelDownload.textContent = 'GERANDO PDF...';

      try {
        await generateAndDownloadReportPDF({ results, insights, leadData });
      } finally {
        btnDownload.disabled = false;
        if (labelDownload) labelDownload.textContent = 'BAIXAR RELATÓRIO EM PDF';
      }
    });
  }

  return container;
}
