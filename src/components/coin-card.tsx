import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Coin } from '../types/coin';

export function CoinCard({ coin }: { coin: Coin }) {
  return (
    <Link href={`/coin/${coin.id}`} asChild>
      <Pressable style={styles.card}>
        <View style={styles.photos}>
          <Image source={coin.avers} style={styles.photo} contentFit="cover" />
          <Image source={coin.revers} style={styles.photo} contentFit="cover" />
        </View>
        <View style={styles.body}>
          <Text style={styles.name}>{coin.name}</Text>
          <Text>
            {coin.value} {coin.currency} · {coin.year}
          </Text>
          <Text style={styles.country}>{coin.country}</Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', gap: 12, padding: 12, borderRadius: 12, backgroundColor: '#fff' },
  photos: { flexDirection: 'row', gap: 4 },
  photo: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#eee' },
  body: { flex: 1, justifyContent: 'center', gap: 2 },
  name: { fontSize: 16, fontWeight: '600' },
  country: { color: '#666' },
});
