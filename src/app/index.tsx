import { ScrollView, Text } from 'react-native';

import { useCoins } from '../providers/coins-provider';

export default function HomeScreen() {
  const { coins, loading, error } = useCoins();

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text selectable style={{ fontFamily: 'Menlo', fontSize: 12 }}>
        {loading ? 'Завантаження...' : error ?? JSON.stringify(coins, null, 2)}
      </Text>
    </ScrollView>
  );
}
