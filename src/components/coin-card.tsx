import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useCountry } from '../providers/countries-provider';
import { card, colors } from '../theme';
import type { Coin } from '../types/coin';

export function CoinCard({ coin }: { coin: Coin }) {
  const country = useCountry(coin.country);

  return (
    <Link href={`/coin/${coin.id}`} asChild>
      <Pressable style={styles.card}>
        <View style={styles.photos}>
          <Image source={coin.avers} style={styles.photo} contentFit="cover" />
          <Image source={coin.revers} style={[styles.photo, styles.photoBack]} contentFit="cover" />
        </View>
        <View style={styles.body}>
          <Text style={styles.name} numberOfLines={1}>
            {coin.name}
          </Text>
          <View style={styles.meta}>
            <Ionicons name="cash-outline" size={14} color={colors.accent} />
            <Text style={styles.metaText}>
              {coin.value} {coin.currency}
            </Text>
            <Ionicons name="calendar-outline" size={14} color={colors.accent} />
            <Text style={styles.metaText}>{coin.year}</Text>
          </View>
          <Text style={styles.country} numberOfLines={1}>
            {country ? `${country.flag}  ${country.name_ua}` : coin.country}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.muted} />
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: { ...card, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  photos: { flexDirection: 'row' },
  photo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: colors.border,
  },
  photoBack: { marginLeft: -16 },
  body: { flex: 1, gap: 4 },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 14, color: colors.text, marginRight: 8 },
  country: { fontSize: 13, color: colors.muted },
});
