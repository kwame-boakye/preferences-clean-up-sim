import type { Preference } from "../../src/registry/types.js";

export const privacyVisibilityPreferences: Preference[] = [
  {
    id: "privacy-discoverability",
    category: "privacy-visibility",
    owner: "privacy-team",
    label: "Who can find you",
    description: "Control whether people with your organization's email domain can discover your account.",
    control: "single_select",
    options: {
      kind: "static",
      values: [
        {
          value: "email_domain",
          label: "Allow anyone with your email domain to find you",
          // Label is a template — the renderer substitutes the user's actual email domain.
          dynamicLabel: true,
        },
        {
          value: "nobody",
          label: "Don't allow anyone to find me by email",
        },
      ],
    },
    default: "email_domain",
    keywords: ["discoverability", "email", "find me", "privacy", "domain"],
    status: "active",
  },
  {
    id: "privacy-read-receipts",
    category: "privacy-visibility",
    owner: "privacy-team",
    label: "Show when I've read messages",
    description: "Let others see when you have read a direct message.",
    control: "toggle",
    default: true,
    keywords: ["read receipts", "seen", "privacy", "messages"],
    status: "active",
  },
  {
    id: "privacy-blocked-invitations",
    category: "privacy-visibility",
    owner: "privacy-team",
    label: "Blocked invitations",
    description: "People and workspaces whose invitations you have blocked. Remove to allow invitations again.",
    control: "managed_list",
    default: [],
    keywords: ["blocked", "invitations", "privacy", "workspaces"],
    status: "active",
  },
  {
    id: "privacy-hidden-people",
    category: "privacy-visibility",
    owner: "privacy-team",
    label: "Hidden people",
    description: "People you've hidden from your directory. Remove to make them visible again.",
    control: "managed_list",
    default: [],
    keywords: ["hidden", "people", "directory", "privacy", "visibility"],
    status: "active",
  },
];
