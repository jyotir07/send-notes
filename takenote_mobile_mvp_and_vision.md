# TakeNote

## Mobile App Product Brief, MVP Scope, and Product Roadmap

**Working title:** TakeNote\
**Product:** A mobile-first personal preparation and checklist app\
**Platforms:** Android and iOS first; web companion may be considered
later\
**Document purpose:** Product vision, MVP definition, implementation
plan, and distinction between the first usable build and the eventual
product.

------------------------------------------------------------------------

# 1. Product in one sentence

TakeNote helps people remember the small, personal things they want to
bring, buy, collect, or do before an activity, through simple
activity-based checklists and instant capture.

**Product promise:** Make room for the experience. Remember the little
things.

------------------------------------------------------------------------

# 2. The problem

People often remember preparation details at random moments, then forget
them by the time they leave.

Examples: - "I bought those new shoes specifically for the trip. Don't
forget them." - "Pick up the parcel before leaving." - "Take the belt I
just bought." - "Charge the power bank before the concert." - "Pack my
gym shoes and towel." - "Bring the first-aid kit for the hike."

These thoughts are often scattered across Notes, messaging apps,
screenshots, and memory. Generic task managers can feel too broad, while
generic packing lists do not capture personal one-off details.

TakeNote makes preparation feel lightweight: create an activity, add
what matters, and check things off when it is time to go.

------------------------------------------------------------------------

# 3. Product philosophy

TakeNote should feel like a small, thoughtful utility, not another
productivity system.

Principles: 1. **Instant capture:** adding a thought should take
seconds. 2. **Activity-first organization:** lists belong to a trip,
concert, gym session, hike, or outing. 3. **Personal over generic:**
starter templates help, but the user's own items matter most. 4. **Low
cognitive load:** simple language, clear screens, minimal setup. 5.
**Mobile-native:** designed for one-handed use, touch, and real-world
preparation. 6. **Delight through polish:** typography, spacing,
transitions, haptics, and satisfying completion states. 7. **Useful
before clever:** no AI or complex automation unless it genuinely removes
friction.

------------------------------------------------------------------------

# 4. Who it is for

Initial audience: - People planning weekend or family trips - Concert
and event attendees - Gym-goers and runners - Hikers and outdoor
enthusiasts - Students and young professionals - Anyone preparing for an
activity with things they do not want to forget

The product should not assume that users are frequent travelers. A gym
session, a one-time concert, and a family weekend should all feel
equally natural.

------------------------------------------------------------------------

# 5. The core user journey

1.  Open TakeNote.
2.  Tap **New activity**.
3.  Name it, for example, "Goa Weekend."
4.  Optionally choose a date and activity type.
5.  Start with a suggested checklist or an empty one.
6.  Add personal items, such as "Take the new black belt."
7.  Add preparation tasks, such as "Collect shoes before Friday."
8.  When getting ready, open the activity and use the checklist.
9.  Check items off and see progress update.
10. Finish with a simple "You're all set" state.

A user should be able to understand and complete this flow without a
tutorial.

------------------------------------------------------------------------

# 6. MVP vs. final product

This distinction is important: **the MVP is a real, installable mobile
application**, not merely a Figma prototype or mobile website. It should
be small enough to build quickly, but useful enough for the developer
and early testers to use for real activities.

## 6.1 MVP: first usable release

### Included

-   Native-feeling Android and iOS app built with React Native and Expo
-   Home screen showing upcoming activities
-   Create, rename, edit, complete, and delete activities
-   Activity types: Trip, Concert/Event, Gym/Fitness, Hiking/Outdoor,
    Family outing, Custom
-   Optional activity date
-   Checklist items with completion state
-   Simple checklist sections
-   Add, edit, delete, and reorder items
-   Quick capture from the home screen
-   Assign a quick-captured item to an activity or leave it in an Inbox
-   A few editable starter templates
-   Progress count, such as "5 of 8 packed"
-   Basic local persistence so lists survive closing and reopening the
    app
-   Light and dark theme, if achievable without delaying the core flow
-   Responsive, accessible touch targets and basic empty/error states
-   Ability to install and run on a personal Android or iPhone during
    development

### Explicitly not required for MVP

-   User accounts or cross-device cloud sync
-   Shared lists or family collaboration
-   AI-generated packing lists
-   Calendar integration
-   Location tracking
-   Social features
-   Subscription billing
-   Advanced notification scheduling
-   Web dashboard
-   Complex analytics
-   Full offline conflict-resolution system

### MVP success condition

A person can install the app, create an activity, add their own items,
close the app, reopen it, and use the checklist while preparing for the
activity without losing data.

## 6.2 Final product vision

The final product should retain the same simple core experience while
becoming more reliable, personal, and convenient across devices.

Potential later capabilities: - Secure account and cloud sync across
devices - Optional reminders for activities and "buy/collect/do before"
items - Reusable personal templates based on the user's own lists -
Duplicate an activity or start from a past one - Shared checklists for
family trips or group events - Widgets for upcoming activities and quick
capture - Voice capture - Optional calendar integration - Better
offline-first behavior and sync recovery - Richer activity-specific
templates - A polished web companion for viewing and editing lists -
Optional paid tier for advanced convenience features

