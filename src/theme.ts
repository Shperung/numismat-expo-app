import type { ViewStyle } from 'react-native';

export const colors = {
  background: '#f4f5f7',
  card: '#fff',
  border: '#e8e9ed',
  text: '#1c1c1e',
  muted: '#6b7280',
  accent: '#b8860b',
  accentSoft: '#fdf6e3',
  error: '#c62828',
};

export const card: ViewStyle = {
  backgroundColor: colors.card,
  borderRadius: 16,
  borderWidth: 1,
  borderColor: colors.border,
  boxShadow: '0 2px 8px rgba(16, 24, 40, 0.06)',
};
