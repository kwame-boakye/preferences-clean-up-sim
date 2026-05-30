import type { Preference } from "../../src/registry/types.js";

// Migration note: the legacy "appearance" object stored font, colorMode, themeSource, and
// theme as one blob. Split into 4 atomic single_select prefs because they are independent
// settings — changing your font has no bearing on your color mode. Keeping them separate
// also makes each individually queryable and searchable (e.g. "dark mode" finds color-mode).

export const appearancePreferences: Preference[] = [
  {
    id: "appearance-color-mode",
    category: "appearance",
    owner: "appearance-team",
    label: "Color mode",
    description: "Choose whether Slack uses a light or dark color scheme, or follows your system setting.",
    control: "single_select",
    options: {
      kind: "static",
      values: [
        { value: "light", label: "Light" },
        { value: "dark", label: "Dark" },
        { value: "system", label: "Sync with system" },
      ],
    },
    default: "dark",
    keywords: ["dark mode", "light mode", "color scheme", "theme", "appearance", "system"],
    status: "active",
  },
  {
    id: "appearance-theme-source",
    category: "appearance",
    owner: "appearance-team",
    label: "Theme source",
    description: "Use a Slack-provided theme or build a custom one with your own colors.",
    control: "single_select",
    options: {
      kind: "static",
      values: [
        { value: "slack_themes", label: "Slack themes" },
        { value: "custom", label: "Custom theme" },
      ],
    },
    default: "slack_themes",
    keywords: ["theme", "custom", "colors", "appearance"],
    status: "active",
  },
  {
    id: "appearance-theme",
    category: "appearance",
    owner: "appearance-team",
    label: "Theme",
    description: "The color theme applied to your Slack sidebar and interface.",
    control: "single_select",
    options: {
      kind: "static",
      values: [
        { value: "aubergine", label: "Aubergine", group: "Single color" },
        { value: "ochin", label: "Ochin", group: "Single color" },
        { value: "monument", label: "Monument", group: "Single color" },
        { value: "work_hard", label: "Work Hard", group: "Single color" },
        { value: "hoth", label: "Hoth", group: "Single color" },
        { value: "nightshade", label: "Nightshade", group: "Dark" },
        { value: "tritanopia_dark", label: "Tritanopia dark", group: "Dark" },
        { value: "protanopia_dark", label: "Protanopia dark", group: "Dark" },
        { value: "tritanopia_light", label: "Tritanopia light", group: "Light" },
        { value: "protanopia_light", label: "Protanopia light", group: "Light" },
      ],
    },
    default: "aubergine",
    keywords: ["theme", "color", "appearance", "skin", "palette", "aubergine"],
    status: "active",
  },
  {
    id: "appearance-font",
    category: "appearance",
    owner: "appearance-team",
    label: "Font",
    description: "The typeface used throughout the Slack interface.",
    control: "single_select",
    options: {
      kind: "static",
      values: [
        { value: "Lato", label: "Lato (default)" },
        { value: "system", label: "System default" },
      ],
    },
    default: "Lato",
    keywords: ["font", "typeface", "text", "appearance", "typography"],
    status: "active",
  },
];
