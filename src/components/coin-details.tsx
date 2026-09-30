import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { startCoinChat } from '../lib/ai';
import type { Coin } from '../types/coin';

export function CoinDetails({ coin }: { coin: Coin }) {
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const askFacts = async () => {
    setLoading(true);
    try {
      const result = await startCoinChat(coin).sendMessage('Розкажи цікаві факти про цю монету');
      setAnswer(result.response.text());
    } catch (e) {
      setAnswer(`Помилка: ${String(e)}`);
    } finally {
      setLoading(false);
    }
  };

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
      <Text>Рік: {coin.year}</Text>
      <Text>Країна: {coin.country}</Text>
      {coin.info ? <Text style={styles.info}>{coin.info}</Text> : null}

      <Pressable style={styles.aiButton} onPress={askFacts} disabled={loading}>
        <Ionicons name="sparkles" size={20} color="#fff" />
        <Text style={styles.aiButtonText}>Дізнатись цікаві факти про цю монету</Text>
      </Pressable>
      {loading ? <ActivityIndicator /> : null}
      {answer ? <Text style={styles.info}>{answer}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 8 },
  photos: { flexDirection: 'row', gap: 12, justifyContent: 'center', marginBottom: 8 },
  photo: { width: 150, height: 150, borderRadius: 75, backgroundColor: '#eee' },
  name: { fontSize: 22, fontWeight: '700' },
  info: { marginTop: 8, lineHeight: 20 },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#1a73e8',
  },
  aiButtonText: { color: '#fff', fontWeight: '600', flexShrink: 1 },
});
