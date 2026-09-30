import { router } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { ProgressBar } from '@/components/ProgressBar';
import type { Db } from '@/db/db';
import { formatDateKey } from '@/domain/dates';
import { useQuery } from '@/hooks/useQuery';
import { listActivities, type ActivitySummary } from '@/repositories/activities';
import { countInbox } from '@/repositories/inbox';
import { radius, spacing, touchTarget, type } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export default function Home() {
  const t = useTheme();
  const { data, error } = useQuery(
    useCallback(async (db: Db) => {
      const [activities, inboxCount] = await Promise.all([listActivities(db), countInbox(db)]);
      return { activities, inboxCount };
    }, []),
  );
  const activities = data?.activities;
  const inboxCount = data?.inboxCount ?? 0;

  const newActivity = () => router.push('/activity/new');

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Quick capture"
        accessibilityHint="Jot down something you don't want to forget"
        onPress={() => router.push('/capture')}
        style={({ pressed }) => [
          styles.capture,
          { backgroundColor: t.surface, borderColor: t.border },
          pressed && { opacity: 0.7 },
        ]}
      >
        <Text style={[type.body, { color: t.textMuted }]}>Don&apos;t forget to…</Text>
      </Pressable>

      <Button label="＋ New activity" onPress={newActivity} />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Inbox, ${inboxCount} unfiled`}
        onPress={() => router.push('/inbox')}
        style={({ pressed }) => [styles.inboxRow, pressed && { opacity: 0.6 }]}
      >
        <Text style={[type.bodyStrong, { color: t.text }]}>Inbox</Text>
        <Text style={[type.body, { color: inboxCount > 0 ? t.accent : t.textMuted }]}>
          {inboxCount > 0 ? `${inboxCount} to file ›` : 'Empty ›'}
        </Text>
      </Pressable>

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
  capture: {
    minHeight: touchTarget + 8,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  inboxRow: {
    minHeight: touchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
