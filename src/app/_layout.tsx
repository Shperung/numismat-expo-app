import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

import { CoinsProvider } from '../providers/coins-provider';

export default function TabLayout() {
  return (
    <CoinsProvider>
      <Tabs>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Головна',
            tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="list"
          options={{
            title: 'Список',
            tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="info"
          options={{
            title: 'Інфо',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="information-circle" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </CoinsProvider>
  );
}
