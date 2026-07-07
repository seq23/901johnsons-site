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
  "functions/api/reunion-gallery-items.ts",
  "functions/api/family-update.ts",
  "functions/api/admin/site-photo-upload.ts",
  "functions/api/site-photo.ts",
  "functions/media/[[path]].ts",
  "wrangler.toml",
  "google-apps-script/Code.gs",
  "docs/CLOUDFLARE_DEPLOYMENT.md",
  "docs/GOOGLE_APPS_SCRIPT_SETUP.md",
  ".env.cloudflare.example",
  "env.cloudflare.example",
  "components/ReunionGallery.tsx",
  "components/AdminGate.tsx",
  "components/FamilyTree.tsx",
  "components/ConnectionFeed.tsx",
  "scripts/cloudflare/setup-cloudflare.mjs",
  "scripts/cloudflare/upload-secrets.mjs",
  "scripts/cloudflare/deploy-cloudflare.mjs",
  "scripts/cloudflare/verify-bindings.mjs",
  "scripts/sync-family-tree.mjs",
  "scripts/validate-family-tree.mjs",
  "scripts/cloudflare/README.md",
  "data/sitePhotos.ts",
  "data/reunions.ts",
  "data/familyTree.ts",
  "data/connections.ts",
  "public/site-photos/site-photo-001-evelena-joe-placeholder.svg",
  "functions/api/connection-items.ts"
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

const familyHistory = readFileSync(join(root, "app/family-history/page.tsx"), "utf8");
if (!familyHistory.includes("FamilyTree") || familyHistory.includes("johnson-family-tree-mockup.png") || familyHistory.includes("PhotoSlot")) {
  console.error("[validate:structure] Family history page must use the designed FamilyTree component instead of an image mockup or old hero image.");
  process.exit(1);
}

const familyTreeData = readFileSync(join(root, "data/familyTree.ts"), "utf8");
const branchCount = (familyTreeData.match(/branchName:/g) || []).length;
const treeEntryCount = (familyTreeData.match(/"/g) || []).length / 2;
if (
  branchCount < 15 ||
  treeEntryCount < 500 ||
  !familyTreeData.includes("familyTreePersonEntryCount") ||
  !familyTreeData.includes("familyTreeExpectedPersonEntryCount = 593")
) {
  console.error("[validate:structure] Family tree data must include the full ingestion and 593-entry Google Sheet target.");
  process.exit(1);
}

const upload = readFileSync(join(root, "app/upload/page.tsx"), "utf8");
if (!upload.includes("CarouselUploadForm") || !upload.includes("FamilyAnnouncementForm")) {
  console.error("[validate:structure] Upload page is missing required forms.");
  process.exit(1);
}

const reunionData = readFileSync(join(root, "data/reunions.ts"), "utf8");
if (!reunionData.includes("1985") || !reunionData.includes("2027") || !reunionData.includes("uploadableReunions")) {
  console.error("[validate:structure] Reunion schedule must cover 1985 through 2027 and expose uploadable reunions.");
  process.exit(1);
}

const uploadForms = readFileSync(join(root, "components/UploadForms.tsx"), "utf8");
if (!uploadForms.includes('name="galleryTarget"') || !uploadForms.includes('name="reunionYear"')) {
  console.error("[validate:structure] Upload form is missing reunion gallery targeting controls.");
  process.exit(1);
}
if (!uploadForms.includes('value="connections"') || !uploadForms.includes('value="birthday"') || !uploadForms.includes('value="recipe"')) {
  console.error("[validate:structure] Upload/update forms are missing connection page self-serve options.");
  process.exit(1);
}

const reunionGalleryEndpoint = readFileSync(join(root, "functions/api/reunion-gallery-items.ts"), "utf8");
if (!reunionGalleryEndpoint.includes("reunion-gallery-item:")) {
  console.error("[validate:structure] Reunion gallery endpoint is missing KV gallery item lookup.");
  process.exit(1);
}

const connectionEndpoint = readFileSync(join(root, "functions/api/connection-items.ts"), "utf8");
if (!connectionEndpoint.includes("connection-item:")) {
  console.error("[validate:structure] Connections page endpoint is missing KV connection item lookup.");
  process.exit(1);
}

const adminPage = readFileSync(join(root, "app/admin/page.tsx"), "utf8");
const adminGate = readFileSync(join(root, "components/AdminGate.tsx"), "utf8");
if (!adminPage.includes("AdminGate") || !adminGate.includes("901Johnsons")) {
  console.error("[validate:structure] Admin page must be protected by the simple family password gate.");
  process.exit(1);
}

const wrangler = readFileSync(join(root, "wrangler.toml"), "utf8");
if (wrangler.includes("REPLACE_WITH_")) {
  console.error("[validate:structure] wrangler.toml contains placeholder Cloudflare IDs.");
  process.exit(1);
}

const appsScript = readFileSync(join(root, "google-apps-script/Code.gs"), "utf8");
if (!appsScript.includes("doPost") || !appsScript.includes("doGet") || !appsScript.includes("tree_website_mock 1") || !appsScript.includes("setupJohnsonFamilyWorkbook")) {
  console.error("[validate:structure] Apps Script bridge is missing required functions.");
  process.exit(1);
}

const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
for (const scriptName of ["cf:setup", "cf:secrets", "cf:deploy", "cf:verify-bindings"]) {
  if (!pkg.scripts?.[scriptName]) {
    console.error(`[validate:structure] Missing package script: ${scriptName}`);
    process.exit(1);
  }
}

const gitignore = readFileSync(join(root, ".gitignore"), "utf8");
if (!gitignore.includes(".env.cloudflare")) {
  console.error("[validate:structure] .env.cloudflare must be ignored.");
  process.exit(1);
}

console.log("[validate:structure] OK: repo identity, routes, Cloudflare functions/scripts, Apps Script, and photo registry present");
