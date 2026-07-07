# 901 Johnsons

Family reunion and family upkeep website for `901johnsons.com`.

## What Is Included

- Home page with prominent Evelena Johnson and Joe Johnson Jr. hero section.
- Giant photo/video family carousel.
- Public upload page for family photos, videos, births, deaths, and marriages.
- Google Sheets webhook handoff for family data updates.
- Reunions hub with upcoming and past reunion sections.
- Dedicated past reunion landing pages with gallery and shirt-photo slots.
- Admin photo upload page for fixed site imagery that is separate from public carousel uploads.
- Numbered site-photo registry in `data/sitePhotos.ts`.
- Numbered placeholder images in `public/site-photos/`.

## Upload Behavior

The production upload backend is designed for Cloudflare Pages Functions:

- Carousel uploads save photos/videos to Cloudflare R2 and metadata to KV.
- Admin site photos save to Cloudflare R2 and a live slot mapping in KV.
- Family update submissions save to KV and forward to Google Apps Script when configured.

For production, set:

```bash
GOOGLE_SHEETS_WEBHOOK_URL="your Google Apps Script web app URL"
ADMIN_UPLOAD_TOKEN="a strong private admin token"
FAMILY_UPDATE_SHARED_SECRET="same secret used in Apps Script"
```

See `docs/CLOUDFLARE_DEPLOYMENT.md` and `docs/GOOGLE_APPS_SCRIPT_SETUP.md`.

## Google Sheets Link

Create a Google Apps Script web app on the family workbook that accepts `POST` JSON and writes rows into the correct sheet tabs. This repo posts structured submissions to `GOOGLE_SHEETS_WEBHOOK_URL`.

Expected submission types:

- `birth`
- `death`
- `marriage`

## Local Commands

```bash
npm install
npm run dev
npm run validate:structure
npm run build
```

## Admin Page

Visit `/admin` and use the `ADMIN_UPLOAD_TOKEN` value to upload designated site photos. This is a lightweight starter gate, not full authentication. Put the finished site behind real admin auth before public launch.
