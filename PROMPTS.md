# Tervexa Logistics: Prompt Pack for Claude in VS Code

**The job:** relaunch this working logistics platform as **Tervexa Logistics** on **tervexalogistics.com** (Hostinger).
The changes are the name, logo, domain, email, tagline and tracking/reference prefixes, plus moving the admin console to a
**path** on the main domain: **`https://tervexalogistics.com/private-user/`** (no separate subdomain).
**These stay the same:** colour palette, fonts, layout, every photo and every feature. Target time: **under 1 hour**.

**How to use**
- Send the prompts **in order, one per chat turn**. Each one ends with STOP. Check the result (`npm run dev` →
  http://localhost:3000) before you send the next one.
- If something breaks, send **Prompt F (Fix)**. In a new chat, send **Prompt R (Resume)** first.
- Time budget: P1 5′ · P2 8′ · P3 12′ · P4 10′ · P5 7′ · P6 3′ · P7 15′ ≈ **60 min**.

> ⛔ **Navora stays live and separate.** Navora Global Freight's domain, GitHub repos (`ojrandy/navoraglobalfreight`,
> `novalglobal`, `novaF`), Hostinger app and database belong to a separate business that is still running. Don't push
> to, redirect, take down or reuse any of them. Tervexa gets a **new GitHub repo** and a **new Hostinger Node.js app**.

---

## Project values (source of truth: confirmed by the owner on 2026-10-12)

| Key | Value |
|---|---|
| Name / legal name | **Tervexa Logistics** |
| Short name (UI) | **Tervexa** |
| Tagline | **Faster Moves. Bigger Reach.** (printed on the logo; replaces "Connecting Markets, Delivering Trust") |
| Domain | **tervexalogistics.com** (`www.` redirects to the root domain) |
| Email | **info@tervexalogistics.com** |
| Admin console | **https://tervexalogistics.com/private-user/** (same app, same domain, path-based) · locally `http://localhost:3000/private-user/` **and** `http://localhost:3000/#/admin` |
| Admin console name | **Tervexa Operations Console** (from `COMPANY_SHORT`) |
| Tracking ID | **`TVX` + 5 characters = 8 total**, e.g. `TVX7K2M9`; piece labels `TVX7K2M9-01` |
| Reference prefixes | `TVX-TKT-######`, `TVX-INV-######`, `TVX-SL-######` (quotes keep `QR-YYYY-#####`) |
| Logo source | `images/Tervexa Logistics Logo.png`: 1815×866 RGBA, **already transparent**, black + red, wide empty margins |
| Palette, fonts, photos | **Unchanged.** Red `#D3070B` + ink `#181818` + greys already match the new logo. No photo changes. |
| DB file (default) | `tervexa.db` (production uses `DB_PATH`). Fresh, empty database. Table/column names unchanged. |
| Internal code names **kept** | CSS `--ngf-*`, classes `ngf-*`, storage keys `ngf_*`, session cookie `ngf.sid` (in `server/middleware/auth.ts`). Users never see them; renaming them is a large mechanical diff that won't fit the hour. Optional after launch: Prompt 9. |
| Phone / WhatsApp / HQ address / social | **Not supplied. Leave empty in `brand.ts`, so the UI keeps hiding them.** Never invent them. Add later with Prompt O. |
| Old brand terms to remove from anything users or crawlers see | `Navora`, `navora`, `navoraglobalfreight`, `Navora Global Freight`, `NGF` as an ID/reference prefix (case-sensitive `\bNGF`, **not** the `ngf-`/`--ngf-`/`ngf_` code names), `Connecting Markets`, `Delivering Trust`, `private.navoraglobalfreight.com` |

---

### Prompt 1: Safety net, branch and remotes (no code changes, ~5 min)
```
We're relaunching this working site as "Tervexa Logistics" on tervexalogistics.com. Read PROMPTS.md (its values table is the source of truth), CLAUDE.md, docs/PROJECT_TRACKER.md (Phase T), src/config/brand.ts, src/App.tsx (isAdminHost and handleNavigate), server/seo.ts, server/index.ts (static serving) and docs/DEPLOYMENT.md.

Rules for the whole job: don't change the design, colours, fonts, layout, photos or features. Navora stays live and separate: never push to or change its repos, Hostinger app, domain or database.

1. Create branch `tervexa` from the current HEAD. If PROMPTS.md and docs/PROJECT_TRACKER.md are the only uncommitted changes, commit them as "docs: Tervexa relaunch plan and prompt pack". Any other uncommitted change: STOP and ask me.
2. This folder is a copy of the Navora repo. Run `git remote -v`, record the remotes in the tracker's Phase T notes, then REMOVE every remote (origin, novalglobal, webspectron) from this local clone so nothing can be pushed to Navora by mistake. This changes only local git config, not the remote repos.
3. `npm run build` and `npm test`: record the baseline.
4. Count the old-brand terms from the values table in src, server, scripts, index.html, Public, docs, CLAUDE.md, package.json and .env.example, grouped as: visible text & metadata / documents & PDFs / admin host logic / docs. Skip the kept internal code names (ngf-, --ngf-, ngf_, ngf.sid).

STOP and report: baseline result, counts per group, and any questions.
```

