# Preferences Closet

A practice project simulating a real internship task: taking a messy, unowned preferences
system (modeled on Slack's Preferences dialog) and giving it a single schema, a validating
registry, search, and a machine-readable export.

**Read `PROJECT.md` first.** It has the full plan, the 16-category inventory, and the
judgment calls. `CLAUDE.md` tells Claude Code how to behave in this repo. `MIGRATION.md` is
the write-up you fill in as you go.

## Quick start

```bash
npm install
npm test        # 4 tests pass; 7 are TODO scaffolds for what you'll build
npm run build   # type-check + compile to dist/
```

## Where things are

- `src/types.ts` — the preference schema (a starting proposal; revise it as you migrate).
- `src/registry.ts` — the "closet": load, validate, reject dup ids, query, `toJSON()`.
- `src/search.ts` — *you build this* (milestone 5).
- `data/preferences/` — clean, migrated preferences. `availability.ts` is a worked example;
  migrate the other 15 categories here.
- `legacy/` — the **deliberate mess** you migrate FROM. Three files, three formats, with a
  planted duplicate, a misfiled preference, and docs-mixed-into-data. Don't clean these in place.
- `test/` — registry + search tests.

## The first thing to do

Open it in VS Code, run `npm test` to confirm it's green, then ask Claude Code to walk you
through `legacy/` and list everything it finds — that's milestone 1.
