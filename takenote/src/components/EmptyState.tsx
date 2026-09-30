import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { spacing, type } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

type Props = {
  title: string;
  message?: string;
  action?: ReactNode;
};

export function EmptyState({ title, message, action }: Props) {
  const t = useTheme();
  return (
    <View style={styles.container}>
      <Text style={[type.heading, { color: t.text, textAlign: 'center' }]}>{title}</Text>
      {message && (
        <Text style={[type.body, { color: t.textMuted, textAlign: 'center' }]}>{message}</Text>
      )}
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
});
