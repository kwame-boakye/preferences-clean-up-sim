import type { Preference } from "../registry/types.js";

/**
 * Search across label, description, and keywords for all preferences matching the query.
 * Supports multi-word queries (all terms must match somewhere in the pref), returns ALL
 * hits (never just the first), and returns [] for empty/whitespace input without throwing.
 */
export function search(query: string, all: Preference[]): Preference[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  const terms = trimmed.split(/\s+/);

  return all.filter((pref) => {
    const haystack = [
      pref.label,
      pref.description,
      ...(pref.keywords ?? []),
    ]
      .join(" ")
      .toLowerCase();

    return terms.every((term) => haystack.includes(term));
  });
}
