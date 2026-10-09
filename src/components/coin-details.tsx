import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { useEffect, useState, type ComponentProps } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { startCoinChat } from '../lib/ai';
import { askServer, fetchProviders, type Provider } from '../lib/numismat-server';
import { useUser } from '../providers/auth-provider';
import { useCountry } from '../providers/countries-provider';
import { card, colors } from '../theme';
import type { Coin } from '../types/coin';
import { MarkdownText } from './markdown-text';

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
  const country = useCountry(coin.country);
  const user = useUser();
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
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={[card, styles.hero]}>
        {user ? (
          <Link href={{ pathname: '/admin/coin', params: { id: coin.id } }} asChild>
            <Pressable style={styles.edit} hitSlop={8}>
              <Ionicons name="pencil" size={18} color={colors.accent} />
            </Pressable>
          </Link>
        ) : null}
        <View style={styles.photos}>
          {sides.map(({ key, label }) => (
            <View key={key} style={styles.side}>
              <Link
                href={{ pathname: '/photo', params: { uri: encodeURIComponent(coin[key] ?? '') } }}
                asChild
                disabled={!coin[key]}
              >
                <Pressable style={styles.photoWrap}>
                  <Image source={coin[key]} style={styles.photo} contentFit="cover" />
                  <View style={styles.zoomBadge}>
                    <Ionicons name="expand-outline" size={14} color="#fff" />
                  </View>
                </Pressable>
              </Link>
              <Text style={styles.caption}>{label}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.name}>{coin.name}</Text>
        <View style={styles.countryPill}>
          <Text style={styles.countryText}>
            {country ? `${country.flag}  ${country.name_ua}` : coin.country}
          </Text>
        </View>
      </View>

      <View style={styles.stats}>
        <Stat icon="cash-outline" label="Номінал" value={`${coin.value} ${coin.currency}`} />
        <Stat icon="calendar-outline" label="Рік" value={String(coin.year)} />
      </View>

      {coin.info ? (
        <View style={[card, styles.section]}>
          <SectionTitle icon="document-text-outline" title="Опис" />
          <Text style={styles.body}>{coin.info}</Text>
        </View>
      ) : null}

      <SectionTitle icon="sparkles-outline" title="Цікаві факти від AI" />
      <View style={styles.aiButtons}>
        {aiButtons.map((button) => (
          <View key={button.id} style={card}>
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
                <Ionicons
                  name={open[button.id] ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.muted}
                />
              ) : null}
            </Pressable>
            {open[button.id] && answers[button.id] ? (
              answers[button.id].error ? (
                <Text style={[styles.answer, styles.body, styles.error]}>{answers[button.id].text}</Text>
              ) : (
                <MarkdownText value={answers[button.id].text} style={styles.answer} />
              )
            ) : null}
          </View>
        ))}
        {providersError ? (
          <Text style={[styles.body, styles.error]}>Помилка завантаження моделей: {providersError}</Text>
        ) : null}
      </View>
    </ScrollView>
  );
}

const sides = [
  { key: 'avers', label: 'Аверс' },
  { key: 'revers', label: 'Реверс' },
] as const;

type IconName = ComponentProps<typeof Ionicons>['name'];

function Stat({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <View style={[card, styles.stat]}>
      <View style={styles.statIcon}>
        <Ionicons name={icon} size={18} color={colors.accent} />
      </View>
      <View style={styles.statBody}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue} numberOfLines={1}>
          {value}
        </Text>
      </View>
    </View>
  );
}

function SectionTitle({ icon, title }: { icon: IconName; title: string }) {
  return (
    <View style={styles.sectionTitle}>
      <Ionicons name={icon} size={18} color={colors.accent} />
      <Text style={styles.sectionTitleText}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background },
  container: { padding: 16, gap: 16 },
  hero: { alignItems: 'center', padding: 20, gap: 12 },
  edit: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
    padding: 8,
    borderRadius: 16,
    backgroundColor: colors.accentSoft,
  },
  photos: { flexDirection: 'row', gap: 20 },
  side: { alignItems: 'center', gap: 8 },
  photoWrap: { borderRadius: 65, boxShadow: '0 4px 12px rgba(16, 24, 40, 0.15)' },
  photo: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: colors.border,
  },
  zoomBadge: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    padding: 5,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  caption: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  name: { fontSize: 24, fontWeight: '700', color: colors.text, textAlign: 'center', marginTop: 4 },
  countryPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.background,
  },
  countryText: { fontSize: 15, color: colors.text },
  stats: { flexDirection: 'row', gap: 12 },
  stat: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12 },
  statIcon: { padding: 8, borderRadius: 10, backgroundColor: colors.accentSoft },
  statBody: { flex: 1 },
  statLabel: { fontSize: 12, color: colors.muted },
  statValue: { fontSize: 16, fontWeight: '600', color: colors.text },
  section: { padding: 16, gap: 8 },
  sectionTitle: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitleText: { fontSize: 17, fontWeight: '700', color: colors.text },
  body: { fontSize: 15, lineHeight: 22, color: colors.text },
  aiButtons: { gap: 10 },
  aiButton: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  aiLogo: { width: 28, height: 28, borderRadius: 8 },
  aiButtonText: { fontSize: 15, fontWeight: '600', color: colors.text, flex: 1 },
  answer: {
    marginHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  error: { color: colors.error },
});
