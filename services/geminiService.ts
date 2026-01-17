
import { GoogleGenAI, Type } from "@google/genai";
import { UserAnswer, Question, PoliticalResult } from "../types";

// Removed global API_KEY constant to follow guidelines of using process.env.API_KEY directly in initialization

export const getQuestionExplanation = async (questionText: string): Promise<string> => {
  // Always create a new instance right before the call
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Você é um cientista político experiente e didático. Um usuário está respondendo a um questionário sobre posicionamento político e não entendeu a seguinte pergunta:

"${questionText}"

Explique de forma clara, imparcial e objetiva:
1. O que a pergunta está avaliando
2. O que significa concordar ou discordar
3. Exemplos práticos de cada posição
4. Por que esta questão é relevante para identificar posicionamento político

Mantenha uma linguagem acessível e neutra, sem influenciar a resposta do usuário.`,
    config: {
      // Basic task, disable thinking to reduce latency
      thinkingConfig: { thinkingBudget: 0 }
    }
  });
  return response.text || "Desculpe, não consegui carregar uma explicação agora.";
};

export const analyzePoliticalPosition = async (
  answers: UserAnswer[],
  questions: Question[]
): Promise<PoliticalResult> => {
  // Always create a new instance right before the call
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const payload = answers.map(a => {
    const q = questions.find(item => item.id === a.questionId);
    return {
      pergunta: q?.text,
      categoria: q?.category,
      resposta_valor: a.value, // 1-5
      interpretacao: a.value === 3 ? "Neutro" : a.value > 3 ? "Concorda" : "Discorda"
    };
  });

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Você é um cientista político renomado, formado pelas principais universidades do mundo, especializado em análise de espectro político e ideologias. Analise as respostas abaixo de um questionário político e forneça uma classificação detalhada.

RESPOSTAS DO USUÁRIO:
${JSON.stringify(payload, null, 2)}

INSTRUÇÕES:
1. Analise as respostas considerando múltiplas dimensões políticas:
   - Eixo Econômico (Esquerda 0 ↔ 10 Direita)
   - Eixo Social/Autoridade (Autoritário 0 ↔ 10 Libertário)
   - Eixo Cultural (Conservador 0 ↔ 10 Progressista)
   - Eixo Nacional (Nacionalista 0 ↔ 10 Globalista)

2. Forneça scores de 0 a 10 para cada dimensão.
3. Identifique a classificação política principal.
4. Forneça uma análise textual explicativa.
5. Liste figuras políticas históricas similares.

FORMATO DE RESPOSTA (JSON):
{
  "classificacao_principal": "string",
  "scores": {
    "economico": number (0-10),
    "social": number (0-10),
    "cultural": number (0-10),
    "nacional": number (0-10)
  },
  "intensidade_geral": number (0-10),
  "analise_detalhada": "string",
  "figuras_similares": ["string"],
  "confianca_classificacao": number (0-100)
}`,
    config: {
      responseMimeType: "application/json",
      // Complex task, use maximum thinking budget for better accuracy
      thinkingConfig: { thinkingBudget: 32768 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          classificacao_principal: { type: Type.STRING },
          scores: {
            type: Type.OBJECT,
            properties: {
              economico: { type: Type.NUMBER },
              social: { type: Type.NUMBER },
              cultural: { type: Type.NUMBER },
              nacional: { type: Type.NUMBER }
            },
            required: ["economico", "social", "cultural", "nacional"]
          },
          intensidade_geral: { type: Type.NUMBER },
          analise_detalhada: { type: Type.STRING },
          figuras_similares: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          confianca_classificacao: { type: Type.NUMBER }
        },
        required: ["classificacao_principal", "scores", "intensidade_geral", "analise_detalhada", "figuras_similares", "confianca_classificacao"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};
