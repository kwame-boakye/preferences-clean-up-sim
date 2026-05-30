# Preferences Closet — Internship Simulation

A practice project that recreates the *shape* of the real internship task: untangling
a messy, unowned settings/preferences system, then giving it structure, search, and a
machine-readable registry — with a working React UI on top. The point is not to build a
pretty settings page. The point is to start from a mess and impose order on it, because
that is what the real summer project is.

---

## 1. Background (why this project exists)

The real task, in the PM's words: Slack's Preferences dialog has become a "junk drawer."
Every team adds preferences wherever they want, there is no clear ownership, and there is
no system for where a new preference should live. As a result:

- Useful preferences exist but are hard to find.
- ~50% of people requesting a "new" preference don't realize it already exists.
- There is no search.
- The code is scattered — anyone has gone in and added whatever section they wanted.

The goals of the real project are to:

1. **Reorganize** preferences into a coherent "closet system" (clear categories, clear ownership).
2. **Add search** so users can find a preference by what it does, not where it happens to live.
3. **Expose a registry** so that both users and AI agents can query the current status of any
   preference in an easy, structured way.

This simulation reproduces all three at small scale, using the stack that lines up with the
real Slack frontend: **Vite + React + TypeScript + plain CSS modules**, with **Vitest** for
tests.

---

## 2. The full reference inventory

Captured directly from the real Preferences dialog (16 categories). Counts are approximate
where a section's value is "one logical preference vs. several controls" (see Section 4).

| #  | Category             | ~Controls | Notable for the schema                                            |
|----|----------------------|----------:|-------------------------------------------------------------------|
| 1  | Availability         | 6         | working-hours time-range (3 selects = 1 logical pref); 3 toggles  |
| 2  | Notifications        | 18        | densest screen; VIP-paused duplicate; text input; an external link |
| 3  | VIP                  | 3         | the only **list-builder**; the VIP-paused duplicate               |
| 4  | Navigation           | 2         | tab **multi-select**; appearance radio                            |
| 5  | Home                 | 12        | sidebar **multi-select**; "unreads" appears in two places         |
| 6  | Appearance           | 4         | ~28-option grouped theme select; custom-theme value              |
| 7  | Messages & media     | 14        | first nested **dependency** (large-files needs linked-images)     |
| 8  | Language & region    | 5         | **dependency** (manual timezone vs. auto-timezone)                |
| 9  | Accessibility        | 12        | **ordered multi-select with locked items** (verbosity) — hardest  |
| 10 | Mark as read         | 2         | mostly documentation/keyboard-shortcut text                       |
| 11 | Audio & video        | 13        | **dependency** (music-timing); **dynamic options** (device lists) |
| 12 | Salesforce           | 0         | empty / promotional state, no controls                            |
| 13 | Connected accounts   | 3         | **managed lists** (empty); link-outs                              |
| 14 | Privacy & visibility | 4         | managed lists; **dynamic label** (injects user email)            |
| 15 | Slack AI             | 1         | minimal case — single toggle                                      |
| 16 | Advanced             | 14        | channel-picker; search-keyword collisions with global search      |

### Control types the schema must cover

- **toggle** — boolean checkbox (most common).
- **single_select** — radio group, dropdown, button group, or swatch grid; pick one.
- **multi_select** — checkbox group; pick any subset.
- **ordered_multi_select** — like multi_select but items are **reorderable** and some can be
  **locked on** (Accessibility → Message verbosity). The hardest control to model.
- **text** — free text (Notifications → Channel keywords, comma-separated).
- **entity_picker** — text input that resolves to references, not free text (Advanced →
  Exclude channels from search). A lightweight cousin of the list-builder.
- **list_builder** — user-driven add/remove of people/apps/workflows (VIP list).
- **managed_list** — a list populated by actions elsewhere; usually only supports remove
  (Connected accounts, Privacy → blocked invitations / hidden people). Often empty.
- **time_range** — a start/end window (Availability → working hours). Could be modeled as
  one control or as several selects; that's a deliberate decision (Section 4).

---

## 3. The deliberate mess (your starting point)

Do **not** start from a clean structure. Seed the repo with the same problems the real
codebase has. The `legacy/` folder ships pre-seeded with these on purpose:

- Preferences defined across **several files** with **no shared shape** — some use `label`,
  some `title`, some `name`; some have descriptions, some don't.
