import { useEffect, useState } from 'react';
import { Text } from 'react-native';

import { CoinDetails } from '../../components/coin-details';
import { fetchCoinsByCountry } from '../../lib/fetch-coins-by-country';
import { pickRandom } from '../../lib/pick-random';
import { useCountries } from '../../providers/countries-provider';
import type { Coin } from '../../types/coin';

export default function HomeScreen() {
  const { countries, error: countriesError } = useCountries();
  const [coin, setCoin] = useState<Coin | null>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const country = pickRandom(countries);
    if (!country) return;
    fetchCoinsByCountry(country.id)
      .then((coins) => setCoin(pickRandom(coins) ?? null))
      .catch((e) => setError(String(e)));
  }, [countries]);

  const message = countriesError ?? error ?? (coin === null ? 'Монет не знайдено' : 'Завантаження...');

  return coin ? <CoinDetails coin={coin} /> : <Text style={{ padding: 16 }}>{message}</Text>;
}
