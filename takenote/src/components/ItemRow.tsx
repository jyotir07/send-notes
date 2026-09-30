import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ITEM_KIND_LABELS, type ChecklistItem } from '@/domain/types';
import { spacing, type } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { Checkbox } from './Checkbox';

type Props = {
  item: ChecklistItem;
  onToggle: () => void;
  onPress?: () => void;
  size?: 'regular' | 'large';
};

export function ItemRow({ item, onToggle, onPress, size = 'regular' }: Props) {
  const t = useTheme();
  const large = size === 'large';

  return (
    <View style={styles.row}>
      <Checkbox checked={item.isCompleted} onToggle={onToggle} label={item.title} size={size} />
      <Pressable
        accessibilityRole="button"
        accessibilityHint={onPress ? 'Opens item options' : undefined}
        // Without an item menu (packing mode) the whole row toggles, for big easy targets.
        onPress={onPress ?? onToggle}
        style={styles.label}
      >
        <Text
          style={[
            large ? type.heading : type.body,
            {
              color: item.isCompleted ? t.textMuted : t.text,
              textDecorationLine: item.isCompleted ? 'line-through' : 'none',
            },
          ]}
        >
          {item.title}
        </Text>
        {item.kind !== 'pack' && (
          <Text style={[type.caption, { color: t.accent }]}>{ITEM_KIND_LABELS[item.kind]}</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingRight: spacing.sm,
    gap: 2,
  },
});
