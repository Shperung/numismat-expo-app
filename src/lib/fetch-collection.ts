import { collection, getDocs } from 'firebase/firestore';

import { db } from './firebase';

export async function fetchCollection(name: string) {
  const snapshot = await getDocs(collection(db, name));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
