# CLAUDE.md

Guidance for Claude Code when working in this repo. Read `PROJECT.md` first — it explains
what we're building, the full preference inventory, and the judgment calls involved.

## What this repo is

A practice simulation of a real internship task: cleaning up a messy, unowned "preferences"
system (modeled on Slack's Preferences dialog, 16 categories) by giving it a single schema, a
validating registry ("the closet"), search, a machine-readable export, and a React UI on top.
The mess in `legacy/` is intentional. Do not "fix" it by deleting it — it's the before-state
we migrate from.

## Stack

- **Vite + React 18 + TypeScript** in strict mode.
- **Plain CSS modules** (`*.module.css`). No Tailwind, no styled-components, no UI libraries.
- **Vitest** for tests, run via `npm test`.

## How I want you to work with me

- I'm an early-career engineer and the point of this project is for **me** to learn, so
  prefer explaining your reasoning over silently producing large diffs.
- **The schema design and migration decisions are mine to make.** See "Judgment calls" in
  PROJECT.md Section 4. When we reach those, lay out options and trade-offs rather than just
  picking one. Everywhere else, move fast.
- Make small, reviewable commits. One concern per change.
- Write or update a test alongside any change to `registry.ts` or `search.ts`.
- When you touch a preference's category, owner, or id during migration, note the reasoning
  so it can land in `MIGRATION.md`.

## Hard rules

- Every preference must conform to the `Preference` type in `src/registry/types.ts`. No
  "temporary" loose objects, no `any` to dodge a hard case — if the type can't express
  something, we change the type deliberately and write down why.
- `id` is stable, unique, kebab-case, and is **never** the display label.
- The registry must reject duplicate ids and surface suspected duplicates (start with the
  known VIP-"always allow notifications when paused" pair) rather than silently allowing them.
- React components **render from the registry**. Do not hardcode a second list of preferences,
  categories, or control types anywhere in `src/ui/`.
- Empty categories (Salesforce) and single-control categories (Slack AI) must work without
  special-casing — the renderer dispatches on shape, not on category name.

## React conventions

- Function components only. Hooks for state.
- One component per file. Filename matches component name (`CategoryRail.tsx` exports `CategoryRail`).
- Styles colocate with components: `Foo.tsx` + `Foo.module.css` in the same folder.
- Props interfaces named `FooProps`, declared above the component.
- No global state library needed at this scale — `useState`/`useContext` is enough.
- A `<PreferenceRenderer>` dispatches on `pref.control` and renders the matching control
  component. Add a new `case` for each control type as you build it.

## The known hard cases (don't paper over these)

- Accessibility → message verbosity is an **ordered multi-select with locked-on items**.
- Three dependencies: large-files↔linked-images, manual-timezone↔auto-timezone,
  music-timing↔play-music.
- Dynamic options (audio device lists) and dynamic labels (privacy email injection).
- Mixed value types (boolean / string / string[] / custom-theme object).

## Other conventions

- Filenames: kebab-case for non-component files (`registry.ts`), PascalCase for components.
- Types/interfaces: PascalCase. Functions/vars: camelCase.
- Search lives only in `src/search/search.ts`.
- Don't put business logic in UI components — they consume the registry and search, they
  don't reimplement them.

## When in doubt

Ask. A short clarifying question is cheaper than a large wrong diff. If a request is ambiguous
about which category a preference belongs to, surface the candidates and let me decide.
