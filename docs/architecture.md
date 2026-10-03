# Architecture

How data flows through the TakeNote app (`takenote/src/`). For why each choice was made and what was rejected, see the Technical decisions table in [`plan.md`](../plan.md).

## Layers

```
screens (src/app/)            UI only; never touch SQL
   │  useQuery(load)          read: runs on screen focus
   │  useMutate(onDone)       write: runs, then reloads; failures are shown to the user
   ▼
repositories (src/repositories/)   the only code that runs SQL; maps snake_case rows → domain types
   │
   ▼
Db interface (src/db/db.ts)   exec / run / all / first / transaction
   │
   ├── expoDb (src/db/expoDb.ts)    expo-sqlite in the app
   └── nodeDb (src/test/nodeDb.ts)  node:sqlite in Jest
```

The rules:

- **Only `src/db/` imports `expo-sqlite`.** Repositories receive a `Db` as their first argument, so the same code runs on the device and in tests, and a sync layer can wrap it later without changing any screens.
- **Only repositories run SQL.** Screens, components, and hooks call repository functions.
- **Domain types live in `src/domain/types.ts`** and use camelCase. Each repository converts its database rows to those types (for example, `toItem` in `repositories/items.ts`).

## Reading and writing

There is no global store. A screen loads what it needs with `useQuery`, which runs the loader every time the screen gains focus (`useFocusEffect`). That's how Home picks up edits made in the activity detail screen when you navigate back.

Writes go through `useMutate(reload)`:

1. Run the write against the `Db`.
2. Call `onDone`, usually the screen's `reload`.
3. If the write throws, log it, show an "Couldn't save that" alert, and resolve to `false`. Failed writes are never dropped silently.

Writes that touch several rows (applying a template, moving an Inbox item into an activity, reordering, running a migration) go through `db.transaction`. In the app, that maps to expo-sqlite's `withExclusiveTransactionAsync`. It's exclusive so that an unrelated write, such as a checkbox tap, can't slip into the transaction and get rolled back along with it.

## Database lifecycle

`DbProvider` (in `src/db/DbProvider.tsx`) opens `takenote.db` through `SQLiteProvider`, using `useSuspense`. Its `onInit` runs `migrate()` before any screen renders:

1. `PRAGMA foreign_keys = ON` must run on every connection and outside a transaction. Without it, the `ON DELETE` cascades are silently ignored.
2. `PRAGMA journal_mode = WAL`.
3. Read `PRAGMA user_version` and apply each pending migration in its own transaction, bumping `user_version` inside that same transaction.
4. If the database's version is newer than the app supports, throw instead of running against a schema the app doesn't understand.

If initialization fails, the error reaches `AppErrorBoundary` in `src/app/_layout.tsx`, so the user sees an error screen rather than a blank app.

### Adding a migration

Migrations are an append-only array in `src/db/migrations.ts`, where position + 1 = `user_version`. Never edit a migration that has shipped. Append a new one and add a repository test that upgrades from the previous version. Testers already have data on their phones.

## IDs and time

- IDs are UUID v4 strings generated on the device (`src/db/ids.ts`), so rows can sync later without collisions.
- Timestamps are ISO-8601 UTC strings.
- An activity's date is a plain `YYYY-MM-DD` calendar date, not a moment in time, which avoids off-by-one-day bugs across timezones. Date helpers live in `src/domain/dates.ts`.

## Tests

Jest (`jest-expo`) tests the repositories and the date logic against a real in-memory SQLite database using Node's built-in `node:sqlite` (`src/test/nodeDb.ts`), not mocks. `jest.setup.ts` only swaps `expo-crypto`'s `randomUUID` for Node's version. The UI isn't covered by automated tests; [`manual-qa.md`](manual-qa.md) covers it instead.
