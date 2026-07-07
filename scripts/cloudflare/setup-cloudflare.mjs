import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..", "..");
const projectName = process.env.CF_PAGES_PROJECT || "901johnsons-site";
const bucketName = process.env.CF_R2_BUCKET || "901johnsons-family-media";
const kvName = process.env.CF_KV_NAMESPACE || "901johnsons-family-submissions";
const productionBranch = process.env.CF_PRODUCTION_BRANCH || "main";
const defaultCloudflareEnv = `ADMIN_UPLOAD_TOKEN=replace-with-long-random-admin-password
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/REPLACE_WITH_DEPLOYMENT_ID/exec
FAMILY_UPDATE_SHARED_SECRET=replace-with-long-random-shared-secret
NEXT_PUBLIC_SITE_URL=https://901johnsons.com
# Optional. Leave blank to serve R2 files through the included /media/* function.
R2_PUBLIC_BASE_URL=
`;

function run(args, options = {}) {
  const command = ["wrangler", ...args];
  console.log(`\n$ npx ${command.join(" ")}`);
  try {
    return execFileSync("npx", command, {
      cwd: root,
      encoding: "utf8",
      stdio: options.capture ? ["ignore", "pipe", "pipe"] : "inherit"
    });
  } catch (error) {
    if (options.allowFailure) {
      const stdout = error.stdout?.toString?.() || "";
      const stderr = error.stderr?.toString?.() || "";
      console.warn(`${stdout}${stderr}`.trim());
      return `${stdout}\n${stderr}`;
    }
    throw error;
  }
}

function extractNamespaceId(output) {
  const jsonMatch = output.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.id) return parsed.id;
    } catch {
      // Fall through to regex output parsing.
    }
  }
  const idMatch =
    output.match(/id\s*=\s*"([^"]+)"/i) ||
    output.match(/"id"\s*:\s*"([^"]+)"/i) ||
    output.match(/([a-f0-9]{32})/i);
  return idMatch?.[1] || "";
}

function findNamespaceIdByTitle(title) {
  const output = run(["kv", "namespace", "list"], {
    capture: true,
    allowFailure: true
  });
  try {
    const namespaces = JSON.parse(output);
    const match = namespaces.find((item) => item.title === title);
    return match?.id || "";
  } catch {
    return "";
  }
}

function ensureEnvFile() {
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
    console.log("\nCreated .env.cloudflare.");
    console.log("Edit it before running npm run cf:secrets.");
  }
}

function patchWrangler(prodId, previewId) {
  const wranglerPath = join(root, "wrangler.toml");
  let toml = readFileSync(wranglerPath, "utf8");
  toml = toml
    .replace(/\n\[\[r2_buckets\]\][\s\S]*?(?=\n\[\[|\n\[|$)/g, "")
    .replace(/\n\[\[kv_namespaces\]\][\s\S]*?(?=\n\[\[|\n\[|$)/g, "")
    .trimEnd();
  toml += `\n\n[[r2_buckets]]
binding = "FAMILY_MEDIA"
bucket_name = "${bucketName}"

[[kv_namespaces]]
binding = "FAMILY_SUBMISSIONS"
id = "${prodId}"
preview_id = "${previewId}"
`;
  writeFileSync(wranglerPath, toml);
  console.log("\nUpdated wrangler.toml with Cloudflare resource bindings.");
}

function main() {
  console.log("901johnsons Cloudflare setup");
  console.log("This creates/ensures Pages project, R2 bucket, KV namespaces, and patches wrangler.toml.");

  run(["--version"]);

  run(["pages", "project", "create", projectName, "--production-branch", productionBranch], {
    allowFailure: true
  });

  run(["r2", "bucket", "create", bucketName], { allowFailure: true });

  const prodOutput = run(["kv", "namespace", "create", kvName], {
    capture: true,
    allowFailure: true
  });
  const previewOutput = run(["kv", "namespace", "create", kvName, "--preview"], {
    capture: true,
    allowFailure: true
  });

  const prodId = extractNamespaceId(prodOutput);
  const previewId = extractNamespaceId(previewOutput);
  const resolvedProdId = prodId || findNamespaceIdByTitle(kvName);
  const resolvedPreviewId = previewId || findNamespaceIdByTitle(`${kvName}_preview`);

  if (!resolvedProdId || !resolvedPreviewId) {
    console.error("\nCould not parse one or both KV namespace IDs from Wrangler output.");
    console.error("Open the command output above, copy the IDs, and replace them in wrangler.toml.");
    process.exit(1);
  }

  patchWrangler(resolvedProdId, resolvedPreviewId);
  ensureEnvFile();

  console.log("\nDone.");
  console.log("Next terminal step after editing .env.cloudflare:");
  console.log("npm run cf:secrets");
  console.log("Then deploy with:");
  console.log("npm run cf:deploy");
}

main();
