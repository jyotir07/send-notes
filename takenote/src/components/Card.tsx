import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

type Props = {
  children: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
};

export function Card({ children, onPress, accessibilityLabel }: Props) {
  const t = useTheme();
  const surface = [styles.card, { backgroundColor: t.surface, borderColor: t.border }];

  if (!onPress) return <View style={surface}>{children}</View>;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [surface, pressed && { opacity: 0.8 }]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.lg,
    gap: spacing.sm,
  },
});
