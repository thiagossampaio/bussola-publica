
import { Question, Category, SelfPositioningOption, ConceptEntry } from './types';

export const QUESTIONS: Question[] = [
  // Economia (0: Esquerda, 10: Direita)
  // Concordar (+1) move para Direita, Discordar (-1) move para Esquerda
  {
    id: 1,
    category: 'economia',
    text: "O Estado deve ser o principal responsável por garantir saúde e educação gratuitas para todos.",
    effect: { economia: -1 },
    weight: 1.0
  },
  {
    id: 2,
    category: 'economia',
    text: "Impostos altos sobre as grandes fortunas são necessários para reduzir a desigualdade social.",
    effect: { economia: -1 },
    weight: 1.2
  },
  {
    id: 3,
    category: 'economia',
    text: "A privatização de empresas estatais geralmente melhora a eficiência dos serviços.",
    effect: { economia: 1 },
    weight: 1.0
  },
  {
    id: 4,
    category: 'economia',
    text: "O mercado deve se autorregular com o mínimo possível de interferência governamental.",
    effect: { economia: 1 },
    weight: 1.1
  },
  {
    id: 5,
    category: 'economia',
    text: "Programas de transferência de renda (como Bolsa Família) devem ser expandidos.",
    effect: { economia: -1 },
    weight: 0.9
  },
  {
    id: 21,
    category: 'economia',
    text: "O Estado deve controlar preços de itens essenciais em períodos de crise.",
    effect: { economia: -1 },
    weight: 1.0
  },
  {
    id: 22,
    category: 'economia',
    text: "Reduzir impostos e regulações deve ser prioridade para estimular o empreendedorismo.",
    effect: { economia: 1 },
    weight: 1.1
  },
  {
    id: 23,
    category: 'economia',
    text: "Empresas públicas devem existir em setores estratégicos, mesmo com menor lucro.",
    effect: { economia: -1 },
    weight: 1.0
  },
  {
    id: 24,
    category: 'economia',
    text: "O salário mínimo deveria ser definido pelo mercado, não pelo governo.",
    effect: { economia: 1 },
    weight: 1.0
  },
  {
    id: 25,
    category: 'economia',
    text: "Uma renda básica universal deve ser garantida a todos os cidadãos.",
    effect: { economia: -1 },
    weight: 1.1
  },

  // Social/Autoridade (0: Autoritário, 10: Libertário)
  // Concordar (+1) move para Libertário, Discordar (-1) move para Autoritário
  {
    id: 6,
    category: 'social',
    text: "A liberdade individual deve sempre prevalecer sobre o interesse coletivo do Estado.",
    effect: { social: 1 },
    weight: 1.0
  },
  {
    id: 7,
    category: 'social',
    text: "O governo deve ter o poder de monitorar comunicações privadas para garantir a segurança nacional.",
    effect: { social: -1 },
    weight: 1.2
  },
  {
    id: 8,
    category: 'social',
    text: "O consumo de drogas deve ser tratado como uma questão de liberdade individual e saúde, não crime.",
    effect: { social: 1 },
    weight: 1.0
  },
  {
    id: 9,
    category: 'social',
    text: "Leis rígidas de ordem pública são essenciais para uma sociedade segura, mesmo que limitem protestos.",
    effect: { social: -1 },
    weight: 1.1
  },
  {
    id: 10,
    category: 'social',
    text: "A posse de armas por cidadãos comuns deve ser um direito garantido pelo Estado.",
    effect: { social: 1 },
    weight: 1.0
  },
  {
    id: 26,
    category: 'social',
    text: "Protestos e greves devem poder ocorrer sem autorização prévia do governo.",
    effect: { social: 1 },
    weight: 1.0
  },
  {
    id: 27,
    category: 'social',
    text: "O uso de reconhecimento facial em espaços públicos é necessário para combater o crime.",
    effect: { social: -1 },
    weight: 1.1
  },
  {
    id: 28,
    category: 'social',
    text: "Liberdade de expressão deve incluir críticas severas ao governo e às autoridades.",
    effect: { social: 1 },
    weight: 1.0
  },
  {
    id: 29,
    category: 'social',
    text: "Penas mais duras, inclusive prisão perpétua, são necessárias para certos crimes.",
    effect: { social: -1 },
    weight: 1.1
  },
  {
    id: 30,
    category: 'social',
    text: "O Estado deve restringir conteúdos na internet para proteger crianças e adolescentes.",
    effect: { social: -1 },
    weight: 0.9
  },

  // Cultural (0: Conservador, 10: Progressista)
  // Concordar (+1) move para Progressista, Discordar (-1) move para Conservador
  {
    id: 11,
    category: 'cultural',
    text: "O aborto deve ser legalizado e garantido pelo sistema público de saúde.",
    effect: { cultural: 1 },
    weight: 1.2
  },
  {
    id: 12,
    category: 'cultural',
    text: "Valores religiosos devem ter influência direta na elaboração das leis do país.",
    effect: { cultural: -1 },
    weight: 1.1
  },
  {
    id: 13,
    category: 'cultural',
    text: "Cotas raciais em universidades e empregos públicos são fundamentais para a justiça histórica.",
    effect: { cultural: 1 },
    weight: 1.0
  },
  {
    id: 14,
    category: 'cultural',
    text: "A preservação da família tradicional deve ser uma das prioridades das políticas culturais.",
    effect: { cultural: -1 },
    weight: 1.0
  },
  {
    id: 15,
    category: 'cultural',
    text: "Escolas devem ensinar sobre diversidade de gênero e orientação sexual.",
    effect: { cultural: 1 },
    weight: 0.9
  },
  {
    id: 31,
    category: 'cultural',
    text: "O casamento entre pessoas do mesmo sexo deve ter os mesmos direitos civis.",
    effect: { cultural: 1 },
    weight: 1.0
  },
  {
    id: 32,
    category: 'cultural',
    text: "Tradições culturais devem ser preservadas mesmo que limitem costumes modernos.",
    effect: { cultural: -1 },
    weight: 1.0
  },
  {
    id: 33,
    category: 'cultural',
    text: "Políticas públicas devem incentivar o uso de linguagem inclusiva.",
    effect: { cultural: 1 },
    weight: 0.9
  },
  {
    id: 34,
    category: 'cultural',
    text: "Arte financiada pelo Estado deve respeitar valores morais tradicionais.",
    effect: { cultural: -1 },
    weight: 1.1
  },
  {
    id: 35,
    category: 'cultural',
    text: "Direitos de pessoas trans devem ser reconhecidos em documentos oficiais.",
    effect: { cultural: 1 },
    weight: 1.0
  },

  // Nacional (0: Nacionalista, 10: Globalista)
  // Concordar (+1) move para Globalista, Discordar (-1) move para Nacionalista
  {
    id: 16,
    category: 'nacional',
    text: "O país deve priorizar acordos internacionais de livre comércio, mesmo que prejudiquem a indústria nacional local.",
    effect: { nacional: 1 },
    weight: 1.0
  },
  {
    id: 17,
    category: 'nacional',
    text: "A soberania nacional é sagrada e organismos internacionais não devem interferir em assuntos internos.",
    effect: { nacional: -1 },
    weight: 1.2
  },
  {
    id: 18,
    category: 'nacional',
    text: "Imigração deve ser incentivada pois enriquece a cultura e a economia do país.",
    effect: { nacional: 1 },
    weight: 1.0
  },
  {
    id: 19,
    category: 'nacional',
    text: "O patriotismo e o ensino de símbolos nacionais devem ser obrigatórios nas escolas.",
    effect: { nacional: -1 },
    weight: 0.8
  },
  {
    id: 20,
    category: 'nacional',
    text: "Questões ambientais globais devem se sobrepor aos interesses de desenvolvimento econômico nacional.",
    effect: { nacional: 1 },
    weight: 1.1
  },
  {
    id: 36,
    category: 'nacional',
    text: "Investimentos estrangeiros em setores estratégicos devem ser facilitados.",
    effect: { nacional: 1 },
    weight: 1.0
  },
  {
    id: 37,
    category: 'nacional',
    text: "Produtos nacionais devem ter preferência em compras públicas.",
    effect: { nacional: -1 },
    weight: 1.0
  },
  {
    id: 38,
    category: 'nacional',
    text: "O país deve aceitar decisões de tribunais internacionais de direitos humanos.",
    effect: { nacional: 1 },
    weight: 1.1
  },
  {
    id: 39,
    category: 'nacional',
    text: "Controle rigoroso de fronteiras é essencial, mesmo que reduza a imigração.",
    effect: { nacional: -1 },
    weight: 1.0
  },
  {
    id: 40,
    category: 'nacional',
    text: "Cooperação internacional em ciência deve ser prioridade estratégica.",
    effect: { nacional: 1 },
    weight: 0.9
  }
];

