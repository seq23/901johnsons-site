# Google Apps Script Setup

Use this to connect the `Upload & Announce` navigation page to the master family data workbook.

## 1. Create Workbook Tabs

Open the master Google Sheet and decide whether the website should write to new intake tabs or existing tabs. The included script creates these tabs if they do not exist:

- `Website Intake`
- `Birth Announcements`
- `Death Announcements`
- `Marriage Announcements`
- `Birthday Calendar`
- `Anniversary Calendar`
- `Recipes and Table Memories`
- `Prayer Requests`
- `Care Updates`

The family tree sync reads the existing workbook tab:

- `tree_website_mock 1`

## 2. Create Apps Script

1. Open the master Google Sheet.
2. Click `Extensions` > `Apps Script`.
3. Replace the default code with `google-apps-script/Code.gs`.
4. Open `Project Settings`.
5. Add these Script Properties:

| Property | Value |
| --- | --- |
| `MASTER_FAMILY_WORKBOOK_ID` | The long ID from the Google Sheet URL |
| `FAMILY_UPDATE_SHARED_SECRET` | A private random phrase matching Cloudflare |

## 3. Run Setup Once

In Apps Script, run:

```javascript
setupJohnsonFamilyWorkbook()
```

Approve the Google permissions. This creates the intake tabs and headers.

## 4. Deploy Web App

1. Click `Deploy` > `New deployment`.
2. Select type `Web app`.
3. Execute as: `Me`.
4. Who has access: `Anyone`.
5. Deploy.
6. Copy the Web App URL.

## 5. Add Cloudflare Variables

In Cloudflare Pages project settings, add:

| Variable | Type | Value |
| --- | --- | --- |
| `GOOGLE_SHEETS_WEBHOOK_URL` | Secret | Apps Script Web App URL |
| `FAMILY_UPDATE_SHARED_SECRET` | Secret | Same private phrase used in Apps Script |

The website posts to Cloudflare first. Cloudflare adds the shared secret and forwards the family update to Apps Script. Do not expose the secret in public frontend code.

## 6. Sync the Family Tree From Google Sheets

After deploying the updated Apps Script, run this from the repo root:

```bash
npm run family-tree:sync
npm run validate:family-tree
```

The sync script reads `.env.cloudflare` for:

```text
GOOGLE_SHEETS_WEBHOOK_URL
FAMILY_UPDATE_SHARED_SECRET
```

It calls Apps Script with `action=family-tree`, reads `tree_website_mock 1`, and regenerates:

```text
data/familyTree.ts
```

The workbook target count is `593` people. If the sheet changes, update the workbook first, redeploy Apps Script if needed, then run the sync again.
