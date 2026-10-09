import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, Field, formStyles } from '../../components/form';
import { addCountry } from '../../lib/admin';
import { useCountries } from '../../providers/countries-provider';
import { card, colors } from '../../theme';
import type { Country } from '../../types/country';

export default function CountryScreen() {
  const draft = useLocalSearchParams<Partial<Country>>();
  const { reload } = useCountries();
  const [country, setCountry] = useState<Country>({
    id: draft.id ?? '',
    flag: draft.flag ?? '',
    name_ua: draft.name_ua ?? '',
    name_en: draft.name_en ?? '',
  });
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  const set = (key: keyof Country) => (text: string) => setCountry((c) => ({ ...c, [key]: text }));

  const save = async () => {
    const values = {
      id: country.id.trim().toLowerCase(),
      flag: country.flag.trim(),
      name_ua: country.name_ua.trim(),
      name_en: country.name_en.trim(),
    };
    if (!/^[a-z]{2,3}$/.test(values.id) || !values.flag || !values.name_ua || !values.name_en) {
      setError('Заповніть код (2–3 латинські літери), назви та прапор');
      return;
    }
    setPending(true);
    setError(undefined);
    try {
      await addCountry(values);
      await reload();
      router.back();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setPending(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={[card, styles.form]}>
          <View style={styles.row}>
            <Field
              label="Код"
              value={country.id}
              onChangeText={set('id')}
              placeholder="ua"
              autoCapitalize="none"
              maxLength={3}
              style={styles.cell}
            />
            <Field label="Прапор" value={country.flag} onChangeText={set('flag')} placeholder="🇺🇦" style={styles.cell} />
          </View>
          <Field label="Назва українською" value={country.name_ua} onChangeText={set('name_ua')} placeholder="Україна" />
          <Field label="Назва англійською" value={country.name_en} onChangeText={set('name_en')} placeholder="Ukraine" />
          {error ? <Text style={formStyles.error}>{error}</Text> : null}
          <Button title="Додати країну" onPress={save} loading={pending} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { padding: 16 },
  form: { padding: 16, gap: 14 },
  row: { flexDirection: 'row', gap: 12 },
  cell: { flex: 1 },
});
