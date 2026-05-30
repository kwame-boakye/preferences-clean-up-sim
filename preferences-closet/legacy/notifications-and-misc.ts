/**
 * legacy/notifications-and-misc.ts
 *
 * !!! THIS IS THE DELIBERATE MESS — DO NOT CLEAN IN PLACE. Migrate FROM it. !!!
 *
 * Notes from whoever wrote this (multiple people, over time):
 *   - keyed by `key`, but some use `title`, some use `name`, some have neither
 *   - no categories — "everyone knows where notification stuff goes" (we do not)
 *   - the Availability working-hours thing got dumped here too, idk why
 *   - HEADS UP: the "vip paused" toggle is ALSO defined in random-team-additions.ts.
 *     Nobody noticed. They have different keys and slightly different wording.
 */

export const notificationPrefs = [
  { key: "desktop_notifs", title: "Desktop notifications", on: true },
  { key: "mobile_notifs", title: "Mobile notifications", on: true },

  // What to notify about — a dropdown, options inlined as a comment lol
  // options: all messages | mentions and DMs | nothing
  { key: "notify_about", title: "Mentions and direct messages", type: "dropdown", value: "mentions_dms" },

  { key: "thread_replies", title: "Thread replies", on: true },

  // ▼▼▼ DUPLICATE #1 (the other copy is in random-team-additions.ts as "vipAlwaysAllow") ▼▼▼
  { key: "vip_when_paused", title: "Messages from VIPs, even if notifications are paused", on: false },
  // ▲▲▲

  { key: "new_huddles", name: "New huddles", on: true }, // note: `name` not `title`
  { key: "mobile_overrides", title: "Set up mobile overrides", on: false },

  // activity feed group
  { key: "act_dms", title: "DMs and Group DMs", on: true },
  { key: "act_all_posts", title: "Channels set to All new posts", on: true },
  { key: "act_later", title: "Reminders when Later items are due", on: true },

  // free text, comma separated, "not case sensitive" per the UI
  { key: "channel_keywords", title: "Channel keywords", type: "text", value: "" },

  // these two are clearly a pair (one gates the other) but nothing records that
  { key: "reminder_time", title: "Default reminder time", type: "dropdown", value: "9:00 AM" },
  { key: "mobile_push_when", title: "Send to mobile when inactive", type: "dropdown", value: "asap_inactive" },
  { key: "mobile_2week_summary", title: "2-week inactivity summary push", on: true },

  { key: "msg_preview_in_notif", title: "Include a preview of the message in each notification", on: true },
  { key: "mute_messaging_sounds", title: "Mute all messaging sounds from Slack", on: false },
  { key: "mute_huddle_sounds", title: "Mute all huddle sounds from Slack", on: false },
  { key: "huddle_notif_sound", title: "Notification sound (huddles)", type: "dropdown", value: "Boop Plus" },
];

// ...and the working-hours stuff someone parked here. Three fields, one idea.
export const workingHours = {
  days: "every_day",
  start: "12:00 AM",
  end: "midnight",
  // automatic statuses — three independent toggles
  status_huddle: true,
  status_focus: true,
  status_after_hours: false,
};
