import type { Preference } from "../../src/registry/types.js";

// Migration note: Salesforce registered a category with no preferences, only a CTA button
// ("Request Customer Management"). CTA buttons are UI chrome, not registry entries.
// The empty array is intentional — the UI must handle empty categories without special-casing.

export const salesforcePreferences: Preference[] = [];
