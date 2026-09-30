import type { SQLiteDatabase } from 'expo-sqlite';

import type { BindValue, Db } from './db';

export function expoDb(sqlite: SQLiteDatabase): Db {
  return {
    exec: (sql) => sqlite.execAsync(sql),
    run: async (sql, params: BindValue[] = []) => {
      await sqlite.runAsync(sql, params);
    },
    all: (sql, params: BindValue[] = []) => sqlite.getAllAsync(sql, params),
    first: (sql, params: BindValue[] = []) => sqlite.getFirstAsync(sql, params),
    // Exclusive so an unrelated write (e.g. a checkbox tap) can't interleave into this
    // transaction and be rolled back with it.
    transaction: (task) => sqlite.withExclusiveTransactionAsync((txn) => task(expoDb(txn))),
  };
}
