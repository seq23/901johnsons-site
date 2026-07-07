import { existsSync, readFileSync, writeFileSync } from "node:fs";

const setupPath = "scripts/cloudflare/setup-cloudflare.mjs";
const validatePath = "scripts/validate-structure.mjs";
const readmePath = "scripts/cloudflare/README.md";

const envExample = `ADMIN_UPLOAD_TOKEN=replace-with-long-random-admin-password
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/REPLACE_WITH_DEPLOYMENT_ID/exec
FAMILY_UPDATE_SHARED_SECRET=replace-with-long-random-shared-secret
NEXT_PUBLIC_SITE_URL=https://901johnsons.com
# Optional. Leave blank to serve R2 files through the included /media/* function.
R2_PUBLIC_BASE_URL=
`;

if (!existsSync(setupPath)) {
  console.error(`Missing ${setupPath}. Run this from the repo root.`);
  process.exit(1);
}

writeFileSync(".env.cloudflare.example", envExample);
writeFileSync("env.cloudflare.example", envExample);

let setup = readFileSync(setupPath, "utf8");

if (!setup.includes("const defaultCloudflareEnv = `")) {
  setup = setup.replace(
    'const productionBranch = process.env.CF_PRODUCTION_BRANCH || "main";',
    `const productionBranch = process.env.CF_PRODUCTION_BRANCH || "main";
const defaultCloudflareEnv = \`${envExample}\`;`
  );
}

const start = setup.indexOf("function ensureEnvFile()");
if (start === -1) {
  console.error("Could not find ensureEnvFile() in setup-cloudflare.mjs.");
  process.exit(1);
}

const nextFunction = setup.indexOf("\nfunction ", start + 1);
if (nextFunction === -1) {
  console.error("Could not find function boundary after ensureEnvFile().");
  process.exit(1);
}

const newEnsureEnvFile = `function ensureEnvFile() {
  const envFile = join(root, ".env.cloudflare");
  const example = join(root, ".env.cloudflare.example");
  const portableExample = join(root, "env.cloudflare.example");

  if (!existsSync(envFile)) {
    const source = existsSync(example)
      ? readFileSync(example, "utf8")
      : existsSync(portableExample)
        ? readFileSync(portableExample, "utf8")
        : defaultCloudflareEnv;

    writeFileSync(envFile, source);
    console.log("\\nCreated .env.cloudflare.");
    console.log("Edit it before running npm run cf:secrets.");
  }
}
`;

setup = setup.slice(0, start) + newEnsureEnvFile + setup.slice(nextFunction);
writeFileSync(setupPath, setup);

if (existsSync(validatePath)) {
  let validate = readFileSync(validatePath, "utf8");
  if (!validate.includes('"env.cloudflare.example"')) {
    validate = validate.replace(
      '  ".env.cloudflare.example",',
      '  ".env.cloudflare.example",\n  "env.cloudflare.example",'
    );
  }
  writeFileSync(validatePath, validate);
}

if (existsSync(readmePath)) {
  let readme = readFileSync(readmePath, "utf8");
  readme = readme.replace(
    "- create `.env.cloudflare` from `.env.cloudflare.example` if missing.",
    "- create `.env.cloudflare` from `.env.cloudflare.example`, `env.cloudflare.example`, or built-in defaults if missing."
  );
  writeFileSync(readmePath, readme);
}

const finalSetup = readFileSync(setupPath, "utf8");
if (!finalSetup.includes("defaultCloudflareEnv") || !finalSetup.includes("portableExample")) {
  console.error("Patch verification failed: env fallback did not land.");
  process.exit(1);
}

console.log("Patch applied and verified: env fallback fix installed.");
