import { assertMedia, clean, Env, json, logSubmission, putMedia } from "../_shared";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const form = await request.formData();
    const media = form.get("media");
    if (!(media instanceof File)) {
      return json({ message: "A photo or video file is required." }, 400);
    }
    assertMedia(media, "imageOrVideo");

    const saved = await putMedia(env, media, "carousel");
    const record = {
      id: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
      submitterName: clean(form.get("submitterName")),
      familyBranch: clean(form.get("familyBranch")),
      caption: clean(form.get("caption"), 1000),
      title: clean(form.get("submitterName")) || "Family upload",
      media: saved,
      status: "auto_added_to_homepage_carousel"
    };
    await env.FAMILY_SUBMISSIONS.put(`carousel-item:${record.id}`, JSON.stringify(record));
    const logKey = await logSubmission(env, "carousel-upload", record);

    return json({
      message: "Upload received and added to the family carousel.",
      mediaPath: saved.url,
      logKey
    });
  } catch (error) {
    return json({ message: error instanceof Error ? error.message : "Upload failed." }, 400);
  }
};

export const onRequestGet: PagesFunction = async () => {
  return json({ message: "Use POST for carousel uploads." }, 405);
};
