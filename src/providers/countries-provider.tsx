import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { fetchCollection } from '../lib/fetch-collection';
import type { Country } from '../types/country';

type CountriesState = {
  countries: Country[];
  loading: boolean;
  error: string | null;
};

const CountriesContext = createContext<CountriesState>({ countries: [], loading: true, error: null });

export function CountriesProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CountriesState>({ countries: [], loading: true, error: null });

  useEffect(() => {
    fetchCollection('countries')
      .then((countries) => setState({ countries: countries as Country[], loading: false, error: null }))
      .catch((e) => setState({ countries: [], loading: false, error: String(e) }));
  }, []);

  return <CountriesContext.Provider value={state}>{children}</CountriesContext.Provider>;
}

export const useCountries = () => useContext(CountriesContext);
