
import { UserAnswer, Question, Scores, PoliticalResult, SelfPositioningSelection } from "../types";

export const calculateLocalScores = (answers: UserAnswer[], questions: Question[]): Scores => {
  const scores: Scores = {
    economico: 5,
    social: 5,
    cultural: 5,
    nacional: 5
  };

  const counts: Record<string, number> = { economico: 0, social: 0, cultural: 0, nacional: 0 };

  answers.forEach(ans => {
    const q = questions.find(item => item.id === ans.questionId);
    if (!q) return;

    const normalizedValue = (ans.value - 3); // -2 to +2
    
    Object.entries(q.effect).forEach(([dim, weight]) => {
      const d = dim as keyof Scores;
      if (weight !== undefined) {
        // Simple linear shift: max shift per question is about 1 point on a 0-10 scale
        scores[d] += (normalizedValue * weight * q.weight * 0.5);
        counts[d]++;
      }
    });
  });

  // Clamp 0-10
  scores.economico = Math.max(0, Math.min(10, scores.economico));
  scores.social = Math.max(0, Math.min(10, scores.social));
  scores.cultural = Math.max(0, Math.min(10, scores.cultural));
  scores.nacional = Math.max(0, Math.min(10, scores.nacional));

  return scores;
};

export const getClassificationFromScores = (scores: Scores): string => {
  const { economico: e, social: s } = scores;
  if (e < 4 && s < 4) return "Esquerda Autoritária";
  if (e < 4 && s > 6) return "Esquerda Libertária";
  if (e > 6 && s < 4) return "Direita Autoritária";
  if (e > 6 && s > 6) return "Direita Libertária";
  return "Centro";
};

export const generateBackupResult = (
  answers: UserAnswer[],
  questions: Question[],
  selfPositioning?: SelfPositioningSelection | null
): PoliticalResult => {
  const scores = calculateLocalScores(answers, questions);
  const classif = getClassificationFromScores(scores);
  return {
    classificacao_principal: classif,
    scores,
    intensidade_geral: 5,
    analise_detalhada: "Esta análise foi gerada localmente como backup. Seus resultados sugerem um posicionamento equilibrado com nuances específicas em cada eixo avaliado.",
    figuras_similares: ["Figuras históricas variadas"],
    confianca_classificacao: 70,
    autoavaliacao: selfPositioning ?? null
  };
};
