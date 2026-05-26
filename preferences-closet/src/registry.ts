/**
 * src/registry.ts
 *
 * The "closet" — the single source of truth for preferences. This is a STUB: it has the
 * shape, the dedupe idea, and the query surface, but the migration data and the harder
 * validation are left for you to build (see TODOs). Build the tests in test/registry.test.ts
 * alongside this.
 */

import type { Category, Preference, PreferenceValue } from "./types.js";
import { CATEGORIES, isTimeRangeValue } from "./types.js";

export interface DuplicateWarning {
  ids: string[];
  reason: string;
}

export class Registry {
  private byId = new Map<string, Preference>();
  private warnings: DuplicateWarning[] = [];

  /**
   * Register one preference. Rejects exact duplicate ids hard. Flags *suspected* duplicates
   * (same label or same description across different ids) as warnings rather than throwing —
   * the headline case being the VIP "always allow notifications when paused" pair.
   */
  register(pref: Preference): void {
    if (this.byId.has(pref.id)) {
      throw new Error(`Duplicate preference id: "${pref.id}"`);
    }

    if (!CATEGORIES.includes(pref.category)) {
      throw new Error(`Preference "${pref.id}" has unknown category "${pref.category}"`);
    }

    // TODO(kelvin): validate that `default`'s shape matches `control`
    // (toggle -> boolean, single_select -> string, etc.). isTimeRangeValue() is provided
    // as a starting helper. Decide how strict to be and write tests for it.
    void isTimeRangeValue;

    this.flagSuspectedDuplicates(pref);
    this.byId.set(pref.id, pref);
  }

  /**
   * Suspected-duplicate detection. Starts simple: same normalized label OR same normalized
   * description as an already-registered preference.
   *
   * TODO(kelvin): improve this. The real VIP-paused duplicate has slightly different wording
   * in each location, so exact-match won't catch it. Consider keyword overlap or a similarity
   * score. This is the feature that demonstrates the "50% didn't know it existed" fix.
   */
  private flagSuspectedDuplicates(incoming: Preference): void {
    const norm = (s: string) => s.trim().toLowerCase();
    for (const existing of this.byId.values()) {
      if (norm(existing.label) === norm(incoming.label)) {
        this.warnings.push({
          ids: [existing.id, incoming.id],
          reason: `Identical label: "${incoming.label}"`,
        });
      }
    }
  }

  getById(id: string): Preference | undefined {
    return this.byId.get(id);
  }

  getByCategory(category: Category): Preference[] {
    return [...this.byId.values()].filter((p) => p.category === category);
  }

  all(): Preference[] {
    return [...this.byId.values()];
  }

  getWarnings(): DuplicateWarning[] {
    return [...this.warnings];
  }

  /**
   * Fuzzy search across label, description, and keywords.
   * TODO(kelvin): implement in src/search.ts and call it here. Must return ALL relevant hits
   * for multi-hit queries ("unreads", "timezone", "english"), not just the first.
   */
  search(_query: string): Preference[] {
    throw new Error("search() not implemented — build src/search.ts first");
  }

  /**
   * The agent-readable export: full structured status of every preference.
   * TODO(kelvin): decide what "status" means here — just defaults, or current values too?
   * For the simulation, defaults are fine to start.
   */
  toJSON(): Record<string, { category: Category; control: string; default: PreferenceValue }> {
    const out: Record<string, { category: Category; control: string; default: PreferenceValue }> = {};
    for (const p of this.byId.values()) {
      out[p.id] = { category: p.category, control: p.control, default: p.default };
    }
    return out;
  }
}

/**
 * TODO(kelvin): once you've migrated legacy/ into data/preferences/, load those modules here
 * and register them, returning a ready-to-use Registry. For now this returns an empty one.
 */
export function buildRegistry(): Registry {
  const registry = new Registry();
  // import { availabilityPreferences } from "../data/preferences/availability.js";
  // availabilityPreferences.forEach((p) => registry.register(p));
  return registry;
}
