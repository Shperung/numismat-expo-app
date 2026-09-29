import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useCoins } from '../../providers/coins-provider';

export default function CoinScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const coin = useCoins().coins.find((c) => c.id === id);

  if (!coin) {
    return <Text style={{ padding: 16 }}>Монету не знайдено</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.photos}>
        <Image source={coin.avers} style={styles.photo} contentFit="cover" />
        <Image source={coin.revers} style={styles.photo} contentFit="cover" />
      </View>
      <Text style={styles.name}>{coin.name}</Text>
      <Text>
        {coin.value} {coin.currency}
      </Text>
      <Text>Країна: {coin.country}</Text>
      {coin.info ? <Text style={styles.info}>{coin.info}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 8 },
  photos: { flexDirection: 'row', gap: 12, justifyContent: 'center', marginBottom: 8 },
  photo: { width: 150, height: 150, borderRadius: 75, backgroundColor: '#eee' },
  name: { fontSize: 22, fontWeight: '700' },
  info: { marginTop: 8, lineHeight: 20 },
});
