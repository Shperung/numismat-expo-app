import { FlatList, Text } from 'react-native';

import { CoinCard } from '../../components/coin-card';
import { useCoins } from '../../providers/coins-provider';

export default function HomeScreen() {
  const { coins, loading, error } = useCoins();

  if (loading || error) {
    return <Text style={{ padding: 16 }}>{error ?? 'Завантаження...'}</Text>;
  }

  return (
    <FlatList
      data={coins}
      keyExtractor={(coin) => coin.id}
      renderItem={({ item }) => <CoinCard coin={item} />}
      contentContainerStyle={{ padding: 16, gap: 12 }}
    />
  );
}
