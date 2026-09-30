import { Pressable, StyleSheet, Text } from 'react-native';

import { radius, spacing, type } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

type Props = { label: string; selected: boolean; onPress: () => void };

export function Chip({ label, selected, onPress }: Props) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      hitSlop={4}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? t.accentMuted : t.surface,
          borderColor: selected ? t.accent : t.border,
        },
      ]}
    >
      <Text style={[type.caption, { color: selected ? t.accent : t.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 36,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    justifyContent: 'center',
  },
});
