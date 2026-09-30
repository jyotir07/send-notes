# TakeNote — Implementation Plan

Source of truth for scope: `takenote_mobile_mvp_and_vision.md`. This plan turns that brief into ordered, verifiable phases. Phases 0–6 are the MVP; Phase 7 is validation; Phase 8+ is post-MVP and only starts once real usage justifies it.

---

## Guiding constraints

- **MVP = a real installable app**, local-only, no accounts, no network, no permissions required.
- **Useful before clever.** No AI, sync, notifications, or analytics in the MVP.
- **Storage behind a repository layer.** Screens never touch SQLite directly, so Supabase sync can be added later without rewriting UI.
- **Test on a physical phone from Phase 1 onward**, not only a simulator.
- Each phase ends with a concrete, checkable exit criterion.

---

## Technical decisions

| Area | Decision | Why / what was rejected |
| --- | --- | --- |
| Framework | Expo (managed) + React Native + TypeScript | Per brief. One codebase, Expo Go for fast device testing, EAS for builds. |
| Navigation | Expo Router | File-based, per brief. |
| Styling | Plain `StyleSheet` + a small theme token module (colors, spacing, type scale) | Rejected NativeWind: extra Babel/Tailwind config and version churn for little gain on ~7 screens. Tokens give us dark mode cheaply. |
| Persistence | `expo-sqlite` | Brief prefers SQLite over a JSON blob. Relational data (activity → sections → items), cheap partial updates, transactions for multi-row ops (apply template, move inbox item, reorder). Rejected AsyncStorage: whole-blob rewrites and no transactions. |
| Migrations | Versioned SQL migrations keyed on `PRAGMA user_version` | Schema will change after MVP (sync fields); we need an upgrade path from day one so testers never lose data. |
| IDs | UUID v4 (`expo-crypto` `randomUUID`) | Stable, generated on-device, safe to sync later. Rejected autoincrement ints — they collide across devices. |
| Dates | Activity date stored as `YYYY-MM-DD` text; timestamps as ISO-8601 UTC | A trip "on Friday" is a calendar date, not an instant. Storing it as a timestamp causes off-by-one bugs across timezones. |
| State | No global store. Repository functions + small hooks that reload on focus/mutation | Data is local and small. Rejected Redux/Zustand as premature; revisit only if cross-screen refresh gets painful. |
| Reordering | `react-native-draggable-flatlist` (on Reanimated + Gesture Handler, both already in Expo) | Long-press drag is the expected mobile idiom. Fallback if it misbehaves: "move up/down" in the item menu. |
| Haptics | `expo-haptics` on check-off and completion | Brief calls for tactile polish; no permission required. |
| Testing | `jest-expo` for repository/data logic; `tsc --noEmit`; `expo lint` | Data loss is the #1 MVP risk, so tests focus on the data layer. UI verified manually on device. |
| Backend | None for MVP. Supabase only when accounts/sync are needed (Phase 9). | Per brief. |

### Deviations from the brief's data model (intentional)

- **Inbox → activity move** creates a `ChecklistItem` and deletes the `InboxItem` in one transaction, rather than setting `linkedActivityId`. A moved thought *is* a checklist item; keeping a linked inbox row would mean two sources of truth. `linkedActivityId` is dropped.
- **Deletes are hard deletes** in the MVP. Tombstones (`deletedAt`) get added in the sync phase via migration.
- **Progress copy** says "5 of 8 done", not "packed", because items can be `buy`/`collect`/`do`, not just `pack`.
- **Activity completion is manual.** Checking every item shows "You're all set" but does not auto-mark the activity `completed` — the user may still add items.

---

## Schema (v1)

```sql
activities (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL,            -- trip | event | fitness | outdoor | family | custom
  date TEXT,                     -- YYYY-MM-DD, nullable
  status TEXT NOT NULL,          -- upcoming | completed | archived
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
)

checklist_sections (
  id TEXT PRIMARY KEY,
  activity_id TEXT NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  sort_order INTEGER NOT NULL
)

checklist_items (
  id TEXT PRIMARY KEY,
  activity_id TEXT NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  section_id TEXT REFERENCES checklist_sections(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'pack',   -- pack | buy | collect | do | remember
  is_completed INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
)

inbox_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  created_at TEXT NOT NULL
)
```

`PRAGMA foreign_keys = ON` must be set on every connection, or the cascades silently do nothing.
Deleting a section moves its items to "ungrouped" (`SET NULL`) rather than deleting them — losing items the user typed is worse than an extra ungrouped row.

---

## Proposed project structure

