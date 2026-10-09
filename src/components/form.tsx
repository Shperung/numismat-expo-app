import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors } from '../theme';

/** `style` — для обгортки (напр. `flex: 1` у рядку), а не для самого `TextInput`. */
export function Field({ label, style, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={[styles.field, style]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput placeholderTextColor={colors.muted} style={styles.input} {...props} />
    </View>
  );
}

export function Label({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{title}</Text>
      {children}
    </View>
  );
}

type ButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
};

const textColor = { primary: '#fff', secondary: colors.accent, danger: colors.error };

export function Button({ title, onPress, loading, disabled, variant = 'primary' }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.button, styles[variant], (disabled || loading) && styles.disabled]}
    >
      {loading ? <ActivityIndicator color={textColor[variant]} /> : null}
      <Text style={[styles.buttonText, { color: textColor[variant] }]}>{title}</Text>
    </Pressable>
  );
}

export const formStyles = StyleSheet.create({
  error: { color: colors.error },
  success: { color: '#2e7d32' },
  hint: { color: colors.muted },
});

const styles = StyleSheet.create({
  field: { gap: 6 },
  label: { fontSize: 13, fontWeight: '600', color: colors.muted },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  primary: { backgroundColor: colors.accent, borderColor: colors.accent },
  secondary: { backgroundColor: colors.accentSoft, borderColor: colors.accent },
  danger: { backgroundColor: '#fff', borderColor: colors.error },
  disabled: { opacity: 0.5 },
  buttonText: { fontSize: 16, fontWeight: '600' },
});
