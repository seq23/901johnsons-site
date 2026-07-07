import { readFileSync } from "node:fs";

const wrangler = readFileSync("wrangler.toml", "utf8");
const hex32 = /^[a-f0-9]{32}$/i;

const failures = [];

if (!wrangler.includes('binding = "FAMILY_MEDIA"')) {
  failures.push("Missing R2 binding FAMILY_MEDIA. Run npm run cf:setup before deploying production functions.");
}

if (!wrangler.includes('binding = "FAMILY_SUBMISSIONS"')) {
  failures.push("Missing KV binding FAMILY_SUBMISSIONS. Run npm run cf:setup before deploying production functions.");
}

for (const [label, pattern] of [
  ["production KV id", /id = "([^"]+)"/],
  ["preview KV id", /preview_id = "([^"]+)"/]
]) {
  const value = wrangler.match(pattern)?.[1] || "";
  if (!hex32.test(value)) {
    failures.push(`Invalid ${label}: ${value || "(missing)"}`);
  }
}

if (failures.length) {
  console.error(`[verify-bindings] FAILED\n${failures.map((item) => `- ${item}`).join("\n")}`);
  process.exit(1);
}

console.log("[verify-bindings] OK: wrangler.toml has real R2/KV bindings");
