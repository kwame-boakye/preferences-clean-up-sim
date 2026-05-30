/**
 * test/search.test.ts
 *
 * Scaffolds for the search feature you'll build in src/search/search.ts. These are the cases
 * that matter most — the multi-hit and synonym tests are what prove the "didn't know it
 * existed" problem is actually solved.
 */

import { describe, it } from "vitest";

describe("search", () => {
  // TODO(kelvin): "dark mode" should find the appearance color-mode / theme preference,
  // even though neither label literally contains "dark mode" (use keywords).
  it.todo('synonym: "dark mode" finds the appearance color-mode preference');

  // TODO(kelvin): "unreads" appears in BOTH the Home sidebar multi-select and the
  // Home conversation filter — search must return BOTH, not just the first.
  it.todo('multi-hit: "unreads" returns both Home preferences that mention it');

  // TODO(kelvin): "timezone" should return both the auto-timezone toggle and the manual select.
  it.todo('multi-hit: "timezone" returns the auto toggle and the manual select');

  // TODO(kelvin): "english" appears in both Language and Keyboard layout — disambiguate by
  // description, but still return both.
  it.todo('multi-hit: "english" returns both language and keyboard-layout preferences');

  // TODO(kelvin): empty / nonsense query returns no results without throwing.
  it.todo("empty query returns no results and does not throw");
});
