/**
 * legacy/random-team-additions.ts
 *
 * !!! THE WORST OFFENDER — DELIBERATE MESS. Migrate FROM it. !!!
 *
 * This is what happens when five teams each "just add their thing." Preferences are
 * hardcoded inside a render function, keyed by ARRAY POSITION, mixed with documentation
 * text, and one of them is the other half of the duplicate from notifications-and-misc.ts.
 */

// VIP team shipped this as a render function. The "preferences" are positional args. Cool.
export function renderVipSettings() {
  return [
    // [0] ▼▼▼ DUPLICATE #1, other copy (see notifications-and-misc.ts "vip_when_paused") ▼▼▼
    { text: "Always allow notifications from VIPs", enabled: false },
    // [1]
    { text: "Create VIP unreads section", enabled: true, badge: "NEW" },
    // [2] the actual VIP list — a builder. stored as a bare array of names. no schema at all.
    { text: "VIP list", people: ["U-EBENEZER-ACQUAH"], kind: "list" },
  ];
}

// Navigation team. Six tabs as six booleans + an appearance radio. One idea, many flags.
export const navTabs = {
  home: true,
  dms: true,
  activity: true,
  files: true,
  later: true,
  tools: false,
  appearance: "icons_and_text", // "icons_and_text" | "icons_only"
};

// Appearance team. The theme picker — ~28 options, grouped, stored as a flat string.
export const appearance = {
  font: "Lato",
  colorMode: "dark", // light | dark | system
  themeSource: "slack_themes", // slack_themes | custom
  theme: "aubergine",
};

// Messages & media team. Note the nested one: large_files only matters if linked_images on.
export const messages = [
  { id: "density", kind: "radio", val: "clean" }, // clean | compact
  { id: "name_display", kind: "radio", val: "full_and_display" },
  { id: "show_typing", kind: "toggle", val: true },
  { id: "clock_24h", kind: "toggle", val: false },
  { id: "color_swatches", kind: "toggle", val: true },
  { id: "default_skin_tone", kind: "swatch", val: "default" },
  { id: "emoji_plain_text", kind: "toggle", val: false },
  { id: "jumbomoji", kind: "toggle", val: true },
  { id: "convert_emoticons", kind: "toggle", val: true },
  { id: "one_click_reactions", kind: "toggle", val: false },
  { id: "show_uploaded_images", kind: "toggle", val: true },
  { id: "show_linked_images", kind: "toggle", val: true },
  { id: "show_large_files", kind: "toggle", val: false, note: "only if show_linked_images" },
  { id: "show_link_previews", kind: "toggle", val: true },
];

// Mark as read team stuffed the keyboard-shortcut DOCS into the data. Migrate the 2 real
// prefs; the shortcuts are UI copy and do NOT belong in the registry.
export const markAsRead = [
  { id: "on_view", kind: "radio", val: "left_off" }, // left_off | newest_marked | newest_unread
  { id: "confirm_mark_all", kind: "toggle", val: true },
  { doc: "Esc = mark channel read" },
  { doc: "Shift+Esc = mark all read" },
  { doc: "Option+click = mark a message unread" },
  { doc: "Cmd+/ = full shortcut list" },
];

// Salesforce team registered a category... with no preferences. Just a CTA button.
export const salesforce = {
  category: "salesforce",
  preferences: [],
  cta: "Request Customer Management",
};

// Slack AI team. One toggle.
export const slackAi = [{ id: "stream_summaries", on: true }];
