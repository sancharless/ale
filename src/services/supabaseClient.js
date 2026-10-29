import { QUESTIONS } from '../data/questions.js';

/**
 * ALÊ — CLIENTE DE SINCRONIZAÇÃO SUPABASE / POSTGREST
 * Conexão direta via API REST nativa com fila de resiliência local
 */

const DEFAULT_SUPABASE_URL = 'https://ijqatbsoelkhabyvyygx.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_fw6aSN1l94vnIOJXQFYShA_wdMPmgzw';
const PENDING_QUEUE_KEY = 'diagnostico_pending_sync_v1';
const LAST_SUBMISSION_KEY = 'diagnostico_last_submission_v1';

export class SupabaseClient {
  constructor() {
    this.config = this.loadConfig();
  }

  loadConfig() {
    let url = '';
    let anonKey = '';

    if (typeof import.meta !== 'undefined' && import.meta.env) {
      url = import.meta.env.VITE_SUPABASE_URL || '';
      anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
    }

    if (!url) url = DEFAULT_SUPABASE_URL;
    if (!anonKey) anonKey = DEFAULT_SUPABASE_KEY;

    return {
      url: url.trim().replace(/\/+$/, ''),
      anonKey: anonKey.trim()
    };
  }

  isConfigured() {
    return Boolean(this.config.url && this.config.anonKey);
  }

  getHeaders(extraHeaders = {}) {
    return {
      'apikey': this.config.anonKey,
      'Authorization': `Bearer ${this.config.anonKey}`,
      'Content-Type': 'application/json',
      ...extraHeaders
    };
  }

  /**
   * Monta o registro completo do diagnóstico (Lead + Scores + Respostas Detalhadas + Insights)
   */
  buildSubmissionRow({ leadData, results, insights, answers }) {
    const safeLead = leadData || {};
    const safeResults = results || {};
    const safeDims = safeResults.dimensions || {};
    const safeProfile = safeResults.profile || {};
    const safeAnswers = answers || {};

    const answersDetailed = QUESTIONS.map((q) => {
      const selectedLetter = safeAnswers[q.id] || null;
      const chosenOption = q.options.find((opt) => opt.letter === selectedLetter);
      return {
        questionId: q.id,
        blockId: q.blockId,
        dimension: q.dimension,
        question: q.question,
        selectedLetter,
        selectedText: chosenOption ? chosenOption.text : null,
        level: chosenOption ? chosenOption.level : null
      };
    });

    const smsPhoneClean = (safeLead.smsPhone || '').trim();
    const smsPhoneDigitsClean = smsPhoneClean.replace(/\D/g, '');

    const enrichedInsights = {
      ...(insights || {}),
      leadContact: {
        phone: (safeLead.phone || '').trim(),
        smsPhone: smsPhoneClean,
        smsPhoneDigits: smsPhoneDigitsClean
      }
    };

    return {
      name: (safeLead.name || '').trim(),
      email: (safeLead.email || '').trim().toLowerCase(),
      phone: (safeLead.phone || '').trim(),
      phone_digits: (safeLead.phone || '').replace(/\D/g, ''),
      sms_phone: smsPhoneClean,
      sms_phone_digits: smsPhoneDigitsClean,
      consent: Boolean(safeLead.consent ?? true),
      overall_score: Number(safeResults.overallScore) || 0,
      profile_id: safeProfile.id || 'indefinido',
      profile_code: safeProfile.code || '',
      profile_name: safeProfile.name || 'PERFIL NÃO IDENTIFICADO',
      profile_tagline: safeProfile.tagline || '',
      score_comportamento: Number(safeDims.comportamento) || 0,
      score_gestao: Number(safeDims.gestao) || 0,
      score_probabilidade: Number(safeDims.probabilidade) || 0,
      score_analise: Number(safeDims.analise) || 0,
      score_disciplina: Number(safeDims.disciplina) || 0,
      dimensions: safeDims,
      answers: safeAnswers,
      answers_detailed: answersDetailed,
      insights: enrichedInsights,
      source_url: typeof window !== 'undefined' ? window.location.href : '',
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      submitted_at: safeLead.submittedAt || new Date().toISOString()
    };
  }

  /**
   * Envia a submissão preenchida para a tabela public.diagnostic_submissions no Supabase
   */
  async saveDiagnosticSubmission({ leadData, results, insights, answers }) {
    const row = this.buildSubmissionRow({ leadData, results, insights, answers });

    try {
      localStorage.setItem(LAST_SUBMISSION_KEY, JSON.stringify(row));
    } catch {
      // Ignora erro de escrita no localStorage
    }

    if (!this.isConfigured()) {
      this.enqueuePending(row);
      return {
        success: false,
        queued: true,
        message: 'Supabase não configurado. Dados salvos na fila local.'
      };
    }

    const endpoint = `${this.config.url}/rest/v1/diagnostic_submissions`;

    try {
      let response = await fetch(endpoint, {
        method: 'POST',
        headers: this.getHeaders({
          'Prefer': 'return=minimal'
        }),
        body: JSON.stringify(row)
      });

      // Fallback automático caso o usuário ainda não tenha executado o ALTER TABLE com sms_phone
      if (!response.ok && response.status === 400) {
        const { sms_phone, sms_phone_digits, ...legacyRow } = row;
        response = await fetch(endpoint, {
          method: 'POST',
          headers: this.getHeaders({
            'Prefer': 'return=minimal'
          }),
          body: JSON.stringify(legacyRow)
        });
      }

      if (!response.ok) {
        let errorDetail = response.statusText;
        try {
          const errJson = await response.json();
          errorDetail = errJson.message || errJson.details || errJson.hint || response.statusText;
        } catch {
          // Ignora falha ao ler JSON de erro
        }

        this.enqueuePending(row);
        console.warn(`[SupabaseClient] Aviso ao sincronizar (${response.status}): ${errorDetail}`);

        return {
          success: false,
          queued: true,
          status: response.status,
          message: errorDetail
        };
      }

      // Se sincronizou com sucesso, aproveita para esvaziar itens pendentes anteriores
      this.flushPendingSubmissions().catch(() => {});

      return {
        success: true,
        queued: false,
        message: 'Diagnóstico sincronizado com sucesso no Supabase.'
      };
    } catch (err) {
      this.enqueuePending(row);
      console.warn('[SupabaseClient] Falha de rede ao sincronizar com Supabase, salvo na fila local:', err.message);

      return {
        success: false,
        queued: true,
        message: err.message
      };
    }
  }

