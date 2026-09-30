import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ProgressBar } from '@/components/ProgressBar';
import { spacing, type } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

// Placeholder until the data layer lands in Phase 2.
const SAMPLE = [{ id: 'sample', title: 'Goa Weekend', date: 'Fri, 10 Oct', done: 2, total: 5 }];

export default function Home() {
  const t = useTheme();

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Button label="New activity" onPress={() => router.push('/activity/new')} />
      <View style={styles.list}>
        {SAMPLE.map((a) => (
          <Card
            key={a.id}
            accessibilityLabel={`${a.title}, ${a.done} of ${a.total} done`}
            onPress={() => router.push({ pathname: '/activity/[id]', params: { id: a.id } })}
          >
            <Text style={[type.heading, { color: t.text }]}>{a.title}</Text>
            <Text style={[type.caption, { color: t.textMuted }]}>
              {a.date} · {a.done} of {a.total} done
            </Text>
            <ProgressBar done={a.done} total={a.total} />
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.xl,
  },
  list: {
    gap: spacing.md,
  },
});
