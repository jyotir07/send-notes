# Manual QA — on-device checklist

Jest covers the data layer only, so UI behavior has to be checked by hand. This list is built from the exit criteria for Phases 3–5 in [`plan.md`](../plan.md) and from the brief's §16 "MVP definition of done".

Run it on a physical phone through Expo Go (`cd takenote && npx expo start`). Do it once in the light system theme and once in dark. Write down the device, the OS version, and the commit you tested.

## Phase 3 — Core checklist

- [ ] Home with no activities shows an empty state that invites you to create one.
- [ ] Create "Goa Weekend" with a date. Saving opens the activity detail screen.
- [ ] Creating an activity with a blank or whitespace-only name is not possible.
- [ ] The date can be cleared after it has been set.
- [ ] Add two sections from the activity menu ("Add section").
- [ ] Add 5 items across the two sections. The add-item field keeps focus after each submit.
- [ ] Check 2 items. Progress reads "2 of 5 done".
- [ ] Edit an item's title, change its kind, and move it to another section.
- [ ] "Move up" and "Move down" reorder items, and the new order survives a restart.
- [ ] Delete a section. Its items become ungrouped and are not deleted.
- [ ] Home shows the activity's title, date, and "2 of 5 done" after you go back.
- [ ] **Persistence:** force-quit the app and reopen it. Everything is still there and progress still reads "2 of 5 done".
- [ ] "Mark as done", then "Move back to upcoming", both work.
- [ ] "Delete activity" asks for confirmation, then returns to Home.

## Phase 4 — Quick capture, Inbox, templates

- [ ] Capture "Take the new black belt" from Home. The keyboard opens straight away, and pressing Enter saves it to the Inbox.
- [ ] Capture an item directly into an activity.
- [ ] The Inbox entry on Home shows the right count.
- [ ] Edit and delete an Inbox item.
- [ ] "Move to an activity…" makes the item appear in that activity and disappear from the Inbox.
- [ ] Create one activity from each template (Weekend trip, Concert/event, Gym, Hiking, Family outing). Each one's items can be edited freely.
- [ ] Editing an activity built from a template doesn't change the template. Create a second activity from the same template to confirm.
- [ ] The Hiking template includes a "check current local conditions" item.
- [ ] "Start empty" creates an activity with no items.

## Phase 5 — Packing mode and polish

- [ ] Packing mode checkboxes are easy to hit with one thumb.
- [ ] Checking an item gives a haptic tick and shows an "Undo" snackbar, and Undo reverts the check.
- [ ] "Hide completed" hides and shows checked items.
- [ ] Checking the last item shows "You're all set". The list can still be edited and reopened afterwards.
- [ ] Empty states appear for Home, the Inbox, an empty activity, and an empty section.
- [ ] The keyboard never covers the field you're typing in, on any screen.
- [ ] On a notched phone, no content sits under the notch, the status bar, or the home indicator.
- [ ] Every screen is readable in dark mode.
- [ ] With the largest system font size, no layout breaks or text gets clipped.
- [ ] With TalkBack or VoiceOver on, controls have labels and the checkbox state is announced.

## §16 MVP definition of done

- [ ] 1. Install and open the app on a phone.
- [ ] 2. Create an activity such as "Goa Weekend".
- [ ] 3. Add a date or leave it blank.
- [ ] 4. Apply or skip a starter template.
- [ ] 5. Add "Take the new black belt".
- [ ] 6. Add "Collect shoes before Friday".
- [ ] 7. Check items off in packing mode.
- [ ] 8. See checklist progress update.
- [ ] 9. Close and reopen the app without losing data.
- [ ] 10. Use all of the above without signing in or granting any permissions.

## Findings

Log each problem with its steps and the device. Data-loss and navigation bugs block release; cosmetic issues don't (see Phase 6 in [`plan.md`](../plan.md)).
