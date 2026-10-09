import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, Field, formStyles } from '../../components/form';
import { auth } from '../../lib/firebase';
import { useUser } from '../../providers/auth-provider';
import { card, colors } from '../../theme';

const WRONG_CREDENTIALS = ['auth/invalid-credential', 'auth/invalid-email', 'auth/user-not-found', 'auth/wrong-password'];

export default function AdminScreen() {
  const user = useUser();

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {user ? (
          <View style={[card, styles.form]}>
            <Text style={styles.title}>Адмінка</Text>
            <Text style={formStyles.hint}>{user.email}</Text>
            <Button title="Додати монету" onPress={() => router.push('/admin/coin')} />
            <Button title="Додати країну" variant="secondary" onPress={() => router.push('/admin/country')} />
            <Text style={formStyles.hint}>Редагування — кнопка ✏️ на сторінці монети.</Text>
            <Button title="Вийти" variant="danger" onPress={() => signOut(auth)} />
          </View>
        ) : (
          <LoginForm />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  const login = async () => {
    setPending(true);
    setError(undefined);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (e) {
      const code = e instanceof FirebaseError ? e.code : '';
      setError(WRONG_CREDENTIALS.includes(code) ? 'Невірний email або пароль' : String(e));
    } finally {
      setPending(false);
    }
  };

  return (
    <View style={[card, styles.form]}>
      <Text style={styles.title}>Вхід в адмінку</Text>
      <Field
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        textContentType="username"
      />
      <Field
        label="Пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="current-password"
        textContentType="password"
        onSubmitEditing={login}
      />
      {error ? <Text style={formStyles.error}>{error}</Text> : null}
      <Button title="Увійти" onPress={login} loading={pending} disabled={!email || !password} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { padding: 16 },
  form: { padding: 16, gap: 14 },
  title: { fontSize: 22, fontWeight: '700', color: colors.text },
});
