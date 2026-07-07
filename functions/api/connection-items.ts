import { Env, json } from "../_shared";

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const list = await env.FAMILY_SUBMISSIONS.list({ prefix: "connection-item:", limit: 50 });
  const values = await Promise.all(
    list.keys.map(async (key) => {
      const raw = await env.FAMILY_SUBMISSIONS.get(key.name);
      return raw ? JSON.parse(raw) : null;
    })
  );
  const items = values
    .filter(Boolean)
    .map((record: any) => ({
      id: record.id,
      type: String(record.media?.type || "").startsWith("video/") ? "video" : "image",
      src: record.media?.url,
      title: record.title || "Family connection",
      caption: record.caption || "Uploaded by family.",
      submittedAt: record.submittedAt || ""
    }))
    .filter((item: any) => item.id && item.src);

  return json({ items });
};
