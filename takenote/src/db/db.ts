export type BindValue = string | number | null;

/**
 * The only surface repositories depend on. Keeps them independent of expo-sqlite so they can be
 * tested against node:sqlite and later wrapped by a sync layer.
 */
export interface Db {
  exec(sql: string): Promise<void>;
  run(sql: string, params?: BindValue[]): Promise<void>;
  all<T>(sql: string, params?: BindValue[]): Promise<T[]>;
  first<T>(sql: string, params?: BindValue[]): Promise<T | null>;
  /** Runs `task` atomically; any throw rolls back every write made through `tx`. */
  transaction(task: (tx: Db) => Promise<void>): Promise<void>;
}
