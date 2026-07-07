import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const required = [
  "REPO_IDENTITY.md",
  "README.md",
  "package.json",
  "app/page.tsx",
  "app/upload/page.tsx",
  "app/reunions/page.tsx",
  "app/reunions/[slug]/page.tsx",
  "app/family-history/page.tsx",
  "app/connections/page.tsx",
  "app/admin/page.tsx",
  "functions/api/carousel-upload.ts",
  "functions/api/carousel-items.ts",
  "functions/api/family-update.ts",
  "functions/api/admin/site-photo-upload.ts",
  "functions/api/site-photo.ts",
  "functions/media/[[path]].ts",
  "wrangler.toml",
  "google-apps-script/Code.gs",
  "docs/CLOUDFLARE_DEPLOYMENT.md",
  "docs/GOOGLE_APPS_SCRIPT_SETUP.md",
  "data/sitePhotos.ts",
  "data/reunions.ts",
  "public/site-photos/site-photo-001-evelena-joe-placeholder.svg"
];

const missing = required.filter((file) => !existsSync(join(root, file)));
if (missing.length) {
  console.error(`[validate:structure] Missing files:\n${missing.join("\n")}`);
  process.exit(1);
}

const photoRegistry = readFileSync(join(root, "data/sitePhotos.ts"), "utf8");
const slotCount = (photoRegistry.match(/id: "site-photo-/g) || []).length;
if (slotCount < 10) {
  console.error(`[validate:structure] Expected at least 10 site photo slots, found ${slotCount}`);
  process.exit(1);
}

const home = readFileSync(join(root, "app/page.tsx"), "utf8");
if (!home.includes("Evelena Johnson") && !home.includes("rootAncestors")) {
  console.error("[validate:structure] Homepage does not reference root ancestors.");
  process.exit(1);
}

const upload = readFileSync(join(root, "app/upload/page.tsx"), "utf8");
if (!upload.includes("CarouselUploadForm") || !upload.includes("FamilyAnnouncementForm")) {
  console.error("[validate:structure] Upload page is missing required forms.");
  process.exit(1);
}

const wrangler = readFileSync(join(root, "wrangler.toml"), "utf8");
if (!wrangler.includes("FAMILY_MEDIA") || !wrangler.includes("FAMILY_SUBMISSIONS")) {
  console.error("[validate:structure] Cloudflare R2/KV bindings are missing.");
  process.exit(1);
}

const appsScript = readFileSync(join(root, "google-apps-script/Code.gs"), "utf8");
if (!appsScript.includes("doPost") || !appsScript.includes("setupJohnsonFamilyWorkbook")) {
  console.error("[validate:structure] Apps Script bridge is missing required functions.");
  process.exit(1);
}

console.log("[validate:structure] OK: repo identity, routes, Cloudflare functions, Apps Script, and photo registry present");