### Prompt 2: New logo and icons (~8 min)
```
Replace the logo with images/Tervexa Logistics Logo.png. Keep the same placements and sizes; no layout change.

1. scripts/optimize-images.mjs: set LOGO_SRC to the new file. The source is ALREADY transparent, so skip the grey-background removal (whiteToAlpha) for it. Just trim the empty transparent margins and keep smooth edges. Don't upscale.
2. Run `node scripts/optimize-images.mjs --brand` (brand only: the photo originals are not in this folder, so never run the full script). It must produce, in Public/brand/:
   - logo.png: full colour (black + red) on transparent, for light backgrounds.
   - logo-white.png: the black/dark parts (wordmark "TERVEXA" and the small tagline) turned white, red kept, for dark backgrounds (header over the hero, footer, admin sidebar and login).
   - mark.png: a square icon cropped from the red globe with the box and orbit arrow.
   - favicon.png (512), favicon-32.png, favicon-16.png, icon-192.png, icon-maskable-512.png (safe padding), apple-touch-icon.png (180), all from mark.png.
   - og-image.jpg (1200×630): the white logo centred on Ink, as before.
3. Bump the ?v=N cache-bust in index.html and Public/site.webmanifest.
4. The new logo is about 2.1:1 (the old one was 2.6:1) and its tagline is small. Check the header (desktop and mobile), mobile drawer, footer, admin sidebar and login, one PDF and the browser tab at 375 and 1440 px. If it reads too small or too large somewhere, adjust ONLY that logo's height/width rule.

`npm run build` must pass. Commit "brand: Tervexa logo and icons". STOP and show me the logo on light and dark backgrounds.
```

### Prompt 3: Name, domain, email, tagline, tracking IDs and references (~12 min)
```
Apply the values table everywhere users, documents or crawlers can see it. Keep the copy word for word apart from the name and tagline. No new marketing text.

1. src/config/brand.ts: COMPANY and LEGAL_NAME "Tervexa Logistics", COMPANY_SHORT "Tervexa", TAGLINE "Faster Moves. Bigger Reach.", EMAIL "info@tervexalogistics.com", DOMAIN "tervexalogistics.com", TRACKING_PREFIX "TVX", REFERENCE_PREFIX "TVX". PHONE, WHATSAPP, HQ_ADDRESS and SOCIAL stay empty. (Leave ADMIN_SUBDOMAIN/ADMIN_HOST alone; Prompt 4 replaces them.)
2. Tagline by hand: the Home hero H1 in HomePage.tsx becomes "Faster Moves," <br /> then the accent-highlight span "Bigger Reach." (same markup pattern as today). Check it at 375/768/1440; if it wraps badly, adjust only that title's font-size/clamp rule. Also the index.html og:title / twitter:title ("Tervexa Logistics: Faster Moves. Bigger Reach.") and the JSON-LD "slogan".
3. Hard-coded strings: index.html (title, description, canonical https://tervexalogistics.com/, OG/Twitter URLs and image, JSON-LD Organization name/url/email/logo), Public/site.webmanifest, App.tsx page titles/descriptions, page copy, image alt text, src/data/legalDocs.ts, DocumentBrand.tsx and every document/PDF label, server/index.ts (health service name, start log), server/db.ts (settings defaults, default DB file data/tervexa.db), .env.example (DB_PATH example), package.json name "tervexa-logistics" (regenerate package-lock.json with `npm install --package-lock-only`). In .ts/.tsx, import from brand.ts; don't hard-code the new strings.
4. Tracking IDs: trackingId.ts builds its regex from TRACKING_PREFIX. Update every example/placeholder (NGF7K2M9 → TVX7K2M9, "NGF·····" → "TVX·····"), help text, and scripts/trackingId.test.ts. References: TVX-TKT / TVX-INV / TVX-SL, and update scripts/references.test.ts. Run `npm test`.
5. docs/CONTENT.md and docs/BRAND_GUIDE.md: company facts, hero H1, OG title, footer brand block, ID formats (§7). CLAUDE.md §1–§2 for Tervexa (company-facts table; the admin URL row says https://tervexalogistics.com/private-user/).

`npm run build` and `npm test` must pass. On localhost: Home, Track, Contact and Legal at 375 and 1440; create a shipment in the admin (#/admin) and confirm it gets a TVX ID that tracks publicly; download one PDF and check the name/logo. Commit "brand: Tervexa name, domain, email, tagline and IDs". STOP and report.
```

