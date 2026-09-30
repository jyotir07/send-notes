import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import type { Db } from '@/db/db';
import { useDb } from '@/db/DbProvider';

/**
 * Loads data when the screen gains focus, so a screen reflects edits made elsewhere when you
 * navigate back to it. `load` must be referentially stable (wrap it in useCallback).
 */
export function useQuery<T>(load: (db: Db) => Promise<T>) {
  const db = useDb();
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);

  const reload = useCallback(async () => {
    try {
      setData(await load(db));
      setError(null);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e : new Error(String(e)));
    }
  }, [db, load]);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  return { data, error, reload };
}
