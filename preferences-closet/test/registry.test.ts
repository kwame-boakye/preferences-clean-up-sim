/**
 * test/registry.test.ts
 *
 * Starter tests. Some pass now; some are TODO scaffolds for behavior you'll build.
 * Run with: npm test
 */

import { describe, it, expect } from "vitest";
import { Registry } from "../src/registry/registry.js";
import type { Preference } from "../src/registry/types.js";
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

  it("flags the VIP-paused suspected duplicate across notifications and vip", () => {
    const r = new Registry();
    const notifVersion: Preference = {
      id: "notifications-vip-when-paused",
      category: "notifications",
      owner: "notifications-team",
      label: "Messages from VIPs, even if notifications are paused",
      description: "Always deliver notifications from VIP contacts even when notifications are paused.",
      control: "toggle",
      default: false,
      keywords: ["vip", "notifications", "paused", "always allow"],
    };
    const vipVersion: Preference = {
      id: "vip-always-allow-notifications",
      category: "vip",
      owner: "vip-team",
      label: "Always allow notifications from VIPs",
      description: "Receive notifications from VIPs even when your notifications are paused.",
      control: "toggle",
      default: false,
      keywords: ["vip", "notifications", "paused"],
    };
    r.register(notifVersion);
    r.register(vipVersion);
    const warnings = r.getWarnings();
    expect(warnings.length).toBeGreaterThan(0);
    const vipWarning = warnings.find(
      (w) => w.ids.includes("notifications-vip-when-paused") && w.ids.includes("vip-always-allow-notifications")
    );
    expect(vipWarning).toBeDefined();
  });

  it("rejects a preference whose default shape doesn't match its control", () => {
    const r = new Registry();
    const bad: Preference = {
      ...fixture("availability-auto-status-huddle"), // toggle, default: true
      id: "bad-toggle",
      default: "yes" as unknown as boolean, // wrong shape
    };
    expect(() => r.register(bad)).toThrowError(/default value shape/);
  });
});
