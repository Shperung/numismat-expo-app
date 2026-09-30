import { Stack } from 'expo-router';

import { CoinsProvider } from '../providers/coins-provider';
import { CountriesProvider } from '../providers/countries-provider';

export default function RootLayout() {
  return (
    <CountriesProvider>
      <CoinsProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="coin/[id]" options={{ title: 'Монета', headerBackTitle: 'Назад' }} />
          <Stack.Screen
            name="photo"
            options={{ presentation: 'fullScreenModal', animation: 'fade', headerShown: false }}
          />
        </Stack>
      </CoinsProvider>
    </CountriesProvider>
  );
}
