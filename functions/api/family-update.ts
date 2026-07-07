import { clean, Env, json, logSubmission, postToGoogleSheets } from "../_shared";

const allowedTypes = new Set(["birth", "death", "marriage"]);

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const form = await request.formData();
    const updateType = clean(form.get("updateType"), 80);
    if (!allowedTypes.has(updateType)) {
      return json({ message: "Invalid family update type." }, 400);
    }

    const payload = {
      submittedAt: new Date().toISOString(),
      updateType,
      primaryNames: clean(form.get("primaryNames")),
      eventDate: clean(form.get("eventDate"), 40),
      relatedNames: clean(form.get("relatedNames")),
      familyBranch: clean(form.get("familyBranch")),
      submittedBy: clean(form.get("submittedBy")),
      contact: clean(form.get("contact")),
      notes: clean(form.get("notes"), 4000),
      source: "901johnsons.com/nav-upload-form",
      status: "submitted_for_family_data_manager_review"
    };

    if (!payload.primaryNames || !payload.submittedBy || !payload.contact) {
      return json({ message: "Name, submitter, and contact are required." }, 400);
    }

    const sheetResult = await postToGoogleSheets(env, payload);
    const logKey = await logSubmission(env, "family-update", { ...payload, sheetResult });

    return json({
      message: sheetResult.sent
        ? "Family update sent to the master spreadsheet intake."
        : "Family update saved in Cloudflare KV. Add GOOGLE_SHEETS_WEBHOOK_URL to send it to the workbook.",
      logKey
    });
  } catch (error) {
    return json({ message: error instanceof Error ? error.message : "Family update failed." }, 400);
  }
};

export const onRequestGet: PagesFunction = async () => {
  return json({ message: "Use POST for family updates." }, 405);
};
