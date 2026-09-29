import { Host, Picker } from '@expo/ui';
import { useEffect, useState } from 'react';
import { FlatList, Text } from 'react-native';

import { CoinCard } from '../../components/coin-card';
import { fetchCoinsByCountry } from '../../lib/fetch-coins-by-country';
import { fetchCollection } from '../../lib/fetch-collection';
import type { Coin } from '../../types/coin';
import type { Country } from '../../types/country';

export default function ListScreen() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [country, setCountry] = useState<string>();
  const [coins, setCoins] = useState<Coin[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCollection('countries')
      .then((data) => {
        const list = data as Country[];
        setCountries(list);
        setCountry(list[Math.floor(Math.random() * list.length)]?.id);
      })
      .catch((e) => setError(String(e)));
  }, []);

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

  if (error) return <Text style={{ padding: 16 }}>{error}</Text>;
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
