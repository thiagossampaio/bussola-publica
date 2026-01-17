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
- Ranking global com recortes por período (7 dias, 30 dias, total)
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
