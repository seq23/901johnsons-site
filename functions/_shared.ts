type JsonRecord = Record<string, unknown>;

export type Env = {
  FAMILY_MEDIA: R2Bucket;
  FAMILY_SUBMISSIONS: KVNamespace;
  GOOGLE_SHEETS_WEBHOOK_URL?: string;
  ADMIN_UPLOAD_TOKEN?: string;
  FAMILY_UPDATE_SHARED_SECRET?: string;
  R2_PUBLIC_BASE_URL?: string;
};

const imageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const videoTypes = new Set(["video/mp4", "video/quicktime", "video/webm"]);

export function json(payload: JsonRecord, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

export function clean(value: FormDataEntryValue | null, max = 2000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function assertMedia(file: File, mode: "image" | "imageOrVideo") {
  const allowed = mode === "image" ? imageTypes : new Set([...imageTypes, ...videoTypes]);
  if (!allowed.has(file.type)) {
    throw new Error(`Unsupported file type: ${file.type || "unknown"}`);
  }
  const maxBytes = mode === "image" ? 8 * 1024 * 1024 : 75 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error(`File is too large. Max size is ${Math.round(maxBytes / 1024 / 1024)}MB.`);
  }
}

export function extensionFor(file: File) {
  const fromName = file.name.toLowerCase().match(/\.[a-z0-9]+$/)?.[0];
  if (fromName) return fromName.replace(/[^.a-z0-9]/g, "");
  if (file.type === "image/jpeg") return ".jpg";
  if (file.type === "image/png") return ".png";
  if (file.type === "image/webp") return ".webp";
  if (file.type === "image/gif") return ".gif";
  if (file.type === "video/mp4") return ".mp4";
  if (file.type === "video/webm") return ".webm";
  return ".bin";
}

export async function putMedia(env: Env, file: File, prefix: string) {
  const key = `${prefix}/${Date.now()}-${crypto.randomUUID()}${extensionFor(file)}`;
  await env.FAMILY_MEDIA.put(key, file.stream(), {
    httpMetadata: {
      contentType: file.type || "application/octet-stream"
    }
  });
  return {
    key,
    url: env.R2_PUBLIC_BASE_URL ? `${env.R2_PUBLIC_BASE_URL.replace(/\/$/, "")}/${key}` : `/media/${key}`,
    type: file.type,
    size: file.size
  };
}

export async function logSubmission(env: Env, prefix: string, payload: JsonRecord) {
  const key = `${prefix}:${Date.now()}:${crypto.randomUUID()}`;
  await env.FAMILY_SUBMISSIONS.put(key, JSON.stringify(payload));
  return key;
}

export async function postToGoogleSheets(env: Env, payload: JsonRecord) {
  if (!env.GOOGLE_SHEETS_WEBHOOK_URL) {
    return { sent: false, status: "missing_webhook" };
  }
  const response = await fetch(env.GOOGLE_SHEETS_WEBHOOK_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      ...payload,
      sharedSecret: env.FAMILY_UPDATE_SHARED_SECRET || ""
    })
  });
  if (!response.ok) {
    throw new Error(`Google Apps Script rejected the submission: ${response.status}`);
  }
  return { sent: true, status: response.status };
}

function tokenMatches(expected: string, provided: string) {
  if (!expected || !provided) return false;
  const a = new TextEncoder().encode(expected);
  const b = new TextEncoder().encode(provided);
  let diff = a.length ^ b.length;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ (b[i % (b.length || 1)] ?? 0);
  return diff === 0;
}

/**
 * Admin token check shared by every /api/admin route. Fails closed when
 * ADMIN_UPLOAD_TOKEN is not configured; compares in constant time; locks an IP
 * out for 15 minutes after 10 wrong tokens. Returns a 401/429 response, or null
 * when the token is good.
 */
export const ADMIN_LOCKOUT = { maxFails: 10, windowSeconds: 900 };

export async function adminTokenCheck(env: Env, request: Request, provided: string) {
  const failKey = `admin-fail:${await ipHash(request)}`;
  const fails = Number((await env.FAMILY_SUBMISSIONS.get(failKey)) || 0);
  if (fails >= ADMIN_LOCKOUT.maxFails) {
    return json({ message: "Too many wrong tokens. Please wait 15 minutes and try again." }, 429);
  }
  if (tokenMatches(env.ADMIN_UPLOAD_TOKEN || "", provided)) return null;
  await env.FAMILY_SUBMISSIONS.put(failKey, String(fails + 1), { expirationTtl: ADMIN_LOCKOUT.windowSeconds });
  return json({ message: "Admin upload token is invalid or not configured." }, 401);
}

async function ipHash(request: Request) {
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`901johnsons:${ip}`));
  return Array.from(new Uint8Array(digest).slice(0, 12), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Daily limits for anonymous public forms (3 Nov 2026 security sweep): a
 * per-IP count and a global count per UTC day, kept in KV with a 2-day TTL.
 * The IP is stored only as a SHA-256 hash. Call checkDailyLimit before doing
 * work and countDailyUse after the submission was stored.
 */
export type DailyLimit = { kind: string; perIp: number; global: number };

async function limitKeys(request: Request, limit: DailyLimit) {
  const day = new Date().toISOString().slice(0, 10);
  return {
    ipKey: `ratelimit:${limit.kind}:ip:${await ipHash(request)}:${day}`,
    globalKey: `ratelimit:${limit.kind}:all:${day}`
  };
}

export async function checkDailyLimit(env: Env, request: Request, limit: DailyLimit) {
  const { ipKey, globalKey } = await limitKeys(request, limit);
  const [ipCount, globalCount] = await Promise.all([env.FAMILY_SUBMISSIONS.get(ipKey), env.FAMILY_SUBMISSIONS.get(globalKey)]);
  if (Number(ipCount || 0) >= limit.perIp) {
    return json({ message: "You have reached today's limit for this form. Please try again tomorrow." }, 429);
  }
  if (Number(globalCount || 0) >= limit.global) {
    return json({ message: "The family site has received a lot of submissions today. Please try again tomorrow." }, 429);
  }
  return null;
}

export async function countDailyUse(env: Env, request: Request, limit: DailyLimit) {
  const { ipKey, globalKey } = await limitKeys(request, limit);
  const [ipCount, globalCount] = await Promise.all([env.FAMILY_SUBMISSIONS.get(ipKey), env.FAMILY_SUBMISSIONS.get(globalKey)]);
  await Promise.all([
    env.FAMILY_SUBMISSIONS.put(ipKey, String(Number(ipCount || 0) + 1), { expirationTtl: 172800 }),
    env.FAMILY_SUBMISSIONS.put(globalKey, String(Number(globalCount || 0) + 1), { expirationTtl: 172800 })
  ]);
}

/** Media under this R2 prefix is awaiting admin review and is never served publicly. */
export const PENDING_MEDIA_PREFIX = "pending/";
/** KV prefix for anonymous uploads awaiting review. Public feeds list other prefixes only. */
export const PENDING_UPLOAD_PREFIX = "pending-upload:";
