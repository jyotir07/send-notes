import { DatabaseSync } from 'node:sqlite';

import type { BindValue, Db } from '@/db/db';
import { migrate } from '@/db/migrations';

function wrap(sqlite: DatabaseSync): Db {
  const db: Db = {
    exec: async (sql) => {
      sqlite.exec(sql);
    },
    run: async (sql, params: BindValue[] = []) => {
      sqlite.prepare(sql).run(...params);
    },
    all: async <T>(sql: string, params: BindValue[] = []) =>
      sqlite.prepare(sql).all(...params) as T[],
    first: async <T>(sql: string, params: BindValue[] = []) =>
      (sqlite.prepare(sql).get(...params) as T | undefined) ?? null,
    transaction: async (task) => {
      sqlite.exec('BEGIN');
      try {
        await task(db);
        sqlite.exec('COMMIT');
      } catch (e) {
        sqlite.exec('ROLLBACK');
        throw e;
      }
    },
  };
  return db;
}

/** Fresh, fully migrated in-memory database — same schema and pragmas as the app. */
export async function createTestDb(): Promise<Db> {
  const db = wrap(new DatabaseSync(':memory:'));
  await migrate(db);
  return db;
}
