# Product Requirements Document (PRD)
## Compass Político - Aplicação Web de Posicionamento Político

---

## 1. VISÃO GERAL DO PRODUTO

### 1.1 Propósito
Desenvolver uma aplicação web responsiva que permita aos usuários descobrirem seu posicionamento político através de um questionário científico, com análise em tempo real por IA (Google Gemini) e visualização de resultados em um espectro político multidimensional.

### 1.2 Objetivos do Produto
- Fornecer uma ferramenta cientificamente fundamentada para autoconhecimento político
- Criar uma experiência envolvente que incentive compartilhamento viral
- Educar usuários sobre espectros políticos através de explicações contextuais
- Gerar insights agregados sobre tendências políticas da base de usuários
- Estabelecer confiança através de metodologia transparente e resultados nuançados

### 1.3 Público-Alvo
- **Primário**: Jovens adultos (18-35 anos) interessados em política e autoconhecimento
- **Secundário**: Educadores, estudantes de ciências sociais, jornalistas
- **Terciário**: Público geral curioso sobre seu posicionamento político

---

## 2. FUNDAMENTAÇÃO CIENTÍFICA EM CIÊNCIA POLÍTICA

### 2.1 Framework Teórico
O aplicativo utilizará um modelo multidimensional baseado em:

#### **Eixo Econômico** (Esquerda ↔ Direita)
- Papel do Estado na economia
- Redistribuição de renda e tributação
- Propriedade privada vs. coletiva
- Regulação de mercados
- Políticas de bem-estar social

#### **Eixo Social/Cultural** (Progressista ↔ Conservador)
- Valores tradicionais vs. mudança social
- Questões de identidade e diversidade
- Liberdades individuais vs. ordem social
- Secularismo vs. religião na esfera pública
- Direitos civis e minorias

#### **Eixo Autoritário-Libertário** (Autoridade ↔ Liberdade)
- Centralização vs. descentralização de poder
- Liberdades civis e vigilância
- Força do Estado e segurança
- Participação democrática
- Direitos individuais vs. coletivos

#### **Eixo Nacionalista-Globalista** (Nacional ↔ Internacional)
- Soberania nacional vs. cooperação internacional
- Políticas de imigração
- Comércio internacional
- Identidade nacional vs. cosmopolitismo
- Intervencionismo internacional

### 2.2 Metodologia de Avaliação
- **Escala Likert de 7 pontos**: Discordo totalmente (-3) a Concordo totalmente (+3)
- **Pesos diferenciados**: Questões têm pesos baseados em relevância teórica
- **Validação cruzada**: Questões de controle para verificar consistência
- **Análise semântica**: Gemini identifica nuances nas respostas textuais opcionais

---

## 3. REQUISITOS FUNCIONAIS

### 3.1 Jornada do Usuário

#### **Fase 1: Onboarding**
- **RF001**: Landing page com explicação clara do propósito
- **RF002**: Breve vídeo ou animação explicativa (30-45 segundos)
- **RF003**: Declaração de privacidade e uso de dados
- **RF004**: Botão CTA destacado: "Descobrir meu posicionamento"
- **RF005**: Estimativa de tempo de conclusão (8-12 minutos)

#### **Fase 2: Questionário**
- **RF006**: 40-50 questões cientificamente validadas
- **RF007**: Barra de progresso visual com etapas temáticas
- **RF008**: Questões apresentadas uma por vez (single-page flow)
- **RF009**: Escala Likert visual interativa (sliders ou botões)
- **RF010**: Botão "?" ao lado de cada questão para explicação contextual
- **RF011**: Questões opcionais abertas para profundidade (5-7 questões)
- **RF012**: Possibilidade de pular questões (máximo 10% do total)
- **RF013**: Salvamento automático de progresso
- **RF014**: Navegação backward permitida para revisão

#### **Fase 3: Processamento com Gemini**
- **RF015**: Tela de loading com animação envolvente
- **RF016**: Mensagens rotativas sobre ciência política durante processamento
- **RF017**: Integração com Google Gemini API para análise
- **RF018**: Prompt estruturado enviado ao Gemini com:
  - Todas as respostas do usuário
  - Framework de análise político
  - Instruções para classificação multidimensional
  - Requisição de scores de 0-10 para cada eixo
  - Requisição de explicação personalizada

