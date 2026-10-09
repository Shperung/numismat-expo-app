import { Host, Picker } from '@expo/ui';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, Field, formStyles, Label } from '../../components/form';
import { deleteCoin, saveCoin } from '../../lib/admin';
import { describeCoinPhotos, type CoinDraft } from '../../lib/ai';
import { useCoins } from '../../providers/coins-provider';
import { useCountries } from '../../providers/countries-provider';
import { card, colors } from '../../theme';
import type { Coin } from '../../types/coin';

type Side = 'avers' | 'revers';

const toForm = (coin?: Partial<Coin>) => ({
  name: coin?.name ?? '',
  country: coin?.country ?? '',
  value: coin?.value?.toString() ?? '',
  currency: coin?.currency ?? '',
  year: coin?.year?.toString() ?? '',
  info: coin?.info ?? '',
});

export default function CoinFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { coins, reload } = useCoins();
  const { countries } = useCountries();
  const editing = id ? coins.find((c) => c.id === id) : undefined;

  const [form, setForm] = useState(() => toForm(editing ?? { country: countries[0]?.id }));
  const [photos, setPhotos] = useState<Partial<Record<Side, string>>>({});
  const [draft, setDraft] = useState<CoinDraft>();
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState<'save' | 'delete' | 'describe'>();

  const set = (key: keyof typeof form) => (text: string) => setForm((f) => ({ ...f, [key]: text }));
  const photo = (side: Side) => photos[side] ?? editing?.[side];
  const newCountry =
    draft?.newCountry && !countries.some((c) => c.id === draft.newCountry?.id) ? draft.newCountry : undefined;

  if (id && !editing) return <Text style={{ padding: 16 }}>Монету не знайдено</Text>;

  const pick = (side: Side) => {
    const options: ImagePicker.ImagePickerOptions = { mediaTypes: 'images', allowsEditing: true, aspect: [1, 1], quality: 0.8 };
    const take = async (camera: boolean) => {
      if (camera && !(await ImagePicker.requestCameraPermissionsAsync()).granted) return;
      const result = await (camera ? ImagePicker.launchCameraAsync : ImagePicker.launchImageLibraryAsync)(options);
      if (!result.canceled) setPhotos((p) => ({ ...p, [side]: result.assets[0].uri }));
    };
    Alert.alert(side === 'avers' ? 'Аверс' : 'Реверс', undefined, [
      { text: 'Камера', onPress: () => take(true) },
      { text: 'Галерея', onPress: () => take(false) },
      { text: 'Скасувати', style: 'cancel' },
    ]);
  };

  const describe = async () => {
    setBusy('describe');
    setError(undefined);
    try {
      const result = await describeCoinPhotos(photo('avers')!, photo('revers')!, countries);
      setDraft(result);
      setForm(toForm(result.coin));
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(undefined);
    }
  };

  const save = async () => {
    const values = {
      name: form.name.trim(),
      country: form.country,
      value: Number(form.value.replace(',', '.')),
      currency: form.currency.trim(),
      year: Number(form.year),
      info: form.info.trim(),
    };
    if (!values.name || !values.country || !values.currency || !(values.value > 0) || !Number.isInteger(values.year) || values.year <= 0) {
      setError('Заповніть назву, країну, номінал, валюту та рік');
      return;
    }
    if (!photo('avers') || !photo('revers')) {
      setError('Додайте фото аверсу і реверсу');
      return;
    }
    if (!countries.some((c) => c.id === values.country)) {
      setError(`Спершу додайте країну «${values.country}»`);
      return;
    }
    setBusy('save');
    setError(undefined);
    try {
      const savedId = await saveCoin(editing?.id ?? null, values, photos);
      await reload();
      if (editing) router.back();
      else router.replace(`/coin/${savedId}`);
    } catch (e) {
      setError(String(e));
      setBusy(undefined);
    }
  };

  const remove = () =>
    Alert.alert('Видалити монету?', editing!.name, [
      { text: 'Скасувати', style: 'cancel' },
      {
        text: 'Видалити',
        style: 'destructive',
        onPress: async () => {
          setBusy('delete');
          try {
            await deleteCoin(editing!);
            await reload();
            router.dismissAll();
          } catch (e) {
            setError(String(e));
            setBusy(undefined);
          }
        },
      },
    ]);

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.screen}>
      <Stack.Screen options={{ title: editing ? 'Редагування' : 'Нова монета' }} />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={[card, styles.form]}>
          <View style={styles.photos}>
            {(['avers', 'revers'] as const).map((side) => (
              <Pressable key={side} style={styles.side} onPress={() => pick(side)}>
                <View style={styles.photo}>
                  {photo(side) ? (
                    <Image source={photo(side)} style={StyleSheet.absoluteFill} contentFit="cover" />
                  ) : (
                    <Ionicons name="camera-outline" size={32} color={colors.muted} />
                  )}
                </View>
                <Text style={formStyles.hint}>{side === 'avers' ? 'Аверс' : 'Реверс'}</Text>
              </Pressable>
            ))}
          </View>

          <Button
            title={busy === 'describe' ? 'Gemini аналізує фото...' : '✨ Заповнити з фото через Gemini'}
            variant="secondary"
            onPress={describe}
            loading={busy === 'describe'}
            disabled={!photo('avers') || !photo('revers') || !!busy}
          />
          {newCountry ? (
            <View style={styles.newCountry}>
              <Text style={formStyles.hint}>
                Країни {newCountry.flag} {newCountry.name_ua} немає в базі — спершу додайте її
              </Text>
              <Button
                title="Додати країну"
                variant="secondary"
                onPress={() => router.push({ pathname: '/admin/country', params: newCountry })}
              />
            </View>
          ) : null}

          <Field label="Назва" value={form.name} onChangeText={set('name')} />
          <Label title="Країна">
            <Host colorScheme="light" matchContents={{ vertical: true }} style={{ width: '100%' }}>
              <Picker selectedValue={form.country} onValueChange={set('country')}>
                {countries.map((c) => (
                  <Picker.Item key={c.id} label={`${c.flag} ${c.name_ua}`} value={c.id} />
                ))}
              </Picker>
            </Host>
          </Label>
          <View style={styles.row}>
            <Field label="Номінал" value={form.value} onChangeText={set('value')} keyboardType="decimal-pad" style={styles.cell} />
            <Field
              label="Валюта"
              value={form.currency}
              onChangeText={set('currency')}
              placeholder="cent..."
              autoCapitalize="none"
              style={styles.cell}
            />
            <Field label="Рік" value={form.year} onChangeText={set('year')} keyboardType="number-pad" maxLength={4} style={styles.cell} />
          </View>
          <Field label="Опис" value={form.info} onChangeText={set('info')} multiline />

          {error ? <Text style={formStyles.error}>{error}</Text> : null}
          <Button
            title={editing ? 'Зберегти зміни' : 'Додати монету'}
            onPress={save}
            loading={busy === 'save'}
            disabled={!!busy}
          />
          {editing ? (
            <Button title="Видалити монету" variant="danger" onPress={remove} loading={busy === 'delete'} disabled={!!busy} />
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { padding: 16 },
  form: { padding: 16, gap: 14 },
  photos: { flexDirection: 'row', justifyContent: 'center', gap: 20 },
  side: { alignItems: 'center', gap: 8 },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    backgroundColor: colors.background,
  },
  newCountry: { gap: 8 },
  row: { flexDirection: 'row', gap: 12 },
  cell: { flex: 1 },
});
