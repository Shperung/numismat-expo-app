import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

import { useUser } from '../../providers/auth-provider';

export default function TabLayout() {
  const user = useUser();

  return (
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
        name="admin"
        options={{
          title: user ? 'Адмінка' : 'Увійти',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={user ? 'construct' : 'log-in'} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
