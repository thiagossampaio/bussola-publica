<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Compass Político

Aplicação web responsiva que ajuda usuários a descobrirem seu posicionamento político por meio de um questionário cientificamente fundamentado, com análise em tempo real via Google Gemini e visualização multidimensional dos resultados.

## Índice

- [Visão Geral](#visão-geral)
- [Principais Funcionalidades](#principais-funcionalidades)
- [Arquitetura e Stack](#arquitetura-e-stack)
- [Requisitos](#requisitos)
- [Como Executar Localmente](#como-executar-localmente)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Metodologia do Questionário](#metodologia-do-questionário)
- [Critérios de Privacidade e Segurança](#critérios-de-privacidade-e-segurança)
- [Acessibilidade e Responsividade](#acessibilidade-e-responsividade)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Roadmap](#roadmap)
- [Contribuição](#contribuição)
- [Suporte](#suporte)
- [Segurança](#segurança)
- [Licença](#licença)

## Visão Geral

O **Compass Político** foi projetado para oferecer uma experiência clara, educativa e confiável de autoconhecimento político. A análise considera quatro dimensões principais:

- Econômica (Esquerda ↔ Direita)
- Social/Cultural (Progressista ↔ Conservador)
- Autoridade (Libertário ↔ Autoritário)
- Global-Nacional (Globalista ↔ Nacionalista)

## Principais Funcionalidades

- Questionário com escala Likert de 7 pontos e progressão por etapas temáticas
- Etapa inicial de autoavaliação política para confronto com a análise final da IA
- Salvamento automático de progresso e navegação retroativa
- Integração com Google Gemini para análise semântica e explicações personalizadas
- Resultados com gráfico radar comparativo (autoavaliação vs IA), scores numéricos e classificação composta
- Resumo compartilhável com 3 insights e badge de consistência/raridade
- Recursos de compartilhamento social e cópia rápida de resumo
- Card social em imagem (1200x630) para postagens
- Ranking global com recortes por período (7 dias, 30 dias, total)
- Instrumentação de eventos para testes de usabilidade (analytics local)
- Opção de refazer o teste e visualizar ranking global

## Arquitetura e Stack

**Frontend**
- React 19 + TypeScript
- Vite 6 (build e dev server)
- CSS moderno (Grid/Flexbox, variáveis CSS, animações)

**Integrações**
- Google GenAI SDK (`@google/genai`) para análise via Gemini
- Firebase (Firestore) para ranking global
- LocalStorage para progresso

**Bibliotecas**
- Recharts (visualizações de dados)
- React Markdown (renderização de conteúdo)
- Vite Plugin PWA (suporte a Progressive Web App)

## Requisitos

- Node.js (LTS recomendado)
- Chave de API do Google Gemini

## Como Executar Localmente

1. Instale as dependências:
   `npm install`
2. Configure a variável `GEMINI_API_KEY` no arquivo `.env.local`
3. Inicie o ambiente de desenvolvimento:
   `npm run dev`

## Variáveis de Ambiente

Crie um arquivo `.env.local` com base no `env.example`:

```
GEMINI_API_KEY=YOUR_KEY_HERE
```

> A chave do Gemini é usada no frontend; para cenários com requisitos rígidos de segurança, considere um backend proxy para proteger o segredo.

## Integração com GTM e GA4 (A/B e Experimentos)

Esta seção cobre a integração completa com Google Tag Manager (GTM) e Google Analytics 4 (GA4), incluindo A/B tests, eventos, e boas práticas para maximizar aprendizado e engajamento.

### 1) Pré‑requisitos

- Contas ativas no **Google Tag Manager** e **Google Analytics 4**.
- Um **GTM Container ID** (ex: `GTM-XXXXXXX`) e um **GA4 Measurement ID** (ex: `G-XXXXXXXXXX`).
- Acesso para publicar no domínio em produção.

### 2) Inserir o GTM no projeto

Adicione o snippet do GTM no `index.html`:

1. No `<head>`:
```
<!-- Google Tag Manager -->
<script>
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-XXXXXXX');
</script>
<!-- End Google Tag Manager -->
```

2. Logo após a abertura do `<body>`:
```
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

### 3) Configurar GA4 via GTM

1. No GTM, crie uma **Tag de Configuração do GA4**.
2. Insira o `G-XXXXXXXXXX` no campo **Measurement ID**.
3. Acione a tag em **All Pages**.

### 4) DataLayer e Eventos Customizados

Padronize eventos usando `dataLayer.push`. Exemplo:
```
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'ab_variant_assigned',
  variant: 'A'
});
```

**Eventos recomendados para este produto:**
- `landing_viewed`
- `landing_start_clicked`
- `landing_resume_clicked`
- `question_answered`
- `question_help_clicked`
- `quiz_cancelled`
- `results_viewed`
- `result_share_clicked`
- `share_card_download`
- `share_card_copy_link`
- `ranking_range_changed`
- `summary_copy_clicked`

### 5) A/B Teste (GTM + GA4)

**Opção A: A/B via GTM (recomendado)**
1. Crie uma **Variável de Randomização** no GTM (Custom JS) para retornar `A` ou `B`.
2. Grave a variante em `localStorage` via **Custom HTML Tag**.
3. Dispare um evento `ab_variant_assigned` para o GA4.
4. Use a variante para alterar textos e CTAs no frontend.

**Opção B: A/B via código (fallback)**
- A aplicação já usa `localStorage` para persistir a variante.
- Garanta que o evento `ab_variant_assigned` seja disparado no carregamento da landing.

### 6) Configurar Conversões no GA4

Marque como **conversão** no GA4:
- `landing_start_clicked`
- `results_viewed`
- `result_share_clicked`
- `share_card_download`

### 7) Funis e Exploração

No GA4:
1. Crie um **funil** com as etapas:
   - `landing_viewed`
   - `landing_start_clicked`
   - `question_answered`
   - `results_viewed`
   - `result_share_clicked`
2. Compare por **segmento de variante A/B**.
3. Avalie queda por dispositivo e canal.

### 8) Boas práticas para tráfego e engajamento

- **Rápida percepção de valor**: headline e CTA diretos.
- **Micro‑conversões**: copiar resumo, baixar card, ver ranking.
- **Remoção de fricção**: sem cadastro, progresso automático.
- **Prova social**: destaque de participação e ranking.
- **Conteúdo neutro e educativo**: aumenta confiança.
- **Teste incremental**: altere um bloco por vez (hero, CTA, prova social).

### 9) Checklist de Produção

- GTM instalado no `index.html`
- GA4 configurado via GTM
- Eventos mapeados e validados (DebugView do GA4)
- Conversões definidas
- Funil criado e monitorado
- Variante A/B persistida e logada no GA4

> Dica: use o **GA4 DebugView** para validar eventos antes de publicar.

## Estrutura de Pastas

```
/
├─ components/
├─ data/
├─ prompts/
├─ public/
├─ results/
├─ services/
├─ utils/
├─ App.tsx
├─ index.tsx
├─ index.css
├─ constants.tsx
├─ types.ts
├─ metadata.json
├─ package.json
└─ vite.config.ts
```

## Metodologia do Questionário

- Escala Likert de 7 pontos: de -3 (Discordo totalmente) a +3 (Concordo totalmente)
- Pesos diferenciados por relevância teórica
- Questões de controle para validação de consistência
- Eixos principais: econômico, social, autoridade e global-nacional
- Autoavaliação declarada no início para comparar percepção pessoal com a análise da IA

## Critérios de Privacidade e Segurança

- Dados anonimizados e sem coleta de informações pessoais identificáveis
- Uso de HTTPS obrigatório
- Para proteger chaves sensíveis, prefira um backend proxy quando possível
- Conformidade com LGPD e GDPR (quando aplicável)

## Acessibilidade e Responsividade

- Conformidade WCAG 2.1 AA
- Navegação completa por teclado
- Compatibilidade com leitores de tela
- Layout adaptativo para mobile, tablet e desktop

## Scripts Disponíveis

- `npm run dev` — executa a aplicação em modo desenvolvimento
- `npm run build` — gera o build de produção
- `npm run preview` — pré-visualiza o build (se disponível)

## Roadmap

**Fase 1 — Pré-Eleições (0–6 semanas)**
- Cartões sociais avançados com radar e chamada neutra de educação política
- Perfil resumido compartilhável com 3 insights e consistência
- Ranking com recortes temporais (7/30 dias)
- Micro-conteúdos neutros sobre o significado de cada eixo
- Badges de conclusão e raridade do perfil

**Fase 2 — Temporada de Campanha (6–12 semanas)**
- Comparador de temas (saúde, economia, educação, segurança) sem citar candidatos
- Radar de prioridades pessoais e contraste com o perfil político
- Mapa do Brasil (opt‑in) com distribuição agregada por UF
- Modo debate saudável com explicações neutras de divergências
- Timeline de mudança para quem refaz o teste

**Fase 3 — Pico Eleitoral (12–20 semanas)**
- Digest semanal de tendências agregadas
- Comparação de clusters com linguagem neutra
- Convite em grupo para comparação de médias
- Cards especiais para stories (Instagram/WhatsApp)
- Explicação do score e etiqueta de confiança

**Fase 4 — Pós‑Eleições (20+ semanas)**
- Análises históricas mensais do ranking
- Biblioteca de conceitos políticos vinculados às perguntas
- Painel de exportações agregadas para pesquisadores

## Contribuição

Consulte o guia em `CONTRIBUTING.md` e o `CODE_OF_CONDUCT.md` antes de abrir PRs.

## Suporte

Use as issues do GitHub para dúvidas, bugs e solicitações de melhoria.

## Segurança

Para relatar vulnerabilidades, siga as instruções de `SECURITY.md`.

## Licença

Licença MIT. Consulte `LICENSE`.
