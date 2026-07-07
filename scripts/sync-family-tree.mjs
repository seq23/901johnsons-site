import { existsSync, readFileSync, writeFileSync } from "node:fs";

const WEBHOOK_KEY = "GOOGLE_SHEETS_WEBHOOK_URL";
const SECRET_KEY = "FAMILY_UPDATE_SHARED_SECRET";
const EXPECTED_COUNT = 593;
const OUTPUT_FILE = "data/familyTree.ts";

function readDotEnv(path) {
  if (!existsSync(path)) return {};
  return Object.fromEntries(
    readFileSync(path, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const index = line.indexOf("=");
        return [line.slice(0, index), line.slice(index + 1)];
      })
  );
}

const envFile = readDotEnv(".env.cloudflare");
const webhookUrl = process.env[WEBHOOK_KEY] || envFile[WEBHOOK_KEY];
const sharedSecret = process.env[SECRET_KEY] || envFile[SECRET_KEY];

if (!webhookUrl || !sharedSecret) {
  console.error(`[family-tree:sync] Missing ${WEBHOOK_KEY} or ${SECRET_KEY}. Set them in .env.cloudflare or environment variables.`);
  process.exit(1);
}

const generationHeaders = ["Root / Gen 1", "Gen 2", "Gen 3", "Gen 4", "Gen 5", "Gen 6"];

function cleanCell(value) {
  return String(value || "")
    .replace(/[“”]/g, '"')
    .replace(/[’]/g, "'")
    .replace(/→/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function shouldSkip(value) {
  if (!value) return true;
  const setupText = [
    "JOHNSON FAMILY TREE",
    "Update PEOPLE_MASTER",
    "PEOPLE_MASTER",
    "SPOUSES_MASTER",
    "DISPLAY_TREE",
    "DISPLAY TREE",
    "Refresh steps",
    "Confirm DISPLAY",
    "Legend",
    "Branch rows",
    "Root / Gen",
    "Each square",
    "Root and branch",
    "Spouses appear",
    "website mock",
    "manual tab",
    "Photo:",
    "[Joseph line only]"
  ];
  return setupText.some((fragment) => value.includes(fragment));
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function detectGenerationColumns(rows) {
  const headerRow = rows.find((row) => row.some((cell) => cleanCell(cell).includes("Root / Gen")));
  if (!headerRow) return [0, 1, 2, 3, 4, 5];
  const indexes = [];
  headerRow.forEach((cell, index) => {
    const value = cleanCell(cell);
    if (value.includes("Root / Gen") || /^Gen [2-6]$/.test(value)) {
      indexes.push(index);
    }
  });
  return indexes.length >= 6 ? indexes.slice(0, 6) : [0, 1, 2, 3, 4, 5];
}

function parseBranches(rows) {
  const columns = detectGenerationColumns(rows);
  const branches = [];
  let current = null;

  for (const row of rows) {
    const generationCells = columns.map((index) => cleanCell(row[index]));
    const fullRow = generationCells.join(" ");
    const branchMatch = generationCells[0].match(/^([IVXLCDM]+)\s*-\s*(.+)$/);

    if (branchMatch) {
      current = {
        roman: branchMatch[1],
        branchName: branchMatch[2],
        photoLabel: `Photo placeholder: ${slugify(branchMatch[2])}.jpg`,
        generations: [[], [], [], [], [], []]
      };
      branches.push(current);
      generationCells[0] = "";
    }

    if (!current || shouldSkip(fullRow)) continue;

    generationCells.forEach((cell, index) => {
      const cleaned = cleanCell(cell.replace(/^[IVXLCDM]+\s*-\s*/, ""));
      if (shouldSkip(cleaned)) return;
      if (!current.generations[index].includes(cleaned)) {
        current.generations[index].push(cleaned);
      }
    });
  }

  return branches;
}

function countDisplayedEntries(branches) {
  return branches.reduce(
    (total, branch) => total + branch.generations.reduce((branchTotal, generation) => branchTotal + generation.length, 0),
    0
  );
}

function quote(value) {
  return JSON.stringify(value);
}

function renderTypeScript(branches, metadata) {
  const lines = [];
  lines.push("export type FamilyTreeBranch = {");
  lines.push("  roman: string;");
  lines.push("  branchName: string;");
  lines.push("  photoLabel: string;");
  lines.push("  generations: string[][];");
  lines.push("};");
  lines.push("");
  lines.push(`export const familyTreeExpectedPersonEntryCount = ${EXPECTED_COUNT};`);
  lines.push(`export const familyTreeWorkbookEntryCount = ${Number(metadata.expectedPersonEntryCount || EXPECTED_COUNT)};`);
  lines.push(`export const familyTreeSourceTab = ${quote(metadata.source || "tree_website_mock 1")};`);
  lines.push(`export const familyTreeSyncedAt = ${quote(metadata.exportedAt || new Date().toISOString())};`);
  lines.push("export const familyTreeGenerations = [\"Root / Gen 1\", \"Gen 2\", \"Gen 3\", \"Gen 4\", \"Gen 5\", \"Gen 6\"];");
  lines.push("");
  lines.push("// Generated from the connected Google Sheet tab by `npm run family-tree:sync`.");
  lines.push("// Edit the workbook first, then re-run the sync script.");
  lines.push("export const familyTreeBranches: FamilyTreeBranch[] = [");
  branches.forEach((branch, branchIndex) => {
    lines.push("  {");
    lines.push(`    roman: ${quote(branch.roman)},`);
    lines.push(`    branchName: ${quote(branch.branchName)},`);
    lines.push(`    photoLabel: ${quote(branch.photoLabel)},`);
    lines.push("    generations: [");
    branch.generations.forEach((generation, generationIndex) => {
      lines.push(`      [${generation.map(quote).join(", ")}]${generationIndex < branch.generations.length - 1 ? "," : ""}`);
    });
    lines.push("    ]");
    lines.push(`  }${branchIndex < branches.length - 1 ? "," : ""}`);
  });
  lines.push("];");
  lines.push("");
  lines.push("export const familyTreePersonEntryCount = familyTreeBranches.reduce(");
  lines.push("  (total, branch) => total + branch.generations.reduce((branchTotal, generation) => branchTotal + generation.length, 0),");
  lines.push("  0");
  lines.push(");");
  lines.push("");
  return `${lines.join("\n")}\n`;
}

const url = new URL(webhookUrl);
url.searchParams.set("action", "family-tree");
url.searchParams.set("sharedSecret", sharedSecret);

const response = await fetch(url);
const payload = await response.json();
if (!response.ok || !payload.ok) {
  console.error(`[family-tree:sync] Apps Script export failed: ${payload.message || response.status}`);
  process.exit(1);
}

const branches = parseBranches(payload.rows || []);
const displayedCount = countDisplayedEntries(branches);
if (branches.length < 15) {
  console.error(`[family-tree:sync] Expected at least 15 branches, found ${branches.length}.`);
  process.exit(1);
}

writeFileSync(OUTPUT_FILE, renderTypeScript(branches, payload));
console.log(`[family-tree:sync] Wrote ${OUTPUT_FILE}`);
console.log(`[family-tree:sync] Branches: ${branches.length}`);
console.log(`[family-tree:sync] Displayed tree cells: ${displayedCount}`);
console.log(`[family-tree:sync] Expected workbook people: ${payload.expectedPersonEntryCount || EXPECTED_COUNT}`);
console.log("[family-tree:sync] Next: npm run validate:family-tree");