#### **Fase 4: Resultados**
- **RF019**: Página de resultados visualmente impactante
- **RF020**: Gráfico radar/spider com 4 eixos dimensionais
- **RF021**: Scores numéricos (0-10) para cada dimensão
- **RF022**: Classificação principal com descrição detalhada
- **RF023**: Explicação personalizada gerada pelo Gemini (200-300 palavras)
- **RF024**: Seção "O que isso significa?" com contexto histórico
- **RF025**: Comparação com figuras políticas conhecidas (opcional)
- **RF026**: Botão de compartilhamento social com card customizado
- **RF027**: Download de resultados em PDF/imagem
- **RF028**: Opção de refazer o teste

#### **Fase 5: Ranking Global**
- **RF029**: Página de dashboard com distribuição agregada
- **RF030**: Gráfico de barras/pizza mostrando % por classificação
- **RF031**: Mapa de calor por região (se coleta de localização opcional)
- **RF032**: Total de participantes
- **RF033**: Atualização em tempo real dos dados
- **RF034**: Filtros por período (última semana, mês, ano, total)

### 3.2 Sistema de Explicações (Gemini Assistant)
- **RF035**: Modal ou sidebar com chat Gemini
- **RF036**: Usuário pode perguntar sobre qualquer questão
- **RF037**: Gemini explica conceitos políticos em linguagem acessível
- **RF038**: Histórico de perguntas durante o questionário
- **RF039**: Limite de 3-5 perguntas por questionário para otimizar custos

### 3.3 Integração com Google Gemini

#### **Requisitos de Prompt Engineering**
- **RF040**: Prompt sistema para análise política estruturada
- **RF041**: Template de prompt incluindo:
  ```
  Você é um cientista político especializado em análise de posicionamento político.
  Analise as respostas fornecidas e classifique o usuário em 4 dimensões:
  
  1. Econômica (0=Extrema Esquerda, 5=Centro, 10=Extrema Direita)
  2. Social (0=Extremamente Progressista, 5=Moderado, 10=Extremamente Conservador)
  3. Autoridade (0=Libertário Extremo, 5=Moderado, 10=Autoritário Extremo)
  4. Global-Nacional (0=Extremamente Globalista, 5=Moderado, 10=Extremamente Nacionalista)
  
  Forneça:
  - Scores numéricos para cada dimensão
  - Classificação principal (ex: "Centro-Esquerda Progressista")
  - Explicação personalizada baseada nas respostas
  - Consistência das respostas (alta/média/baixa)
  ```

- **RF042**: Validação de resposta JSON estruturado do Gemini
- **RF043**: Fallback para respostas não estruturadas
- **RF044**: Retry logic para falhas de API

---

## 4. REQUISITOS NÃO-FUNCIONAIS

### 4.1 Performance
- **RNF001**: Tempo de carregamento inicial < 2 segundos
- **RNF002**: Resposta do Gemini API < 5 segundos
- **RNF003**: Transições suaves entre questões (< 300ms)
- **RNF004**: Otimização para conexões 3G

### 4.2 Responsividade
- **RNF005**: Layout adaptativo para mobile (320px+), tablet (768px+) e desktop (1024px+)
- **RNF006**: Touch-friendly para dispositivos móveis
- **RNF007**: Testes em iOS Safari, Android Chrome, Desktop Chrome/Firefox/Edge

### 4.3 Acessibilidade
- **RNF008**: Conformidade WCAG 2.1 nível AA
- **RNF009**: Navegação por teclado completa
- **RNF010**: Screen reader compatibility
- **RNF011**: Contraste de cores adequado (mínimo 4.5:1)
- **RNF012**: Textos alternativos para elementos visuais

### 4.4 Segurança e Privacidade
- **RNF013**: Dados armazenados anonimamente
- **RNF014**: Não coleta de informações pessoais identificáveis
- **RNF015**: HTTPS obrigatório
- **RNF016**: Conformidade com LGPD (Brasil) e GDPR (se aplicável)
- **RNF017**: API keys protegidas (não expostas no frontend)

### 4.5 Escalabilidade
- **RNF018**: Suporte para 1000+ usuários simultâneos
- **RNF019**: Banco de dados otimizado para agregações em tempo real
- **RNF020**: Caching de resultados de ranking

---

## 5. STACK TECNOLÓGICA (Google AI Studio)

