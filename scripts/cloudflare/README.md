# Terminal Cloudflare Setup

These scripts avoid most manual Cloudflare dashboard work.

## One-Time Login

```bash
npx wrangler login
```

This opens a browser. That manual approval cannot be avoided safely.

## One-Time Resource Setup

```bash
npm run cf:setup
```

This attempts to:

- create the Cloudflare Pages project;
- create the R2 bucket;
- create production and preview KV namespaces;
- patch `wrangler.toml` with the KV IDs;
- create `.env.cloudflare` from `.env.cloudflare.example` if missing.

After this runs, commit the updated `wrangler.toml`. Cloudflare Git deploys read `wrangler.toml`, so the deployed branch must contain the real KV namespace IDs.

Verify bindings:

```bash
npm run cf:verify-bindings
```

## Fill Secrets

Edit `.env.cloudflare`, then run:

```bash
npm run cf:secrets
```

This uses Wrangler Pages secret bulk upload.

Do not commit `.env.cloudflare`. It is ignored by `.gitignore`.

## Deploy

```bash
npm run cf:deploy
```

This validates structure, builds static output, and deploys `out/` to Cloudflare Pages.

## Manual Steps That Remain

- Approve `wrangler login` in browser.
- Deploy the Google Apps Script web app and paste its URL into `.env.cloudflare`.
- Add `901johnsons.com` as a custom domain if the Pages project does not already have it.
- If Wrangler output changes and KV IDs cannot be parsed, paste the KV IDs into `wrangler.toml`, then run `npm run cf:verify-bindings`.
