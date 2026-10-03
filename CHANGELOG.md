# Changelog

Notable changes to TakeNote. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versions will match `version` in `takenote/app.json` once builds are cut.

## [Unreleased]

The MVP as of Phase 5 in [`plan.md`](plan.md). Not yet released as an installable build.

### Added

- Expo SDK 57 app with Expo Router, TypeScript, lint, typecheck and Jest.
- Theme tokens with light and dark palettes that follow the system theme, plus base UI components.
- On-device SQLite storage (schema v1) with versioned migrations based on `PRAGMA user_version`, behind a `Db` interface and repositories.
- Activities: create, edit, mark as done, and delete, each with a name, an optional type, and an optional date.
- Checklists: sections, items, completion, item kinds (pack / buy / collect / do / remember), move up/down reordering, and progress on Home.
- Quick capture from Home: Enter saves to the Inbox, or one tap files the item into an upcoming activity.
- Inbox: edit, delete, and move an item into an activity, which converts it to a checklist item in a single transaction.
- Five editable starter templates (weekend trip, concert/event, gym, hiking, family outing), offered when creating an activity.
- Packing mode: large tap targets, hide-checked toggle, Undo snackbar, haptics, and a "You're all set" completion state.
- A root error boundary with retry, shown if the database fails to open or migrate.
- Docs: README, architecture overview, and an on-device manual QA checklist.
