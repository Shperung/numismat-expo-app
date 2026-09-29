import { useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';

import { CoinDetails } from '../../components/coin-details';
import { useCoins } from '../../providers/coins-provider';

export default function CoinScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const coin = useCoins().coins.find((c) => c.id === id);

  if (!coin) {
    return <Text style={{ padding: 16 }}>Монету не знайдено</Text>;
  }

  return <CoinDetails coin={coin} />;
}
