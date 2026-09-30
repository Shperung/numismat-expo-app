import { Image } from 'expo-image';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { startCoinChat } from '../lib/ai';
import { askServer } from '../lib/numismat-server';
import type { Coin } from '../types/coin';

const QUESTION = 'Розкажи цікаві факти про цю монету';

const aiButtons = [
  {
    id: 'gemini',
    title: 'Запитати в Gemini про монету',
    logo: require('../../assets/ai/gemini.png'),
    ask: async (coin: Coin) => (await startCoinChat(coin).sendMessage(QUESTION)).response.text(),
  },
  {
    id: 'groq',
    title: 'Запитати в Groq про монету',
    logo: require('../../assets/ai/groq.png'),
    ask: (coin: Coin) => askServer('groq-gpt-oss', coin, [{ role: 'user', content: QUESTION }]),
  },
];

export function CoinDetails({ coin }: { coin: Coin }) {
  const [answer, setAnswer] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const askFacts = async (button: (typeof aiButtons)[number]) => {
    setLoadingId(button.id);
    try {
      setAnswer(await button.ask(coin));
    } catch (e) {
      setAnswer(`Помилка: ${String(e)}`);
    } finally {
      setLoadingId(null);
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
          <Pressable
            key={button.id}
            style={styles.aiButton}
            onPress={() => askFacts(button)}
            disabled={loadingId !== null}
          >
            <Image source={button.logo} style={styles.aiLogo} />
            <Text style={styles.aiButtonText}>{button.title}</Text>
            {loadingId === button.id ? <ActivityIndicator /> : null}
          </Pressable>
        ))}
      </View>
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
  aiButtons: { gap: 8, marginTop: 16 },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  aiLogo: { width: 24, height: 24, borderRadius: 4 },
  aiButtonText: { fontWeight: '600', flex: 1 },
});
