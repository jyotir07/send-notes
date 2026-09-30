import type { Db } from '@/db/db';
import { newId, nowIso } from '@/db/ids';
import type { ChecklistItem, ItemKind, Progress } from '@/domain/types';

import { requireTitle } from './activities';

type ItemRow = {
  id: string;
  activity_id: string;
  section_id: string | null;
  title: string;
  kind: ItemKind;
  is_completed: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

const toItem = (r: ItemRow): ChecklistItem => ({
  id: r.id,
  activityId: r.activity_id,
  sectionId: r.section_id,
  title: r.title,
  kind: r.kind,
  isCompleted: r.is_completed === 1,
  sortOrder: r.sort_order,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

export async function listItems(db: Db, activityId: string): Promise<ChecklistItem[]> {
  const rows = await db.all<ItemRow>(
    'SELECT * FROM checklist_items WHERE activity_id = ? ORDER BY sort_order',
    [activityId],
  );
  return rows.map(toItem);
}

export async function getProgress(db: Db, activityId: string): Promise<Progress> {
  const row = await db.first<Progress>(
    `SELECT COALESCE(SUM(is_completed), 0) AS done, COUNT(*) AS total
       FROM checklist_items WHERE activity_id = ?`,
    [activityId],
  );
  return row ?? { done: 0, total: 0 };
}

export type NewItem = {
  activityId: string;
  title: string;
  sectionId?: string | null;
  kind?: ItemKind;
};

export async function insertItem(db: Db, input: NewItem): Promise<ChecklistItem> {
  const next = await db.first<{ n: number }>(
    'SELECT COALESCE(MAX(sort_order), -1) + 1 AS n FROM checklist_items WHERE activity_id = ?',
    [input.activityId],
  );
  const now = nowIso();
  const item: ChecklistItem = {
    id: newId(),
    activityId: input.activityId,
    sectionId: input.sectionId ?? null,
    title: requireTitle(input.title),
    kind: input.kind ?? 'pack',
    isCompleted: false,
    sortOrder: next?.n ?? 0,
    createdAt: now,
    updatedAt: now,
  };
  await db.run(
    `INSERT INTO checklist_items
       (id, activity_id, section_id, title, kind, is_completed, sort_order, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?)`,
    [
      item.id,
      item.activityId,
      item.sectionId,
      item.title,
      item.kind,
      item.sortOrder,
      item.createdAt,
      item.updatedAt,
    ],
  );
  return item;
}

export type ItemPatch = { title?: string; kind?: ItemKind; sectionId?: string | null };

export async function updateItem(db: Db, id: string, patch: ItemPatch): Promise<void> {
  const row = await db.first<ItemRow>('SELECT * FROM checklist_items WHERE id = ?', [id]);
  if (!row) throw new Error('Item not found.');
  await db.run(
    'UPDATE checklist_items SET title = ?, kind = ?, section_id = ?, updated_at = ? WHERE id = ?',
    [
      patch.title === undefined ? row.title : requireTitle(patch.title),
      patch.kind ?? row.kind,
      patch.sectionId === undefined ? row.section_id : patch.sectionId,
      nowIso(),
      id,
    ],
  );
}

export async function setItemCompleted(db: Db, id: string, completed: boolean): Promise<void> {
  await db.run('UPDATE checklist_items SET is_completed = ?, updated_at = ? WHERE id = ?', [
    completed ? 1 : 0,
    nowIso(),
    id,
  ]);
}

export async function deleteItem(db: Db, id: string): Promise<void> {
  await db.run('DELETE FROM checklist_items WHERE id = ?', [id]);
}

/**
 * Swaps the item with its neighbour in the same group (same section, or ungrouped).
 * No-op at either end of the group.
 */
export async function moveItem(db: Db, id: string, direction: 'up' | 'down'): Promise<void> {
  await db.transaction(async (tx) => {
    const item = await tx.first<ItemRow>('SELECT * FROM checklist_items WHERE id = ?', [id]);
    if (!item) throw new Error('Item not found.');

    const neighbour = await tx.first<ItemRow>(
      `SELECT * FROM checklist_items
        WHERE activity_id = ?
          AND section_id IS ?
          AND sort_order ${direction === 'up' ? '<' : '>'} ?
        ORDER BY sort_order ${direction === 'up' ? 'DESC' : 'ASC'}
        LIMIT 1`,
      [item.activity_id, item.section_id, item.sort_order],
    );
    if (!neighbour) return;

    const now = nowIso();
    await tx.run('UPDATE checklist_items SET sort_order = ?, updated_at = ? WHERE id = ?', [
      neighbour.sort_order,
      now,
      item.id,
    ]);
    await tx.run('UPDATE checklist_items SET sort_order = ?, updated_at = ? WHERE id = ?', [
      item.sort_order,
      now,
      neighbour.id,
    ]);
  });
}