```
app/                      # Expo Router screens
  _layout.tsx
  index.tsx               # Home
  activity/new.tsx        # Create activity
  activity/[id]/index.tsx # Activity detail
  activity/[id]/pack.tsx  # Packing mode
  inbox.tsx
  capture.tsx             # Quick capture (modal)
src/
  db/                     # connection, migrations
  repositories/           # activities, sections, items, inbox — the only SQLite callers
  domain/                 # types, templates data, progress helpers
  hooks/                  # useActivities, useActivity, useInbox
  components/             # Button, Card, Checkbox, ProgressBar, EmptyState, ...
  theme/                  # tokens, light/dark palettes, useTheme
```

---

## Phase 0 — Project setup

- Create Expo app with TypeScript + Expo Router template.
- Configure `tsc --noEmit`, `expo lint`, and `jest-expo`; add npm scripts `typecheck`, `lint`, `test`.
- Set app name, slug, and a placeholder bundle id / package name (`com.<you>.takenote`) — changing these after a store build is painful.
- Run the blank app on a physical phone via Expo Go (tunnel mode if Wi-Fi blocks LAN).
- Expand `.gitignore` for Expo (`node_modules`, `.expo`, `dist`, native build dirs, `.env*`).

**Exit criteria:** blank app opens on the phone; `typecheck`, `lint`, `test` all pass on an empty suite.

---

## Phase 1 — App foundation (Milestone 1)

- Theme tokens: color palette (one accent), spacing scale, type scale, radii. Light + dark palettes wired through `useColorScheme` from the start — cheaper now than retrofitting.
- Base components: `Screen` (safe-area wrapper), `Button`, `Card`, `TextField`, `Checkbox`, `ProgressBar`, `EmptyState`, `IconButton`.
- Routes and static screens with hard-coded data: Home, Create Activity, Activity Detail.
- Navigation between them works; back behavior correct on Android.

**Deliverable:** navigable app shell on a real device.
**Exit criteria:** can tap Home → New activity → (fake) Activity Detail → back, on the phone, in both light and dark system themes.

---

## Phase 2 — Data layer

Split out from "core checklist" because it's the riskiest part and should be solid before UI depends on it.

- DB connection singleton, `foreign_keys = ON`, migration runner on `user_version`, migration v1 = schema above.
- Repositories:
  - `activities`: list (upcoming first, sorted by date nulls-last then created), get, create, update, setStatus, delete.
  - `sections`: list by activity, create, rename, delete, reorder.
  - `items`: list by activity, create, update title/kind/section, toggle, delete, reorder, progress counts.
  - `inbox`: list, create, update, delete, `moveToActivity` (transactional).
- Reorder writes all affected `sort_order` values in one transaction.
- Every write updates `updated_at`.
- Unit tests (jest-expo against an in-memory/test DB): CRUD, cascades, section delete → items ungrouped, reorder, inbox move atomicity, migration from empty DB.

**Exit criteria:** repository tests pass; no screen imports `expo-sqlite`.

**Open risk:** running `expo-sqlite` inside Jest may need a mock or a Node SQLite shim. If that's friction, test repositories on-device via a dev-only debug screen instead, and say so explicitly rather than skip testing.

---

## Phase 3 — Core checklist (Milestone 2)

- Create activity: name (required, trimmed, non-empty), type (optional, default `custom`), date (optional, native date picker, clearable). On save → navigate to detail.
- Home: upcoming activity cards (title, date, "x of y done"), empty state inviting first activity.
- Activity detail: title, date, progress, sections with items, ungrouped items, add-item input (stays focused after submit for rapid entry), check/uncheck, edit item title, delete item, add/rename/delete section, drag reorder.
- Edit activity menu: rename, change type/date, mark completed, delete (with confirmation).
- Hooks reload on screen focus so Home reflects changes made in Detail.

**Deliverable:** personally usable activity checklist.
**Exit criteria (manual, on device):** create "Goa Weekend", add 5 items across 2 sections, check 2, force-quit the app, reopen → everything intact, progress shows "2 of 5 done".

---

## Phase 4 — Quick capture, Inbox, templates (Milestone 3)

