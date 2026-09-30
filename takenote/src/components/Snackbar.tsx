import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { radius, spacing, touchTarget, type } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

type Props = {
  message: string | null;
  actionLabel: string;
  onAction: () => void;
  onHide: () => void;
  durationMs?: number;
};

export function Snackbar({ message, actionLabel, onAction, onHide, durationMs = 4000 }: Props) {
  const t = useTheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onHide, durationMs);
    return () => clearTimeout(timer);
  }, [message, onHide, durationMs]);

  if (!message) return null;

  return (
    <View
      accessibilityLiveRegion="polite"
      style={[styles.bar, { backgroundColor: t.text, bottom: insets.bottom + spacing.lg }]}
    >
      <Text numberOfLines={1} style={[type.body, styles.message, { color: t.background }]}>
        {message}
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          onHide();
          onAction();
        }}
        style={styles.action}
      >
        <Text style={[type.bodyStrong, { color: t.accentMuted }]}>{actionLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    minHeight: touchTarget,
    borderRadius: radius.md,
    paddingLeft: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  message: {
    flex: 1,
  },
  action: {
    minHeight: touchTarget,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
});