- **No category ownership** — at least one preference filed under the wrong category
  (e.g. an accessibility toggle living in the "home" file).
- **A real duplicate** — the VIP "always allow notifications when paused" preference exists
  in *both* the notifications file and the vip file, keyed differently. This is the headline
  migration find.
- **No stable IDs** — some preferences keyed by slug, some by display label, some by array
  position.
- **Documentation mixed into data** — Mark as read stuffs keyboard-shortcut copy into the
  preference objects instead of keeping it as separate UI text.

Your job is to migrate all of it into `data/preferences/` conforming to one schema, and to
record every judgment call in `MIGRATION.md`.

---

## 4. Judgment calls to make yourself (do not let the tool decide these)

These are the decisions that *are* the learning. When sparring with Claude Code, ask it to
lay out options and trade-offs, then **you** pick:

1. **One logical preference vs. several controls.** Availability's working hours is three
   selects that mean one thing. Navigation's tabs are six checkboxes that mean one thing.
   Do you model these as one composite control or several atomic ones? Be consistent.
2. **Dependencies.** Three real cases: large-files needs linked-images (Messages), manual
   timezone vs. auto (Language), music-timing needs play-music (Audio). Add a `dependsOn?`
   field, or handle it some other way?
3. **Dynamic options & labels.** Device selectors (Audio) have hardware-dependent options;
   the discoverability radio (Privacy) injects the user's email into a label. The schema
   needs a way to say "options/label resolved at runtime," not a fixed list.
4. **Flexible value types.** A toggle's value is `boolean`, a select's is `string`, a
   list's is `string[]`, a custom theme's is an object. How does one `Preference` type and
   one `default` field cover all of these without becoming `any`?
5. **Builder vs. managed lists.** VIP is user-driven; connected-apps/blocked/hidden are
   populated elsewhere. One control type with a mode flag, or two distinct types?

---

## 5. What you're building (the "after")

### 5.1 A single preference schema
One TypeScript type (`src/registry/types.ts`) every preference conforms to. Ships pre-written
as a *starting proposal* — you are expected to revise it as you migrate and hit the cases above.

### 5.2 A registry (the "closet")
`src/registry/registry.ts` — the single source of truth. Loads every preference, validates
it, **rejects duplicate ids**, and **flags suspected duplicates** (the VIP-paused pair). Exposes:
- `getByCategory(category)` — power the rail / detail pane.
- `getById(id)` — direct lookup.
- `search(query)` — fuzzy match across label, description, keywords.
- `toJSON()` — full structured status of every preference. **The agent-readable output.**

### 5.3 The React UI
Two-pane layout (category rail + detail pane) plus a top search box that filters across all
categories at once. Built with Vite + React + TypeScript + plain CSS modules. Components
render from the registry — never from a second hardcoded list — and must handle empty
categories (Salesforce) and single-control categories (Slack AI) without special-casing.

A small set of control components covers everything: `<ToggleControl>`, `<SingleSelectControl>`,
`<MultiSelectControl>`, etc. A `<PreferenceRenderer>` dispatches on `control` type and renders
the right one. That dispatch is itself a clean test of whether the schema holds up.

---

## 6. Suggested stack & structure

- **Vite** (dev server, build, HMR).
- **React 18 + TypeScript** in strict mode.
- **Plain CSS modules** (`*.module.css`) — no Tailwind, no styled-components.
- **Vitest** for tests, run via `npm test`.

```
/
├── PROJECT.md
├── CLAUDE.md
├── MIGRATION.md          # you write this as you go
├── README.md
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── index.html            # Vite entry
├── public/               # static assets (empty for now)
├── src/
│   ├── main.tsx          # React entry point
│   ├── App.tsx           # top-level layout
│   ├── registry/
│   │   ├── types.ts          # the Preference schema (starting proposal — revise it)
│   │   ├── registry.ts       # the closet: load, validate, dedupe, query, toJSON
│   │   └── index.ts          # re-exports
│   ├── search/
│   │   └── search.ts         # fuzzy search (you build)
│   └── ui/
│       ├── components/
│       │   ├── CategoryRail.tsx
│       │   ├── DetailPane.tsx
│       │   ├── SearchBox.tsx
│       │   ├── PreferenceRenderer.tsx
│       │   ├── ToggleControl.tsx
│       │   ├── SingleSelectControl.tsx
│       │   └── ... (add as you migrate)
│       └── styles/
│           └── *.module.css  # per-component CSS modules
├── data/
│   └── preferences/      # the CLEAN, migrated preferences (you create, per category)
│       └── availability.ts   # one fully-worked example, ships pre-migrated
├── legacy/               # the deliberate mess — your "before" (pre-seeded)
│   ├── notifications-and-misc.ts
│   ├── home-prefs.json
│   └── random-team-additions.ts
└── test/
    ├── registry.test.ts  # no dup ids, every pref validates, queries work
    └── search.test.ts    # "dark mode" finds appearance theme/color-mode, etc.
```

