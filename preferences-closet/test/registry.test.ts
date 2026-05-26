/**
 * test/registry.test.ts
 *
 * Starter tests. Some pass now; some are TODO scaffolds for behavior you'll build.
 * Run with: npm test
 */

import { describe, it, expect } from "vitest";
import { Registry } from "../src/registry.js";
import type { Preference } from "../src/types.js";
import { availabilityPreferences } from "../data/preferences/availability.js";

// helper: grab a preference by id from the fixture, failing loudly if it's missing
function fixture(id: string): Preference {
  const p = availabilityPreferences.find((x) => x.id === id);
  if (!p) throw new Error(`fixture not found: ${id}`);
  return p;
}

describe("Registry", () => {
  it("registers a valid preference and looks it up by id", () => {
    const r = new Registry();
    r.register(fixture("availability-working-hours"));
    expect(r.getById("availability-working-hours")?.label).toBe("Working hours");
  });

  it("rejects duplicate ids", () => {
    const r = new Registry();
    const pref = fixture("availability-working-hours");
    r.register(pref);
    expect(() => r.register(pref)).toThrowError(/Duplicate preference id/);
  });

  it("groups preferences by category", () => {
    const r = new Registry();
    availabilityPreferences.forEach((p) => r.register(p));
    expect(r.getByCategory("availability")).toHaveLength(availabilityPreferences.length);
  });

  it("exports machine-readable status via toJSON()", () => {
    const r = new Registry();
    availabilityPreferences.forEach((p) => r.register(p));
    const json = r.toJSON();
    expect(json["availability-working-hours"]?.control).toBe("time_range");
  });

  // TODO(kelvin): once you migrate notifications + vip, write a test proving the
  // VIP-"always allow when paused" pair is flagged as a suspected duplicate via getWarnings().
  it.todo("flags the VIP-paused suspected duplicate across notifications and vip");

  // TODO(kelvin): write a test that validates `default` shape matches `control`
  // (e.g. a toggle whose default is a string should be rejected).
  it.todo("rejects a preference whose default shape doesn't match its control");
});
