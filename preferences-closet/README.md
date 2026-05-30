# Preferences Closet

A practice project simulating a real internship task: taking a messy, unowned preferences
system (modeled on Slack's Preferences dialog) and giving it a single schema, a validating
registry, search, a machine-readable export, and a React UI.

**Read `PROJECT.md` first.** It has the full plan, the 16-category inventory, and the
judgment calls. `CLAUDE.md` tells Claude Code how to behave in this repo. `MIGRATION.md` is
the write-up you fill in as you go.

## Stack

Vite + React 18 + TypeScript (strict) + plain CSS modules + Vitest.

## Quick start

```bash
npm install
npm test           # green baseline (5 pass, 7 todo)
npm run typecheck  # full strict type-check
npm run dev        # http://localhost:5173 — placeholder page until milestone 7
```

## Where things are

- `src/registry/types.ts` — the preference schema (a starting proposal; revise as you migrate).
- `src/registry/registry.ts` — the "closet": load, validate, reject dup ids, query, `toJSON()`.
- `src/search/search.ts` — *you build this* (milestone 5).
- `src/ui/` — React components and CSS modules. Mostly empty until milestones 7–9.
- `src/App.tsx`, `src/main.tsx` — React entry points (placeholder UI for now).
- `data/preferences/` — clean, migrated preferences. `availability.ts` is the worked example.
- `legacy/` — the **deliberate mess** you migrate FROM. Three files, three formats, with a
  planted duplicate, a misfiled preference, and docs-mixed-into-data. Don't clean these in place.
- `test/` — registry, search, and React component tests.

## The first thing to do

Open it in VS Code, run `npm install && npm test` to confirm a green baseline, then ask
Claude Code to walk you through `legacy/` and list everything it finds — that's milestone 1.
