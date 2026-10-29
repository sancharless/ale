-- ============================================================================
-- ALÊ — DIAGNÓSTICO DE PERFIL DE TOMADA DE DECISÃO
-- SCHEMA DO BANCO DE DADOS EM NUVEM (SUPABASE / POSTGRESQL)
-- Projeto: https://ijqatbsoelkhabyvyygx.supabase.co
-- ============================================================================

-- 1. Habilitar extensão para geração de UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Tabela Principal de Submissões do Diagnóstico (Leads + Resultados + Respostas)
CREATE TABLE IF NOT EXISTS public.diagnostic_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Dados do Lead preenchidos no formulário
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    phone_digits TEXT,
    sms_phone TEXT,
    sms_phone_digits TEXT,
    consent BOOLEAN NOT NULL DEFAULT true,
    
    -- Resultado Consolidado do Perfil
    overall_score INTEGER NOT NULL DEFAULT 0,
    profile_id TEXT NOT NULL,
    profile_code TEXT,
    profile_name TEXT NOT NULL,
    profile_tagline TEXT,
    
    -- Pontuação Individual nas 5 Dimensões Estratégicas (0 a 100)
    score_comportamento INTEGER DEFAULT 0,
    score_gestao INTEGER DEFAULT 0,
    score_probabilidade INTEGER DEFAULT 0,
    score_analise INTEGER DEFAULT 0,
    score_disciplina INTEGER DEFAULT 0,
    
    -- Estruturas Detalhadas em JSONB para Análise Profunda
    dimensions JSONB DEFAULT '{}'::jsonb,
    answers JSONB DEFAULT '{}'::jsonb,
    answers_detailed JSONB DEFAULT '[]'::jsonb,
    insights JSONB DEFAULT '{}'::jsonb,
    
    -- Metadados de Rastreio e Auditoria
    source_url TEXT,
    user_agent TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Garantir que as novas colunas de Celular (SMS) existam caso a tabela já tenha sido criada antes
ALTER TABLE public.diagnostic_submissions ADD COLUMN IF NOT EXISTS sms_phone TEXT;
ALTER TABLE public.diagnostic_submissions ADD COLUMN IF NOT EXISTS sms_phone_digits TEXT;

-- 4. Índices de Performance para Consultas, Filtros, Painel Admin e CRM
CREATE INDEX IF NOT EXISTS idx_diagnostic_submissions_email ON public.diagnostic_submissions (email);
CREATE INDEX IF NOT EXISTS idx_diagnostic_submissions_phone_digits ON public.diagnostic_submissions (phone_digits);
CREATE INDEX IF NOT EXISTS idx_diagnostic_submissions_sms_phone_digits ON public.diagnostic_submissions (sms_phone_digits);
CREATE INDEX IF NOT EXISTS idx_diagnostic_submissions_profile_id ON public.diagnostic_submissions (profile_id);
CREATE INDEX IF NOT EXISTS idx_diagnostic_submissions_overall_score ON public.diagnostic_submissions (overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_diagnostic_submissions_created_at ON public.diagnostic_submissions (created_at DESC);

-- 5. Garantir permissões na Data API para as roles anon e authenticated
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.diagnostic_submissions TO anon, authenticated;

-- 6. Habilitar Row Level Security (RLS)
ALTER TABLE public.diagnostic_submissions ENABLE ROW LEVEL SECURITY;

-- Limpar políticas anteriores caso o script seja re-executado
DROP POLICY IF EXISTS "Permitir insercao publica de diagnosticos" ON public.diagnostic_submissions;
DROP POLICY IF EXISTS "Permitir leitura de diagnosticos" ON public.diagnostic_submissions;
DROP POLICY IF EXISTS "Permitir atualizacao de diagnosticos" ON public.diagnostic_submissions;
DROP POLICY IF EXISTS "Permitir exclusao de diagnosticos pelo admin" ON public.diagnostic_submissions;

-- Políticas de Acesso para a Chave Publicável (anon / authenticated)
CREATE POLICY "Permitir insercao publica de diagnosticos"
ON public.diagnostic_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Permitir leitura de diagnosticos"
ON public.diagnostic_submissions
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Permitir atualizacao de diagnosticos"
ON public.diagnostic_submissions
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Permitir exclusao de diagnosticos pelo admin"
ON public.diagnostic_submissions
FOR DELETE
TO anon, authenticated
USING (true);

-- 7. Habilitar Supabase Realtime para acompanhamento em tempo real no Painel Admin
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.diagnostic_submissions;
  END IF;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 8. Recarregar o cache de schema do PostgREST automaticamente
NOTIFY pgrst, 'reload schema';
