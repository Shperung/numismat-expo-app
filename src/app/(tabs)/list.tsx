import { Host, Picker } from '@expo/ui';
import { useEffect, useState } from 'react';
import { FlatList, Text } from 'react-native';

import { CoinCard } from '../../components/coin-card';
import { fetchCoinsByCountry } from '../../lib/fetch-coins-by-country';
import { pickRandom } from '../../lib/pick-random';
import { useCountries } from '../../providers/countries-provider';
import type { Coin } from '../../types/coin';

export default function ListScreen() {
  const { countries, error: countriesError } = useCountries();
  const [country, setCountry] = useState<string>();
  const [coins, setCoins] = useState<Coin[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCountry(pickRandom(countries)?.id);
  }, [countries]);

  useEffect(() => {
    if (!country) return;
    let active = true;
    fetchCoinsByCountry(country)
      .then((data) => active && setCoins(data))
      .catch((e) => active && setError(String(e)));
    return () => {
      active = false;
    };
  }, [country]);

  if (countriesError || error) return <Text style={{ padding: 16 }}>{countriesError ?? error}</Text>;
  if (!country) return <Text style={{ padding: 16 }}>Завантаження...</Text>;

  return (
    <FlatList
      data={coins}
      keyExtractor={(coin) => coin.id}
      renderItem={({ item }) => <CoinCard coin={item} />}
      contentContainerStyle={{ padding: 16, gap: 12 }}
      ListHeaderComponent={
        <Host colorScheme="light" matchContents={{ vertical: true }} style={{ width: '100%' }}>
          <Picker selectedValue={country} onValueChange={setCountry}>
            {countries.map((c) => (
              <Picker.Item key={c.id} label={`${c.flag} ${c.name_ua}`} value={c.id} />
            ))}
          </Picker>
        </Host>
      }
      ListEmptyComponent={<Text>Монет цієї країни немає</Text>}
    />
  );
}
