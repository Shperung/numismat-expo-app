import type { Coin } from '../types/coin';

const API_URL = 'https://inua.tetiana-redko.com';

type Message = { role: 'user' | 'assistant'; content: string };

export async function askServer(provider: string, coin: Coin, messages: Message[]) {
  const res = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider, coin, messages }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`${res.status} ${data.error}`);
  return data.text as string;
}
