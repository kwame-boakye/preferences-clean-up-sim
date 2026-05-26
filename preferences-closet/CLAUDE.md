# CLAUDE.md

Guidance for Claude Code when working in this repo. Read `PROJECT.md` first — it explains
what we're building, the full preference inventory, and the judgment calls involved.

## What this repo is

A practice simulation of a real internship task: cleaning up a messy, unowned "preferences"
system (modeled on Slack's Preferences dialog, 16 categories) by giving it a single schema, a
validating registry ("the closet"), search, and a machine-readable export. The mess in
`legacy/` is intentional. Do not "fix" it by deleting it — it's the before-state we migrate from.

## Stack

- TypeScript (compiled with `tsc`), plain HTML + CSS for the UI.
- Tests with Vitest.
- No framework unless I explicitly ask for React.

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

- Every preference must conform to the `Preference` type in `src/types.ts`. No "temporary"
  loose objects, no `any` to dodge a hard case — if the type can't express something, we change
  the type deliberately and write down why.
- `id` is stable, unique, kebab-case, and is **never** the display label.
- The registry must reject duplicate ids and surface suspected duplicates (start with the
  known VIP-"always allow notifications when paused" pair) rather than silently allowing them.
- The UI renders from the registry. Do not hardcode a second list of preferences in the
  render layer.
- Empty categories (Salesforce) and single-control categories (Slack AI) must work without
  special-casing.

## The known hard cases (don't paper over these)

- Accessibility → message verbosity is an **ordered multi-select with locked-on items**.
- Three dependencies: large-files↔linked-images, manual-timezone↔auto-timezone,
  music-timing↔play-music.
- Dynamic options (audio device lists) and dynamic labels (privacy email injection).
- Mixed value types (boolean / string / string[] / custom-theme object).

## Conventions

- Filenames: kebab-case. Types/interfaces: PascalCase. Functions/vars: camelCase.
- Keep `src/render.ts` free of business logic — it reads from the registry and draws.
- Search lives only in `src/search.ts`.

## When in doubt

Ask. A short clarifying question is cheaper than a large wrong diff. If a request is ambiguous
about which category a preference belongs to, surface the candidates and let me decide.
