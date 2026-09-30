import { SQLiteProvider, useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import { useMemo, type ReactNode } from 'react';

import type { Db } from './db';
import { expoDb } from './expoDb';
import { migrate } from './migrations';

const DATABASE_NAME = 'takenote.db';

const runMigrations = (sqlite: SQLiteDatabase) => migrate(expoDb(sqlite));

export function DbProvider({ children }: { children: ReactNode }) {
  // useSuspense lets init failures (e.g. a failed migration) surface through the route
  // ErrorBoundary instead of leaving a blank screen.
  return (
    <SQLiteProvider databaseName={DATABASE_NAME} onInit={runMigrations} useSuspense>
      {children}
    </SQLiteProvider>
  );
}

export function useDb(): Db {
  const sqlite = useSQLiteContext();
  return useMemo(() => expoDb(sqlite), [sqlite]);
}
