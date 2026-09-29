import { Stack } from 'expo-router';

import { CoinsProvider } from '../providers/coins-provider';

export default function RootLayout() {
  return (
    <CoinsProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="coin/[id]" options={{ title: 'Монета', headerBackTitle: 'Назад' }} />
      </Stack>
    </CoinsProvider>
  );
}
