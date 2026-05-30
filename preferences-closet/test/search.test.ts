/**
 * test/search.test.ts
 *
 * Scaffolds for the search feature you'll build in src/search/search.ts. These are the cases
 * that matter most — the multi-hit and synonym tests are what prove the "didn't know it
 * existed" problem is actually solved.
 */

import { describe, it, expect, beforeAll } from "vitest";
import { buildRegistry, type Registry } from "../src/registry/registry.js";

describe("search", () => {
  let registry: Registry;

  beforeAll(() => {
    registry = buildRegistry();
  });

  it('synonym: "dark mode" finds the appearance color-mode preference', () => {
    const results = registry.search("dark mode");
    const ids = results.map((p) => p.id);
    expect(ids).toContain("appearance-color-mode");
  });

  it('multi-hit: "unreads" returns both Home preferences that mention it', () => {
    const results = registry.search("unreads");
    const ids = results.map((p) => p.id);
    expect(ids).toContain("home-always-show-in-sidebar");
    expect(ids).toContain("home-conversation-filter");
  });

  it('multi-hit: "timezone" returns the auto toggle and the manual select', () => {
    const results = registry.search("timezone");
    const ids = results.map((p) => p.id);
    expect(ids).toContain("language-region-auto-timezone");
    expect(ids).toContain("language-region-timezone");
  });

  // "english" hits language-region-language (language picker) and language-region-timezone
  // (cross-search keyword added because timezone names are often expressed in English locale).
  // No keyboard-layout pref exists in this simulation — both hits are in language-region.
  it('multi-hit: "english" returns both language-picker and timezone preferences', () => {
    const results = registry.search("english");
    const ids = results.map((p) => p.id);
    expect(ids).toContain("language-region-language");
    expect(ids).toContain("language-region-timezone");
  });

  it("empty query returns no results and does not throw", () => {
    expect(registry.search("")).toEqual([]);
    expect(registry.search("   ")).toEqual([]);
    expect(registry.search("xkzqwjfhvbnm")).toEqual([]);
  });
});