### 5.1 Frontend
- **HTML5**: Estrutura semântica
- **CSS3**: Estilização responsiva
  - CSS Grid e Flexbox para layouts
  - CSS Variables para temas
  - Animations/Transitions
- **JavaScript (ES6+)**: Lógica de aplicação
  - Vanilla JS ou framework leve compatível
  - Módulos ES6
  - Async/Await para API calls

### 5.2 Backend/API
- **Google Gemini API**: Processamento de linguagem natural e análise
  - Model: `gemini-pro` ou `gemini-pro-vision` (se usar imagens)
  - Endpoint: Via Google AI Studio SDK
- **Google Apps Script** (opcional): Backend leve para persistência
- **Google Sheets API**: Banco de dados para armazenamento de resultados agregados

### 5.3 Armazenamento
- **LocalStorage**: Salvamento temporário de progresso
- **Google Sheets**: Banco de dados para:
  - Armazenamento de respostas agregadas
  - Cálculo de estatísticas do ranking
  - Logs de uso (anonimizados)

### 5.4 Bibliotecas Permitidas (CDN)
- **Chart.js**: Visualizações de dados (gráficos radar, barras)
- **D3.js** (alternativa): Para visualizações mais complexas
- **Marked.js**: Renderização de Markdown (explicações)
- **HTML2Canvas**: Captura de resultados para compartilhamento

