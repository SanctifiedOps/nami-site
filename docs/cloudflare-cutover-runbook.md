# NAMI Cloudflare cutover runbook

Last updated: 2026-09-23

## Current state

- `namicreative.co.uk` and `www.namicreative.co.uk` now route through the Cloudflare Worker `nami-creative-site`.
- The registrar is GoDaddy.
- Cloudflare is authoritative through `dawn.ns.cloudflare.com` and `kenneth.ns.cloudflare.com`.
- The retained Netlify deployment and origin records remain the immediate rollback target.
- Both live hostnames have Worker routes attached to `nami-creative-site`.
- The verified active production Worker version is `7a5efef1-affc-4d6a-b7e0-d3186a84ddfb`.
- The live safety suite passes 26/26 checks and the profile audit passes 185/185 profiles.
- Member invitations, account email, retries, external integrations and owner alerts remain on hold.
- Network Events and Network News remain offline.

## DNS record inventory

The Netlify zone contained these 11 records before Cloudflare setup:

| Type | Name | Value | Priority |
| --- | --- | --- | --- |
| CNAME | `autodiscover` | `autodiscover.secureserver.net` | |
| CNAME | `email` | `email.secureserver.net` | |
| CNAME | `k2._domainkey` | `dkim2.mcsv.net` | |
| CNAME | `k3._domainkey` | `dkim3.mcsv.net` | |
| MX | `@` | `namicreative-co-uk.mail.protection.outlook.com` | 0 |
| NETLIFY | `@` | `namicreative.netlify.app` | |
| NETLIFY | `www` | `namicreative.netlify.app` | |
| TXT | `_dmarc` | `v=DMARC1; p=none;` | |
| TXT | `@` | `google-site-verification=4IfPMAyBTR5Fdjoblo4-OHCrdtbBFhFdW08xQ7XLXeQ` | |
| TXT | `@` | `NETORGFT13714713.onmicrosoft.com` | |
| TXT | `@` | `v=spf1 include:secureserver.net -all` | |

Cloudflare imported the mail, verification, SPF, DMARC and DKIM records. `autodiscover` and `email` were changed to DNS-only so Cloudflare will not proxy mail-related hostnames. Cloudflare represented the two Netlify website records as four proxied A records:

- Apex: `18.208.88.157`, `98.84.224.111`
- `www`: `18.208.88.157`, `98.84.224.111`

Direct HTTPS checks against both imported origins returned 200 for the apex. Both `www` origins returned the expected 301 to the apex. These records preserve the Netlify site while the zone moves to Cloudflare and provide the immediate fallback after launch.

## Launch gates

Do not start the cutover unless all of these remain true:

- Typecheck and Cloudflare build pass.
- The exact uploaded production version passes the 26-check safety suite and all 185 production profile checks.
- Staging has no cron schedules and its 21-route safety check passes.
- Production D1 and R2 bindings, secrets and hold switches have been verified on the exact uploaded version.
- Contact, workshop and Creative Network test notifications have reached the owner mailbox.
- The owner-controlled newsletter confirmation journey has passed, including subscribed-state and tag readback.
- No member invitation or member email job has been created.
- Netlify remains available as the rollback target.

## Cutover sequence

### 1. Move authoritative DNS to Cloudflare without moving website traffic

In GoDaddy, replace the four Netlify nameservers with:

- `dawn.ns.cloudflare.com`
- `kenneth.ns.cloudflare.com`

Do not delete the Netlify DNS zone or detach the Netlify production domains. Wait until Cloudflare reports the zone as active. Confirm public NS responses use the two Cloudflare nameservers, then verify:

- Apex and `www` still reach Netlify.
- `www` still redirects to the apex.
- MX, SPF, DMARC, DKIM, Google verification, `autodiscover` and `email` match the inventory above.
- `hello@namicreative.co.uk` can still receive mail.

This stage changes the DNS provider only. The website should remain on Netlify.

### 2. Re-run the final production checks

Rebuild only if code has changed. If it has, upload a new production version without deploying it, verify its bindings, then repeat the exact-version route and profile checks. Otherwise keep version `d52258d9-fbc8-4b57-a671-85f3ce5aafc3` as the launch candidate.

Recheck production data counts and confirm the only expected pending Sheet jobs are:

- `migration-profile-image-ellie`
- `migration-profile-image-joe`

Production must still have zero invitation jobs and zero member email jobs.

### 3. Deploy the approved Worker version with all holds in place

Deploy the verified version to `nami-creative-site`. Do not enable member invitations, account email, retry email or external integrations.

The production cron schedule becomes active at this point. Watch the two known Sheet jobs and confirm they complete against the production `Creative Network` tab. Any unexpected email or invitation job is a stop condition.

### 4. Route the live website to the Worker

Add Worker routes for:

- `namicreative.co.uk/*`
- `www.namicreative.co.uk/*`

Both routes must target `nami-creative-site`. Use routes rather than deleting the proxied Netlify A records. This keeps rollback immediate: removing the routes sends traffic back to Netlify without another nameserver change.

### 5. Run the live smoke test immediately

Confirm these pages and behaviours on the real domain:

- Home, Contact, Creator Wave, Network landing, Directory and Login return 200.
- Network News index and article routes return 404.
- Joe's member page loads with its image, metadata and private email omitted.
- Directory filters and profile links work.
- A login to the member dashboard works.
- Invalid form submissions return validation errors.
- One controlled owner-only form test reaches `hello@namicreative.co.uk`.
- Ordinary member invitations and member email remain held.
- Mobile checks at 360, 390, 430 and 768 px show no horizontal overflow or edge-hugging content.

Keep a timestamped result for every check.

## Immediate rollback

If the Worker site fails but Cloudflare DNS and email are healthy:

1. Remove only the two Worker routes.
2. Confirm the proxied Netlify A records are still present.
3. Check `/`, `/contact`, `/network/directory`, Joe's profile and `www` redirect through Netlify.
4. Confirm form endpoints and owner email delivery on Netlify.

This is the preferred rollback because it does not wait for nameserver propagation.

If Cloudflare DNS itself is the problem, restore the four Netlify nameservers in GoDaddy:

- `dns1.p05.nsone.net`
- `dns2.p05.nsone.net`
- `dns3.p05.nsone.net`
- `dns4.p05.nsone.net`

Then repeat the Netlify route and email checks. Keep the Netlify deployment, DNS zone and domain configuration untouched for at least 14 days after a successful launch.

## After launch

- Keep member invitations held until the planned member-page improvements are complete and Joe gives separate approval.
- Keep Network News offline until it has approved content.
- The owner approval and ticket-email framework is built behind a separate held switch and recipient allowlist. Verify the owner dashboard URL and complete one owner-only delivery test before enabling it.
- The independent ticket route is live at `/network/report-a-problem`; its owner email alert remains held.
- The member events framework is deployed but held. Finish the owner moderation surface and populate launch content before enabling it.
- Redesign the current newsletter welcome email after launch so it uses the current NAMI message and voice rather than the old services-led, AI-written copy.
- Only after those changes are tested should real members receive profile-claim invitations.
