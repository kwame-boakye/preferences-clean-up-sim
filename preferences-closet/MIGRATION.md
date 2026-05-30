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

### 1. One logical preference vs. several controls

**Working hours** → modeled as one `time_range` control (pre-decided in the worked example).
Three selects (days, start, end) express a single idea — "my working window." Splitting them
would mean three separate prefs that are meaningless in isolation.

**Nav tabs** → modeled as six atomic `toggle` prefs + one `single_select` for appearance.
The six tab visibility flags are independent — you can show Home but hide Files without any
relationship between them. Grouping them into one composite control would make each tab
harder to query individually and would require a custom value type for no real benefit.

### 2. Dependencies

Chose `dependsOn?: { id: string; when: PreferenceValue }` over a bare `string`.

A bare id loses the *direction* of the dependency. The three real cases show why this matters:
- `show-large-files` depends on `show-linked-images` being `true`
- `manual-timezone` depends on `auto-timezone` being `false`
- `music-timing` depends on `play-music` being `true`

Without the `when` field, the registry and any agent reading `toJSON()` can't tell whether a
preference is active when its parent is on or off. The richer shape makes the condition
self-documenting and enforceable.

### 3. Dynamic options and labels

**Dynamic options** (audio/video device lists): already handled by the existing
`{ kind: "dynamic"; source: string }` on the `Options` type. No change needed.

**Dynamic labels** (Privacy & Visibility discoverability option injects the user's email
domain at runtime): added `dynamicLabel?: boolean` to `PreferenceOption`.

A static placeholder string would render fine in the UI but would silently mislead any agent
reading `toJSON()` — it would look like a literal label when it's actually a template. The
flag makes the distinction explicit: renderers resolve it, agents know not to treat it as
final copy. Only one option in the entire schema uses this today (Privacy discoverability).

### 4. Flexible value types

The `PreferenceValue` union (`boolean | string | string[] | TimeRangeValue`) covers every
control type without widening.

The Appearance "custom theme" object from the legacy data (font + colorMode + themeSource +
theme) is not a genuine composite preference — it's four independent settings stored together
for convenience. Splitting it into four atomic `single_select` prefs keeps the union narrow
and makes each setting independently queryable and searchable.

Added strict runtime validation in `registry.register()` to enforce that `default` shape
matches `control` at load time. TypeScript catches mismatches in typed migration files, but
preferences can also arrive from remote config or database sources that are never compiled.
The registry is the gatekeeper; runtime rejection makes the contract enforceable regardless
of the source.

### 5. Builder vs. managed lists

Kept as two distinct `ControlType` values: `list_builder` and `managed_list`.

- `list_builder` (VIP list): user actively adds/removes people. Needs an add/search input.
- `managed_list` (connected accounts, blocked invitations, hidden people): populated by
  actions taken elsewhere in the app; the Preferences dialog only supports removal.

These map to genuinely different UI components. A single `list` type with a `mode` flag
would unify them at the type level but force the same branching back into the renderer —
no net simplification, and it obscures the semantic difference between user-driven and
system-populated lists.

## The "after" (what it looks like now)

- [ ] One `Preference` schema, one registry, search, machine-readable `toJSON()`.
- [ ] React UI renders entirely from the registry; empty + single-control categories work.
- [ ] Counts: _N_ preferences across 16 categories; _M_ suspected duplicates flagged.
