import { adminTokenOk, clean, Env, json, logSubmission, PENDING_MEDIA_PREFIX, PENDING_UPLOAD_PREFIX } from "../../_shared";

// Review queue for anonymous family uploads, behind the same ADMIN_UPLOAD_TOKEN
// as /api/admin/site-photo-upload. POST form fields: token, action, id.
//   action=list     -> pending uploads (newest first)
//   action=media    -> the pending file's bytes, for the /admin preview
//   action=approve  -> moves the file out of pending/ and publishes it to its gallery
//   action=reject   -> deletes the pending file and record

type PendingRecord = {
  id: string;
  submittedAt: string;
  submitterName: string;
  familyBranch: string;
  caption: string;
  title: string;
  galleryTarget: string;
  reunionYear: string;
  media: { key: string; url: string; type: string; size: number };
  status: string;
};

function liveKeyFor(record: PendingRecord) {
  if (record.galleryTarget === "reunion") return `reunion-gallery-item:${record.reunionYear}:${record.id}`;
  if (record.galleryTarget === "connections") return `connection-item:${record.id}`;
  return `carousel-item:${record.id}`;
}

function liveStatusFor(record: PendingRecord) {
  if (record.galleryTarget === "reunion") return "approved_for_reunion_gallery";
  if (record.galleryTarget === "connections") return "approved_for_connections_page";
  return "approved_for_homepage_carousel";
}

async function readPending(env: Env, id: string) {
  if (!/^[0-9a-f-]{36}$/.test(id)) return null;
  const raw = await env.FAMILY_SUBMISSIONS.get(`${PENDING_UPLOAD_PREFIX}${id}`);
  return raw ? (JSON.parse(raw) as PendingRecord) : null;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const form = await request.formData();
    if (!adminTokenOk(env, clean(form.get("token"), 200))) {
      return json({ message: "Admin upload token is invalid or not configured." }, 401);
    }
    const action = clean(form.get("action"), 20);

    if (action === "list") {
      const list = await env.FAMILY_SUBMISSIONS.list({ prefix: PENDING_UPLOAD_PREFIX, limit: 200 });
      const records = await Promise.all(
        list.keys.map(async (key) => {
          const raw = await env.FAMILY_SUBMISSIONS.get(key.name);
          return raw ? (JSON.parse(raw) as PendingRecord) : null;
        })
      );
      const items = records
        .filter((record): record is PendingRecord => Boolean(record))
        .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
        .map((record) => ({
          id: record.id,
          submittedAt: record.submittedAt,
          submitterName: record.submitterName,
          familyBranch: record.familyBranch,
          caption: record.caption,
          galleryTarget: record.galleryTarget,
          reunionYear: record.reunionYear,
          type: record.media?.type || "",
          size: record.media?.size || 0
        }));
      return json({ items });
    }

    const record = await readPending(env, clean(form.get("id"), 60));
    if (!record) {
      return json({ message: "That upload is no longer waiting for review." }, 404);
    }

    if (action === "media") {
      const object = await env.FAMILY_MEDIA.get(record.media.key);
      if (!object) return json({ message: "The file for this upload is missing." }, 404);
      return new Response(object.body, {
        headers: { "content-type": record.media.type || "application/octet-stream", "cache-control": "no-store" }
      });
    }

    if (action === "approve") {
      const pendingKey = record.media.key;
      const liveKey = pendingKey.startsWith(PENDING_MEDIA_PREFIX) ? pendingKey.slice(PENDING_MEDIA_PREFIX.length) : pendingKey;
      if (liveKey !== pendingKey) {
        const object = await env.FAMILY_MEDIA.get(pendingKey);
        if (!object) return json({ message: "The file for this upload is missing." }, 404);
        await env.FAMILY_MEDIA.put(liveKey, await object.arrayBuffer(), { httpMetadata: { contentType: record.media.type || "application/octet-stream" } });
        await env.FAMILY_MEDIA.delete(pendingKey);
      }
      const url = record.media.url.replace(pendingKey, liveKey);
      const live = {
        ...record,
        media: { ...record.media, key: liveKey, url },
        status: liveStatusFor(record),
        approvedAt: new Date().toISOString()
      };
      await env.FAMILY_SUBMISSIONS.put(liveKeyFor(record), JSON.stringify(live));
      await env.FAMILY_SUBMISSIONS.delete(`${PENDING_UPLOAD_PREFIX}${record.id}`);
      await logSubmission(env, "admin-upload-approved", { id: record.id, galleryTarget: record.galleryTarget, mediaKey: liveKey });
      return json({ message: "Approved. It is now on the site.", id: record.id });
    }

    if (action === "reject") {
      await env.FAMILY_MEDIA.delete(record.media.key);
      await env.FAMILY_SUBMISSIONS.delete(`${PENDING_UPLOAD_PREFIX}${record.id}`);
      await logSubmission(env, "admin-upload-rejected", { id: record.id, galleryTarget: record.galleryTarget });
      return json({ message: "Removed. It will not appear on the site.", id: record.id });
    }

    return json({ message: "Unknown action." }, 400);
  } catch (error) {
    return json({ message: error instanceof Error ? error.message : "Review action failed." }, 400);
  }
};

export const onRequestGet: PagesFunction = async () => {
  return json({ message: "Use POST for admin upload review." }, 405);
};
