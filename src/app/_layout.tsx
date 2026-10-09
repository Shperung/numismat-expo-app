import { Stack } from 'expo-router';

import { AuthProvider, useUser } from '../providers/auth-provider';
import { CoinsProvider } from '../providers/coins-provider';
import { CountriesProvider } from '../providers/countries-provider';

export default function RootLayout() {
  return (
    <AuthProvider>
      <CountriesProvider>
        <CoinsProvider>
          <RootStack />
        </CoinsProvider>
      </CountriesProvider>
    </AuthProvider>
  );
}

function RootStack() {
  const user = useUser();

  return (
    <Stack screenOptions={{ headerBackTitle: 'Назад' }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="coin/[id]" options={{ title: 'Монета' }} />
      <Stack.Screen
        name="photo"
        options={{ presentation: 'fullScreenModal', animation: 'fade', headerShown: false }}
      />
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="admin/coin" options={{ title: 'Монета' }} />
        <Stack.Screen name="admin/country" options={{ title: 'Нова країна' }} />
      </Stack.Protected>
    </Stack>
  );
}
