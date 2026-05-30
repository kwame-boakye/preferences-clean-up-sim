# MIGRATION.md

The demo artifact. Fill this in **as you migrate**, not at the end. Your PM said he'd rather
read a clear bulleted list of what changed and why than a polished document — so keep it
plain and honest. This is what you'd present.

## The "before" (what was wrong)

- Preferences scattered across `legacy/notifications-and-misc.ts`, `legacy/home-prefs.json`,
  and `legacy/random-team-additions.ts` — three different formats, no shared shape.
- No stable ids: keyed by `key`, `slug`, display label, or array position depending on the file.
- No category ownership — any team added preferences wherever they wanted.
- Field names inconsistent: some entries used `title`, some `name`, some neither.
- Documentation mixed into data: `markAsRead` included keyboard-shortcut copy (`{ doc: "..." }`)
  as if it were a preference object.
- One preference misfiled in the wrong category: `underline_links` in `home-prefs.json`.
- One real duplicate: the VIP "always allow notifications when paused" preference existed in
  both `notifications-and-misc.ts` (as `vip_when_paused`) and `random-team-additions.ts`
  (as position `[0]` in `renderVipSettings()`), with different keys and slightly different wording.
- Dependency between `show_large_files` and `show_linked_images` noted in a code comment
  (`"only if show_linked_images"`) with no machine-readable representation.

## Findings (the interesting stuff)

### Duplicate found
- **VIP "always allow notifications when paused"** existed twice: as `vip_when_paused` in
  `notifications-and-misc.ts` ("Messages from VIPs, even if notifications are paused") and
  as position `[0]` in `renderVipSettings()` in `random-team-additions.ts` ("Always allow
  notifications from VIPs"). Different keys, slightly different wording, same behavior.
- Resolution: canonical copy assigned to `vip` category as `vip-always-allow-when-paused`.
  Rationale: this preference governs what VIP contacts can do to your notification rules —
  it's a VIP behavior, not a general notification setting. The `notifications.ts` copy was
  dropped entirely.

### Misfiled preference
- **"Underline links to websites"** (`underline_links`) lived in `home-prefs.json` under the
  Home category.
- Resolution: moved to `accessibility.ts` as `accessibility-underline-links`. It controls a
  visual accessibility aid (link underlines for non-color distinguishability), not sidebar layout.

### Docs mixed into data
- `markAsRead` in `random-team-additions.ts` included four `{ doc: "..." }` entries for
  keyboard shortcuts (Esc, Shift+Esc, Option+click, Cmd+/).
- Resolution: excluded from the registry entirely. Keyboard shortcuts are UI copy owned by
  the help system, not user-configurable preferences. Only the two real prefs (`on_view` and
  `confirm_mark_all`) were migrated.

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

- One `Preference` schema (`src/registry/types.ts`), one registry, search, machine-readable `toJSON()`.
- 16 category files in `data/preferences/`, one per category.
- Every preference has a stable kebab-case id, a category, an owner, a description, and keywords.
- All 5 hard cases handled: ordered/locked multi-select, three `dependsOn` relationships,
  dynamic device options, `dynamicLabel` flag for Privacy, builder vs managed list split.
- Registry rejects duplicate ids at load time and flags suspected duplicates by token overlap.
- Counts: ~90 preferences across 16 categories; 1 confirmed duplicate resolved (VIP-paused).
