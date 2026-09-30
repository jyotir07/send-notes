import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { TextField } from '@/components/TextField';
import type { Db } from '@/db/db';
import { useMutate } from '@/hooks/useMutate';
import { useQuery } from '@/hooks/useQuery';
import { listActivities } from '@/repositories/activities';
import { insertInboxItem } from '@/repositories/inbox';
import { insertItem } from '@/repositories/items';
import { spacing, type } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export default function QuickCapture() {
  const t = useTheme();
  const [title, setTitle] = useState('');
  const { data: activities } = useQuery(useCallback((db: Db) => listActivities(db), []));
  const mutate = useMutate();
  const canSave = title.trim().length > 0;

  const save = async (activityId: string | null) => {
    if (!canSave) return;
    const ok = await mutate((db) =>
      activityId ? insertItem(db, { activityId, title }) : insertInboxItem(db, title),
    );
    if (ok) router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <TextField
        autoFocus
        value={title}
        onChangeText={setTitle}
        placeholder="e.g. Take the new black belt"
        accessibilityLabel="What do you want to remember?"
        returnKeyType="done"
        onSubmitEditing={() => save(null)}
      />
      <Button label="Save to Inbox" disabled={!canSave} onPress={() => save(null)} />

      {activities && activities.length > 0 && (
        <View style={styles.field}>
          <Text style={[type.caption, { color: t.textMuted }]}>Or add it straight to</Text>
          <View style={styles.chips}>
            {activities.map((a) => (
              <Chip key={a.id} label={a.title} selected={false} onPress={() => save(a.id)} />
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  field: {
    gap: spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
