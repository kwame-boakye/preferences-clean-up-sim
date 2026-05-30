import type { Preference } from "../../src/registry/types.js";

export const slackAiPreferences: Preference[] = [
  {
    id: "slack-ai-stream-summaries",
    category: "slack-ai",
    owner: "ai-team",
    label: "Stream channel summaries",
    description: "Use Slack AI to generate live summaries of channel activity as you read.",
    control: "toggle",
    default: true,
    keywords: ["slack ai", "summaries", "ai", "channel", "stream"],
    status: "active",
  },
];
