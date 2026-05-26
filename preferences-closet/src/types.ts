/**
 * src/types.ts
 *
 * STARTING PROPOSAL for the preference schema. This is intentionally incomplete in the
 * places that require judgment — see the TODOs and PROJECT.md Section 4. You are expected
 * to revise this type as you migrate and hit the hard cases. Don't reach for `any` to dodge
 * a case; change the type deliberately and record why in MIGRATION.md.
 */

/** The 16 canonical categories. A preference's `category` MUST be one of these. */
export const CATEGORIES = [
  "availability",
  "notifications",
  "vip",
  "navigation",
  "home",
  "appearance",
  "messages-media",
  "language-region",
  "accessibility",
  "mark-as-read",
  "audio-video",
  "salesforce",
  "connected-accounts",
  "privacy-visibility",
  "slack-ai",
  "advanced",
] as const;

export type Category = (typeof CATEGORIES)[number];

/**
 * Every control type observed across the real dialog. See PROJECT.md Section 2 for which
 * screen each one comes from.
 */
export type ControlType =
  | "toggle" //                 boolean checkbox
  | "single_select" //          radio / dropdown / button group / swatch grid — pick one
  | "multi_select" //           checkbox group — pick any subset
  | "ordered_multi_select" //   multi_select that is reorderable + can lock items on
  | "text" //                   free text (e.g. channel keywords)
  | "entity_picker" //          text that resolves to references, not free text
  | "list_builder" //           user-driven add/remove of people/apps/workflows (VIP)
  | "managed_list" //           list populated elsewhere; usually remove-only
  | "time_range"; //            a start/end window (working hours)

/** An option for a select-style control. */
export interface PreferenceOption {
  value: string;
  label: string;
  /** Optional grouping for large option sets (Appearance themes: "Single color", etc.). */
  group?: string;
  /**
   * For ordered_multi_select: an item that is always on and cannot be turned off
   * (Accessibility verbosity: Sender, Message). Reorderable but not removable.
   */
  locked?: boolean;
}

/**
 * Where a control's options come from. Most selects have a fixed list; a few are resolved
 * at runtime (audio device lists). Keeping this explicit means an agent reading toJSON()
 * knows not to expect a static list.
 *
 * TODO(kelvin): decide if this is the right shape, or if dynamic options deserve their own
 * field / mechanism. (PROJECT.md Section 4, item 3.)
 */
export type Options =
  | { kind: "static"; values: PreferenceOption[] }
  | { kind: "dynamic"; source: string }; // e.g. "audio-input-devices"

/**
 * The stored value of a preference. Deliberately a union rather than `any` so the registry
 * can tell value-shapes apart.
 *
 * TODO(kelvin): the custom-theme case (Appearance) is a structured object. Decide whether to
 * widen this union, model custom themes separately, or store them as a serialized string.
 * (PROJECT.md Section 4, item 4.)
 */
export type PreferenceValue =
  | boolean //          toggle
  | string //           single_select, text
  | string[] //         multi_select, ordered_multi_select, list_builder, managed_list, entity_picker
  | TimeRangeValue; //  time_range

export interface TimeRangeValue {
  /** Which days the window applies to, e.g. "every_day" | "weekdays" | "custom". */
  days: string;
  /** 24h "HH:mm" or a token like "midnight". */
  start: string;
  end: string;
}

/**
 * The one shape every preference must conform to.
 */
export interface Preference {
  /** Stable, unique, kebab-case. NEVER the display label. */
  id: string;

  /** Canonical owner category — one of CATEGORIES. */
  category: Category;

  /** Which (fictional) team governs this preference. Used to surface ownership. */
  owner: string;

  /** Human-facing name as shown in the UI. */
  label: string;

  /** One sentence describing what it does. Feeds search + agent readability. */
  description: string;

  control: ControlType;

  /** Required for select-style controls (single/multi/ordered). Omit for toggles/text. */
  options?: Options;

  /** The default value. Its shape must match `control`. */
  default: PreferenceValue;

  /** Extra search terms ("dark mode" -> appearance theme/color-mode). */
  keywords?: string[];

  /**
   * If set, this preference is only meaningful when another preference is in a given state.
   * Three real cases: large-files↔linked-images, manual-timezone↔auto-timezone,
   * music-timing↔play-music.
   *
   * TODO(kelvin): is a single dependsOn enough, or do you need a richer condition
   * (e.g. "enabled only when X == false")? (PROJECT.md Section 4, item 2.)
   */
  dependsOn?: string;

  status?: "active" | "deprecated";
}

/** Convenience type guard the registry can use when validating value shapes. */
export function isTimeRangeValue(v: PreferenceValue): v is TimeRangeValue {
  return typeof v === "object" && v !== null && !Array.isArray(v) && "days" in v;
}
