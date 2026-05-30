import type { Preference } from "../../src/registry/types.js";

// Migration note: "vip-always-allow-when-paused" is the canonical copy of the duplicate
// that existed as both "vip_when_paused" in notifications-and-misc.ts and [0] in
// renderVipSettings() in random-team-additions.ts. Assigned to vip (not notifications)
// because it governs what VIP contacts can do, not general notification config.
// The notifications copy has been excluded from notifications.ts.

export const vipPreferences: Preference[] = [
  {
    id: "vip-always-allow-when-paused",
    category: "vip",
    owner: "vip-team",
    label: "Always allow notifications from VIPs",
    description: "Deliver notifications from VIP contacts even when your notifications are paused.",
    control: "toggle",
    default: false,
    keywords: ["vip", "notifications", "paused", "always allow", "do not disturb"],
    status: "active",
  },
  {
    id: "vip-unreads-section",
    category: "vip",
    owner: "vip-team",
    label: "Create VIP unreads section",
    description: "Group unread messages from VIPs into a dedicated section in your sidebar.",
    control: "toggle",
    default: true,
    keywords: ["vip", "unreads", "sidebar", "section"],
    status: "active",
  },
  {
    id: "vip-list",
    category: "vip",
    owner: "vip-team",
    label: "VIP list",
    description: "People whose messages always get through and appear in your VIP section.",
    control: "list_builder",
    default: [],
    keywords: ["vip", "people", "contacts", "priority", "list"],
    status: "active",
  },
];
