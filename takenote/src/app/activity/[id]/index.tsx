import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AddItemField } from '@/components/AddItemField';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { IconButton } from '@/components/IconButton';
import { ItemRow } from '@/components/ItemRow';
import { Overlay, useOverlay, type SheetAction } from '@/components/Overlay';
import { ProgressBar } from '@/components/ProgressBar';
import type { Db } from '@/db/db';
import { formatDateKey } from '@/domain/dates';
import {
  ACTIVITY_TYPE_LABELS,
  ITEM_KIND_LABELS,
  ITEM_KINDS,
  type ChecklistItem,
  type ChecklistSection,
} from '@/domain/types';
import { useMutate } from '@/hooks/useMutate';
import { useQuery } from '@/hooks/useQuery';
import { deleteActivity, getActivity, setActivityStatus } from '@/repositories/activities';
import {
  deleteItem,
  insertItem,
  listItems,
  moveItem,
  setItemCompleted,
  updateItem,
} from '@/repositories/items';
import { deleteSection, insertSection, listSections, renameSection } from '@/repositories/sections';
import { spacing, type } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export default function ActivityDetail() {
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
  const { overlay, close, showActions, showPrompt, showConfirm } = useOverlay();

  if (error) {
    return <EmptyState title="Couldn't load this activity" message={error.message} />;
  }
  if (!data) return null;
  if (!data.activity) {
    return <EmptyState title="This activity no longer exists" />;
  }

  const { activity, sections, items } = data;
  const done = items.filter((i) => i.isCompleted).length;
  const ungrouped = items.filter((i) => i.sectionId === null);
  const completed = activity.status === 'completed';

  const addSection = () =>
    showPrompt({
      title: 'New section',
      placeholder: 'e.g. Clothes & gear',
      submitLabel: 'Add',
      onSubmit: (title) => mutate((db) => insertSection(db, id, title)),
    });

  const openActivityMenu = () =>
    showActions([
      { label: 'Edit name, type or date', onPress: () => router.push({ pathname: '/activity/[id]/edit', params: { id } }) },
      { label: 'Add section', onPress: addSection },
      {
        label: completed ? 'Move back to upcoming' : 'Mark as done',
        onPress: () => mutate((db) => setActivityStatus(db, id, completed ? 'upcoming' : 'completed')),
      },
      {
        label: 'Delete activity',
        destructive: true,
        onPress: () =>
          showConfirm({
            title: 'Delete this activity?',
            message: `"${activity.title}" and its checklist will be removed.`,
            confirmLabel: 'Delete',
            onConfirm: async () => {
              if (await mutate((db) => deleteActivity(db, id))) router.back();
            },
          }),
      },
    ]);

  const openSectionMenu = (section: ChecklistSection) =>
    showActions(
      [
        {
          label: 'Rename section',
          onPress: () =>
            showPrompt({
              title: 'Rename section',
              initialValue: section.title,
              onSubmit: (title) => mutate((db) => renameSection(db, section.id, title)),
            }),
        },
        {
          label: 'Delete section',
          destructive: true,
          onPress: () =>
            showConfirm({
              title: 'Delete this section?',
              message: 'Its items stay in the list, just ungrouped.',
              confirmLabel: 'Delete',
              onConfirm: () => mutate((db) => deleteSection(db, section.id)),
            }),
        },
      ],
      section.title,
    );

  const openItemMenu = (item: ChecklistItem) => {
    const actions: SheetAction[] = [
      {
        label: 'Edit',
        onPress: () =>
          showPrompt({
            title: 'Edit item',
            initialValue: item.title,
            onSubmit: (title) => mutate((db) => updateItem(db, item.id, { title })),
          }),
      },
      { label: 'Move up', onPress: () => mutate((db) => moveItem(db, item.id, 'up')) },
      { label: 'Move down', onPress: () => mutate((db) => moveItem(db, item.id, 'down')) },
      {
        label: `Kind: ${ITEM_KIND_LABELS[item.kind]}`,
        onPress: () =>
          showActions(
            ITEM_KINDS.map((kind) => ({
              label: ITEM_KIND_LABELS[kind],
              onPress: () => mutate((db) => updateItem(db, item.id, { kind })),
            })),
            'What kind of item is this?',
          ),
      },
    ];
    if (sections.length > 0) {
      actions.push({
        label: 'Move to section…',
        onPress: () =>
          showActions(
            [...sections.map((s) => ({ id: s.id, title: s.title })), { id: null, title: 'No section' }]
              .filter((target) => target.id !== item.sectionId)
              .map((target) => ({
                label: target.title,
                onPress: () => mutate((db) => updateItem(db, item.id, { sectionId: target.id })),
              })),
            'Move to',
          ),
      });
    }
    actions.push({
      label: 'Delete item',
      destructive: true,
      onPress: () => mutate((db) => deleteItem(db, item.id)),
    });
    showActions(actions, item.title);
  };

  const renderItems = (list: ChecklistItem[]) =>
    list.map((item) => (
      <ItemRow
        key={item.id}
        item={item}
        onToggle={() => mutate((db) => setItemCompleted(db, item.id, !item.isCompleted))}
        onPress={() => openItemMenu(item)}
      />
    ));

  const addTo = (sectionId: string | null) => (title: string) =>
    mutate((db) => insertItem(db, { activityId: id, sectionId, title }));

  const meta = [
    activity.date && formatDateKey(activity.date),
    activity.type !== 'custom' && ACTIVITY_TYPE_LABELS[activity.type],
    completed && 'Done',
  ].filter(Boolean);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <Stack.Screen
        options={{
          title: '',
          headerRight: () => <IconButton glyph="⋯" label="Activity options" onPress={openActivityMenu} />,
        }}
      />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={[type.title, { color: t.text }]}>{activity.title}</Text>
          {meta.length > 0 && (
            <Text style={[type.caption, { color: t.textMuted }]}>{meta.join(' · ')}</Text>
          )}
        </View>

        <View style={styles.progress}>
          <Text style={[type.bodyStrong, { color: t.text }]}>
            {items.length === 0 ? 'Nothing added yet' : `${done} of ${items.length} done`}
          </Text>
          <ProgressBar done={done} total={items.length} />
        </View>

        <View>
          {renderItems(ungrouped)}
          <AddItemField
            placeholder={items.length === 0 ? '＋ Add your first item' : '＋ Add an item'}
            onAdd={addTo(null)}
          />
        </View>

        {sections.map((section) => (
          <View key={section.id}>
            <View style={styles.sectionHeader}>
              <Text style={[type.heading, styles.flex, { color: t.text }]}>{section.title}</Text>
              <IconButton
                glyph="⋯"
                label={`${section.title} options`}
                onPress={() => openSectionMenu(section)}
              />
            </View>
            {renderItems(items.filter((i) => i.sectionId === section.id))}
            <AddItemField placeholder={`＋ Add to ${section.title}`} onAdd={addTo(section.id)} />
          </View>
        ))}

        <Button label="＋ Add section" variant="ghost" onPress={addSection} />
      </ScrollView>
      <Overlay overlay={overlay} onClose={close} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl * 2,
    gap: spacing.xl,
  },
  header: {
    gap: spacing.xs,
  },
  progress: {
    gap: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
