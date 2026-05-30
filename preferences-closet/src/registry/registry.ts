/**
 * src/registry/registry.ts
 *
 * The "closet" — the single source of truth for preferences. This is a STUB: it has the
 * shape, the dedupe idea, and the query surface, but the migration data and the harder
 * validation are left for you to build (see TODOs). Build the tests in test/registry.test.ts
 * alongside this.
 */

import type { Category, ControlType, Options, Preference, PreferenceValue } from "./types.js";
import { CATEGORIES, isTimeRangeValue } from "./types.js";
import { search as searchPreferences } from "../search/search.js";

export interface DuplicateWarning {
  ids: string[];
  reason: string;
}

/** The shape emitted by toJSON() — every field an agent needs to reason about any preference. */
export interface PreferenceJSON {
  id: string;
  label: string;
  description: string;
  category: Category;
  owner: string;
  control: ControlType;
  options?: Options;
  default: PreferenceValue;
  keywords: string[];
  status: "active" | "deprecated";
  dependsOn?: { id: string; when: PreferenceValue };
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

    this.validateDefault(pref);

    this.flagSuspectedDuplicates(pref);
    this.byId.set(pref.id, pref);
  }

  private validateDefault(pref: Preference): void {
    const { id, control, default: def } = pref;
    const isStringArray = (v: PreferenceValue) => Array.isArray(v) && v.every((x) => typeof x === "string");

    const valid =
      (control === "toggle" && typeof def === "boolean") ||
      (control === "single_select" && typeof def === "string") ||
      (control === "text" && typeof def === "string") ||
      (control === "multi_select" && isStringArray(def)) ||
      (control === "ordered_multi_select" && isStringArray(def)) ||
      (control === "list_builder" && isStringArray(def)) ||
      (control === "managed_list" && isStringArray(def)) ||
      (control === "entity_picker" && isStringArray(def)) ||
      (control === "time_range" && isTimeRangeValue(def));

    if (!valid) {
      throw new Error(
        `Preference "${id}" has control "${control}" but its default value shape does not match.`
      );
    }
  }

  /**
   * Two signals:
   * 1. Identical normalized label — catches obvious copy-pastes.
   * 2. High token overlap across label + description + keywords — catches the VIP-paused
   *    pair, which has different wording but shares enough meaningful terms ("vip",
   *    "notifications", "paused"). Threshold: 3+ shared tokens after stop-word removal.
   */
  private flagSuspectedDuplicates(incoming: Preference): void {
    const norm = (s: string) => s.trim().toLowerCase();
    const STOP = new Set(["a", "an", "the", "to", "in", "of", "and", "or", "is", "for", "from", "if", "even"]);
    const tokens = (p: Preference): Set<string> => {
      const text = [p.label, p.description, ...(p.keywords ?? [])].join(" ");
      const words = text.toLowerCase().match(/\b\w{3,}\b/g) ?? [];
      return new Set(words.filter((w) => !STOP.has(w)));
    };

    for (const existing of this.byId.values()) {
      if (norm(existing.label) === norm(incoming.label)) {
        this.warnings.push({
          ids: [existing.id, incoming.id],
          reason: `Identical label: "${incoming.label}"`,
        });
        continue;
      }

      // Same-category structural similarity (e.g. six nav tabs) is intentional by design.
      // Only cross-category token overlap signals a genuine misplaced duplicate.
      if (existing.category === incoming.category) continue;

      const sharedTokens = [...tokens(existing)].filter((t) => tokens(incoming).has(t));
      if (sharedTokens.length >= 5) {
        this.warnings.push({
          ids: [existing.id, incoming.id],
          reason: `High token overlap (${sharedTokens.length} shared terms: ${sharedTokens.slice(0, 5).join(", ")})`,
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

  search(query: string): Preference[] {
    return searchPreferences(query, this.all());
  }

  /**
   * Agent-readable export: full structured status of every preference.
   * Outputs defaults (not live values) — sufficient for the simulation.
   * Agents reading this can tell: what each pref does, where it lives, who owns it,
   * what values are valid, and what other prefs it depends on.
   */
  toJSON(): Record<string, PreferenceJSON> {
    const out: Record<string, PreferenceJSON> = {};
    for (const p of this.byId.values()) {
      out[p.id] = {
        id: p.id,
        label: p.label,
        description: p.description,
        category: p.category,
        owner: p.owner,
        control: p.control,
        options: p.options,
        default: p.default,
        keywords: p.keywords ?? [],
        status: p.status ?? "active",
        dependsOn: p.dependsOn,
      };
    }
    return out;
  }
}

import { availabilityPreferences } from "../../data/preferences/availability.js";
import { notificationsPreferences } from "../../data/preferences/notifications.js";
import { vipPreferences } from "../../data/preferences/vip.js";
import { navigationPreferences } from "../../data/preferences/navigation.js";
import { homePreferences } from "../../data/preferences/home.js";
import { appearancePreferences } from "../../data/preferences/appearance.js";
import { messagesMediaPreferences } from "../../data/preferences/messages-media.js";
import { languageRegionPreferences } from "../../data/preferences/language-region.js";
import { accessibilityPreferences } from "../../data/preferences/accessibility.js";
import { markAsReadPreferences } from "../../data/preferences/mark-as-read.js";
import { audioVideoPreferences } from "../../data/preferences/audio-video.js";
import { salesforcePreferences } from "../../data/preferences/salesforce.js";
import { connectedAccountsPreferences } from "../../data/preferences/connected-accounts.js";
import { privacyVisibilityPreferences } from "../../data/preferences/privacy-visibility.js";
import { slackAiPreferences } from "../../data/preferences/slack-ai.js";
import { advancedPreferences } from "../../data/preferences/advanced.js";

export function buildRegistry(): Registry {
  const registry = new Registry();
  [
    availabilityPreferences,
    notificationsPreferences,
    vipPreferences,
    navigationPreferences,
    homePreferences,
    appearancePreferences,
    messagesMediaPreferences,
    languageRegionPreferences,
    accessibilityPreferences,
    markAsReadPreferences,
    audioVideoPreferences,
    salesforcePreferences,
    connectedAccountsPreferences,
    privacyVisibilityPreferences,
    slackAiPreferences,
    advancedPreferences,
  ].flat().forEach((p) => registry.register(p));
  return registry;
}
