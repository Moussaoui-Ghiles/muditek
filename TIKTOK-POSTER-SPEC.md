# Build Spec — TikTok Auto-Poster inside the muditek-web admin portal

**For:** the agent that builds in `muditek/website/muditek-web`.
**Goal:** add a tool to the existing `/admin` portal that pushes our TikTok slideshow PNGs to TikTok as **drafts**, via TikTok's official free API, so we stop hand-uploading every post on the phone.

> Build EXACTLY this. Where a TikTok request field is marked "confirm in doc", open the linked official doc and confirm the field name before coding — do NOT guess. No fabricated endpoints, scopes, or field names.

---

## 1. Why this exists (read first)

The TikTok account @muditek.ai is stuck at ~300 views. Diagnosis + full plan:
- `marketing/tiktok/STRATEGY.md` — master strategy. **§10** is the blueprint for THIS tool; **§13** = SEO/posting rules; the action plan = this is **Step 3** (volume enabler).
- `marketing/tiktok/checkpoints/2026-06-03-strategy-reset/CHECKPOINT.md` — current account state + decisions.
- `.claude/skills/tiktok-slideshow-machine/SKILL.md` — the skill that PRODUCES the slides this tool will post (output = 1080×1920 PNGs + `POST.md`).

The manual phone upload is the bottleneck that blocks volume and multi-account. This tool removes it.

**Source blueprint:** Mikel Cobián, "How to create a US TikTok automatic posting service for dummies" — https://x.com/MikelCobian/status/2057019625372574184 (OAuth + Vercel Blob image hosting + official Content Posting API → drafts).

---

## 2. What it does (scope)

- Connect one or more TikTok accounts via OAuth (one-time login per account, in the admin UI).
- Take a set of slide images for one post, host them on Vercel Blob, and call TikTok's Content Posting API to create a **photo (slideshow) DRAFT** in that account's TikTok inbox.
- Keep tokens alive automatically (daily refresh cron).
- The human opens the TikTok app, adds the native slide-1 keyword text + a trending sound, and taps publish.

**Out of scope (do NOT build):** auto-publishing public posts, scheduling, analytics dashboards, multi-account beyond a handful, comment/DM automation. Drafts only.

---

## 3. Verified TikTok API facts (build against these — all confirmed in official docs)