export const MAX_QUESTIONS = 20;

const shuffle = <T,>(items: T[]): T[] => {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
};

export const buildQuestionnaireQuestions = (
  questions: Question[] = QUESTIONS,
  maxTotal = MAX_QUESTIONS
): Question[] => {
  if (maxTotal <= 0) {
    return [];
  }

  const byCategory = questions.reduce((acc, question) => {
    const category = question.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(question);
    return acc;
  }, {} as Record<Category, Question[]>);

  const categories = Object.keys(byCategory) as Category[];
  if (!categories.length) {
    return [];
  }

  const maxPerCategory = Math.floor(maxTotal / categories.length);
  if (maxPerCategory <= 0) {
    return [];
  }

  const perCategory = Math.min(
    maxPerCategory,
    ...categories.map(category => byCategory[category].length)
  );

  const selected = categories.flatMap(category =>
    shuffle([...byCategory[category]]).slice(0, perCategory)
  );

  return shuffle(selected);
};

export const LIKERT_OPTIONS = [
  { value: 1, label: "Discordo Totalmente", color: "bg-red-500" },
  { value: 2, label: "Discordo", color: "bg-red-300" },
  { value: 3, label: "Neutro", color: "bg-slate-300" },
  { value: 4, label: "Concordo", color: "bg-emerald-300" },
  { value: 5, label: "Concordo Totalmente", color: "bg-emerald-500" },
];

