/**
 * @jest-environment node
 */
import type { Db } from '@/db/db';
import { migrate, SCHEMA_VERSION } from '@/db/migrations';
import { createTestDb } from '@/test/nodeDb';

import {
  deleteActivity,
  getActivity,
  insertActivity,
  listActivities,
  setActivityStatus,
  updateActivity,
} from '../activities';
import {
  countInbox,
  insertInboxItem,
  listInbox,
  moveInboxItemToActivity,
} from '../inbox';
import {
  deleteItem,
  getProgress,
  insertItem,
  listItems,
  moveItem,
  setItemCompleted,
  updateItem,
} from '../items';
import { deleteSection, insertSection, listSections, renameSection } from '../sections';

let db: Db;

beforeEach(async () => {
  db = await createTestDb();
});

describe('migrations', () => {
  it('sets user_version to the latest schema', async () => {
    const row = await db.first<{ user_version: number }>('PRAGMA user_version');
    expect(row?.user_version).toBe(SCHEMA_VERSION);
  });

  it('is idempotent when run again on an up-to-date database', async () => {
    const a = await insertActivity(db, { title: 'Goa Weekend' });
    await migrate(db);
    expect(await getActivity(db, a.id)).not.toBeNull();
  });

  it('refuses a database from a newer app version', async () => {
    await db.exec(`PRAGMA user_version = ${SCHEMA_VERSION + 1}`);
    await expect(migrate(db)).rejects.toThrow(/newer/);
  });
});

describe('activities', () => {
  it('creates with trimmed title and defaults', async () => {
    const a = await insertActivity(db, { title: '  Goa Weekend  ' });
    expect(a).toMatchObject({ title: 'Goa Weekend', type: 'custom', date: null, status: 'upcoming' });
    expect(await getActivity(db, a.id)).toEqual(a);
  });

  it('rejects a blank title', async () => {
    await expect(insertActivity(db, { title: '   ' })).rejects.toThrow('Title is required.');
  });

  it('lists dated activities first by date, then undated newest first, with progress', async () => {
    const undated = await insertActivity(db, { title: 'Gym' });
    const later = await insertActivity(db, { title: 'Concert', date: '2026-12-01' });
    const sooner = await insertActivity(db, { title: 'Goa', date: '2026-10-10' });
    const item = await insertItem(db, { activityId: sooner.id, title: 'Belt' });
    await insertItem(db, { activityId: sooner.id, title: 'Shoes' });
    await setItemCompleted(db, item.id, true);

    const list = await listActivities(db);
    expect(list.map((a) => a.id)).toEqual([sooner.id, later.id, undated.id]);
    expect(list[0]).toMatchObject({ done: 1, total: 2 });
    expect(list[2]).toMatchObject({ done: 0, total: 0 });
  });

  it('filters by status', async () => {
    const a = await insertActivity(db, { title: 'Done trip' });
    await setActivityStatus(db, a.id, 'completed');
    expect(await listActivities(db)).toHaveLength(0);
    expect(await listActivities(db, 'completed')).toHaveLength(1);
  });

  it('updates only the provided fields and can clear the date', async () => {
    const a = await insertActivity(db, { title: 'Goa', type: 'trip', date: '2026-10-10' });
    await updateActivity(db, a.id, { date: null });
    expect(await getActivity(db, a.id)).toMatchObject({ title: 'Goa', type: 'trip', date: null });
  });

  it('cascades delete to sections and items', async () => {
    const a = await insertActivity(db, { title: 'Goa' });
    const s = await insertSection(db, a.id, 'Clothes');
    await insertItem(db, { activityId: a.id, sectionId: s.id, title: 'Belt' });
    await deleteActivity(db, a.id);
    expect(await listSections(db, a.id)).toEqual([]);
    expect(await listItems(db, a.id)).toEqual([]);
  });
});

