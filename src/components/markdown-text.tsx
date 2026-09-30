import { Fragment } from 'react';
import { View, type ViewStyle } from 'react-native';
import { useMarkdown, type useMarkdownHookOptions } from 'react-native-marked';

const options: useMarkdownHookOptions = {
  colorScheme: 'light',
  styles: {
    text: { fontSize: 14, lineHeight: 20 },
    li: { fontSize: 14, lineHeight: 20 },
    codeText: { fontSize: 13 },
    h1: { fontSize: 20, lineHeight: 26 },
    h2: { fontSize: 18, lineHeight: 24 },
    h3: { fontSize: 16, lineHeight: 22 },
    h4: { fontSize: 15, lineHeight: 20 },
    h5: { fontSize: 14, lineHeight: 20 },
    h6: { fontSize: 14, lineHeight: 20 },
  },
};

export function MarkdownText({ value, style }: { value: string; style?: ViewStyle }) {
  const elements = useMarkdown(value, options);
  return (
    <View style={style}>
      {elements.map((element, index) => (
        <Fragment key={index}>{element}</Fragment>
      ))}
    </View>
  );
}
