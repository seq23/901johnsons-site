const CONFIG = {
  sharedSecretProperty: "FAMILY_UPDATE_SHARED_SECRET",
  workbookIdProperty: "MASTER_FAMILY_WORKBOOK_ID",
  intakeSheetName: "Website Intake",
  birthSheetName: "Birth Announcements",
  deathSheetName: "Death Announcements",
  marriageSheetName: "Marriage Announcements"
};

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || "{}");
    verifySharedSecret_(payload.sharedSecret);

    const workbook = SpreadsheetApp.openById(
      PropertiesService.getScriptProperties().getProperty(CONFIG.workbookIdProperty)
    );
    const normalized = normalizePayload_(payload);

    appendRow_(workbook, CONFIG.intakeSheetName, normalized);

    if (normalized.updateType === "birth") {
      appendRow_(workbook, CONFIG.birthSheetName, normalized);
    }
    if (normalized.updateType === "death") {
      appendRow_(workbook, CONFIG.deathSheetName, normalized);
    }
    if (normalized.updateType === "marriage") {
      appendRow_(workbook, CONFIG.marriageSheetName, normalized);
    }

    return json_({ ok: true, message: "Family update recorded." });
  } catch (error) {
    return json_({ ok: false, message: error.message || "Apps Script failed." }, 400);
  }
}

function setupJohnsonFamilyWorkbook() {
  const workbookId = PropertiesService.getScriptProperties().getProperty(CONFIG.workbookIdProperty);
  if (!workbookId) {
    throw new Error("Set MASTER_FAMILY_WORKBOOK_ID in Project Settings > Script properties first.");
  }
  const workbook = SpreadsheetApp.openById(workbookId);
  [
    CONFIG.intakeSheetName,
    CONFIG.birthSheetName,
    CONFIG.deathSheetName,
    CONFIG.marriageSheetName
  ].forEach(function (sheetName) {
    const sheet = getOrCreateSheet_(workbook, sheetName);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers_());
      sheet.setFrozenRows(1);
    }
  });
}

function normalizePayload_(payload) {
  return {
    receivedAt: new Date(),
    submittedAt: payload.submittedAt || "",
    updateType: payload.updateType || "",
    primaryNames: payload.primaryNames || "",
    eventDate: payload.eventDate || "",
    relatedNames: payload.relatedNames || "",
    familyBranch: payload.familyBranch || "",
    submittedBy: payload.submittedBy || "",
    contact: payload.contact || "",
    notes: payload.notes || "",
    source: payload.source || "901johnsons.com",
    status: payload.status || "submitted_for_family_data_manager_review"
  };
}

function headers_() {
  return [
    "receivedAt",
    "submittedAt",
    "updateType",
    "primaryNames",
    "eventDate",
    "relatedNames",
    "familyBranch",
    "submittedBy",
    "contact",
    "notes",
    "source",
    "status"
  ];
}

function appendRow_(workbook, sheetName, normalized) {
  const sheet = getOrCreateSheet_(workbook, sheetName);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers_());
    sheet.setFrozenRows(1);
  }
  sheet.appendRow(headers_().map(function (key) {
    return normalized[key] || "";
  }));
}

function getOrCreateSheet_(workbook, sheetName) {
  return workbook.getSheetByName(sheetName) || workbook.insertSheet(sheetName);
}

function verifySharedSecret_(providedSecret) {
  const expectedSecret = PropertiesService.getScriptProperties().getProperty(CONFIG.sharedSecretProperty);
  if (!expectedSecret) {
    throw new Error("FAMILY_UPDATE_SHARED_SECRET is not configured in Apps Script properties.");
  }
  if (!providedSecret || providedSecret !== expectedSecret) {
    throw new Error("Unauthorized submission.");
  }
}

function json_(payload, statusCode) {
  const output = ContentService.createTextOutput(JSON.stringify(payload));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
