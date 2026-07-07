import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..", "..");
const projectName = process.env.CF_PAGES_PROJECT || "901johnsons-site";
const envPath = join(root, ".env.cloudflare");

if (!existsSync(envPath)) {
  console.error("Missing .env.cloudflare.");
  console.error("Create it from .env.cloudflare.example and fill in real values first.");
  process.exit(1);
}

console.log(`Uploading Pages secrets/env vars from .env.cloudflare to ${projectName}.`);
execFileSync(
  "npx",
  ["wrangler", "pages", "secret", "bulk", ".env.cloudflare", "--project-name", projectName],
  {
    cwd: root,
    stdio: "inherit"
  }
);
console.log("Cloudflare Pages secrets uploaded.");
