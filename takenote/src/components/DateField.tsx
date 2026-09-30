import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Platform, StyleSheet, View } from 'react-native';

import { formatDateKey, fromDateKey, toDateKey } from '@/domain/dates';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { Button } from './Button';

type Props = { value: string | null; onChange: (value: string | null) => void };

export function DateField({ value, onChange }: Props) {
  const t = useTheme();
  const current = value ? fromDateKey(value) : new Date();

  const openAndroid = () =>
    DateTimePickerAndroid.open({
      value: current,
      mode: 'date',
      onChange: (event, date) => {
        if (event.type === 'set' && date) onChange(toDateKey(date));
      },
    });

  if (Platform.OS === 'android' || value === null) {
    return (
      <View style={styles.row}>
        <Button
          variant="secondary"
          label={value ? formatDateKey(value) : 'Add a date'}
          onPress={Platform.OS === 'android' ? openAndroid : () => onChange(toDateKey(new Date()))}
        />
        {value && <Button variant="ghost" label="Clear" onPress={() => onChange(null)} />}
      </View>
    );
  }

  return (
    <View style={styles.row}>
      <DateTimePicker
        value={current}
        mode="date"
        display="compact"
        accentColor={t.accent}
        onChange={(event, date) => {
          if (event.type === 'set' && date) onChange(toDateKey(date));
        }}
      />
      <Button variant="ghost" label="Clear" onPress={() => onChange(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
