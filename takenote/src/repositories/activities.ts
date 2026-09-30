import type { Db } from '@/db/db';
import { newId, nowIso } from '@/db/ids';
import type { Activity, ActivityStatus, ActivityType, Progress } from '@/domain/types';

type ActivityRow = {
  id: string;
  title: string;
  type: ActivityType;
  date: string | null;
  status: ActivityStatus;
  created_at: string;
  updated_at: string;
};

export type ActivitySummary = Activity & Progress;

const toActivity = (r: ActivityRow): Activity => ({
  id: r.id,
  title: r.title,
  type: r.type,
  date: r.date,
  status: r.status,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

export function requireTitle(title: string): string {
  const trimmed = title.trim();
  if (!trimmed) throw new Error('Title is required.');
  return trimmed;
}

export async function listActivities(
  db: Db,
  status: ActivityStatus = 'upcoming',
): Promise<ActivitySummary[]> {
  const rows = await db.all<ActivityRow & { done: number; total: number }>(
    `SELECT a.*,
            COUNT(i.id) AS total,
            COALESCE(SUM(i.is_completed), 0) AS done
       FROM activities a
       LEFT JOIN checklist_items i ON i.activity_id = a.id
      WHERE a.status = ?
      GROUP BY a.id
      ORDER BY a.date IS NULL, a.date ASC, a.created_at DESC`,
    [status],
  );
  return rows.map((r) => ({ ...toActivity(r), done: r.done, total: r.total }));
}

export async function getActivity(db: Db, id: string): Promise<Activity | null> {
  const row = await db.first<ActivityRow>('SELECT * FROM activities WHERE id = ?', [id]);
  return row ? toActivity(row) : null;
}

export type NewActivity = { title: string; type?: ActivityType; date?: string | null };

export async function insertActivity(db: Db, input: NewActivity): Promise<Activity> {
  const now = nowIso();
  const activity: Activity = {
    id: newId(),
    title: requireTitle(input.title),
    type: input.type ?? 'custom',
    date: input.date ?? null,
    status: 'upcoming',
    createdAt: now,
    updatedAt: now,
  };
  await db.run(
    `INSERT INTO activities (id, title, type, date, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      activity.id,
      activity.title,
      activity.type,
      activity.date,
      activity.status,
      activity.createdAt,
      activity.updatedAt,
    ],
  );
  return activity;
}

export type ActivityPatch = { title?: string; type?: ActivityType; date?: string | null };

export async function updateActivity(db: Db, id: string, patch: ActivityPatch): Promise<void> {
  const current = await getActivity(db, id);
  if (!current) throw new Error('Activity not found.');
  await db.run(
    'UPDATE activities SET title = ?, type = ?, date = ?, updated_at = ? WHERE id = ?',
    [
      patch.title === undefined ? current.title : requireTitle(patch.title),
      patch.type ?? current.type,
      patch.date === undefined ? current.date : patch.date,
      nowIso(),
      id,
    ],
  );
}

export async function setActivityStatus(db: Db, id: string, status: ActivityStatus): Promise<void> {
  await db.run('UPDATE activities SET status = ?, updated_at = ? WHERE id = ?', [
    status,
    nowIso(),
    id,
  ]);
}

export async function deleteActivity(db: Db, id: string): Promise<void> {
  await db.run('DELETE FROM activities WHERE id = ?', [id]);
}