These are product direction, not MVP commitments. Add them only after
real usage shows which ones matter.

------------------------------------------------------------------------

# 7. MVP screens

## 7.1 Home

Purpose: show what the user is preparing for and make adding something
effortless.

Elements: - App name or short greeting - Primary **New activity**
button - Quick-capture action - Upcoming activity cards - Activity
title, date if set, and progress - Inbox entry for uncategorized
thoughts - Empty state that invites the first activity

Avoid dashboard clutter, streaks, charts, or unnecessary stats.

## 7.2 Create activity

Keep the form short: - Activity name (required) - Type (optional) - Date
(optional) - Starter checklist (optional)

After creation, open the activity detail screen.

## 7.3 Activity detail

Elements: - Activity title and optional date - Progress indicator -
Checklist sections - Add-item action - Quick access to packing mode -
Edit activity menu

Suggested sections: - Essentials - Clothes & gear - Personal reminders -
Get or do before

Users can keep items ungrouped if they prefer.

## 7.4 Quick capture

A compact input for thoughts such as: - "Take the new black belt" - "Buy
sunscreen" - "Collect parcel" - "Charge headphones"

Then choose: - Add to an activity - Save to Inbox

Do not force the user to fill out multiple fields.

## 7.5 Inbox

A simple list of thoughts not yet assigned to an activity. Users can
move an item to an activity, edit it, or delete it.

## 7.6 Packing mode

A focused checklist view: - Large touch-friendly checkboxes - Clear item
names - Progress - Optional hide-completed toggle - Easy way to undo an
accidental check

When complete, show a warm, concise completion message. Do not block the
user from reopening or editing the list.

------------------------------------------------------------------------

# 8. Starter templates for MVP

Templates should be editable suggestions, never mandatory requirements.

### Weekend trip

-   Wallet and ID
-   Phone and charger
-   Power bank
-   Toiletries
-   Clothes
-   Comfortable shoes
-   Booking or travel documents
-   Personal items

### Concert or event

-   Ticket or entry pass
-   ID, if required
-   Phone
-   Payment method
-   Portable charger, if permitted
-   Transport plan
-   Venue-specific items to verify

### Gym

-   Workout clothes
-   Shoes
-   Water bottle
-   Towel
-   Lock, if needed
-   Headphones
-   Membership card, if needed

### Hiking

-   Suitable footwear
-   Water
-   Weather-appropriate layers
-   Snacks
-   First-aid essentials
-   Charged phone
-   Route and local conditions checked
-   Activity-specific gear or permits

### Family outing

-   Keys and wallet
-   Phone and charger
-   Snacks or water
-   Tickets or reservations
-   Items for children or family members
-   Planned pickups or purchases

Outdoor templates should remind users to check current local conditions
and activity-specific guidance. A generic checklist is not a safety
guarantee.

------------------------------------------------------------------------

# 9. Recommended simple technology stack

The aim is to avoid unnecessary native setup and backend complexity
while still building a real mobile app.

  -----------------------------------------------------------------------
  Area                    Choice                  Why
  ----------------------- ----------------------- -----------------------
  Mobile app              React Native            One codebase for
                                                  Android and iOS

  App tooling             Expo                    Simplifies development,
                                                  device testing, and
                                                  builds

  Language                TypeScript              Safer data models and
                                                  easier refactoring

  Navigation              Expo Router             File-based navigation

  Styling                 NativeWind or plain     Choose one; avoid
                          StyleSheet              styling-system churn

  Local data for MVP      SQLite via              Data persists on the
                          Expo-compatible         device
                          library, or             
                          AsyncStorage for a very 
                          small prototype         

  Backend for MVP         None required           Keep the first version
                                                  small

  Future backend          Supabase                Auth, PostgreSQL, and
                                                  sync without
                                                  maintaining a custom
                                                  server

  App distribution        Expo Go during          Test quickly, then
                          development; EAS Build  create shareable
                          for installable builds  Android/iOS builds
  -----------------------------------------------------------------------

**Recommended MVP default:** Expo + React Native + TypeScript + Expo
Router + a simple local persistence layer. Do not introduce Supabase
until accounts or sync are actually needed.

For structured activity/checklist data, prefer SQLite over storing the
entire application state as one large JSON blob. Keep data access behind
a small repository/service layer so cloud sync can be added later
without rewriting screens.

------------------------------------------------------------------------

# 10. How to run it on a real phone

The MVP should be testable on a personal phone early, not only in a
simulator.

### Development testing

1.  Create the Expo project.
2.  Install Expo Go on the phone from the official app store.
3.  Start the development server on the computer.
4.  Connect the phone and computer to the same Wi-Fi network, or use
    Expo's tunnel option if local networking is blocked.
5.  Scan the QR code shown by Expo.
6.  The app opens in Expo Go and reloads as code changes.

This is a development workflow, not the final public app-store release.

### Installable builds

