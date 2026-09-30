import { Pressable, StyleSheet, Text, View } from 'react-native';

import { radius, touchTarget } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

type Props = {
  checked: boolean;
  onToggle: () => void;
  label: string;
  size?: 'regular' | 'large';
};

export function Checkbox({ checked, onToggle, label, size = 'regular' }: Props) {
  const t = useTheme();
  const box = size === 'large' ? 32 : 24;

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      hitSlop={8}
      onPress={onToggle}
      style={styles.target}
    >
      <View
        style={[
          styles.box,
          {
            width: box,
            height: box,
            borderColor: checked ? t.accent : t.textMuted,
            backgroundColor: checked ? t.accent : 'transparent',
          },
        ]}
      >
        {checked && (
          <Text style={{ color: t.onAccent, fontSize: box * 0.6, fontWeight: '700' }}>✓</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  target: {
    minWidth: touchTarget,
    minHeight: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    borderWidth: 2,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
