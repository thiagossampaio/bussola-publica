import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBz2Hs6XjLfnbZ1oB08QoftHNJNoyKLArY",
  authDomain: "bussola-251eb.firebaseapp.com",
  projectId: "bussola-251eb",
  storageBucket: "bussola-251eb.firebasestorage.app",
  messagingSenderId: "232559255310",
  appId: "1:232559255310:web:af3a8203eda66a1b72415f"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const db = getFirestore(app);