export const SELF_POSITIONING_OPTIONS: SelfPositioningOption[] = [
  {
    id: 'esquerda',
    label: 'Esquerda',
    description: 'Ênfase em igualdade social e intervenção econômica do Estado.',
    scores: { economico: 2.5, social: 5, cultural: 5, nacional: 5 }
  },
  {
    id: 'centro_esquerda',
    label: 'Centro-Esquerda',
    description: 'Equilíbrio com viés social e políticas públicas ativas.',
    scores: { economico: 4, social: 5, cultural: 5, nacional: 5 }
  },
  {
    id: 'centro',
    label: 'Centro',
    description: 'Posição moderada e pragmática entre Estado e mercado.',
    scores: { economico: 5, social: 5, cultural: 5, nacional: 5 }
  },
  {
    id: 'centro_direita',
    label: 'Centro-Direita',
    description: 'Maior foco em mercado com responsabilidades sociais moderadas.',
    scores: { economico: 6, social: 5, cultural: 5, nacional: 5 }
  },
  {
    id: 'direita',
    label: 'Direita',
    description: 'Ênfase em livre mercado e menor intervenção estatal.',
    scores: { economico: 7.5, social: 5, cultural: 5, nacional: 5 }
  },
  {
    id: 'nao_sei',
    label: 'Não sei / Prefiro não dizer',
    description: 'Sem autoavaliação no momento.',
    scores: null
  }
];

export const UF_OPTIONS = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
];

export const CONCEPT_LIBRARY: ConceptEntry[] = [
  {
    id: 'estado-bem-estar',
    title: 'Estado de bem-estar social',
    description: 'Debate sobre o papel do Estado em garantir saúde, educação e proteção social.',
    category: 'economia',
    questionIds: [1, 5, 21, 25]
  },
  {
    id: 'tributacao-progressiva',
    title: 'Tributação progressiva',
    description: 'Discussão sobre impostos sobre renda e patrimônio para reduzir desigualdades.',
    category: 'economia',
    questionIds: [2]
  },
  {
    id: 'livre-mercado',
    title: 'Livre mercado e privatizações',
    description: 'Ideias sobre autorregulação econômica, privatização e estímulo ao empreendedorismo.',
    category: 'economia',
    questionIds: [3, 4, 22, 24]
  },
  {
    id: 'liberdades-civis',
    title: 'Liberdades civis',
    description: 'Liberdade de expressão, protestos e proteção contra abuso estatal.',
    category: 'social',
    questionIds: [6, 26, 28]
  },
  {
    id: 'seguranca-vigilancia',
    title: 'Segurança pública e vigilância',
    description: 'Uso de monitoramento e endurecimento penal para garantir ordem.',
    category: 'social',
    questionIds: [7, 9, 27, 29, 30]
  },
  {
    id: 'diversidade-direitos',
    title: 'Diversidade e direitos civis',
    description: 'Reconhecimento de minorias, ações afirmativas e políticas inclusivas.',
    category: 'cultural',
    questionIds: [13, 15, 31, 33, 35]
  },
  {
    id: 'tradicao-moral',
    title: 'Tradição e moralidade pública',
    description: 'Prioridade a valores tradicionais, religião e preservação cultural.',
    category: 'cultural',
    questionIds: [12, 14, 32, 34]
  },
  {
    id: 'direitos-reprodutivos',
    title: 'Direitos reprodutivos',
    description: 'Políticas sobre aborto e autonomia corporal.',
    category: 'cultural',
    questionIds: [11]
  },
  {
    id: 'soberania-globalizacao',
    title: 'Soberania e globalização',
    description: 'Equilíbrio entre cooperação internacional e autonomia nacional.',
    category: 'nacional',
    questionIds: [16, 17, 38]
  },
  {
    id: 'imigracao-fronteiras',
    title: 'Imigração e fronteiras',
    description: 'Abertura ou restrição de fluxos migratórios e controle territorial.',
    category: 'nacional',
    questionIds: [18, 39]
  },
  {
    id: 'nacionalismo-economico',
    title: 'Nacionalismo econômico',
    description: 'Proteção de setores estratégicos e preferência por produtos locais.',
    category: 'nacional',
    questionIds: [19, 37, 36]
  },
  {
    id: 'cooperacao-cientifica',
    title: 'Cooperação científica e ambiental',
    description: 'Coordenação internacional em ciência e meio ambiente.',
    category: 'nacional',
    questionIds: [20, 40]
  }
];
