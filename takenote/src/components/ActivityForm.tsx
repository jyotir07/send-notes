import { useState, type ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ACTIVITY_TYPE_LABELS, ACTIVITY_TYPES, type ActivityType } from '@/domain/types';
import { spacing, type } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { Button } from './Button';
import { Chip } from './Chip';
import { DateField } from './DateField';
import { TextField } from './TextField';

export type ActivityFormValues = { title: string; type: ActivityType; date: string | null };

type Props = {
  initial?: Partial<ActivityFormValues>;
  submitLabel: string;
  onSubmit: (values: ActivityFormValues) => unknown;
  /** Rendered between the fields and the submit button, e.g. the template picker. */
  renderExtra?: (values: ActivityFormValues) => ReactNode;
};

export function ActivityForm({ initial, submitLabel, onSubmit, renderExtra }: Props) {
  const t = useTheme();
  const [title, setTitle] = useState(initial?.title ?? '');
  const [activityType, setActivityType] = useState<ActivityType>(initial?.type ?? 'custom');
  const [date, setDate] = useState<string | null>(initial?.date ?? null);
  const [submitting, setSubmitting] = useState(false);

  const values = { title, type: activityType, date };
  const canSubmit = title.trim().length > 0 && !submitting;

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  };

  const label = (text: string) => (
    <Text style={[type.caption, { color: t.textMuted }]}>{text}</Text>
  );

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.field}>
        {label('Name')}
        <TextField
          autoFocus={!initial?.title}
          placeholder="e.g. Goa Weekend"
          value={title}
          onChangeText={setTitle}
          returnKeyType="done"
          onSubmitEditing={submit}
          accessibilityLabel="Activity name"
        />
      </View>

      <View style={styles.field}>
        {label('Type (optional)')}
        <View style={styles.chips} accessibilityRole="radiogroup">
          {ACTIVITY_TYPES.map((k) => (
            <Chip
              key={k}
              label={ACTIVITY_TYPE_LABELS[k]}
              selected={activityType === k}
              onPress={() => setActivityType(k)}
            />
          ))}
        </View>
      </View>

      <View style={styles.field}>
        {label('Date (optional)')}
        <DateField value={date} onChange={setDate} />
      </View>

      {renderExtra?.(values)}

      <Button label={submitLabel} disabled={!canSubmit} onPress={submit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.xl,
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
