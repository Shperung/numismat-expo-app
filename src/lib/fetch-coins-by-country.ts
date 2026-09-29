import { collection, getDocs, query, where } from 'firebase/firestore';

import type { Coin } from '../types/coin';
import { db } from './firebase';

export async function fetchCoinsByCountry(country: string) {
  const snapshot = await getDocs(query(collection(db, 'coins'), where('country', '==', country)));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Coin);
}
