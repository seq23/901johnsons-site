import {
  assertMedia,
  checkDailyLimit,
  clean,
  countDailyUse,
  DailyLimit,
  Env,
  json,
  logSubmission,
  PENDING_MEDIA_PREFIX,
  PENDING_UPLOAD_PREFIX,
  putMedia
} from "../_shared";

const validReunionYears = new Set(Array.from({ length: (2027 - 1985) / 2 + 1 }, (_, index) => String(1985 + index * 2)));
const validGalleryTargets = new Set(["homepage", "reunion", "connections"]);

// Anonymous uploads are held for review (3 Nov 2026 security sweep): nothing a
// visitor sends is public until a family admin approves it at /admin.
export const uploadLimit: DailyLimit = { kind: "carousel-upload", perIp: 10, global: 100 };

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const limited = await checkDailyLimit(env, request, uploadLimit);
    if (limited) return limited;

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
    const saved = await putMedia(env, media, `${PENDING_MEDIA_PREFIX}${storagePrefix}`);
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
      status: "pending_review"
    };
    await env.FAMILY_SUBMISSIONS.put(`${PENDING_UPLOAD_PREFIX}${record.id}`, JSON.stringify(record));
    await countDailyUse(env, request, uploadLimit);
    const logKey = await logSubmission(env, "carousel-upload", record);

    const place =
      galleryTarget === "reunion"
        ? `the ${reunionYear} reunion gallery`
        : galleryTarget === "connections"
          ? "the family connections page"
          : "the family carousel";
    return json({
      message: `Thank you. Your upload was received and will appear on ${place} once a family admin approves it.`,
      status: "pending_review",
      logKey
    });
  } catch (error) {
    return json({ message: error instanceof Error ? error.message : "Upload failed." }, 400);
  }
};

export const onRequestGet: PagesFunction = async () => {
  return json({ message: "Use POST for carousel uploads." }, 405);
};
