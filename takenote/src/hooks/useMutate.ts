import { useCallback } from 'react';
import { Alert } from 'react-native';

import type { Db } from '@/db/db';
import { useDb } from '@/db/DbProvider';

/**
 * Runs a write, then `onDone` (typically the screen's reload). Failures are logged and shown to
 * the user; nothing is dropped silently. Resolves to whether the write succeeded.
 */
export function useMutate(onDone?: () => unknown) {
  const db = useDb();

  return useCallback(
    async (write: (db: Db) => Promise<unknown>): Promise<boolean> => {
      try {
        await write(db);
        await onDone?.();
        return true;
      } catch (e) {
        console.error(e);
        Alert.alert("Couldn't save that", e instanceof Error ? e.message : 'Please try again.');
        return false;
      }
    },
    [db, onDone],
  );
}
