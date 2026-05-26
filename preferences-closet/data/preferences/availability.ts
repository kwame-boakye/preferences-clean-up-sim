/**
 * data/preferences/availability.ts
 *
 * WORKED EXAMPLE — the only pre-migrated category. Use it as a reference for how to migrate
 * the other 15 from legacy/. Note the choices made here (and write your own equivalents in
 * MIGRATION.md as you go):
 *   - working hours modeled as ONE time_range control, not three selects
 *   - the three automatic-status toggles kept as three atomic toggles
 *   - stable kebab-case ids, never the label
 *   - an owner assigned, a description written, search keywords added
 */

import type { Preference } from "../../src/types.js";

export const availabilityPreferences: Preference[] = [
  {
    id: "availability-working-hours",
    category: "availability",
    owner: "notifications-team",
    label: "Working hours",
    description:
      "The window during which you receive notifications; outside it, notifications pause except for VIPs.",
    control: "time_range",
    default: { days: "every_day", start: "00:00", end: "midnight" },
    keywords: ["working hours", "notification schedule", "do not disturb", "quiet hours"],
    status: "active",
  },
  {
    id: "availability-auto-status-huddle",
    category: "availability",
    owner: "status-team",
    label: "Set status to In a huddle for huddles",
    description: "Automatically set your status to In a huddle while you're in a huddle.",
    control: "toggle",
    default: true,
    keywords: ["automatic status", "huddle"],
    status: "active",
  },
  {
    id: "availability-auto-status-focus",
    category: "availability",
    owner: "status-team",
    label: "Set status to In focus mode for focus mode",
    description: "Automatically set your status to In focus mode while focus mode is on.",
    control: "toggle",
    default: true,
    keywords: ["automatic status", "focus mode"],
    status: "active",
  },
  {
    id: "availability-auto-status-after-hours",
    category: "availability",
    owner: "status-team",
    label: "Set status to After hours for after working hours",
    description: "Automatically set your status to After hours once your working hours end.",
    control: "toggle",
    default: false,
    keywords: ["automatic status", "after hours", "working hours"],
    status: "active",
  },
];
