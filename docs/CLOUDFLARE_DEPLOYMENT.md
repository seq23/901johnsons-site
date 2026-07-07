# Cloudflare Deployment

This repo is set up for Cloudflare Pages static hosting plus Pages Functions.

## Required Cloudflare Resources

- Cloudflare Pages project: `901johnsons-site`
- R2 bucket: `901johnsons-family-media`
- KV namespace: `901johnsons-family-submissions`
- Custom domain: `901johnsons.com`

## Build Settings

| Setting | Value |
| --- | --- |
| Framework preset | Next.js / static export |
| Build command | `npm run pages:build` |
| Build output directory | `out` |
| Root directory | repo root |
| Node version | `20` or newer |

## Bindings

Add these Pages bindings for Production and Preview:

| Binding | Type | Name |
| --- | --- | --- |
| `FAMILY_MEDIA` | R2 bucket | `901johnsons-family-media` |
| `FAMILY_SUBMISSIONS` | KV namespace | `901johnsons-family-submissions` |

## Environment Variables

| Variable | Type | Required | Notes |
| --- | --- | --- | --- |
| `ADMIN_UPLOAD_TOKEN` | Secret | Yes | Used by `/admin` uploads |
| `GOOGLE_SHEETS_WEBHOOK_URL` | Secret | Yes for spreadsheet sync | Apps Script Web App URL |
| `FAMILY_UPDATE_SHARED_SECRET` | Secret | Yes for spreadsheet sync | Must match Apps Script property |
| `R2_PUBLIC_BASE_URL` | Plaintext | Optional | Leave blank to serve via `/media/*` function |
| `NEXT_PUBLIC_SITE_URL` | Plaintext | Yes | `https://901johnsons.com` |

## Wrangler Commands

Create resources:

```bash
wrangler r2 bucket create 901johnsons-family-media
wrangler kv namespace create 901johnsons-family-submissions
wrangler kv namespace create 901johnsons-family-submissions --preview
```

After KV creation, paste the returned IDs into `wrangler.toml`.

Deploy:

```bash
npm install
npm run pages:build
wrangler pages deploy out --project-name 901johnsons-site
```

## Production Behavior

- `/upload` posts carousel media to `/api/carousel-upload`.
- `/api/carousel-upload` stores photos/videos in R2 and metadata in KV.
- Homepage carousel calls `/api/carousel-items` and displays uploaded items before placeholders.
- `/upload` posts birth/death/marriage records to `/api/family-update`.
- `/api/family-update` logs to KV and forwards to Google Apps Script when configured.
- `/admin` posts designated site photos to `/api/admin/site-photo-upload`.
