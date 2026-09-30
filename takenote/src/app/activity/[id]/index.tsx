import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Checkbox } from '@/components/Checkbox';
import { ProgressBar } from '@/components/ProgressBar';
import { spacing, type } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

// Placeholder until the data layer lands in Phase 2.
const SAMPLE_ITEMS = ['Wallet and ID', 'Phone and charger', 'Take the new black belt'];

export default function ActivityDetail() {
  const t = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const done = SAMPLE_ITEMS.filter((i) => checked[i]).length;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={[type.title, { color: t.text }]}>Goa Weekend</Text>
      <Text style={[type.caption, { color: t.textMuted }]}>
        {done} of {SAMPLE_ITEMS.length} done · id {id}
      </Text>
      <ProgressBar done={done} total={SAMPLE_ITEMS.length} />
      <View>
        {SAMPLE_ITEMS.map((item) => (
          <View key={item} style={styles.row}>
            <Checkbox
              label={item}
              checked={!!checked[item]}
              onToggle={() => setChecked((c) => ({ ...c, [item]: !c[item] }))}
            />
            <Text style={[type.body, { color: t.text }]}>{item}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
