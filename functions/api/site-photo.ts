import { Env, json } from "../_shared";

const validSlot = /^site-photo-0(0[1-9]|10)$/;

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const slotId = url.searchParams.get("slotId") || "";
  if (!validSlot.test(slotId)) {
    return json({ message: "Unknown site photo slot." }, 400);
  }
  const raw = await env.FAMILY_SUBMISSIONS.get(`site-photo-live:${slotId}`);
  if (!raw) {
    return json({ url: null });
  }
  const record = JSON.parse(raw);
  return json({ url: record.url || null, uploadedAt: record.uploadedAt || null });
};
