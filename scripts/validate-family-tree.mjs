import { readFileSync } from "node:fs";

const source = readFileSync("data/familyTree.ts", "utf8");
const required = [
  "familyTreeExpectedPersonEntryCount = 593",
  "familyTreeWorkbookEntryCount = 593",
  "familyTreeSourceTab",
  "tree_website_mock 1",
  "familyTreePersonEntryCount"
];

const missing = required.filter((fragment) => !source.includes(fragment));
if (missing.length) {
  console.error(`[validate:family-tree] Missing synced family tree markers:\n${missing.join("\n")}`);
  console.error("[validate:family-tree] Run npm run family-tree:sync after deploying the updated Apps Script.");
  process.exit(1);
}

const branchCount = (source.match(/branchName:/g) || []).length;
if (branchCount < 15) {
  console.error(`[validate:family-tree] Expected at least 15 branches, found ${branchCount}.`);
  process.exit(1);
}

console.log("[validate:family-tree] OK: family tree is wired to the 593-entry Google Sheet source");
