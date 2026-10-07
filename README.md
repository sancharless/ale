# Plataforma Web de Diagnóstico de Perfil de Tomada de Decisão

Aplicação web premium, moderna, responsiva e mobile-first para avaliação de maturidade decisória e consistência comportamental diante dos números.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js instalado (v18 ou superior)

### Passo a Passo
1. Abra o terminal na raiz do projeto:
   ```bash
   cd "Ale New"
   ```
2. Instale as dependências (já instaladas):
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acesse a aplicação no seu navegador:
   `http://localhost:5173/`

Para gerar a build de produção otimizada:
```bash
npm run build
```

---

## 🏛️ Arquitetura e Estrutura de Pastas

```text
├── index.html                   # Estrutura HTML5 com SEO e viewport mobile-first
├── package.json                 # Configuração do Vite e scripts de build
├── vite.config.js               # Configurações do Vite
├── src/
│   ├── main.js                  # Orquestrador da máquina de estados do diagnóstico
│   ├── styles/
│   │   ├── index.css            # Design tokens, reset, tipografia e luz de fundo
│   │   ├── components.css       # Estilos da jornada (Hero, Questões, Lead, Transições)
│   │   └── dashboard.css        # Estilos do Dashboard (Métricas, Radar, Insights)
│   ├── data/
│   │   ├── questions.js         # As 20 questões com alternativas, blocos e pesos
│   │   ├── profiles.js          # Os 5 perfis de maturidade (Reativo a Alta Consistência)
│   │   ├── scoring.js           # Motor de pontuação ponderado e normalização 0-100
│   │   └── insights.js          # Biblioteca de regras inteligentes e Mapa de Evolução
│   └── components/
│       ├── Hero.js              # Tela inicial com proposta de valor e indicadores
│       ├── IntroAssessment.js   # Calibragem reflexiva ("Não existem respostas perfeitas")
│       ├── ProgressHeader.js    # Barra de progresso, indicador numérico e botão Voltar
│       ├── QuestionCard.js      # Card da questão e controle de seleção
│       ├── AnswerCard.js        # Cards clicáveis com cápsula de letra e feedback
│       ├── SectionTransition.js # Transições temáticas entre blocos de perguntas
│       ├── ProcessingScreen.js  # Tela de processamento sequencial de 2,5s
│       ├── LeadCapture.js       # Captura de lead com validação e máscara de WhatsApp
│       ├── ResultDashboard.js   # Painel executivo do resultado com placar animado
│       ├── DimensionScore.js    # Barras horizontais e Gráfico Radar SVG pentagonal
│       ├── InsightCard.js       # Ponto Forte, Ponto de Evolução e Atenção
│       ├── EvolutionMap.js      # Matriz tática (Mantenha, Desenvolva, Priorize)
│       ├── ShareResult.js       # Modal para WhatsApp e cópia de link do perfil
│       └── FinalCTA.js          # Chamada de encerramento e botão de refazer
```

---

## ⚙️ Personalizações e Integrações

### 1. Alterar Questões e Pontuações
Edite o arquivo [questions.js](file:///c:/Users/USUÁRIO/OneDrive/Área de Trabalho/OneDrive/Documentos/Ale New/src/data/questions.js). Cada questão possui os pesos de cada alternativa para as 5 dimensões (`comportamento`, `gestao`, `probabilidade`, `analise`, `disciplina`).

### 2. Alterar Perfis e Faixas de Pontuação
Edite o arquivo [profiles.js](file:///c:/Users/USUÁRIO/OneDrive/Área de Trabalho/OneDrive/Documentos/Ale New/src/data/profiles.js). Você pode ajustar as faixas (0–39, 40–54, 55–69, 70–84, 85–100), nomes, resumos executivos e cores.

### 3. Conectar Webhook / CRM no Formulário de Leads
No arquivo [LeadCapture.js](file:///c:/Users/USUÁRIO/OneDrive/Área de Trabalho/OneDrive/Documentos/Ale New/src/components/LeadCapture.js), na função `onSubmitLead`, você pode adicionar um disparo via `fetch('SUA_URL_DE_WEBHOOK', { method: 'POST', body: JSON.stringify(leadData) })`.

### 4. Link de Destino do CTA Final
No arquivo [main.js](file:///c:/Users/USUÁRIO/OneDrive/Área de Trabalho/OneDrive/Documentos/Ale New/src/main.js) ou [FinalCTA.js](file:///c:/Users/USUÁRIO/OneDrive/Área de Trabalho/OneDrive/Documentos/Ale New/src/components/FinalCTA.js), altere o parâmetro `targetUrl` para direcionar o usuário para sua página de vendas, mentoria ou WhatsApp.
