import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { fetchCollection } from '../lib/fetch-collection';
import type { Coin } from '../types/coin';

type CoinsState = {
  coins: Coin[];
  loading: boolean;
  error: string | null;
};

const CoinsContext = createContext<CoinsState & { reload: () => Promise<void> }>({
  coins: [],
  loading: true,
  error: null,
  reload: async () => {},
});

export function CoinsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CoinsState>({ coins: [], loading: true, error: null });

  const reload = () =>
    fetchCollection('coins')
      .then((coins) => setState({ coins: coins as Coin[], loading: false, error: null }))
      .catch((e) => setState({ coins: [], loading: false, error: String(e) }));

  useEffect(() => {
    reload();
  }, []);

  return <CoinsContext.Provider value={{ ...state, reload }}>{children}</CoinsContext.Provider>;
}

export const useCoins = () => useContext(CoinsContext);
