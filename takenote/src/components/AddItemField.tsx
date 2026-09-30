import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { spacing } from '@/theme/tokens';

import { TextField } from './TextField';

type Props = { placeholder?: string; onAdd: (title: string) => Promise<boolean> };

/** Stays focused after each submit so several items can be typed in a row. */
export function AddItemField({ placeholder = '＋ Add an item', onAdd }: Props) {
  const [value, setValue] = useState('');

  const submit = async () => {
    if (!value.trim()) return;
    if (await onAdd(value)) setValue('');
  };

  return (
    <TextField
      value={value}
      onChangeText={setValue}
      placeholder={placeholder}
      accessibilityLabel={placeholder.replace('＋ ', '')}
      returnKeyType="done"
      submitBehavior="submit"
      onSubmitEditing={submit}
      style={styles.field}
    />
  );
}

const styles = StyleSheet.create({
  field: {
    marginTop: spacing.xs,
  },
});
