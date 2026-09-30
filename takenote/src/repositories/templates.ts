import type { Db } from '@/db/db';
import type { Template } from '@/domain/templates';
import type { Activity } from '@/domain/types';

import { insertActivity, type NewActivity } from './activities';
import { insertItem } from './items';
import { insertSection } from './sections';

/** Creates the activity and copies the template's sections and items, all or nothing. */
export async function createActivity(
  db: Db,
  input: NewActivity,
  template: Template | null,
): Promise<Activity> {
  let activity: Activity | undefined;
  await db.transaction(async (tx) => {
    activity = await insertActivity(tx, input);
    for (const s of template?.sections ?? []) {
      const section = await insertSection(tx, activity.id, s.title);
      for (const item of s.items) {
        await insertItem(tx, {
          activityId: activity.id,
          sectionId: section.id,
          title: item.title,
          kind: item.kind,
        });
      }
    }
  });
  return activity!;
}
