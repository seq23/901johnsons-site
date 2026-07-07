import { Env, json } from "../_shared";

const validReunionYears = new Set(Array.from({ length: (2027 - 1985) / 2 + 1 }, (_, index) => String(1985 + index * 2)));

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const year = url.searchParams.get("year") || "";
  if (!validReunionYears.has(year)) {
    return json({ message: "Choose a valid past reunion year." }, 400);
  }

  const list = await env.FAMILY_SUBMISSIONS.list({ prefix: `reunion-gallery-item:${year}:`, limit: 100 });
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
      title: record.title || `${year} family upload`,
      caption: record.caption || "Uploaded by family.",
      submittedAt: record.submittedAt || ""
    }))
    .filter((item: any) => item.id && item.src);

  return json({ items });
};
