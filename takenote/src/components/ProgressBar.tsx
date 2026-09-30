import { StyleSheet, View } from 'react-native';

import { radius } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export function ProgressBar({ done, total }: { done: number; total: number }) {
  const t = useTheme();
  const fraction = total === 0 ? 0 : done / total;

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: total, now: done }}
      style={[styles.track, { backgroundColor: t.surfaceMuted }]}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${fraction * 100}%`,
            backgroundColor: fraction === 1 ? t.success : t.accent,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 6,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
  },
});
