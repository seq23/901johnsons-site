import { assertMedia, clean, Env, json, logSubmission, putMedia } from "../_shared";

const validReunionYears = new Set(Array.from({ length: (2027 - 1985) / 2 + 1 }, (_, index) => String(1985 + index * 2)));
const validGalleryTargets = new Set(["homepage", "reunion", "connections"]);

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const form = await request.formData();
    const media = form.get("media");
    if (!(media instanceof File)) {
      return json({ message: "A photo or video file is required." }, 400);
    }
    assertMedia(media, "imageOrVideo");

    const galleryTarget = clean(form.get("galleryTarget"), 40) || "homepage";
    const reunionYear = clean(form.get("reunionYear"), 10);
    if (!validGalleryTargets.has(galleryTarget)) {
      return json({ message: "Choose a valid place for this upload." }, 400);
    }
    if (galleryTarget === "reunion" && !validReunionYears.has(reunionYear)) {
      return json({ message: "Choose a valid past reunion year for this gallery upload." }, 400);
    }

    const storagePrefix =
      galleryTarget === "reunion" ? `reunions/${reunionYear}` : galleryTarget === "connections" ? "connections" : "carousel";
    const saved = await putMedia(env, media, storagePrefix);
    const record = {
      id: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
      submitterName: clean(form.get("submitterName")),
      familyBranch: clean(form.get("familyBranch")),
      caption: clean(form.get("caption"), 1000),
      title: clean(form.get("submitterName")) || "Family upload",
      galleryTarget,
      reunionYear: galleryTarget === "reunion" ? reunionYear : "",
      media: saved,
      status:
        galleryTarget === "reunion"
          ? "auto_added_to_reunion_gallery"
          : galleryTarget === "connections"
            ? "auto_added_to_connections_page"
            : "auto_added_to_homepage_carousel"
    };
    if (galleryTarget === "reunion") {
      await env.FAMILY_SUBMISSIONS.put(`reunion-gallery-item:${reunionYear}:${record.id}`, JSON.stringify(record));
    } else if (galleryTarget === "connections") {
      await env.FAMILY_SUBMISSIONS.put(`connection-item:${record.id}`, JSON.stringify(record));
    } else {
      await env.FAMILY_SUBMISSIONS.put(`carousel-item:${record.id}`, JSON.stringify(record));
    }
    const logKey = await logSubmission(env, "carousel-upload", record);

    return json({
      message:
        galleryTarget === "reunion"
          ? `Upload received and added to the ${reunionYear} reunion gallery.`
          : galleryTarget === "connections"
            ? "Upload received and added to the family connections page."
          : "Upload received and added to the family carousel.",
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
