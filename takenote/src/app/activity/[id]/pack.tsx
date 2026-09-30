import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { ItemRow } from '@/components/ItemRow';
import { ProgressBar } from '@/components/ProgressBar';
import { Snackbar } from '@/components/Snackbar';
import type { Db } from '@/db/db';
import type { ChecklistItem } from '@/domain/types';
import { celebrate, tick } from '@/feedback/haptics';
import { useMutate } from '@/hooks/useMutate';
import { useQuery } from '@/hooks/useQuery';
import { getActivity, setActivityStatus } from '@/repositories/activities';
import { listItems, setItemCompleted } from '@/repositories/items';
import { listSections } from '@/repositories/sections';
import { spacing, type } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export default function PackingMode() {
  const t = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, error, reload } = useQuery(
    useCallback(
      async (db: Db) => {
        const [activity, sections, items] = await Promise.all([
          getActivity(db, id),
          listSections(db, id),
          listItems(db, id),
        ]);
        return { activity, sections, items };
      },
      [id],
    ),
  );
  const mutate = useMutate(reload);
  const [hideCompleted, setHideCompleted] = useState(false);
  const [lastChecked, setLastChecked] = useState<ChecklistItem | null>(null);
  const hideSnackbar = useCallback(() => setLastChecked(null), []);

  if (error) return <EmptyState title="Couldn't load this checklist" message={error.message} />;
  if (!data) return null;
  if (!data.activity) return <EmptyState title="This activity no longer exists" />;

  const { activity, sections, items } = data;
  const done = items.filter((i) => i.isCompleted).length;
  const allDone = items.length > 0 && done === items.length;

  const toggle = async (item: ChecklistItem) => {
    const checking = !item.isCompleted;
    if (!(await mutate((db) => setItemCompleted(db, item.id, checking)))) return;
    if (checking && done + 1 === items.length) celebrate();
    else tick();
    setLastChecked(checking ? item : null);
  };

  const undo = (item: ChecklistItem) => mutate((db) => setItemCompleted(db, item.id, false));

  const groups = [
    { key: 'ungrouped', title: null as string | null, sectionId: null as string | null },
    ...sections.map((s) => ({ key: s.id, title: s.title, sectionId: s.id })),
  ]
    .map((g) => ({
      ...g,
      items: items.filter(
        (i) => i.sectionId === g.sectionId && !(hideCompleted && i.isCompleted),
      ),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <View style={styles.flex}>
      <Stack.Screen options={{ title: activity.title }} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.progress}>
          <Text style={[type.title, { color: t.text }]}>
            {done} of {items.length}
          </Text>
          <ProgressBar done={done} total={items.length} />
        </View>

        <View style={styles.toggleRow}>
          <Text style={[type.body, { color: t.text }]}>Hide checked items</Text>
          <Switch
            accessibilityLabel="Hide checked items"
            value={hideCompleted}
            onValueChange={setHideCompleted}
            trackColor={{ true: t.accent, false: t.surfaceMuted }}
          />
        </View>

        {allDone && (
          <Card>
            <Text style={[type.heading, { color: t.text }]}>You&apos;re all set ✓</Text>
            <Text style={[type.body, { color: t.textMuted }]}>
              Everything&apos;s ready. Enjoy {activity.title}.
            </Text>
            <View style={styles.doneButtons}>
              {activity.status !== 'completed' && (
                <Button
                  label="Mark activity done"
                  onPress={async () => {
                    if (await mutate((db) => setActivityStatus(db, id, 'completed'))) {
                      router.dismissTo('/');
                    }
                  }}
                />
              )}
              <Button label="Back to list" variant="secondary" onPress={() => router.back()} />
            </View>
          </Card>
        )}

        {items.length === 0 && (
          <EmptyState
            title="Nothing to pack yet"
            message="Add a few items to the checklist first."
            action={<Button label="Back to list" onPress={() => router.back()} />}
          />
        )}

        {groups.map((g) => (
          <View key={g.key} style={styles.group}>
            {g.title && (
              <Text style={[type.caption, { color: t.textMuted }]}>{g.title.toUpperCase()}</Text>
            )}
            {g.items.map((item) => (
              <ItemRow key={item.id} item={item} size="large" onToggle={() => toggle(item)} />
            ))}
          </View>
        ))}
      </ScrollView>
      <Snackbar
        message={lastChecked ? `Checked "${lastChecked.title}"` : null}
        actionLabel="Undo"
        onAction={() => lastChecked && undo(lastChecked)}
        onHide={hideSnackbar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl * 3,
    gap: spacing.xl,
  },
  progress: {
    gap: spacing.sm,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  group: {
    gap: spacing.xs,
  },
  doneButtons: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
});