---

## 7. Milestones (mirrors the real summer ramp)

The PM said the first couple of weeks are beginner bugs and ramp-up before real work.
Mirror that:

1. **Warm-up.** Get the repo running. `npm install`, `npm test` (green), `npm run dev` (Vite
   serves a placeholder page). Read `legacy/` and just *list* what's there.
2. **Design the schema.** Revise `src/registry/types.ts` to handle the Section-4 cases. This
   unlocks everything else.
3. **Build the registry.** Load + validate + reject dup ids + flag suspected dups. Tests
   alongside in `test/registry.test.ts`.
4. **Migrate.** Move every legacy preference into `data/preferences/` (one file per category),
   assigning canonical id + category + owner. Record each decision in `MIGRATION.md`.
5. **Add search.** Fuzzy search in `src/search/search.ts`; prove with tests that synonyms find
   the right preference and that multi-hit cases ("unreads", "timezone", "english") return all
   relevant results.
6. **Expose the registry.** Implement `toJSON()`; write a tiny script that prints full status
   — your stand-in for "an AI agent can read the state."
7. **Build the React UI — structure.** Two-pane layout in `App.tsx`: `<CategoryRail>` reading
   categories from the registry on the left, `<DetailPane>` showing the selected category on
   the right. No styling polish yet — just structure that renders from the registry.
8. **Build the React UI — controls.** One control component per control type (`<ToggleControl>`,
   `<SingleSelectControl>`, etc.) plus a `<PreferenceRenderer>` that dispatches on `control`.
   Local React state for now — no persistence required. Empty categories (Salesforce) and
   single-control categories (Slack AI) must render correctly without special-casing.
9. **Build the React UI — search.** `<SearchBox>` at the top filters across all categories at
   once. Selecting a result jumps the detail pane to that preference's category and highlights it.
10. **Polish + write-up.** Some CSS modules love for the layout, and finish `MIGRATION.md`:
    what was messy, what changed, why. This is your demo artifact.

---

## 8. Definition of done

- [ ] Every preference conforms to one schema with a stable, unique id.
- [ ] Registry rejects duplicate ids and flags the VIP-paused suspected duplicate.
- [ ] Schema cleanly handles: ordered/locked multi-select, dependencies, dynamic options/labels,
      flexible value types, builder-vs-managed lists.
- [ ] Search finds preferences by synonym/description and returns all relevant multi-hits.
- [ ] `toJSON()` emits the full, structured status of all preferences.
- [ ] React UI renders categories, control values, and search results entirely from the registry.
- [ ] Empty and single-control categories work without special-casing.
- [ ] Tests cover registry validation, dedupe, and search.
- [ ] `MIGRATION.md` documents the before/after and the reasoning.

---

## 9. Skills this rehearses (tie back to your goals)

You told the PM you want to (a) get fast at navigating an unfamiliar, messy codebase and
(b) communicate ideas clearly. This trains both:

- **Navigating mess:** `legacy/`'s deliberate disorder forces you to read scattered code,
  infer intent, find the duplicate, and consolidate — the real task in miniature.
- **Communicating clearly:** the schema, the canonical categories, and `MIGRATION.md` are all
  acts of communication through code and writing. The PM values clarity over polish — a clear
  `MIGRATION.md` beats a fancy UI.
- **React in a real codebase:** building one control component per type and dispatching from a
  schema mirrors how the real Slack preferences code is structured. It's the same pattern.

When you spar with Claude Code, lean on it for the parts you want to learn from, but make the
Section-4 judgment calls yourself. Those are what you'll be doing for real in a few weeks.
