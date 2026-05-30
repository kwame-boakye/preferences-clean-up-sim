/**
 * src/search/search.ts
 *
 * TODO(kelvin): milestone 5. Implement fuzzy search across label + description + keywords.
 *
 * Required behaviors (see test/search.test.ts for the cases):
 *   - "dark mode" finds the appearance color-mode / theme preference via keywords
 *   - "unreads" returns ALL hits (Home sidebar item + Home conversation filter)
 *   - "timezone" returns both the auto toggle and the manual select
 *   - "english" returns both language and keyboard-layout preferences
 *   - empty / whitespace query returns []
 */

import type { Preference } from "../registry/types.js";

export function search(_query: string, _all: Preference[]): Preference[] {
  throw new Error("search() not implemented yet — milestone 5");
}
