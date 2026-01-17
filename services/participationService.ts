import { addDoc, collection, onSnapshot, query } from 'firebase/firestore';
import { db } from './firebase';
import { PoliticalResult } from '../types';

export interface ParticipationDoc extends PoliticalResult {
  createdAtMs: number;
}

const PARTICIPATION_COLLECTION = 'bussola';

export const saveParticipation = (result: PoliticalResult) => {
  const payload: ParticipationDoc = {
    ...result,
    createdAtMs: Date.now()
  };

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
