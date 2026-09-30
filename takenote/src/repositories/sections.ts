import type { Db } from '@/db/db';
import { newId } from '@/db/ids';
import type { ChecklistSection } from '@/domain/types';

import { requireTitle } from './activities';

type SectionRow = { id: string; activity_id: string; title: string; sort_order: number };

const toSection = (r: SectionRow): ChecklistSection => ({
  id: r.id,
  activityId: r.activity_id,
  title: r.title,
  sortOrder: r.sort_order,
});

export async function listSections(db: Db, activityId: string): Promise<ChecklistSection[]> {
  const rows = await db.all<SectionRow>(
    'SELECT * FROM checklist_sections WHERE activity_id = ? ORDER BY sort_order',
    [activityId],
  );
  return rows.map(toSection);
}

export async function insertSection(
  db: Db,
  activityId: string,
  title: string,
): Promise<ChecklistSection> {
  const next = await db.first<{ n: number }>(
    'SELECT COALESCE(MAX(sort_order), -1) + 1 AS n FROM checklist_sections WHERE activity_id = ?',
    [activityId],
  );
  const section: ChecklistSection = {
    id: newId(),
    activityId,
    title: requireTitle(title),
    sortOrder: next?.n ?? 0,
  };
  await db.run(
    'INSERT INTO checklist_sections (id, activity_id, title, sort_order) VALUES (?, ?, ?, ?)',
    [section.id, section.activityId, section.title, section.sortOrder],
  );
  return section;
}

export async function renameSection(db: Db, id: string, title: string): Promise<void> {
  await db.run('UPDATE checklist_sections SET title = ? WHERE id = ?', [requireTitle(title), id]);
}

/** Items in the section become ungrouped (ON DELETE SET NULL) rather than being deleted. */
export async function deleteSection(db: Db, id: string): Promise<void> {
  await db.run('DELETE FROM checklist_sections WHERE id = ?', [id]);
}
