/**
 * scripts/print-registry.ts
 *
 * Prints the full registry as JSON to stdout — the stand-in for
 * "an AI agent can read the state of every preference."
 *
 * Usage:
 *   npm run export-registry
 *   npm run export-registry > registry-snapshot.json
 *
 * Summary lines go to stderr so they don't contaminate the JSON stream
 * when the output is piped or redirected.
 */

import { buildRegistry } from "../src/registry/registry.js";

const registry = buildRegistry();
const warnings = registry.getWarnings();
const json = registry.toJSON();
const prefs = Object.values(json);

const byCategory = prefs.reduce<Record<string, number>>((acc, p) => {
  acc[p.category] = (acc[p.category] ?? 0) + 1;
  return acc;
}, {});

process.stderr.write(`Preferences Closet — registry snapshot\n`);
process.stderr.write(`  Total preferences : ${prefs.length}\n`);
process.stderr.write(`  Categories        : ${Object.keys(byCategory).length}\n`);

for (const [cat, count] of Object.entries(byCategory).sort()) {
  process.stderr.write(`    ${cat.padEnd(24)} ${count}\n`);
}

if (warnings.length > 0) {
  process.stderr.write(`\nWarnings (${warnings.length}):\n`);
  for (const w of warnings) {
    process.stderr.write(`  [${w.ids.join(", ")}] ${w.reason}\n`);
  }
}

process.stderr.write(`\n`);

process.stdout.write(JSON.stringify(json, null, 2) + "\n");
