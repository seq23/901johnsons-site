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