  /**
   * Guarda submissão pendente no localStorage caso a tabela ainda não tenha sido criada ou esteja sem rede
   */
  enqueuePending(row) {
    try {
      const existingRaw = localStorage.getItem(PENDING_QUEUE_KEY);
      const queue = existingRaw ? JSON.parse(existingRaw) : [];
      if (Array.isArray(queue)) {
        queue.push(row);
        // Limita a fila aos últimos 50 registros por segurança
        const trimmed = queue.slice(-50);
        localStorage.setItem(PENDING_QUEUE_KEY, JSON.stringify(trimmed));
      }
    } catch {
      // Ignora erro de localStorage
    }
  }

  /**
   * Reenvia automaticamente submissões que estavam na fila local
   */
  async flushPendingSubmissions() {
    if (!this.isConfigured()) return { flushed: 0 };

    let queue = [];
    try {
      const existingRaw = localStorage.getItem(PENDING_QUEUE_KEY);
      queue = existingRaw ? JSON.parse(existingRaw) : [];
    } catch {
      return { flushed: 0 };
    }

    if (!Array.isArray(queue) || queue.length === 0) {
      return { flushed: 0 };
    }

    const endpoint = `${this.config.url}/rest/v1/diagnostic_submissions`;
    const remaining = [];
    let flushedCount = 0;

    for (const item of queue) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: this.getHeaders({ 'Prefer': 'return=minimal' }),
          body: JSON.stringify(item)
        });
        if (res.ok) {
          flushedCount++;
        } else {
          remaining.push(item);
        }
      } catch {
        remaining.push(item);
      }
    }

    try {
      if (remaining.length === 0) {
        localStorage.removeItem(PENDING_QUEUE_KEY);
      } else {
        localStorage.setItem(PENDING_QUEUE_KEY, JSON.stringify(remaining));
      }
    } catch {
      // Ignora erro de localStorage
    }

    return { flushed: flushedCount, remaining: remaining.length };
  }

  /**
   * Busca todos os cadastros e diagnósticos dos alunos no Supabase (para o Painel Admin)
   */
  async fetchDiagnosticSubmissions(limit = 500) {
    // Tenta enviar eventuais pendentes locais antes de listar
    await this.flushPendingSubmissions().catch(() => {});

    if (!this.isConfigured()) {
      return {
        success: false,
        data: this.getLocalFallbackSubmissions(),
        message: 'Supabase não configurado.'
      };
    }

    const endpoint = `${this.config.url}/rest/v1/diagnostic_submissions?select=*&order=created_at.desc&limit=${limit}`;

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        let errorDetail = response.statusText;
        try {
          const errJson = await response.json();
          errorDetail = errJson.message || errJson.details || response.statusText;
        } catch {
          // Ignora falha de parse
        }
        return {
          success: false,
          status: response.status,
          data: this.getLocalFallbackSubmissions(),
          message: errorDetail
        };
      }

      const rows = await response.json();
      return {
        success: true,
        data: Array.isArray(rows) ? rows : [],
        message: 'Sincronizado com sucesso.'
      };
    } catch (err) {
      return {
        success: false,
        data: this.getLocalFallbackSubmissions(),
        message: err.message
      };
    }
  }

  /**
   * Remove um cadastro do Supabase (caso o admin queira excluir um teste)
   */
  async deleteDiagnosticSubmission(id) {
    if (!this.isConfigured() || !id) return false;

    const endpoint = `${this.config.url}/rest/v1/diagnostic_submissions?id=eq.${encodeURIComponent(id)}`;
    try {
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  getLocalFallbackSubmissions() {
    const list = [];
    try {
      const pendingRaw = localStorage.getItem(PENDING_QUEUE_KEY);
      if (pendingRaw) {
        const parsed = JSON.parse(pendingRaw);
        if (Array.isArray(parsed)) list.push(...parsed);
      }
      if (list.length === 0) {
        const lastRaw = localStorage.getItem(LAST_SUBMISSION_KEY);
        if (lastRaw) {
          const parsedLast = JSON.parse(lastRaw);
          if (parsedLast) list.push(parsedLast);
        }
      }
    } catch {
      // Ignora erro
    }
    return list;
  }
}

export const supabaseClient = new SupabaseClient();
export default supabaseClient;

