import type { Preference } from "../../src/registry/types.js";

export const connectedAccountsPreferences: Preference[] = [
  {
    id: "connected-accounts-google",
    category: "connected-accounts",
    owner: "integrations-team",
    label: "Google account",
    description: "Google accounts linked to your Slack profile for Calendar and Drive integration.",
    control: "managed_list",
    default: [],
    keywords: ["google", "connected", "accounts", "calendar", "drive", "integration"],
    status: "active",
  },
  {
    id: "connected-accounts-github",
    category: "connected-accounts",
    owner: "integrations-team",
    label: "GitHub account",
    description: "GitHub accounts linked to your Slack profile for code review notifications.",
    control: "managed_list",
    default: [],
    keywords: ["github", "connected", "accounts", "code", "integration"],
    status: "active",
  },
  {
    id: "connected-accounts-apps",
    category: "connected-accounts",
    owner: "integrations-team",
    label: "Connected apps",
    description: "Third-party apps authorized to access your Slack account. Remove to revoke access.",
    control: "managed_list",
    default: [],
    keywords: ["apps", "connected", "authorized", "oauth", "third party", "integrations"],
    status: "active",
  },
];
