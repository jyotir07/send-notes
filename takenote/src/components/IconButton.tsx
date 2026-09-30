import { Pressable, StyleSheet, Text } from 'react-native';

import { touchTarget } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

type Props = { glyph: string; label: string; onPress: () => void };

export function IconButton({ glyph, label, onPress }: Props) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && { opacity: 0.5 }]}
    >
      <Text style={[styles.glyph, { color: t.accent }]}>{glyph}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: touchTarget,
    minHeight: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyph: {
    fontSize: 22,
    fontWeight: '700',
  },
});
