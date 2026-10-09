import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { fetchCollection } from '../lib/fetch-collection';
import type { Country } from '../types/country';

type CountriesState = {
  countries: Country[];
  loading: boolean;
  error: string | null;
};

const CountriesContext = createContext<CountriesState & { reload: () => Promise<void> }>({
  countries: [],
  loading: true,
  error: null,
  reload: async () => {},
});

export function CountriesProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CountriesState>({ countries: [], loading: true, error: null });

  const reload = () =>
    fetchCollection('countries')
      .then((countries) => setState({ countries: countries as Country[], loading: false, error: null }))
      .catch((e) => setState({ countries: [], loading: false, error: String(e) }));

  useEffect(() => {
    reload();
  }, []);

  return <CountriesContext.Provider value={{ ...state, reload }}>{children}</CountriesContext.Provider>;
}

export const useCountries = () => useContext(CountriesContext);

export const useCountry = (id: string) => useCountries().countries.find((c) => c.id === id);
