import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { startCoinChat } from '../lib/ai';
import { askServer, fetchProviders, type Provider } from '../lib/numismat-server';
import type { Coin } from '../types/coin';

const QUESTION = 'Розкажи цікаві факти про цю монету';

type AiButton = {
  id: string;
  title: string;
  logo: number | string;
  ask: (coin: Coin) => Promise<string>;
};

const geminiButton: AiButton = {
  id: 'gemini',
  title: 'Запитати в Gemini про монету',
  logo: require('../../assets/ai/gemini.png'),
  ask: async (coin) => (await startCoinChat(coin).sendMessage(QUESTION)).response.text(),
};

const toButton = (p: Provider): AiButton => ({
  id: p.id,
  title: `Запитати в ${p.title} про монету`,
  logo: p.logo,
  ask: (coin) => askServer(p.id, coin, [{ role: 'user', content: QUESTION }]),
});

export function CoinDetails({ coin }: { coin: Coin }) {
  const [answers, setAnswers] = useState<Record<string, { text: string; error?: boolean }>>({});
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [providers, setProviders] = useState<Provider[]>([]);
  const [providersError, setProvidersError] = useState<string | null>(null);

  useEffect(() => {
    fetchProviders()
      .then(setProviders)
      .catch((e) => setProvidersError(String(e)));
  }, []);

  const aiButtons = [geminiButton, ...providers.map(toButton)];

  const onPress = async ({ id, ask }: AiButton) => {
    if (answers[id] && !answers[id].error) {
      setOpen((o) => ({ ...o, [id]: !o[id] }));
      return;
    }
    setLoading((l) => ({ ...l, [id]: true }));
    setOpen((o) => ({ ...o, [id]: true }));
    try {
      const text = await ask(coin);
      setAnswers((a) => ({ ...a, [id]: { text } }));
    } catch (e) {
      setAnswers((a) => ({ ...a, [id]: { text: `Помилка: ${String(e)}`, error: true } }));
    } finally {
      setLoading((l) => ({ ...l, [id]: false }));
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

      <View style={styles.aiButtons}>
        {aiButtons.map((button) => (
          <View key={button.id} style={styles.aiItem}>
            <Pressable
              style={styles.aiButton}
              onPress={() => onPress(button)}
              disabled={loading[button.id]}
            >
              <Image source={button.logo} style={styles.aiLogo} />
              <Text style={styles.aiButtonText}>{button.title}</Text>
              {loading[button.id] ? (
                <ActivityIndicator />
              ) : answers[button.id] && !answers[button.id].error ? (
                <Ionicons name={open[button.id] ? 'chevron-up' : 'chevron-down'} size={20} color="#666" />
              ) : null}
            </Pressable>
            {open[button.id] && answers[button.id] ? (
              <Text style={[styles.answer, answers[button.id].error && styles.error]}>
                {answers[button.id].text}
              </Text>
            ) : null}
          </View>
        ))}
        {providersError ? (
          <Text style={styles.error}>Помилка завантаження моделей: {providersError}</Text>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 8 },
  photos: { flexDirection: 'row', gap: 12, justifyContent: 'center', marginBottom: 8 },
  photo: { width: 150, height: 150, borderRadius: 75, backgroundColor: '#eee' },
  name: { fontSize: 22, fontWeight: '700' },
  info: { marginTop: 8, lineHeight: 20 },
  aiButtons: { gap: 8, marginTop: 16 },
  aiItem: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  aiButton: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12 },
  aiLogo: { width: 24, height: 24, borderRadius: 4 },
  aiButtonText: { fontWeight: '600', flex: 1 },
  answer: { paddingHorizontal: 12, paddingBottom: 12, lineHeight: 20 },
  error: { color: '#c62828' },
});
