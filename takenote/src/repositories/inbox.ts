import type { Db } from '@/db/db';
import { newId, nowIso } from '@/db/ids';
import type { InboxItem } from '@/domain/types';

import { requireTitle } from './activities';
import { insertItem } from './items';

type InboxRow = { id: string; title: string; created_at: string };

const toInboxItem = (r: InboxRow): InboxItem => ({
  id: r.id,
  title: r.title,
  createdAt: r.created_at,
});

export async function listInbox(db: Db): Promise<InboxItem[]> {
  const rows = await db.all<InboxRow>('SELECT * FROM inbox_items ORDER BY created_at DESC');
  return rows.map(toInboxItem);
}

export async function countInbox(db: Db): Promise<number> {
  const row = await db.first<{ n: number }>('SELECT COUNT(*) AS n FROM inbox_items');
  return row?.n ?? 0;
}

export async function insertInboxItem(db: Db, title: string): Promise<InboxItem> {
  const item: InboxItem = { id: newId(), title: requireTitle(title), createdAt: nowIso() };
  await db.run('INSERT INTO inbox_items (id, title, created_at) VALUES (?, ?, ?)', [
    item.id,
    item.title,
    item.createdAt,
  ]);
  return item;
}

export async function renameInboxItem(db: Db, id: string, title: string): Promise<void> {
  await db.run('UPDATE inbox_items SET title = ? WHERE id = ?', [requireTitle(title), id]);
}

export async function deleteInboxItem(db: Db, id: string): Promise<void> {
  await db.run('DELETE FROM inbox_items WHERE id = ?', [id]);
}

/** Converts the thought into a checklist item. Atomic, so it can never be lost or duplicated. */
export async function moveInboxItemToActivity(
  db: Db,
  inboxId: string,
  activityId: string,
): Promise<void> {
  await db.transaction(async (tx) => {
    const row = await tx.first<InboxRow>('SELECT * FROM inbox_items WHERE id = ?', [inboxId]);
    if (!row) throw new Error('Inbox item not found.');
    await insertItem(tx, { activityId, title: row.title });
    await tx.run('DELETE FROM inbox_items WHERE id = ?', [inboxId]);
  });
}