### Prompt 4: Admin console at /private-user/ on the main domain (~10 min)
```
Move the admin console from the private.<domain> subdomain to the path https://tervexalogistics.com/private-user/ on the SAME host. Same app, same API, same login. Don't edit server/middleware/auth.ts or the session settings.

1. brand.ts: replace ADMIN_SUBDOMAIN/ADMIN_HOST with ADMIN_PATH = '/private-user/' and ADMIN_URL = `${SITE_URL}${ADMIN_PATH}`. Fix every import.
2. src/App.tsx: replace isAdminHost() with isAdminPath(): true when window.location.pathname, lower-cased with any trailing slash ignored, equals '/private-user' (exact; '/private-user-x' or '/private-users' must not match). It works on any host, so localhost:3000/private-user/ opens admin too; keep #/admin working on localhost/127.0.0.1 only. On the public site, #/admin and /admin must still fall back to Home in production. Update getInitialPage, the hash effect, setRobotsNoIndex and the comments.
   - handleNavigate from admin to a public page: same-origin `window.location.assign('/#/page')` (or '/'), not SITE_URL, so it also works on localhost.
   - onViewPublicTracking: `window.location.assign('/#/track/<id>')`.
   - Admin logout and login keep the user on /private-user/.
3. server/index.ts: add GET '/private-user' → 301 to '/private-user/', and GET '/private-user/' → send dist/index.html with `Cache-Control: no-cache` and `X-Robots-Tag: noindex, nofollow`. Put it before express.static. Make sure index.html's script/style/icon URLs are root-absolute (/assets/…, /brand/…), so they load from /private-user/. Anything else under /private-user/… returns the normal 404.
4. server/seo.ts: isAdminRequest = ADMIN_PROXY_TARGET set OR req.path is /private-user or starts with /private-user/. Keep the X-Robots-Tag header for those paths. robots.txt and sitemap.xml are now one public version; do NOT list /private-user/ in robots.txt (that would advertise it). Remove the admin-host branches.
5. Vite dev: confirm http://localhost:3000/private-user/ serves the app (SPA fallback) and API calls still go through the /api proxy.
6. Search src, server and docs for ADMIN_HOST, ADMIN_SUBDOMAIN, isAdminHost and "private." and update every remaining reference (the admin Settings or help text that prints the admin URL should show ADMIN_URL).

Known trade-off (record it in the tracker Decisions log): the admin session cookie is host-only, so it is now also sent on public pages of the same domain. That's harmless (httpOnly, SameSite=lax, the API still checks the session), but a logged-in admin browsing the public site will see admin data load in the background.

`npm run build` and `npm test` must pass. Test with `npm run build && npm start` (production mode, NODE_ENV=production in the shell only, scratch DB_PATH): /private-user and /private-user/ open the login; wrong password is rejected; login works; create a shipment → "view public tracking" opens /#/track/<id> on the same host; /#/admin and /admin show Home; /private-user/ responses carry X-Robots-Tag noindex; robots.txt doesn't mention private-user; the public pages are unchanged. Commit "feat: admin console at /private-user/ on the main domain". STOP and report.
```

### Prompt 5: Docs, final sweep and full local check (~7 min)
```
1. docs/DEPLOYMENT.md: rewrite for Tervexa. One domain (tervexalogistics.com + www redirect), admin at /private-user/, no private. subdomain, env vars (DB_PATH and UPLOADS_DIR in e.g. /home/<user>/tervexa-data/), email info@tervexalogistics.com, the smoke test (§7) with the /private-user/ checks, backups of tervexa.db + uploads.
2. docs/PROJECT_TRACKER.md: tick the finished Phase T tasks, add change-log lines, and keep Blocked / Needs owner current.
3. Fresh `npm run build`, then sweep src, server, scripts, Public, index.html, docs, CLAUDE.md, package.json AND dist/ + dist-server/ for the old-brand terms in the values table (case-insensitive "navora"; case-sensitive \bNGF). Goal: zero hits outside the tracker's history sections and the kept internal code names. List anything left and why.
4. Full run on localhost (production build): admin login at /private-user/ → create shipment (TVX ID) → track publicly → change status → generate each document type → quote request → publish → public quote page → contact message → Messages inbox → package photo + payment request → proof upload → approve. Confirm the new name and logo everywhere and that nothing else changed visually (375/768/1440).
5. Confirm there's no demo data in code or seed, and SEED_DEMO_DATA is unset/false.
Commit "docs: Tervexa deployment and tracker" (and "fix: …" for any fixes). STOP with a short ready / not-ready report.
```

