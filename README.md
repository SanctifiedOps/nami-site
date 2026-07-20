# NAMI Creative — namicreative.co.uk

Marketing site for NAMI Creative. Brand, content, websites, visual direction, and growth automation, presented as one integrated studio offer.

## Stack

- **Next.js 15** (App Router, Turbopack dev) on **React 19**
- **Tailwind v4** + custom design tokens (`app/globals.css`)
- **Motion** (`motion/react`) for orchestrated entrances + scroll reveals
- **Lenis** for smooth scrolling, custom cursor, magnetic CTAs
- **TypeScript** strict
- Hosted on **Netlify** (`@netlify/plugin-nextjs`)

## Local development

```bash
npm install
cp .env.example .env.local   # fill in the values
npm run dev                   # http://localhost:3000
```

`npm run build && npm run start` for a production preview. `npm run typecheck` for a fast pass.

## Required environment variables

| Var | Purpose |
| --- | --- |
| `MAILCHIMP_API_KEY` | Mailchimp Marketing API key. Suffix after the dash is the data-center (e.g. `…-us8`) and is required. |
| `MAILCHIMP_AUDIENCE_ID` | Audience (list) ID the newsletter + contact form upsert into. |
| `CONTACT_WEBHOOK_URL` | Make.com custom webhook fired on every successful contact form submission. Powers notification email + Notion/CRM sync. |
| `CREATIVE_NETWORK_WEBHOOK_URL` | Optional dedicated Make.com webhook for `/network` submissions. Falls back to `CONTACT_WEBHOOK_URL` when unset. |

`.env.local` is gitignored. The same three are set in Netlify → Site → Environment variables.

## Routes

```text
/                       Home
/work                   Selected work index
/work/[slug]            Case studies (millions, the-league, barking-puppy, vessl)
/services               Five-pillar services overview
/services/[slug]        Service detail (brand, content, website, visual, automation)
/process                Engagement process
/pricing                Engagement tiers
/insights               Studio writing index (placeholder posts pre-launch)
/insights/[slug]        Article placeholder
/about                  Studio + founder
/contact                Project enquiry form → /api/contact → Mailchimp + Make
/thank-you              Post-submit confirmation + newsletter prompt
/privacy                Privacy notice (UK GDPR)
/terms                  Terms of use (E&W law)

/api/subscribe          Newsletter form → Mailchimp double opt-in
/api/contact            Project enquiry → Mailchimp upsert + Make webhook
/sitemap.xml /robots.txt
```

## Content sources

All site content lives in TypeScript modules under `lib/content/`:

- `services.ts` · five service pillars
- `work.ts` · case studies + accent gradients
- `process.ts` · engagement phases
- `engagement.ts` · pricing tiers
- `values.ts` · about-page principles
- `faq.ts` · home + services + service detail FAQ items

Edit a content file, the page that renders it updates everywhere it appears.

## Make.com automations

- **Contact intake** — Custom webhook (`CONTACT_WEBHOOK_URL`) → notification email to `hello@namicreative.co.uk` → Notion CRM row → optional Slack ping.
- **Newsletter confirmed** — Mailchimp webhook on `subscribe` → tag + log.

Built in the `Nami Creative` org on `eu2.make.com`.