- **Quick capture:** a prominent action on Home opening a compact modal — one text field, then two actions: "Add to activity" (pick from upcoming list) or "Save to Inbox". Keyboard opens immediately. Enter defaults to Inbox, so capture never requires a second decision.
- **Inbox:** entry point on Home with count; list with edit, delete, and "Move to activity".
- **Templates:** static data in `src/domain/templates.ts` for Weekend trip, Concert/event, Gym, Hiking, Family outing (items from brief §8, grouped into the brief's suggested sections).
  - Offered as an optional step in Create Activity, preselected from the chosen type, with "Start empty" always available.
  - Applying copies sections/items into the activity in one transaction — templates are never linked, so editing an activity never alters the template.
  - Hiking template includes "Check current local conditions" item, per the brief's safety note.

**Deliverable:** the distinctive core experience.
**Exit criteria:** capture "Take the new black belt" from Home in ≤ 2 taps after typing; move an inbox item into an activity and see it appear there and vanish from Inbox; create an activity from each template and edit its items freely.

---

## Phase 5 — Packing mode and UX polish (Milestone 4)

- **Packing mode:** full-screen focused list, large tap targets (≥ 48dp), clear progress, "Hide completed" toggle, undo via tapping again plus a brief "Undo" snackbar on check. Haptic tick on check.
- **Completion state:** warm "You're all set" message when all items done; list stays editable/reopenable.
- Empty states for Home, Inbox, empty activity, empty section.
- Keyboard handling (inputs not covered, `KeyboardAvoidingView` / scroll-to-input), safe-area on notched devices.
- Dark mode verified on every screen.
- Accessibility pass: labels/roles on all controls, checkbox state announced, dynamic font size doesn't break layouts, contrast checked for both themes.
- Error handling: DB init failure shows a clear error screen (not a blank app); failed writes surface a toast and are logged — never silently dropped.
- Small, purposeful transitions (Home → Detail, check-off animation). No onboarding, no permission prompts.

**Deliverable:** MVP suitable for a small group of testers.
**Exit criteria:** walk through all 10 items of the brief's §16 "MVP definition of done" on a physical device with no blockers.

---

## Phase 6 — Test and distribute (Milestone 5)

- Test on at least two Android screen sizes (small phone + large phone); iOS if a device is available.
- Data-safety checks: force-quit mid-edit, low-storage behavior, app update over an existing install preserves data (install build N, add data, install build N+1).
- Fix data-loss and navigation bugs found above — these block release; cosmetic bugs don't.
- Final app icon, splash screen, app name, bundle id/package, version `1.0.0` / build number.
- `eas.json` with a `preview` profile producing an Android **APK** for direct install; iOS build + TestFlight only if an Apple Developer account is available.

**Deliverable:** a real installable MVP.
**Exit criteria:** APK installed on a phone *without* Expo Go, full §16 flow passes, data survives an upgrade install.

---

## Phase 7 — Validation with real users

Per brief §15. Scope stays frozen during this phase except for bug fixes.

- Give the build to ~5–10 people with a real upcoming activity.
- Observe, don't survey: Did they create an activity unaided? Use quick capture? Add items beyond the template? Reopen while preparing? Trust the data was there? What still went into Notes/WhatsApp?
- Keep a simple findings log; rank post-MVP work by observed behavior.

**Exit criteria:** written findings that justify (or kill) each post-MVP phase below.

---

## Post-MVP phases (direction, not commitments)

Order is a proposal; Phase 7 findings decide the real order.

### Phase 8 — Low-cost convenience (still local-only)
- Duplicate an activity / start from a past one.
- Save an activity as a personal template.
- Archive view for completed/archived activities.
- Optional reminders for dated activities and "buy/collect/do before" items (`expo-notifications`; permission requested only when the user turns a reminder on).

### Phase 9 — Accounts and cloud sync
- Supabase auth + Postgres; row-level security per user.
- Migration adding sync fields (`deleted_at` tombstones, `user_id`, sync version/timestamp).
- Local-first: SQLite remains the source the UI reads; a sync worker pushes/pulls through the repository layer. Last-write-wins per row on `updated_at` to start — full conflict resolution only if users hit real conflicts.
- Sync must be idempotent and retry-safe (UUID keys make upserts natural); offline edits queue and flush on reconnect.
- First-login flow uploads existing local data rather than discarding it.

### Phase 10 — Sharing and reach
- Shared checklists for family/group activities (requires Phase 9).
- Home-screen widgets for upcoming activities and quick capture (needs a dev build / config plugin; leaves Expo Go).
- Voice capture.
- Optional calendar integration.
- Web companion for viewing/editing lists.

### Phase 11 — Monetization
- Only after retention is proven. Free core; paid tier for sync, unlimited personal templates, advanced reminders, widgets, shared lists; optional family plan. No ads.

---

## Open decisions (need your call)

1. **Reordering UX** — drag-and-drop (recommended, more expected on mobile, one extra dependency) vs. move up/down menu (zero deps, clunkier).
2. **iOS testing** — is an iPhone and/or Apple Developer account available? If not, Phase 6 is Android-only and iOS is verified via Expo Go only.
3. **Item `kind` in the UI** — recommend storing it but exposing it only as an optional chip in the edit sheet for MVP, defaulting to `pack`, to keep capture single-field.
