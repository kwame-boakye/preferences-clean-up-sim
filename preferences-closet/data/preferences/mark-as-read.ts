import type { Preference } from "../../src/registry/types.js";

// Migration note: legacy markAsRead included 4 { doc: "..." } entries for keyboard shortcuts
// (Esc, Shift+Esc, Option+click, Cmd+/). These are UI copy, not preferences — they have no
// value, no default, and no owner. Excluded from the registry entirely.

export const markAsReadPreferences: Preference[] = [
  {
    id: "mark-as-read-on-view",
    category: "mark-as-read",
    owner: "messaging-team",
    label: "When I view a channel, mark it as read",
    description: "Choose what happens to a channel's unread state when you open it.",
    control: "single_select",
    options: {
      kind: "static",
      values: [
        { value: "left_off", label: "Start where I left off" },
        { value: "newest_marked", label: "Start at the newest message and mark all as read" },
        { value: "newest_unread", label: "Start at the newest message but leave messages unread" },
      ],
    },
    default: "left_off",
    keywords: ["mark as read", "unread", "channel", "view", "left off"],
    status: "active",
  },
  {
    id: "mark-as-read-confirm-mark-all",
    category: "mark-as-read",
    owner: "messaging-team",
    label: "Ask for confirmation before marking all messages as read",
    description: "Show a confirmation dialog before bulk-marking everything as read.",
    control: "toggle",
    default: true,
    keywords: ["mark as read", "confirm", "all messages", "bulk"],
    status: "active",
  },
];
