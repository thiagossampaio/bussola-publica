
import { Question } from './types';

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
  }
];

export const LIKERT_OPTIONS = [
  { value: 1, label: "Discordo Totalmente", color: "bg-red-500" },
  { value: 2, label: "Discordo", color: "bg-red-300" },
  { value: 3, label: "Neutro", color: "bg-slate-300" },
  { value: 4, label: "Concordo", color: "bg-emerald-300" },
  { value: 5, label: "Concordo Totalmente", color: "bg-emerald-500" },
];
