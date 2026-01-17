
export type Category = 'economia' | 'social' | 'cultural' | 'nacional';

export interface Question {
  id: number;
  category: Category;
  text: string;
  effect: {
    [key in Category]?: number; // -1 to 1
  };
  weight: number;
}

export interface UserAnswer {
  questionId: number;
  value: number; // 1 (Discordo Totalmente) to 5 (Concordo Totalmente)
}

export interface Scores {
  economico: number;
  social: number;
  cultural: number;
  nacional: number;
}

export interface ConceptEntry {
  id: string;
  title: string;
  description: string;
  category: Category;
  questionIds: number[];
}

export type SelfPositioningId =
  | 'esquerda'
  | 'centro_esquerda'
  | 'centro'
  | 'centro_direita'
  | 'direita'
  | 'nao_sei';

export interface SelfPositioningOption {
  id: SelfPositioningId;
  label: string;
  description: string;
  scores: Scores | null;
}

export interface SelfPositioningSelection {
  id: SelfPositioningId;
  label: string;
  scores: Scores | null;
}

export interface PoliticalResult {
  id?: string;
  classificacao_principal: string;
  scores: Scores;
  intensidade_geral: number;
  analise_detalhada: string;
  figuras_similares: string[];
  confianca_classificacao: number;
  autoavaliacao?: SelfPositioningSelection | null;
  timestamp?: number;
  prioridades?: Scores | null;
  uf?: string | null;
  ufOptIn?: boolean;
}

export enum AppState {
  LANDING = 'LANDING',
  CONSENT = 'CONSENT',
  SELF_ASSESSMENT = 'SELF_ASSESSMENT',
  QUESTIONNAIRE = 'QUESTIONNAIRE',
  RESULTS = 'RESULTS',
  RANKING = 'RANKING'
}
