import type { ActivityType, ItemKind } from './types';

export type TemplateItem = { title: string; kind?: ItemKind };
export type Template = {
  id: string;
  name: string;
  forType: ActivityType;
  sections: { title: string; items: TemplateItem[] }[];
};

// Starter suggestions only: applying one copies its items, so users edit freely and templates
// never change underneath an activity.
export const TEMPLATES: Template[] = [
  {
    id: 'weekend-trip',
    name: 'Weekend trip',
    forType: 'trip',
    sections: [
      {
        title: 'Essentials',
        items: [
          { title: 'Wallet and ID' },
          { title: 'Phone and charger' },
          { title: 'Power bank' },
          { title: 'Booking or travel documents' },
        ],
      },
      {
        title: 'Clothes & gear',
        items: [{ title: 'Clothes' }, { title: 'Comfortable shoes' }, { title: 'Toiletries' }],
      },
      { title: 'Personal reminders', items: [{ title: 'Personal items', kind: 'remember' }] },
    ],
  },
  {
    id: 'concert',
    name: 'Concert or event',
    forType: 'event',
    sections: [
      {
        title: 'Essentials',
        items: [
          { title: 'Ticket or entry pass' },
          { title: 'ID, if required' },
          { title: 'Phone' },
          { title: 'Payment method' },
          { title: 'Portable charger, if permitted' },
        ],
      },
      {
        title: 'Get or do before',
        items: [
          { title: 'Sort out a transport plan', kind: 'do' },
          { title: 'Check venue rules on what you can bring', kind: 'do' },
        ],
      },
    ],
  },
  {
    id: 'gym',
    name: 'Gym',
    forType: 'fitness',
    sections: [
      {
        title: 'Clothes & gear',
        items: [
          { title: 'Workout clothes' },
          { title: 'Shoes' },
          { title: 'Towel' },
          { title: 'Water bottle' },
          { title: 'Headphones' },
        ],
      },
      {
        title: 'Essentials',
        items: [{ title: 'Lock, if needed' }, { title: 'Membership card, if needed' }],
      },
    ],
  },
  {
    id: 'hiking',
    name: 'Hiking',
    forType: 'outdoor',
    sections: [
      {
        title: 'Get or do before',
        items: [
          { title: 'Check the route and current local conditions', kind: 'do' },
          { title: 'Charge phone', kind: 'do' },
        ],
      },
      {
        title: 'Essentials',
        items: [{ title: 'Water' }, { title: 'Snacks' }, { title: 'First-aid essentials' }],
      },
      {
        title: 'Clothes & gear',
        items: [
          { title: 'Suitable footwear' },
          { title: 'Weather-appropriate layers' },
          { title: 'Activity-specific gear or permits' },
        ],
      },
    ],
  },
  {
    id: 'family-outing',
    name: 'Family outing',
    forType: 'family',
    sections: [
      {
        title: 'Essentials',
        items: [
          { title: 'Keys and wallet' },
          { title: 'Phone and charger' },
          { title: 'Snacks or water' },
          { title: 'Tickets or reservations' },
        ],
      },
      {
        title: 'Personal reminders',
        items: [{ title: 'Items for children or family members', kind: 'remember' }],
      },
      {
        title: 'Get or do before',
        items: [{ title: 'Planned pickups or purchases', kind: 'collect' }],
      },
    ],
  },
];

export const templateForType = (type: ActivityType): Template | undefined =>
  TEMPLATES.find((t) => t.forType === type);

export const templateItemCount = (template: Template): number =>
  template.sections.reduce((n, s) => n + s.items.length, 0);