| Fact | Value | Source |
|---|---|---|
| Photo carousels supported? | **Yes.** `media_type=PHOTO`, up to 35 images | [photo-post doc](https://developers.tiktok.com/doc/content-posting-api-reference-photo-post) |
| Endpoint | `POST https://open.tiktokapis.com/v2/post/publish/content/init/` (confirm in doc) | [get-started](https://developers.tiktok.com/doc/content-posting-api-get-started) |
| Image source | `source=PULL_FROM_URL` → TikTok downloads from our public URL | photo-post doc |
| Image format | **JPEG** (use JPEG, not PNG — PNG support is inconsistent), ≤20MB each, ≤1080p | photo-post doc |
| Draft mode (no audit needed) | `post_mode=MEDIA_UPLOAD` → lands in user's inbox as draft | [get-started](https://developers.tiktok.com/doc/content-posting-api-get-started) |
| Direct public post | `post_mode=DIRECT_POST` → **requires TikTok audit (1–2 weeks). We do NOT use this.** | get-started |
| Unaudited app limit | content restricted to private/draft only → fine, we only draft | get-started |
| Image URL rule | must be HTTPS, **public**, **no redirects**; domain/prefix must be **verified** in the dev portal | photo-post doc |
| Access token life | **24 hours** | [token mgmt](https://developers.tiktok.com/doc/oauth-user-access-token-management/) |
| Refresh token life | **365 days**, refreshes access token with **no user re-login** | token mgmt |
| Refresh rotation | each refresh returns a **NEW refresh token** — always store the latest | token mgmt |
| Rate limit | **6 requests/min per user token** + a daily post cap | 2026 API guide |

**Async publish flow:** `content/init` returns a `publish_id`; status is then polled at the status endpoint (`/v2/post/publish/status/fetch/`, confirm in doc) until the draft is ready. A success at `init` does NOT mean the draft is live — you must poll.

---

## 4. Architecture (portal-native — simpler than Mikel's CLI)

Mikel needed a separate Vercel "relay" page only because his callback was `localhost`. **We do NOT need that.** The portal is already a hosted Next.js app on Vercel with a real domain, so the OAuth callback is just one of our own API routes. Three logical pieces, all inside muditek-web:

1. **OAuth connect** — admin clicks "Connect TikTok" → redirect to TikTok auth → TikTok redirects back to our callback route → we exchange the code for tokens → store in Neon.
2. **Token store + daily refresh** — tokens live in a Neon table; a Vercel Cron refreshes them daily before the 24h access token expires.
3. **Post a slideshow** — convert slides to JPEG → upload to Vercel Blob (public URLs) → call `content/init` with `media_type=PHOTO`, `post_mode=MEDIA_UPLOAD`, `source=PULL_FROM_URL` → poll status → draft appears in the TikTok app.

OAuth flow type: standard **Authorization Code** (server-side, we have a client secret). PKCE optional.

---

## 5. Data model (Neon)

Create one table. Refresh tokens rotate, so they MUST live in the DB, never in env.

```sql
CREATE TABLE tiktok_accounts (
  id              SERIAL PRIMARY KEY,
  handle          TEXT NOT NULL,            -- e.g. 'muditek.ai'
  open_id         TEXT NOT NULL UNIQUE,     -- TikTok user open_id
  access_token    TEXT NOT NULL,
  refresh_token   TEXT NOT NULL,            -- rotates on every refresh — overwrite each time
  access_expires  TIMESTAMPTZ NOT NULL,
  refresh_expires TIMESTAMPTZ NOT NULL,
  scope           TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);
```

---

## 6. Files to create (exact paths — confirmed against the current repo)

| Piece | Path |
|---|---|
| Admin page (server) | `src/app/admin/tiktok/page.tsx` |
| Admin page (client UI) | `src/app/admin/tiktok/tiktok-content.tsx` |
| Sidebar nav entry | edit `src/components/admin/admin-sidebar.tsx` (add under the "Acquisition" group) |
| OAuth start route | `src/app/api/admin/tiktok/connect/route.ts` (builds the TikTok authorize URL, sets `state`) |
| OAuth callback route | `src/app/api/admin/tiktok/callback/route.ts` (exchanges code → tokens → Neon) |
| Post route | `src/app/api/admin/tiktok/post/route.ts` (Blob upload + content/init + poll) |
| Token refresh cron | `src/app/api/cron/tiktok-refresh/route.ts` |
| TikTok lib helpers | `src/lib/tiktok.ts` (auth URL, token exchange, refresh, init, status, JPEG convert) |
| Vercel Cron entry | add to the `crons` array in `vercel.json` (e.g. `{ "path": "/api/cron/tiktok-refresh", "schedule": "0 8 * * *" }`) |

**Reuse what already exists (do NOT rebuild):**
- Admin auth: wrap every new API route with `requireAdmin()` from `src/lib/admin-auth.ts` (Clerk + `ADMIN_EMAILS`).
- Vercel Blob: already wired (`@vercel/blob`, `BLOB_READ_WRITE_TOKEN`); see `src/app/api/admin/upload` for the existing pattern.
- Cron auth: reuse the existing `Authorization: Bearer ${CRON_SECRET}` check used by `/api/cron/sequences`.
- Neon: existing `@neondatabase/serverless` + `DATABASE_URL`.

---

## 7. The three flows in detail

### 7a. Connect (one-time per account)
1. Admin page button → GET `/api/admin/tiktok/connect`.
2. Build authorize URL: `https://www.tiktok.com/v2/auth/authorize/?client_key=...&scope=<publish scopes>&response_type=code&redirect_uri=<callback>&state=<random>` (confirm param names in get-started doc).
3. TikTok redirects to `/api/admin/tiktok/callback?code=...&state=...`.
4. Callback POSTs to `https://open.tiktokapis.com/v2/oauth/token/` (`grant_type=authorization_code`) → receives `access_token`, `refresh_token`, `open_id`, expiries.
5. Upsert into `tiktok_accounts`.

### 7b. Daily refresh (cron)
1. Cron hits `/api/cron/tiktok-refresh` (Bearer `CRON_SECRET`).
2. For each row whose `access_expires` is near: POST `/v2/oauth/token/` with `grant_type=refresh_token`.
3. Store the **new** `access_token` AND **new** `refresh_token` (it rotated) + new expiries.

### 7c. Post a slideshow (the core)
Input: a list of slide image paths/URLs (from the skill's output folder) + caption + cover index + target account handle.
1. Convert each slide to **JPEG** (≤1080p, ≤20MB) if not already.
2. Upload each to Vercel Blob → get public HTTPS URLs (no redirects).
3. POST `content/init`:
   ```jsonc
   // confirm exact field names against the photo-post doc before shipping
   {
     "post_info": { "title": "<≤90 chars>", "description": "<≤4000>", "privacy_level": "SELF_ONLY" },
     "source_info": {
       "source": "PULL_FROM_URL",
       "photo_cover_index": 0,
       "photo_images": ["https://<blob>/slide-01.jpg", "..."]
     },
     "post_mode": "MEDIA_UPLOAD",   // DRAFT — no audit
     "media_type": "PHOTO"
   }
   ```
4. Read `publish_id`; poll the status endpoint until the draft is confirmed.
5. Show the result in the admin UI ("draft sent — open TikTok app to add sound + publish").

---

## 8. Env vars to add (`.env.local` + Vercel project settings)

Follow the existing convention. Ghiles provides the first two; the tokens are written by the OAuth flow into Neon (not env).

```
TIKTOK_CLIENT_KEY=        # from the TikTok developer app  (Ghiles provides)
TIKTOK_CLIENT_SECRET=     # from the TikTok developer app  (Ghiles provides)
TIKTOK_REDIRECT_URI=https://<portal-domain>/api/admin/tiktok/callback
```

(`CRON_SECRET`, `BLOB_READ_WRITE_TOKEN`, `DATABASE_URL` already exist.)

---

## 9. WHAT GHILES MUST PROVIDE (only he can do these — the build is blocked without them)

1. **Create a free TikTok developer app** at https://developers.tiktok.com → gives `TIKTOK_CLIENT_KEY` + `TIKTOK_CLIENT_SECRET`.
2. **Add the "Content Posting API" product** to that app and request its publishing scope(s) (the draft/upload scope — confirm exact scope string in the console; do not hardcode-guess).
3. **Set the redirect URI** in the app to `https://<portal-domain>/api/admin/tiktok/callback`.
4. **Verify the image domain** (the portal/Blob domain that will serve `photo_images`) in the dev portal via DNS TXT record or file upload — required for `PULL_FROM_URL`.
5. **Authorize the TikTok account(s)** once via the portal's "Connect TikTok" button after the build is deployed.

(No audit needed — we stay in draft mode. Audit is only for public auto-posting, which we are not doing.)

---

## 10. Gotchas (do not skip)

- **JPEG only** — convert the skill's PNGs to JPEG before upload.
- **Image URLs must be public HTTPS with NO redirect** — Vercel Blob public URLs qualify; do not put them behind auth.
- **Refresh token rotates every refresh** — always overwrite the stored one, or the account silently disconnects (the only real maintenance risk; the daily cron handles it).
- **6 requests/min per token** — a single post is a handful of calls; fine. Don't batch-blast.
- **Unaudited app = drafts/private only** — expected; that's our mode.
- **TikTok can't add sounds via API** — the human adds the trending sound + native slide-1 keyword text in the app at publish time (per `SKILL.md` rule 5 + `STRATEGY.md` §13).
- **Sandbox test-user cap** — an unaudited app can only post to a limited number of authorized test accounts. Fine for 1–3 of our own; revisit if scaling accounts.

---

## 11. Acceptance test (definition of done)

1. Admin clicks "Connect TikTok," authorizes @muditek.ai → a row appears in `tiktok_accounts`.
2. Admin selects a folder of slide images + a caption → clicks "Send draft."
3. Within ~1 min, a **photo draft appears in the TikTok app** for @muditek.ai.
4. Next day, the refresh cron runs and the account is still connected (access token renewed, no re-login).

That's the whole build. Drafts only, official API, $0, lives entirely inside the existing portal.
