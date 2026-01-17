import { addDoc, collection, getCountFromServer, onSnapshot, query } from 'firebase/firestore';
import { db } from './firebase';
import { PoliticalResult } from '../types';

export interface ParticipationDoc extends PoliticalResult {
  createdAtMs: number;
}

const PARTICIPATION_COLLECTION = 'bussola';

const toFiniteNumber = (value: unknown, fallback: number) => {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeParticipation = (result: PoliticalResult): ParticipationDoc => {
  return {
    classificacao_principal: String(result.classificacao_principal || 'Indefinido'),
    scores: {
      economico: toFiniteNumber(result.scores?.economico, 5),
      social: toFiniteNumber(result.scores?.social, 5),
      cultural: toFiniteNumber(result.scores?.cultural, 5),
      nacional: toFiniteNumber(result.scores?.nacional, 5)
    },
    intensidade_geral: toFiniteNumber(result.intensidade_geral, 5),
    analise_detalhada: String(result.analise_detalhada || ''),
    figuras_similares: Array.isArray(result.figuras_similares)
      ? result.figuras_similares.map((item) => String(item))
      : [],
    confianca_classificacao: toFiniteNumber(result.confianca_classificacao, 0),
    createdAtMs: Date.now()
  };
};

export const saveParticipation = (result: PoliticalResult) => {
  const payload = normalizeParticipation(result);
  return addDoc(collection(db, PARTICIPATION_COLLECTION), payload);
};

export const subscribeToParticipations = (
  onData: (items: ParticipationDoc[]) => void,
  onError: (error: Error) => void
) => {
  const q = query(collection(db, PARTICIPATION_COLLECTION));

  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((doc) => doc.data() as ParticipationDoc);
      onData(items);
    },
    (error) => {
      onError(error);
    }
  );
};

export const getParticipationCount = async () => {
  const snapshot = await getCountFromServer(collection(db, PARTICIPATION_COLLECTION));
  return snapshot.data().count;
};
