import { assertMedia, clean, Env, json, logSubmission, putMedia } from "../../_shared";

const validSlot = /^site-photo-0(0[1-9]|10)$/;

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const form = await request.formData();
    const expectedToken = env.ADMIN_UPLOAD_TOKEN;
    const providedToken = clean(form.get("token"), 200);
    if (!expectedToken || providedToken !== expectedToken) {
      return json({ message: "Admin upload token is invalid or not configured." }, 401);
    }

    const slotId = clean(form.get("slotId"), 40);
    if (!validSlot.test(slotId)) {
      return json({ message: "Unknown site photo slot." }, 400);
    }

    const photo = form.get("photo");
    if (!(photo instanceof File)) {
      return json({ message: "A replacement photo is required." }, 400);
    }
    assertMedia(photo, "image");

    const saved = await putMedia(env, photo, `site-photos/${slotId}`);
    await env.FAMILY_SUBMISSIONS.put(
      `site-photo-live:${slotId}`,
      JSON.stringify({
        slotId,
        url: saved.url,
        uploadedAt: new Date().toISOString(),
        note: clean(form.get("note"), 1000)
      })
    );
    const logKey = await logSubmission(env, "admin-site-photo-upload", {
      slotId,
      photo: saved,
      note: clean(form.get("note"), 1000)
    });

    return json({
      message: "Site photo uploaded to R2 and mapped in KV for this slot.",
      photoPath: saved.url,
      logKey
    });
  } catch (error) {
    return json({ message: error instanceof Error ? error.message : "Admin upload failed." }, 400);
  }
};

export const onRequestGet: PagesFunction = async () => {
  return json({ message: "Use POST for admin site photo uploads." }, 405);
};
