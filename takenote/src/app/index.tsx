import { router } from 'expo-router';
import { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { ProgressBar } from '@/components/ProgressBar';
import type { Db } from '@/db/db';
import { formatDateKey } from '@/domain/dates';
import { useQuery } from '@/hooks/useQuery';
import { listActivities, type ActivitySummary } from '@/repositories/activities';
import { spacing, type } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export default function Home() {
  const t = useTheme();
  const { data: activities, error } = useQuery(useCallback((db: Db) => listActivities(db), []));

  const newActivity = () => router.push('/activity/new');

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Button label="＋ New activity" onPress={newActivity} />

      {error && <EmptyState title="Couldn't load your activities" message={error.message} />}

      {activities?.length === 0 && (
        <EmptyState
          title="What are you getting ready for?"
          message="Create an activity — a trip, a concert, a gym session — and jot down the little things you don't want to forget."
        />
      )}

      {activities && activities.length > 0 && (
        <View style={styles.list}>
          <Text style={[type.caption, { color: t.textMuted }]}>UPCOMING</Text>
          {activities.map((a) => (
            <ActivityCard key={a.id} activity={a} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

function ActivityCard({ activity: a }: { activity: ActivitySummary }) {
  const t = useTheme();
  const progress = a.total === 0 ? 'No items yet' : `${a.done} of ${a.total} done`;
  const meta = [a.date && formatDateKey(a.date), progress].filter(Boolean).join(' · ');

  return (
    <Card
      accessibilityLabel={`${a.title}, ${meta}`}
      onPress={() => router.push({ pathname: '/activity/[id]', params: { id: a.id } })}
    >
      <Text style={[type.heading, { color: t.text }]}>{a.title}</Text>
      <Text style={[type.caption, { color: t.textMuted }]}>{meta}</Text>
      {a.total > 0 && <ProgressBar done={a.done} total={a.total} />}
    </Card>
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
