import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { spacing, type } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export default function NewActivity() {
  const t = useTheme();
  const [title, setTitle] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={[type.caption, { color: t.textMuted }]}>What are you getting ready for?</Text>
      <TextField
        autoFocus
        placeholder="e.g. Goa Weekend"
        value={title}
        onChangeText={setTitle}
        returnKeyType="done"
      />
      <Button
        label="Create"
        disabled={title.trim().length === 0}
        onPress={() => router.replace({ pathname: '/activity/[id]', params: { id: 'sample' } })}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
});