When the MVP is stable: - Use Expo Application Services (EAS) to create
an Android build, such as an APK for direct testing or an AAB for Google
Play submission. - Create an iOS build for device testing and
TestFlight/App Store distribution. Apple signing and distribution
requirements apply. - Keep app name, icon, splash screen, package
identifier, and versioning configured before public release.

**Important:** Expo Go is excellent for early testing, but it is not
itself the app-store deliverable. The final product is a separately
built application installed on the device.

------------------------------------------------------------------------

# 11. Suggested data model

Keep the first schema small.

### Activity

-   `id`
-   `title`
-   `type`
-   `date` (optional)
-   `status` (`upcoming`, `completed`, `archived`)
-   `createdAt`
-   `updatedAt`

### ChecklistSection

-   `id`
-   `activityId`
-   `title`
-   `sortOrder`

### ChecklistItem

-   `id`
-   `activityId`
-   `sectionId` (optional)
-   `title`
-   `kind` (`pack`, `buy`, `collect`, `do`, `remember`)
-   `isCompleted`
-   `createdAt`
-   `updatedAt`
-   `sortOrder`

### InboxItem

-   `id`
-   `title`
-   `createdAt`
-   `linkedActivityId` (optional)

Use stable IDs and keep storage logic separate from UI components.

------------------------------------------------------------------------

# 12. Implementation roadmap

## Milestone 1: App foundation

-   Initialize Expo + TypeScript
-   Set up Expo Router
-   Establish theme, typography, spacing, and reusable components
-   Create Home, Activity Detail, and Create Activity screens
-   Run on a physical phone through Expo Go

**Deliverable:** navigable app shell on a real device.

## Milestone 2: Core checklist

-   Create and edit activities
-   Add, edit, delete, and complete checklist items
-   Add basic sections
-   Implement local persistence
-   Verify data remains after app restart

**Deliverable:** personally usable activity checklist.

## Milestone 3: Quick capture and templates

-   Add quick capture
-   Add Inbox
-   Add activity templates
-   Allow moving Inbox items into activities

**Deliverable:** the distinctive core experience.

## Milestone 4: UX polish

-   Packing mode
-   Progress feedback
-   Empty states
-   Dark mode if not already done
-   Keyboard and safe-area handling
-   Accessibility pass
-   Basic error handling

**Deliverable:** MVP suitable for a small group of testers.

## Milestone 5: Test and distribute

-   Test on multiple Android screen sizes
-   Test iOS if a device is available
-   Fix data-loss and navigation bugs
-   Configure app icon, splash screen, app identifiers, and version
-   Produce an installable test build with EAS

**Deliverable:** a real installable MVP that can be used for upcoming
activities.

------------------------------------------------------------------------

# 13. Final product design direction

The eventual app should feel like a polished consumer product, not a
developer utility.

### Visual direction

-   Warm, calm, modern
-   Excellent typography and whitespace
-   A restrained color palette with one recognizable accent
-   Cards that feel tactile but not overly rounded or toy-like
-   Small, purposeful motion
-   Friendly language
-   Beautiful empty states
-   Light and dark themes

### Interaction direction

-   One obvious primary action per screen
-   Fast item entry
-   Immediate visual response when checking something off
-   Smooth transitions between Home and an activity
-   No unnecessary onboarding
-   No permission requests until the user asks for a feature that needs
    them

### Brand feeling

The app should feel like a thoughtful friend who remembers the little
details, without becoming noisy or overly familiar.

------------------------------------------------------------------------

# 14. Monetization direction

Do not build monetization into the first MVP. First validate that users
return and rely on the app.

Potential future model: - Free core checklist and activity creation -
Paid tier for cloud sync, unlimited personal templates, advanced
reminders, widgets, or shared lists - Optional family plan for
collaborative preparation

Avoid intrusive ads in the initial experience. Trust and simplicity are
central to the product.

------------------------------------------------------------------------

# 15. Validation plan

Before expanding scope, give the MVP to a small group of people and ask
them to use it for a real upcoming activity.

Observe: - Can they create an activity without help? - Do they use quick
capture naturally? - Do they add personal items beyond the starter
template? - Do they reopen the app while preparing? - Do they trust that
their items will still be there? - What do they still use Notes or
messaging apps for?

Ask about actual behavior, not just whether they like the idea.

------------------------------------------------------------------------

# 16. MVP definition of done

The MVP is ready for real personal use when a user can:

1.  Install and open it on a phone.
2.  Create an activity such as "Goa Weekend."
3.  Add a date or leave it blank.
4.  Apply or skip a starter template.
5.  Add "Take the new black belt."
6.  Add "Collect shoes before Friday."
7.  Check items off in a focused view.
8.  See checklist progress update.
9.  Close and reopen the app without losing data.
10. Use the core experience without signing in or granting
    location/notification permissions.

------------------------------------------------------------------------

# 17. Product summary

**MVP:** A small, real, installable React Native app for activities,
personal checklists, quick capture, and reliable on-device storage.

**Final product:** A polished personal preparation companion with sync,
reminders, reusable templates, widgets, and optional sharing, while
preserving the same simple experience.

The MVP proves the core habit. The final product makes that habit more
convenient across the user's life and devices.
