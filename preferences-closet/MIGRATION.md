# MIGRATION.md

The demo artifact. Fill this in **as you migrate**, not at the end. Your PM said he'd rather
read a clear bulleted list of what changed and why than a polished document — so keep it
plain and honest. This is what you'd present.

## The "before" (what was wrong)

- [ ] Preferences scattered across `legacy/notifications-and-misc.ts`, `legacy/home-prefs.json`,
      and `legacy/random-team-additions.ts` — three different formats, no shared shape.
- [ ] No stable ids (keyed by slug / label / array position depending on the file).
- [ ] No category ownership.
- [ ] (fill in the rest as you find it)

## Findings (the interesting stuff)

### Duplicate found
- **VIP "always allow notifications when paused"** exists twice: as `vip_when_paused` in
  `notifications-and-misc.ts` and as the `[0]` entry in `renderVipSettings()` in
  `random-team-additions.ts`. Different keys, slightly different wording, same behavior.
- Resolution: _(which one wins? what id? which category owns it? — write your decision)_

### Misfiled preference
- **"Underline links to websites"** lives in `home-prefs.json` but is an Accessibility
  preference.
- Resolution: _(your decision)_

### Docs mixed into data
- `markAsRead` in `random-team-additions.ts` includes keyboard-shortcut `doc` entries.
- Resolution: _(kept as UI copy, excluded from registry — confirm)_

## Schema decisions (the Section-4 judgment calls)

For each, write what you chose and why:

1. **One logical preference vs. several controls** (working hours, nav tabs): _____
2. **Dependencies** (large-files, timezone, music-timing): _____
3. **Dynamic options / labels** (audio devices, privacy email): _____
4. **Flexible value types** (custom theme object): _____
5. **Builder vs. managed lists** (VIP vs. connected/blocked/hidden): _____

## The "after" (what it looks like now)

- [ ] One `Preference` schema, one registry, search, machine-readable `toJSON()`.
- [ ] Counts: _N_ preferences across 16 categories; _M_ suspected duplicates flagged.
