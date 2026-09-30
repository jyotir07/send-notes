import { useCallback, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { radius, spacing, touchTarget, type } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { Button } from './Button';
import { TextField } from './TextField';

export type SheetAction = { label: string; onPress: () => void; destructive?: boolean };

type Prompt = {
  title: string;
  initialValue?: string;
  placeholder?: string;
  submitLabel?: string;
  onSubmit: (value: string) => unknown;
};

type Confirm = {
  title: string;
  message?: string;
  confirmLabel: string;
  onConfirm: () => unknown;
};

type OverlayState =
  | { kind: 'actions'; title?: string; actions: SheetAction[] }
  | ({ kind: 'prompt' } & Prompt)
  | ({ kind: 'confirm' } & Confirm);

/**
 * One modal per screen whose content swaps between an action sheet, a text prompt and a
 * confirmation. iOS can't present a second Modal (or an Alert) while the first is dismissing, so
 * flows like "menu → Edit" or "menu → Delete?" must reuse the same one.
 */
export function useOverlay() {
  const [overlay, setOverlay] = useState<OverlayState | null>(null);
  const close = useCallback(() => setOverlay(null), []);
  const showActions = useCallback(
    (actions: SheetAction[], title?: string) => setOverlay({ kind: 'actions', title, actions }),
    [],
  );
  const showPrompt = useCallback((prompt: Prompt) => setOverlay({ kind: 'prompt', ...prompt }), []);
  const showConfirm = useCallback(
    (confirm: Confirm) => setOverlay({ kind: 'confirm', ...confirm }),
    [],
  );

  return { overlay, close, showActions, showPrompt, showConfirm };
}

type Props = { overlay: OverlayState | null; onClose: () => void };

export function Overlay({ overlay, onClose }: Props) {
  const t = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={overlay !== null}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
      navigationBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[styles.backdrop, overlay && overlay.kind !== 'actions' && styles.centered]}
      >
        <Pressable
          accessibilityLabel="Close"
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />
        {overlay?.kind === 'actions' && (
          <View
            style={[
              styles.sheet,
              { backgroundColor: t.surface, paddingBottom: insets.bottom + spacing.md },
            ]}
          >
            {overlay.title && (
              <Text numberOfLines={2} style={[type.caption, styles.sheetTitle, { color: t.textMuted }]}>
                {overlay.title}
              </Text>
            )}
            {overlay.actions.map((a, i) => (
              <Pressable
                key={i}
                accessibilityRole="button"
                onPress={() => {
                  onClose();
                  a.onPress();
                }}
                style={({ pressed }) => [styles.action, pressed && { backgroundColor: t.surfaceMuted }]}
              >
                <Text style={[type.body, { color: a.destructive ? t.danger : t.text }]}>{a.label}</Text>
              </Pressable>
            ))}
          </View>
        )}
        {overlay?.kind === 'prompt' && <PromptCard prompt={overlay} onClose={onClose} />}
        {overlay?.kind === 'confirm' && (
          <View style={[styles.card, { backgroundColor: t.surface }]}>
            <Text style={[type.heading, { color: t.text }]}>{overlay.title}</Text>
            {overlay.message && (
              <Text style={[type.body, { color: t.textMuted }]}>{overlay.message}</Text>
            )}
            <View style={styles.cardButtons}>
              <Button label="Cancel" variant="ghost" onPress={onClose} />
              <Button
                label={overlay.confirmLabel}
                variant="danger"
                onPress={() => {
                  onClose();
                  overlay.onConfirm();
                }}
              />
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
}

function PromptCard({ prompt, onClose }: { prompt: Prompt; onClose: () => void }) {
  const t = useTheme();
  const [value, setValue] = useState(prompt.initialValue ?? '');
  const canSubmit = value.trim().length > 0;

  const submit = async () => {
    if (!canSubmit) return;
    onClose();
    await prompt.onSubmit(value);
  };

  return (
    <View style={[styles.card, { backgroundColor: t.surface }]}>
      <Text style={[type.heading, { color: t.text }]}>{prompt.title}</Text>
      <TextField
        autoFocus
        value={value}
        onChangeText={setValue}
        placeholder={prompt.placeholder}
        returnKeyType="done"
        onSubmitEditing={submit}
        selectTextOnFocus
      />
      <View style={styles.cardButtons}>
        <Button label="Cancel" variant="ghost" onPress={onClose} />
        <Button label={prompt.submitLabel ?? 'Save'} disabled={!canSubmit} onPress={submit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  centered: {
    justifyContent: 'center',
    padding: spacing.lg,
  },
  sheet: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingTop: spacing.sm,
  },
  sheetTitle: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
  },
  action: {
    minHeight: touchTarget + 4,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  card: {
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  cardButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
});