describe('sections', () => {
  it('orders by creation and renames', async () => {
    const a = await insertActivity(db, { title: 'Goa' });
    const s1 = await insertSection(db, a.id, 'Essentials');
    const s2 = await insertSection(db, a.id, 'Clothes');
    await renameSection(db, s2.id, 'Clothes & gear');
    expect((await listSections(db, a.id)).map((s) => [s.id, s.title])).toEqual([
      [s1.id, 'Essentials'],
      [s2.id, 'Clothes & gear'],
    ]);
  });

  it('ungroups items instead of deleting them when a section is deleted', async () => {
    const a = await insertActivity(db, { title: 'Goa' });
    const s = await insertSection(db, a.id, 'Clothes');
    const item = await insertItem(db, { activityId: a.id, sectionId: s.id, title: 'Belt' });
    await deleteSection(db, s.id);
    const [after] = await listItems(db, a.id);
    expect(after).toMatchObject({ id: item.id, sectionId: null });
  });
});

describe('items', () => {
  it('toggles completion and reports progress', async () => {
    const a = await insertActivity(db, { title: 'Goa' });
    const i1 = await insertItem(db, { activityId: a.id, title: 'Belt' });
    await insertItem(db, { activityId: a.id, title: 'Shoes', kind: 'collect' });
    await setItemCompleted(db, i1.id, true);
    expect(await getProgress(db, a.id)).toEqual({ done: 1, total: 2 });
    await setItemCompleted(db, i1.id, false);
    expect(await getProgress(db, a.id)).toEqual({ done: 0, total: 2 });
  });

  it('edits title, kind and section', async () => {
    const a = await insertActivity(db, { title: 'Goa' });
    const s = await insertSection(db, a.id, 'Before');
    const i = await insertItem(db, { activityId: a.id, title: 'Shoes' });
    await updateItem(db, i.id, { title: 'Collect shoes before Friday', kind: 'collect', sectionId: s.id });
    const [after] = await listItems(db, a.id);
    expect(after).toMatchObject({ title: 'Collect shoes before Friday', kind: 'collect', sectionId: s.id });
  });

  it('deletes', async () => {
    const a = await insertActivity(db, { title: 'Goa' });
    const i = await insertItem(db, { activityId: a.id, title: 'Belt' });
    await deleteItem(db, i.id);
    expect(await listItems(db, a.id)).toEqual([]);
  });

  it('moves within its own group only and is a no-op at the edges', async () => {
    const a = await insertActivity(db, { title: 'Goa' });
    const s = await insertSection(db, a.id, 'Clothes');
    await insertItem(db, { activityId: a.id, title: 'x' });
    const inSection = await insertItem(db, { activityId: a.id, sectionId: s.id, title: 's' });
    const y = await insertItem(db, { activityId: a.id, title: 'y' });

    await moveItem(db, y.id, 'up');
    const ungrouped = (await listItems(db, a.id)).filter((i) => i.sectionId === null);
    expect(ungrouped.map((i) => i.title)).toEqual(['y', 'x']);

    await moveItem(db, y.id, 'up');
    await moveItem(db, inSection.id, 'down');
    const all = await listItems(db, a.id);
    expect(all.filter((i) => i.sectionId === null).map((i) => i.title)).toEqual(['y', 'x']);
    expect(all.find((i) => i.id === inSection.id)?.sortOrder).toBe(inSection.sortOrder);
  });
});

describe('inbox', () => {
  it('captures newest first and counts', async () => {
    await insertInboxItem(db, 'Buy sunscreen');
    await new Promise((r) => setTimeout(r, 2));
    await insertInboxItem(db, 'Charge headphones');
    expect((await listInbox(db)).map((i) => i.title)).toEqual(['Charge headphones', 'Buy sunscreen']);
    expect(await countInbox(db)).toBe(2);
  });

  it('moves a thought into an activity atomically', async () => {
    const a = await insertActivity(db, { title: 'Goa' });
    const thought = await insertInboxItem(db, 'Take the new black belt');
    await moveInboxItemToActivity(db, thought.id, a.id);
    expect(await listInbox(db)).toEqual([]);
    expect((await listItems(db, a.id)).map((i) => i.title)).toEqual(['Take the new black belt']);
  });

  it('keeps the thought in the inbox if the target activity does not exist', async () => {
    const thought = await insertInboxItem(db, 'Collect parcel');
    await expect(moveInboxItemToActivity(db, thought.id, 'missing')).rejects.toThrow();
    expect(await countInbox(db)).toBe(1);
  });
});
