import type { Ref } from 'react';
import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { radius, spacing, touchTarget, type } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

type Props = TextInputProps & { ref?: Ref<TextInput> };

export function TextField({ style, ...rest }: Props) {
  const t = useTheme();
  return (
    <TextInput
      placeholderTextColor={t.textMuted}
      style={[
        styles.input,
        type.body,
        { backgroundColor: t.surface, borderColor: t.border, color: t.text },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: touchTarget,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
  },
});
