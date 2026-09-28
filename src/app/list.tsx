import { useEffect, useState } from 'react';
import { ScrollView, Text } from 'react-native';

import { fetchCollection } from '../lib/fetch-collection';

export default function ListScreen() {
  const [text, setText] = useState('Завантаження...');

  useEffect(() => {
    fetchCollection('countries')
      .then((countries) => setText(JSON.stringify(countries, null, 2)))
      .catch((e) => setText(String(e)));
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text selectable style={{ fontFamily: 'Menlo', fontSize: 12 }}>
        {text}
      </Text>
    </ScrollView>
  );
}
