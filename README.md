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
- [Configuração do Gemini](#configuração-do-gemini)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Metodologia do Questionário](#metodologia-do-questionário)
- [Critérios de Privacidade e Segurança](#critérios-de-privacidade-e-segurança)
- [Acessibilidade e Responsividade](#acessibilidade-e-responsividade)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Roadmap](#roadmap)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Visão Geral

O **Compass Político** foi projetado para oferecer uma experiência clara, educativa e confiável de autoconhecimento político. A análise considera quatro dimensões principais:

- Econômica (Esquerda ↔ Direita)
- Social/Cultural (Progressista ↔ Conservador)
- Autoridade (Libertário ↔ Autoritário)
- Global-Nacional (Globalista ↔ Nacionalista)

## Principais Funcionalidades

- Questionário com escala Likert de 7 pontos e progressão por etapas temáticas
- Salvamento automático de progresso e navegação retroativa
- Integração com Google Gemini para análise semântica e explicações personalizadas
- Resultados com gráfico radar, scores numéricos e classificação composta
- Recursos de compartilhamento e geração de card social
- Opção de refazer o teste e visualizar ranking global

## Arquitetura e Stack

**Frontend**
- HTML5 + CSS3 (Grid/Flexbox, variáveis CSS, animações)
- JavaScript (ES6+), módulos e async/await

**Integrações**
- Google Gemini API (Google AI Studio)
- LocalStorage para progresso

**Bibliotecas recomendadas (CDN)**
- Chart.js (visualizações de dados)
- Marked.js (renderização de Markdown)
- HTML2Canvas (captura de resultados)

## Requisitos

- Node.js (LTS recomendado)
- Chave de API do Google Gemini

## Como Executar Localmente

1. Instale as dependências:
   `npm install`
2. Configure a variável `GEMINI_API_KEY` no arquivo `.env.local`
3. Inicie o ambiente de desenvolvimento:
   `npm run dev`

## Configuração do Gemini

O projeto utiliza o Google AI Studio com o modelo `gemini-pro`.

Exemplo de integração:

```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

async function analyzeResponses(userResponses) {
  const prompt = `[Prompt estruturado com respostas]`;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return parseResults(response.text());
}
```

## Estrutura de Pastas

> Ajuste esta seção conforme a organização real do repositório.

```
/
├─ public/
├─ src/
│  ├─ components/
│  ├─ pages/
│  ├─ services/
│  └─ styles/
├─ results/
│  └─ PRD.md
└─ README.md
```

## Metodologia do Questionário

- Escala Likert de 7 pontos: de -3 (Discordo totalmente) a +3 (Concordo totalmente)
- Pesos diferenciados por relevância teórica
- Questões de controle para validação de consistência
- Eixos principais: econômico, social, autoridade e global-nacional

## Critérios de Privacidade e Segurança

- Dados anonimizados e sem coleta de informações pessoais identificáveis
- Uso de HTTPS obrigatório
- Chaves de API protegidas (não expostas no frontend)
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

**Fase 1 (MVP)**
- [x] Landing page básica e 30 questões essenciais
- [x] Página de resultados com gráfico radar

**Fase 2 (Aprimoramento)**
- Questionário completo (45 questões, 4 eixos)
- Ranking global com visualizações

**Fase 3 (Polimento)**
- Questões abertas opcionais
- [x] Acessibilidade completa e otimização de performance
- [x] SEO
- [x] PWA
- [x] Animações e micro-interações

## Contribuição

1. Faça um fork do repositório
2. Crie uma branch a partir de `main`
3. Abra um Pull Request descrevendo o contexto e as mudanças

## Licença

Defina a licença do projeto (ex: MIT) neste arquivo e atualize esta seção.
