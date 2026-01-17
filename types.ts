
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

export interface PoliticalResult {
  classificacao_principal: string;
  scores: Scores;
  intensidade_geral: number;
  analise_detalhada: string;
  figuras_similares: string[];
  confianca_classificacao: number;
  timestamp?: number;
}

export enum AppState {
  LANDING = 'LANDING',
  CONSENT = 'CONSENT',
  QUESTIONNAIRE = 'QUESTIONNAIRE',
  RESULTS = 'RESULTS',
  RANKING = 'RANKING'
}
