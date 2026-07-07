import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..", "..");
const projectName = process.env.CF_PAGES_PROJECT || "901johnsons-site";
const outDir = join(root, "out");

function run(args) {
  console.log(`\n$ ${args.join(" ")}`);
  execFileSync(args[0], args.slice(1), { cwd: root, stdio: "inherit" });
}

run(["npm", "run", "validate:structure"]);
run(["npm", "run", "cf:verify-bindings"]);
run(["npm", "run", "pages:build"]);

if (!existsSync(outDir)) {
  console.error("Build did not produce out/. Deployment stopped.");
  process.exit(1);
}

run(["npx", "wrangler", "pages", "deploy", "out", "--project-name", projectName]);
