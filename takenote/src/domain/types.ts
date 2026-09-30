export const ACTIVITY_TYPES = ['trip', 'event', 'fitness', 'outdoor', 'family', 'custom'] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  trip: 'Trip',
  event: 'Concert / Event',
  fitness: 'Gym / Fitness',
  outdoor: 'Hiking / Outdoor',
  family: 'Family outing',
  custom: 'Custom',
};

export type ActivityStatus = 'upcoming' | 'completed' | 'archived';

export const ITEM_KINDS = ['pack', 'buy', 'collect', 'do', 'remember'] as const;
export type ItemKind = (typeof ITEM_KINDS)[number];

export type Activity = {
  id: string;
  title: string;
  type: ActivityType;
  /** Calendar date as YYYY-MM-DD, not an instant, so it never shifts across timezones. */
  date: string | null;
  status: ActivityStatus;
  createdAt: string;
  updatedAt: string;
};

export type ChecklistSection = {
  id: string;
  activityId: string;
  title: string;
  sortOrder: number;
};

export type ChecklistItem = {
  id: string;
  activityId: string;
  sectionId: string | null;
  title: string;
  kind: ItemKind;
  isCompleted: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type InboxItem = {
  id: string;
  title: string;
  createdAt: string;
};

export type Progress = { done: number; total: number };