### Prompt 6: New admin password and session secret (~3 min, mostly me)
```
Set a new admin password and session secret for Tervexa. Configuration only; don't edit auth logic, and never ask me for the password.

1. Give me the two commands to run MYSELF in the project folder:
   - node -e "console.log(require('bcryptjs').hashSync('MY-NEW-PASSWORD', 12))"
   - node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
2. Tell me exactly what to put in my local .env (ADMIN_PASSWORD_HASH, SESSION_SECRET), whether the `$` characters in the hash need quoting, and remind me the same values go into Hostinger in Prompt 7. These must NOT be the Navora values.
3. After I say "done", restart and have me confirm: the old password is rejected, the new one works at http://localhost:3000/private-user/, and logout/login works.
STOP.
```

### Prompt 7: New GitHub repo and deploy to tervexalogistics.com on Hostinger (~15 min, mostly me in hPanel)
```
Prepare the deploy per docs/DEPLOYMENT.md. Don't deploy anything yourself; give me exact steps. This is a NEW site: never touch Navora's repos, app, domain or database.

1. GitHub, fresh history (small, fast push, no Navora history): check .gitignore excludes node_modules, dist, dist-server, data, .env, then give me the commands: `git checkout --orphan tervexa-main`, `git add -A`, commit "Tervexa Logistics: initial release", `git branch -M main`, `git remote add origin <MY NEW EMPTY REPO URL>`, `git push -u origin main`. Ask me for the repo URL; don't guess it. Confirm `git remote -v` shows ONLY the new repo before pushing.
2. hPanel → new Node.js web app: connect the new repo, branch main, Node 22.x (≥ 22.5), install `npm install` (postinstall builds; don't build twice), start `npm start` (entry dist-server/server/index.js).
3. Environment variables: NODE_ENV=production, PORT only if hPanel requires it, ADMIN_PASSWORD_HASH and SESSION_SECRET (from Prompt 6), DB_PATH=/home/<user>/tervexa-data/tervexa.db and UPLOADS_DIR=/home/<user>/tervexa-data/uploads (a folder OUTSIDE the deploy directory; create it first), SEED_DEMO_DATA unset. The database starts empty.
4. Domain: tervexalogistics.com on this app, www.tervexalogistics.com redirecting to the root (one host, so the admin session cookie works), SSL on both, force HTTPS; DNS records if the domain is registered elsewhere. No private. subdomain.
5. Smoke test on the live domain (DEPLOYMENT §7): new logo, name and tab icon; the share preview uses tervexalogistics.com and the OG image loads; https://tervexalogistics.com/private-user/ shows the login and works with the new password; /#/admin and /admin show Home; robots.txt doesn't mention private-user; log in, then open /api/diag/storage and confirm DB_PATH and UPLOADS_DIR point at tervexa-data; create → track a TVX shipment; redeploy once and confirm the shipment is still there; response headers show compression and the /assets cache rule.
6. Email: create the info@tervexalogistics.com mailbox and add SPF/DKIM/DMARC (Hostinger email or my provider).
STOP and wait for my results, then tick Phase T/7 in the tracker and commit "docs: Tervexa live".
```

---

## Utility prompts

### Prompt R: Resume in a new chat
```
Resume the Tervexa Logistics launch. Read CLAUDE.md, PROMPTS.md and docs/PROJECT_TRACKER.md (Phase T), run `git status`, `git branch` and `git log --oneline -10`, then tell me which prompt we're on and what's next. Don't change anything until I confirm.
```

### Prompt F: Fix something that broke
```
Something broke: [what you see, which page/URL, steps, any error message].
Find the root cause (check the latest commits first) and explain it before fixing. Apply the smallest fix that doesn't change design or unrelated behaviour. Confirm `npm run build` and `npm test` pass and that admin login at /private-user/ → create → track still works, then commit "fix: …".
```

### Prompt O: Owner contact details arrived
```
Here are Tervexa's contact details: [phone / WhatsApp / HQ address / social links].
Add them to src/config/brand.ts (and the JSON-LD in index.html), confirm the UI that was hidden now shows them correctly on the Header, Footer, Contact and documents, update the values table in PROMPTS.md and the tracker, build, and commit "content: add Tervexa contact details".
```

### Prompt 9 (optional, after launch): Rename the internal ngf code names
```
Rename the internal code names that still carry the old prefix: CSS --ngf-* → --tvx-*, class ngf- → tvx-, storage keys ngf_* → tvx_*, the cookie ngf.sid → tvx.sid (SESSION_COOKIE and the logout clearCookie must change together; this logs everyone out once), and the Cookie Policy text. It's a mechanical rename with no behaviour change: prove it by comparing the built bundles with the prefixes mapped back, as in the tracker's 2026-10-02 launch entry. Build, test, check 375/1440, commit "chore: rename internal ngf names to tvx".
```