### 5.5 Integração Google AI Studio
```javascript
// Exemplo de integração
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

---

## 6. DESIGN DE QUESTIONÁRIO

### 6.1 Estrutura de Questões (45 questões sugeridas)

#### **Bloco 1: Economia (12 questões)**
1. O Estado deve garantir emprego para todos os cidadãos.
2. Grandes fortunas devem ser fortemente tributadas para redistribuição.
3. Serviços essenciais (saúde, educação) devem ser exclusivamente públicos.
4. A privatização de empresas estatais geralmente melhora a eficiência.
5. O salário mínimo deve ser determinado pelo mercado, não pelo governo.
6. Sindicatos têm poder excessivo sobre a economia.
7. O governo deve regular preços de produtos essenciais.
8. Programas de transferência de renda (ex: Bolsa Família) são essenciais.
9. Impostos corporativos devem ser reduzidos para atrair investimentos.
10. O livre comércio beneficia mais do que prejudica a economia nacional.
11. Bancos e grandes corporações devem ser fortemente regulados.
12. A desigualdade econômica é um problema natural e aceitável.

#### **Bloco 2: Questões Sociais (12 questões)**
13. O casamento entre pessoas do mesmo sexo deve ser reconhecido legalmente.
14. O aborto deve ser uma escolha da mulher em qualquer circunstância.
15. Cotas raciais em universidades e concursos são necessárias.
16. A religião deve influenciar políticas públicas.
17. A educação sexual nas escolas é fundamental.
18. Drogas leves devem ser legalizadas.
19. Valores tradicionais familiares estão em declínio perigoso.
20. A diversidade de gênero deve ser ensinada nas escolas.
21. Manifestações culturais tradicionais devem ser preservadas mesmo se controversas.
22. A imigração cultural enriquece mais do que ameaça a identidade nacional.
23. A pena de morte é justificável para crimes graves.
24. Expressões artísticas nunca devem ser censuradas, independente do conteúdo.

#### **Bloco 3: Autoridade e Liberdade (11 questões)**
25. Em situações de crise, a democracia pode ser temporariamente suspensa.
26. O Estado deve ter acesso a comunicações privadas para combater o crime.
27. Câmeras de vigilância em espaços públicos aumentam a segurança necessária.
28. A polícia deve ter amplos poderes para manter a ordem.
29. Leis restritivas à liberdade de expressão são necessárias contra discurso de ódio.
30. O porte de armas deve ser um direito individual irrestrito.
31. O governo deve ter controle sobre informações que circulam na internet.
32. Manifestações que bloqueiam vias públicas devem ser reprimidas.
33. A descentralização de poder (federalismo forte) é preferível à centralização.
34. Cidadãos devem ter direito de desobedecer leis injustas.
35. O serviço militar obrigatório fortalece a sociedade.

#### **Bloco 4: Globalismo e Nacionalismo (10 questões)**
36. A soberania nacional deve sempre prevalecer sobre acordos internacionais.
37. A imigração deve ser fortemente restrita para proteger empregos nacionais.
38. Organizações internacionais (ONU, OMS) têm autoridade excessiva.
39. O país deve priorizar aliados ideológicos em relações internacionais.
40. Culturas locais devem ser protegidas da homogeneização global.
41. Intervenções militares humanitárias internacionais são justificáveis.
42. Tratados de livre comércio prejudicam trabalhadores nacionais.
43. Mudanças climáticas exigem coordenação global acima de interesses nacionais.
44. A identidade nacional é mais importante que a identidade global/cosmopolita.
45. Países ricos têm obrigação moral de ajudar países pobres.

### 6.2 Questões Abertas (5 questões opcionais)
- "Descreva em suas palavras o papel ideal do governo na economia."
- "Qual sua posição sobre equilíbrio entre segurança e liberdade individual?"
- "Como você vê a importância da tradição versus mudança social?"
- "Qual sua visão sobre o papel do seu país no cenário internacional?"
- "Alguma questão política específica que você considera fundamental?"

---

## 7. SISTEMA DE SCORING E CLASSIFICAÇÃO

### 7.1 Cálculo de Scores
```
Score Dimensão = Σ(Resposta × Peso) / Σ(Pesos) × 10
Normalizado para escala 0-10
```

### 7.2 Classificações Principais

#### **Eixo Econômico:**
- 0-2: Extrema Esquerda
- 2-4: Esquerda
- 4-6: Centro / Centro-Esquerda / Centro-Direita
- 6-8: Direita
- 8-10: Extrema Direita

#### **Eixo Social:**
- 0-2: Extremamente Progressista
- 2-4: Progressista
- 4-6: Moderado
- 6-8: Conservador
- 8-10: Extremamente Conservador

#### **Eixo Autoridade:**
- 0-2: Libertário Extremo
- 2-4: Libertário
- 4-6: Moderado
- 6-8: Autoritário
- 8-10: Autoritário Extremo

#### **Eixo Global-Nacional:**
- 0-2: Extremamente Globalista
- 2-4: Globalista
- 4-6: Moderado
- 6-8: Nacionalista
- 8-10: Extremamente Nacionalista

### 7.3 Classificação Composta
Combinação dos eixos principais:
- "Social-Democrata" (Esquerda econômica + Progressista social)
- "Liberal Clássico" (Direita econômica + Libertário + Progressista)
- "Conservador Tradicional" (Direita econômica + Conservador social)
- "Populista de Esquerda" (Esquerda econômica + Autoritário + Nacionalista)
- "Libertário de Direita" (Direita econômica + Libertário)
- Etc. (20-25 classificações possíveis)

---

## 8. DESIGN DE INTERFACE (UI/UX)

### 8.1 Princípios de Design
- **Minimalista e limpo**: Foco no conteúdo, sem distrações
- **Cores neutras com acentos vibrantes**: 
  - Primária: Azul profundo (#2C3E50)
  - Secundária: Verde sábio (#27AE60)
  - Acento: Laranja energético (#E67E22)
- **Tipografia legível**: 
  - Headings: Montserrat/Poppins (sans-serif)
  - Body: Open Sans/Roboto
  - Tamanho mínimo: 16px
- **Micro-interações**: Feedback visual para cada ação
- **Storytelling visual**: Progresso como jornada de autodescoberta

### 8.2 Componentes-Chave

#### **Landing Page**
```
[Hero Section]
- Headline impactante: "Descubra seu verdadeiro posicionamento político"
- Subheadline: "Análise científica com inteligência artificial"
- CTA button destacado
- Ilustração/animação conceitual

[Como Funciona]
- 3 passos visuais
- Badges de credibilidade (científico, privado, rápido)

[Estatísticas]
- Contador de participantes
- Preview de gráfico de distribuição

[Footer]
- Sobre o projeto
- Metodologia
- Contato/Feedback
```

#### **Questionário**
```
[Header]
- Logo
- Barra de progresso segmentada (4 blocos temáticos)
- Indicador numérico (Questão X de 45)

[Corpo]
- Questão central em destaque
- Escala Likert visual interativa
- Botão "?" para explicação
- Botões "Anterior" e "Próximo"
- Link discreto "Pular questão"

[Sidebar/Modal de Ajuda]
- Chat com Gemini
- Explicações contextuais
```

#### **Resultados**
```
[Header]
- Título personalizado: "Seus Resultados, [Nome opcional]"

