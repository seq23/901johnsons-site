// Behaviour test for anonymous family uploads (3 Nov 2026 security sweep).
// Anonymous upload -> stored pending, absent from every public feed and /media;
// over the per-IP or global daily limit -> 429; approved via the token-gated
// admin route -> appears in its gallery. Bundles the real Pages Functions with
// esbuild and runs them against in-memory KV and R2.
import { build } from "esbuild";
import assert from "node:assert/strict";
import { mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const outdir = mkdtempSync(join(tmpdir(), "901j-test-"));
const entries = {
  upload: "functions/api/carousel-upload.ts",
  carouselItems: "functions/api/carousel-items.ts",
  reunionItems: "functions/api/reunion-gallery-items.ts",
  connectionItems: "functions/api/connection-items.ts",
  media: "functions/media/[[path]].ts",
  review: "functions/api/admin/pending-uploads.ts",
  familyUpdate: "functions/api/family-update.ts"
};

function fakeKv() {
  const store = new Map();
  return {
    store,
    async get(key) {
      return store.has(key) ? store.get(key) : null;
    },
    async put(key, value) {
      store.set(key, String(value));
    },
    async delete(key) {
      store.delete(key);
    },
    async list({ prefix = "", limit = 1000 } = {}) {
      return { keys: [...store.keys()].filter((key) => key.startsWith(prefix)).sort().slice(0, limit).map((name) => ({ name })) };
    }
  };
}

function fakeR2() {
  const store = new Map();
  return {
    store,
    async put(key, body, options) {
      const bytes = new Uint8Array(await new Response(body).arrayBuffer());
      store.set(key, { bytes, contentType: options?.httpMetadata?.contentType || "" });
    },
    async get(key) {
      const entry = store.get(key);
      if (!entry) return null;
      return {
        body: new Blob([entry.bytes]).stream(),
        httpEtag: '"x"',
        size: entry.bytes.length,
        arrayBuffer: async () => entry.bytes.buffer.slice(0),
        writeHttpMetadata: (headers) => headers.set("content-type", entry.contentType)
      };
    },
    async delete(key) {
      store.delete(key);
    }
  };
}

let failures = 0;
async function check(name, fn) {
  try {
    await fn();
    console.log(`ok   ${name}`);
  } catch (error) {
    failures += 1;
    console.log(`FAIL ${name}: ${error.message}`);
  }
}

try {
  await build({
    entryPoints: entries,
    outdir,
    bundle: true,
    format: "esm",
    platform: "neutral",
    outExtension: { ".js": ".mjs" },
    logLevel: "silent"
  });
  const mod = {};
  for (const name of Object.keys(entries)) mod[name] = await import(pathToFileURL(join(outdir, `${name}.mjs`)).href);

  const TOKEN = "test-admin-token-123";
  const freshEnv = () => ({ FAMILY_SUBMISSIONS: fakeKv(), FAMILY_MEDIA: fakeR2(), ADMIN_UPLOAD_TOKEN: TOKEN });

  const uploadRequest = (ip, fields = {}) => {
    const form = new FormData();
    form.set("media", new File([new Uint8Array([1, 2, 3, 4])], "photo.jpg", { type: "image/jpeg" }));
    form.set("submitterName", "Cousin Test");
    form.set("galleryTarget", "homepage");
    for (const [key, value] of Object.entries(fields)) form.set(key, value);
    return new Request("https://901johnsons.com/api/carousel-upload", {
      method: "POST",
      body: form,
      headers: { "cf-connecting-ip": ip }
    });
  };
  const upload = (env, ip, fields) => mod.upload.onRequestPost({ request: uploadRequest(ip, fields), env });
  const feed = async (env) => {
    const carousel = await (await mod.carouselItems.onRequestGet({ env, request: new Request("https://x/api/carousel-items") })).json();
    const reunion = await (
      await mod.reunionItems.onRequestGet({ env, request: new Request("https://x/api/reunion-gallery-items?year=2025") })
    ).json();
    const connections = await (await mod.connectionItems.onRequestGet({ env, request: new Request("https://x/api/connection-items") })).json();
    return [...carousel.items, ...reunion.items, ...connections.items];
  };
  const review = (env, fields) => {
    const form = new FormData();
    for (const [key, value] of Object.entries(fields)) form.set(key, value);
    return mod.review.onRequestPost({ request: new Request("https://x/api/admin/pending-uploads", { method: "POST", body: form }), env });
  };
  const mediaGet = (env, key) => mod.media.onRequestGet({ env, params: { path: key.split("/") } });

  await check("anonymous upload is stored pending and is not public", async () => {
    const env = freshEnv();
    for (const target of [{ galleryTarget: "homepage" }, { galleryTarget: "reunion", reunionYear: "2025" }, { galleryTarget: "connections" }]) {
      const response = await upload(env, "203.0.113.1", target);
      assert.equal(response.status, 200, `upload ${target.galleryTarget} -> ${response.status}`);
    }
    const pending = [...env.FAMILY_SUBMISSIONS.store.keys()].filter((key) => key.startsWith("pending-upload:"));
    assert.equal(pending.length, 3, "three pending records");
    assert.equal((await feed(env)).length, 0, "public feeds must show no pending upload");
    const mediaKeys = [...env.FAMILY_MEDIA.store.keys()];
    assert.equal(mediaKeys.length, 3);
    for (const key of mediaKeys) assert.equal((await mediaGet(env, key)).status, 404, `pending media ${key} must not be served`);
  });

  await check("over the per-IP daily limit -> 429", async () => {
    const env = freshEnv();
    for (let i = 0; i < 10; i++) assert.equal((await upload(env, "203.0.113.2")).status, 200, `upload ${i + 1}`);
    assert.equal((await upload(env, "203.0.113.2")).status, 429);
    assert.equal((await upload(env, "203.0.113.3")).status, 200, "another visitor is not blocked");
  });

  await check("over the global daily cap -> 429", async () => {
    const env = freshEnv();
    for (let i = 0; i < 100; i++) assert.equal((await upload(env, `198.51.100.${i}`)).status, 200, `upload ${i + 1}`);
    assert.equal((await upload(env, "192.0.2.200")).status, 429);
  });

  await check("family update over the per-IP daily limit -> 429", async () => {
    const env = freshEnv();
    const send = () => {
      const form = new FormData();
      form.set("updateType", "birthday");
      form.set("primaryNames", "Test Person");
      form.set("submittedBy", "Cousin Test");
      form.set("contact", "555-0100");
      return mod.familyUpdate.onRequestPost({
        env,
        request: new Request("https://x/api/family-update", { method: "POST", body: form, headers: { "cf-connecting-ip": "203.0.113.9" } })
      });
    };
    for (let i = 0; i < 10; i++) assert.equal((await send()).status, 200, `update ${i + 1}`);
    assert.equal((await send()).status, 429);
  });

  await check("review route needs the admin token; approve publishes, reject removes", async () => {
    const env = freshEnv();
    await upload(env, "203.0.113.4", { galleryTarget: "reunion", reunionYear: "2025", caption: "Picnic" });
    await upload(env, "203.0.113.4");
    assert.equal((await review(env, { action: "list" })).status, 401, "no token");
    assert.equal((await review(env, { action: "list", token: "wrong" })).status, 401, "wrong token");
    assert.equal((await review({ ...env, ADMIN_UPLOAD_TOKEN: undefined }, { action: "list", token: "" })).status, 401, "unset token fails closed");
    const listed = await (await review(env, { action: "list", token: TOKEN })).json();
    assert.equal(listed.items.length, 2);
    const reunionItem = listed.items.find((item) => item.galleryTarget === "reunion");
    const other = listed.items.find((item) => item.galleryTarget === "homepage");
    assert.equal((await review(env, { action: "media", id: reunionItem.id, token: TOKEN })).status, 200, "admin preview");
    assert.equal((await review(env, { action: "approve", id: reunionItem.id })).status, 401, "approve without token");
    assert.equal((await feed(env)).length, 0);
    assert.equal((await review(env, { action: "approve", id: reunionItem.id, token: TOKEN })).status, 200);
    const visible = await feed(env);
    assert.equal(visible.length, 1, "approved upload appears");
    assert.equal(visible[0].id, reunionItem.id);
    const liveKey = visible[0].src.replace(/^\/media\//, "");
    assert.ok(!liveKey.startsWith("pending/"), "approved media left pending/");
    assert.equal((await mediaGet(env, liveKey)).status, 200, "approved media is served");
    assert.equal((await review(env, { action: "reject", id: other.id, token: TOKEN })).status, 200);
    assert.equal((await feed(env)).length, 1, "rejected upload never appears");
    assert.equal([...env.FAMILY_MEDIA.store.keys()].filter((key) => key.startsWith("pending/")).length, 0, "no pending media left");
  });
  await check("admin token: 10 wrong tries from one IP -> 429 lockout, even with the right token", async () => {
    const env = freshEnv();
    const tryToken = (token, ip) => {
      const form = new FormData();
      form.set("token", token);
      form.set("action", "list");
      return mod.review.onRequestPost({
        env,
        request: new Request("https://x/api/admin/pending-uploads", { method: "POST", body: form, headers: { "cf-connecting-ip": ip } })
      });
    };
    for (let i = 0; i < 10; i++) assert.equal((await tryToken(`guess-${i}`, "203.0.113.50")).status, 401, `wrong try ${i + 1}`);
    assert.equal((await tryToken("guess-x", "203.0.113.50")).status, 429, "11th wrong try");
    assert.equal((await tryToken(TOKEN, "203.0.113.50")).status, 429, "locked IP stays locked for the window");
    assert.equal((await tryToken(TOKEN, "203.0.113.51")).status, 200, "another IP with the right token gets in");
  });

  await check("admin page holds no client-side secret and is checked by the server", async () => {
    const files = [];
    for (const dir of ["app", "components"]) {
      for (const entry of readdirSync(join(root, dir), { recursive: true })) {
        if (/\.(tsx?|jsx?)$/.test(entry)) files.push(join(dir, entry));
      }
    }
    for (const file of files) {
      const source = readFileSync(join(root, file), "utf8");
      assert.ok(!/ADMIN_PASSWORD|901Johnsons["']/.test(source), `${file} carries an admin password`);
      assert.ok(!/(password|token)\s*===\s*["'`]/i.test(source), `${file} compares a password/token to a literal`);
    }
    const gate = readFileSync(join(root, "components/AdminGate.tsx"), "utf8");
    assert.ok(gate.includes("/api/admin/"), "AdminGate must check the token with the server");
  });
} catch (error) {
  failures += 1;
  console.log(`FAIL setup: ${error.message}`);
} finally {
  rmSync(outdir, { recursive: true, force: true });
}

if (failures) {
  console.log(`${failures} check(s) failed`);
  process.exit(1);
}
console.log("upload moderation: all checks passed");
