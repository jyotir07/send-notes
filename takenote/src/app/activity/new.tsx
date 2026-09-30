import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ActivityForm } from '@/components/ActivityForm';
import { Chip } from '@/components/Chip';
import { TEMPLATES, templateForType, type Template } from '@/domain/templates';
import type { ActivityType } from '@/domain/types';
import { useMutate } from '@/hooks/useMutate';
import { createActivity } from '@/repositories/templates';
import { spacing, type } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const NONE = 'none';

export default function NewActivity() {
  const t = useTheme();
  const mutate = useMutate();
  // null = follow the selected type's template until the user picks one explicitly.
  const [choice, setChoice] = useState<string | null>(null);

  const selectedTemplate = (type: ActivityType): Template | null => {
    if (choice === NONE) return null;
    if (choice) return TEMPLATES.find((tpl) => tpl.id === choice) ?? null;
    return templateForType(type) ?? null;
  };

  return (
    <ActivityForm
      submitLabel="Create activity"
      renderExtra={(values) => {
        const selected = selectedTemplate(values.type);
        return (
          <View style={styles.field}>
            <Text style={[type.caption, { color: t.textMuted }]}>Starter checklist (optional)</Text>
            <View style={styles.chips} accessibilityRole="radiogroup">
              <Chip label="Start empty" selected={!selected} onPress={() => setChoice(NONE)} />
              {TEMPLATES.map((tpl) => (
                <Chip
                  key={tpl.id}
                  label={tpl.name}
                  selected={selected?.id === tpl.id}
                  onPress={() => setChoice(tpl.id)}
                />
              ))}
            </View>
            {selected && (
              <Text style={[type.caption, { color: t.textMuted }]}>
                {selected.sections
                  .flatMap((s) => s.items.map((i) => i.title))
                  .join(' · ')}
                {'\n'}You can edit or remove any of these.
              </Text>
            )}
          </View>
        );
      }}
      onSubmit={async (values) => {
        let id: string | undefined;
        await mutate(async (db) => {
          id = (await createActivity(db, values, selectedTemplate(values.type))).id;
        });
        if (id) router.replace({ pathname: '/activity/[id]', params: { id } });
      }}
    />
  );
}

const styles = StyleSheet.create({
  field: {
    gap: spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
