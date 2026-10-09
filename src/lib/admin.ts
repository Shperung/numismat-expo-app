import { addDoc, collection, deleteDoc, deleteField, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import type { Coin } from '../types/coin';
import type { Country } from '../types/country';
import { db, storage } from './firebase';

export type CoinValues = Omit<Coin, 'id' | 'avers' | 'revers'>;

async function uploadPhoto(path: string, uri: string) {
  const blob = await (await fetch(uri)).blob();
  const photoRef = ref(storage, path);
  await uploadBytes(photoRef, blob, { contentType: blob.type || 'image/jpeg' });
  return getDownloadURL(photoRef);
}

/** `photos` — локальні URI лише нових (вибраних) фото. */
export async function saveCoin(
  id: string | null,
  { info, ...values }: CoinValues,
  photos: { avers?: string; revers?: string },
) {
  const prefix = `coins/${values.country}/${values.value}-${values.currency}-${values.year}-${Date.now()}`;
  const upload = (side: 'avers' | 'revers') => photos[side] && uploadPhoto(`${prefix}-${side}.jpg`, photos[side]);
  const [avers, revers] = await Promise.all([upload('avers'), upload('revers')]);
  const data = { ...values, ...(avers && { avers }), ...(revers && { revers }) };

  if (id) {
    await updateDoc(doc(db, 'coins', id), { ...data, info: info || deleteField() });
    return id;
  }
  return (await addDoc(collection(db, 'coins'), { ...data, ...(info && { info }) })).id;
}

export async function deleteCoin(coin: Coin) {
  await deleteDoc(doc(db, 'coins', coin.id));
  const photos = [coin.avers, coin.revers].filter((url): url is string => !!url);
  await Promise.allSettled(photos.map((url) => deleteObject(ref(storage, url))));
}

export async function addCountry({ id, ...values }: Country) {
  const countryRef = doc(db, 'countries', id);
  if ((await getDoc(countryRef)).exists()) throw new Error(`Країна «${id}» вже існує`);
  await setDoc(countryRef, values);
}