[Visualização Principal]
- Gráfico radar central (grande e impactante)
- Scores numéricos ao redor do radar

[Classificação]
- Badge com classificação principal
- Descrição detalhada (2-3 parágrafos)

[Explicação Personalizada]
- Texto gerado pelo Gemini
- Destacar insights únicos

[Contexto]
- "O que isso significa?"
- Figuras políticas similares (com disclaimer)

[Ações]
- Compartilhar (Twitter, Facebook, WhatsApp, LinkedIn)
- Download de imagem
- Ver ranking global
- Refazer teste

[Disclaimer]
- Nota sobre natureza educacional
- Limitações do teste
```

#### **Ranking Global**
```
[Visualizações]
- Gráfico de pizza/donut: Distribuição geral
- Gráficos de barras: Cada dimensão separadamente
- Heatmap: Distribuição bidimensional (econômico x social)

[Estatísticas]
- Total de participantes
- Classificação mais comum
- Tendências ao longo do tempo

[Filtros]
- Período
- Região (se aplicável)
```

---

## 9. ESTRATÉGIA DE VIRALIZAÇÃO

### 9.1 Elementos Virais
- **Shareability**: Resultados visuais impressionantes
- **Surpresa**: Insights inesperados sobre si mesmo
- **Comparação social**: "Compare com seus amigos"
- **Curiosidade**: "X% das pessoas são como você"
- **Controvérsia saudável**: Pode gerar discussões construtivas
- **Personalização**: Cada resultado é único

### 9.2 Social Sharing Cards
- **Open Graph tags otimizadas**
- **Card visual customizado por usuário**:
  ```
  [Imagem gerada dinamicamente]
  "Meu Compass Político:
  [Gráfico radar miniatura]
  Classificação: [X]
  Descubra o seu em [URL]"
  ```

### 9.3 Gamificação Sutil
- **Badges de conclusão**: "Pensador Completo" (respondeu todas)
- **Consistência**: Indicador de coerência das respostas
- **Raridade**: "Você está entre os X% com essa combinação"

---

## 10. MÉTRICAS DE SUCESSO (KPIs)

### 10.1 Métricas de Engajamento
- Taxa de conclusão do questionário (meta: >70%)
- Tempo médio de conclusão (meta: 8-12 minutos)
- Taxa de compartilhamento (meta: >25%)
- Retorno para ver ranking (meta: >40%)
- Uso do sistema de explicações (meta: >30% fazem perguntas)

### 10.2 Métricas de Crescimento
- Usuários únicos por dia/semana/mês
- Taxa de crescimento viral (K-factor)
- Taxa de retorno (refazer teste)
- Origem do tráfego (orgânico, social, direto)

### 10.3 Métricas de Qualidade
- Consistência média das respostas (via validação cruzada)
- Tempo de resposta da API Gemini
- Taxa de erro de API
- Feedback qualitativo (thumbs up/down nos resultados)

---

## 11. FASES DE DESENVOLVIMENTO

### Fase 1: MVP (4-6 semanas)
- Landing page básica
- 30 questões essenciais (10 por eixo: econômico, social, autoridade)
- Integração básica com Gemini
- Página de resultados com gráfico radar
- Compartilhamento social básico
- Armazenamento simples no Sheets

### Fase 2: Aprimoramento (3-4 semanas)
- 45 questões completas (4 eixos)
- Sistema de explicações com Gemini
- Ranking global com visualizações
- Otimização de UX/UI
- Testes de usabilidade
- Implementação de analytics

### Fase 3: Polimento (2-3 semanas)
- Questões abertas opcionais
- Classificações compostas sofisticadas
- Animações e micro-interações
- Otimização de performance
- Acessibilidade completa
- Marketing e lançamento

---

## 12. RISCOS E MITIGAÇÕES

### 12.1 Riscos Técnicos
| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| API Gemini instável | Alto | Implementar retry logic, cache, fallback para análise baseada em regras |
| Custos de API elevados | Médio | Rate limiting, otimização de prompts, caching de explicações comuns |
| Performance em mobile | Médio | Lazy loading, otimização de assets, progressive enhancement |

### 12.2 Riscos de Produto
| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Resultados imprecisos | Alto | Validação científica rigorosa, testes com grupo piloto, ajustes de pesos |
| Baixo engajamento | Alto | Testes A/B, feedback constante, iteração rápida em UX |
| Controvérsia política | Médio | Disclaimers claros, tons neutros, foco educacional |
| Viés na classificação | Médio | Revisão por cientistas políticos, transparência metodológica |

### 12.3 Riscos de Privacidade
| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Vazamento de dados | Alto | Anonimização completa, não coletar PII, HTTPS |
| Uso indevido de dados | Médio | Termos de uso claros, dados agregados apenas |

---

## 13. PROMPT PARA GEMINI (Template)

```markdown
# SISTEMA: ANÁLISE DE POSICIONAMENTO POLÍTICO

