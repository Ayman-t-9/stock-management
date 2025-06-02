import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, getDoc, doc, addDoc, updateDoc, serverTimestamp, query, where } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export interface Supplier {
  id: string;
  name: string;
  category?: 'electrical' | 'mechanical';
}

export interface Piece {
  id: string;
  name: string;
  category: 'electrical' | 'mechanical';
}

// TODO: Replace with your Firebase project config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export async function addInventoryItem(data: any) {
  const docRef = await addDoc(collection(db, "inventory"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function addEntryVoucher(data: any) {
  const docRef = await addDoc(collection(db, "entrees"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getSuppliers(category?: 'electrical' | 'mechanical'): Promise<Supplier[]> {
  const suppliersRef = collection(db, "suppliers");
  const q = category ? query(suppliersRef, where("category", "==", category)) : suppliersRef;
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Supplier));
}

export async function getPieces(category: 'electrical' | 'mechanical'): Promise<Piece[]> {
  const piecesRef = collection(db, "pieces");
  const q = query(piecesRef, where("category", "==", category));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Piece));
}

// Debug Firebase connection
console.log('Firebase initialized with config:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain
});

export { db, auth, signInWithEmailAndPassword, collection, getDocs, getDoc, doc };
