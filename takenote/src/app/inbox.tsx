import { router } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { Overlay, useOverlay } from '@/components/Overlay';
import type { Db } from '@/db/db';
import type { InboxItem } from '@/domain/types';
import { useMutate } from '@/hooks/useMutate';
import { useQuery } from '@/hooks/useQuery';
import { listActivities } from '@/repositories/activities';
import {
  deleteInboxItem,
  listInbox,
  moveInboxItemToActivity,
  renameInboxItem,
} from '@/repositories/inbox';
import { spacing, touchTarget, type } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export default function Inbox() {
  const t = useTheme();
  const { data, error, reload } = useQuery(
    useCallback(async (db: Db) => {
      const [items, activities] = await Promise.all([listInbox(db), listActivities(db)]);
      return { items, activities };
    }, []),
  );
  const mutate = useMutate(reload);
  const { overlay, close, showActions, showPrompt } = useOverlay();

  if (error) return <EmptyState title="Couldn't load your inbox" message={error.message} />;
  if (!data) return null;

  const { items, activities } = data;

  const openMenu = (item: InboxItem) =>
    showActions(
      [
        {
          label: 'Move to an activity…',
          onPress: () =>
            activities.length === 0
              ? showActions(
                  [{ label: 'Create an activity', onPress: () => router.push('/activity/new') }],
                  "You don't have any upcoming activities yet",
                )
              : showActions(
                  activities.map((a) => ({
                    label: a.title,
                    onPress: () => mutate((db) => moveInboxItemToActivity(db, item.id, a.id)),
                  })),
                  'Move to',
                ),
        },
        {
          label: 'Edit',
          onPress: () =>
            showPrompt({
              title: 'Edit',
              initialValue: item.title,
              onSubmit: (title) => mutate((db) => renameInboxItem(db, item.id, title)),
            }),
        },
        {
          label: 'Delete',
          destructive: true,
          onPress: () => mutate((db) => deleteInboxItem(db, item.id)),
        },
      ],
      item.title,
    );

  return (
    <>
      <ScrollView contentContainerStyle={styles.content}>
        {items.length === 0 ? (
          <EmptyState
            title="Nothing here"
            message="Thoughts you capture without an activity land here until you file them."
            action={<Button label="Capture a thought" onPress={() => router.push('/capture')} />}
          />
        ) : (
          <Card>
            {items.map((item) => (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                accessibilityHint="Opens options to move, edit or delete"
                onPress={() => openMenu(item)}
                style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]}
              >
                <Text style={[type.body, { color: t.text }]}>{item.title}</Text>
              </Pressable>
            ))}
          </Card>
        )}
      </ScrollView>
      <Overlay overlay={overlay} onClose={close} />
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  row: {
    minHeight: touchTarget,
    justifyContent: 'center',
  },
});