Você é um cientista político PhD especializado em análise quantitativa de posicionamento político. Sua tarefa é analisar as respostas de um questionário político e fornecer uma classificação precisa e nuançada.

## METODOLOGIA
Utilize um modelo multidimensional baseado em 4 eixos:
1. Econômico (0=Extrema Esquerda, 10=Extrema Direita)
2. Social (0=Progressista Extremo, 10=Conservador Extremo)
3. Autoridade (0=Libertário Extremo, 10=Autoritário Extremo)
4. Global-Nacional (0=Globalista Extremo, 10=Nacionalista Extremo)

## RESPOSTAS DO USUÁRIO
[Inserir respostas estruturadas aqui]
Questão 1: [Escala -3 a +3]
Questão 2: [Escala -3 a +3]
...
Respostas abertas (se houver): [Texto]

## INSTRUÇÕES DE ANÁLISE
1. Calcule scores para cada dimensão considerando:
   - Padrões de resposta
   - Consistência interna
   - Nuances em respostas abertas
   
2. Identifique a classificação principal que melhor representa a combinação dos 4 eixos

3. Forneça análise personalizada incluindo:
   - Características principais do posicionamento
   - Possíveis tensões ou contradições
   - Contexto histórico-político

## FORMATO DE RESPOSTA OBRIGATÓRIO (JSON)
```json
{
  "scores": {
    "economico": 5.5,
    "social": 3.2,
    "autoridade": 4.8,
    "global_nacional": 6.1
  },
  "classificacao_principal": "Social-Democrata Moderado",
  "consistencia": "alta",
  "analise_personalizada": "[Texto de 200-300 palavras explicando os resultados de forma personalizada e educativa]",
  "caracteristicas_chave": [
    "Favorece intervenção econômica moderada do Estado",
    "Posições socialmente progressistas",
    "Equilibra autoridade e liberdades individuais",
    "Abordagem moderadamente nacionalista"
  ],
  "insights": "[Observações únicas baseadas nas respostas específicas]"
}
```

## DIRETRIZES ÉTICAS
- Seja neutro e descritivo, nunca prescritivo
- Evite linguagem valorativa ou julgamentos morais
- Reconheça complexidade e nuances
- Destaque que posicionamentos políticos são multifacetados
- Enfatize o caráter educacional da ferramenta
```

---

## 14. CONSIDERAÇÕES FINAIS

### 14.1 Diferenciação de Mercado
- **Científico**: Baseado em teoria política estabelecida
- **Multidimensional**: Vai além de esquerda-direita simplista
- **Personalizado**: IA gera insights únicos para cada usuário
- **Educacional**: Explicações contextuais aprofundam conhecimento
- **Transparente**: Metodologia aberta e clara

### 14.2 Próximos Passos
1. Validação do questionário com cientistas políticos
2. Teste piloto com 50-100 usuários
3. Ajuste de pesos e classificações baseado em feedback
4. Desenvolvimento do MVP
5. Beta privado com 500-1000 usuários
6. Iteração baseada em dados
7. Lançamento público

### 14.3 Evolução Futura
- Versões do questionário em outros idiomas
- Comparação com espectros políticos de diferentes países
- Análise temporal: "Como seu posicionamento mudou?"
- Comunidade: Fóruns de discussão por cluster político
- API pública para pesquisadores (anonimizada)

---

## ANEXOS

### Anexo A: Referências Científicas
- Nolan, David (1971). "The Nolan Chart"
- Political Compass (2001). Two-dimensional political spectrum
- Moral Foundations Theory (Haidt, 2012)
- Inglehart-Welzel Cultural Map
- Eysenck, H.J. (1954). "The Psychology of Politics"

### Anexo B: Prompt de Explicação para Questões
```
Explique o conceito político por trás da seguinte questão de forma:
- Clara e acessível (