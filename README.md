# TakeNote

A mobile-first app for remembering the small, personal things to bring, buy, collect, or do before an activity — a trip, a concert, a gym session, a hike. Create an activity, capture items as they come to mind, and check them off when it's time to go.

Built with Expo (React Native + TypeScript) and Expo Router. Data stays on the device in SQLite: no accounts, no network, no permissions.

## Status

MVP phases 0–5 are built; Phase 6 (device testing and an installable EAS build) has not started. See [`plan.md`](plan.md) for the phase table, technical decisions, and schema.

## Features

- Activities with a type, an optional date, and a manual completed state
- Checklists with sections, item kinds (pack / buy / collect / do / remember), and move up/down reordering
- Quick capture from Home, saved to an Inbox or straight into an activity
- Editable starter templates (weekend trip, concert, gym, hiking, family outing)
- Packing mode: large check targets, hide-completed, undo, haptics
- Light and dark themes

## Repository layout

```
plan.md        implementation plan and as-built decisions
takenote/      the Expo app
  src/app/           screens (Expo Router)
  src/repositories/  the only code that talks to SQLite
  src/db/            Db interface, expo-sqlite adapter, migrations
  src/domain/        types, dates, template data
  src/components/    shared UI
```

## Running it

Requires Node 22 or newer (the tests use Node's built-in `node:sqlite`) and the Expo Go app on your phone.

```bash
cd takenote
npm install
npx expo start            # scan the QR code with Expo Go
npx expo start --tunnel   # if the phone and computer are on different networks
```

## Checks

Run from `takenote/`:

```bash
npm test            # Jest: repository and date logic against a real SQLite database
npm run typecheck   # tsc --noEmit
npm run lint        # expo lint
```

UI behavior is verified manually on a device.
