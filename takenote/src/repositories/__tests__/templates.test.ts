/**
 * @jest-environment node
 */
import type { Db } from '@/db/db';
import { TEMPLATES, templateForType, templateItemCount } from '@/domain/templates';
import { ACTIVITY_TYPES } from '@/domain/types';
import { createTestDb } from '@/test/nodeDb';

import { getActivity, listActivities } from '../activities';
import { listItems } from '../items';
import { listSections } from '../sections';
import { createActivity } from '../templates';

let db: Db;

beforeEach(async () => {
  db = await createTestDb();
});

describe('createActivity', () => {
  it('creates an empty activity without a template', async () => {
    const a = await createActivity(db, { title: 'Gym' }, null);
    expect(await getActivity(db, a.id)).not.toBeNull();
    expect(await listItems(db, a.id)).toEqual([]);
  });

  it('copies every section and item of the template in order', async () => {
    const template = templateForType('trip')!;
    const a = await createActivity(db, { title: 'Goa Weekend', type: 'trip' }, template);

    const sections = await listSections(db, a.id);
    expect(sections.map((s) => s.title)).toEqual(template.sections.map((s) => s.title));

    const items = await listItems(db, a.id);
    expect(items).toHaveLength(templateItemCount(template));
    expect(items.map((i) => i.title)).toEqual(
      template.sections.flatMap((s) => s.items.map((i) => i.title)),
    );
    expect(items.every((i) => !i.isCompleted && i.sectionId !== null)).toBe(true);
  });

  it('creates nothing if any part fails', async () => {
    const broken = { ...TEMPLATES[0], sections: [{ title: 'Ok', items: [{ title: '  ' }] }] };
    await expect(createActivity(db, { title: 'Goa' }, broken)).rejects.toThrow();
    expect(await listActivities(db)).toEqual([]);
  });
});

describe('templates', () => {
  it('has at most one template per activity type and none for custom', () => {
    for (const type of ACTIVITY_TYPES) {
      expect(TEMPLATES.filter((t) => t.forType === type).length).toBeLessThanOrEqual(1);
    }
    expect(templateForType('custom')).toBeUndefined();
  });

  it('reminds hikers to check current conditions', () => {
    const titles = templateForType('outdoor')!.sections.flatMap((s) => s.items.map((i) => i.title));
    expect(titles.some((t) => /conditions/i.test(t))).toBe(true);
  });
});
