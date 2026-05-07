# NAMI Creative — context for Claude

This file is the single source of truth for any Claude instance working in this repo. Read it first; defer to the code where it disagrees with this document.

## The business

**NAMI Creative** is a one-person creative marketing studio operated by **Joe Wilson** (founder, sole operator). Trading as NAMI Creative; site at **namicreative.co.uk**. UK-based, sells globally.

The studio sells one integrated offer: **brand, content, websites, visual direction, and growth automation, built by the same hands.** The pitch is that strategy, design, and systems aren't separable when the goal is compounding growth — splitting them across vendors is where most brands fall apart.

Joe runs every engagement directly. There is no team, no account managers, no middle layer. Output is senior-only because there is no junior. Clients should expect to talk to Joe, not a project lead.

## Positioning + promise

- **Tagline:** "Creative systems built for real-world momentum."
- **Promise:** "We Build Brands That Move With Meaning."
- **Frame:** Brand as **infrastructure**, not decoration. Identity systems are load-bearing — content, marketing, and growth all sit on top.
- **Refusal:** No plug-and-play work, no template flips, no decoration without function. "Strategy without execution is a deck. Execution without systems is exhaustion."

Three principles to hold to (from `lib/content/values.ts`):
1. **Branding is infrastructure** — identity systems are load-bearing structure for content, marketing, and growth.
2. **Clarity over volume** — sharp positioning beats more output every time.
3. **Systems compound, posts decay** — design for the second order: formats, frameworks, and pipelines.

## Who Joe works with

- Founders and early-stage teams that need identity, naming, and a coherent story from day one.
- Growing brands that need tighter operations, sharper digital presence, and scalable systems.
- Independent operators through to small teams. Trades, founders, small businesses — the common thread is **intent**.
- Clients drift toward people who care about doing the work properly. Not the cheapest option, not chasing trends.

## Services (the five pillars)

Defined in `lib/content/services.ts`. All five are sold as one integrated offer; clients can buy individual pillars but the studio is built to deliver them together.

| # | Slug | Pillar | What it is |
| --- | --- | --- | --- |
| 01 | `brand-strategy` | Brand | Positioning, messaging architecture, tone of voice, visual direction. A brand framework you run a business off — not a deck. |
| 02 | `content-systems` | Content | Repeatable formats, platform-specific strategy, narrative architecture. A content engine, not a stream of posts. |
| 03 | `website-funnel` | Brand | Conversion-led websites in Next.js, Webflow, or Framer. Sites are conversion environments, not online brochures. |
| 04 | `visual-direction` | Brand | Cohesive creative direction across content, product, campaign. "Recognition before recall." |
| 05 | `automation-growth` | Systems | Notion, Make.com, lifecycle email, lead-capture pipelines, content automations. The connective tissue. |

## Engagement models (`lib/content/engagement.ts`)

| # | Model | Best for | Timeline | Pricing |
| --- | --- | --- | --- | --- |
| 01 | **Project** | Defined brand or website build with clear scope | 4–8 weeks | Scoped to the work |
| 02 | **Partnership** *(highlight)* | Teams scaling brand, content, systems together | Monthly cadence | Monthly retainer |
| 03 | **Systems + product** | Founders productising their brand or content engine | 2–5 weeks | Scoped to the work |

Process is four phases (`lib/content/process.ts`): **01 Discovery + positioning** → **02 Design + build** → **03 Launch + integrate** → **04 Scale + evolve**.

## Selected work (`lib/content/work.ts`)

| Client | Sector | Status | Highlights |
| --- | --- | --- | --- |
| **MILLIONS** *(featured)* | On-chain intelligence · Solana | Live | Brand + live signal dashboard + sub-1s Discord/Telegram alerts. 583 smart wallets tracked, 37,340 deployer wallets scored, cumulative 19,840× call multiplier. |
| **The League** | Members club · UK | Live | Positioning, identity, conversion-led website, lifecycle email. Invitation-only private dining society, nationwide UK. |
| **Barking Puppy** | Community brand · Solana | Ongoing | Full-stack: identity, copy, PFP generator, dashboard, Telegram bot, community management. 7,000+ holders. |
| **VESSL** | Fitness · DTC | Recently shipped | Premium mobile-first landing funnel, three-tier pricing, lead automation. React 19 + Vite, CSS-only. |

When discussing work, default to these four. Don't invent other clients.

## Tone + voice (read this carefully)

The brand voice is the whole product. Match it in any user-facing copy you write or edit.

**Energy:** Confident, direct, slightly combative against trends and decoration without function. Energetic and bold. "Move fast, think loud, refuse to stay boxed in." Never write the phrase "no fluff" or "no filler" — banned phrases.

**Cadence:** Short, punchy sentences. Strategic and pragmatic. Outcome-focused. Stops short of bombast.

**Imagery:** Motion and water — waves, momentum, movement, chop, current, flow. The studio name *NAMI* (波) means *wave* in Japanese; lean into it without overplaying it.

**Signature phrases (verbatim — quote, don't paraphrase):**
- "We Build Brands That Move With Meaning."
- "Creative systems built for real-world momentum."
- "Clarity Over Chaos."
- "Creative With Weight."
- "Systems That Carry You."
- "Waves of Creative Impact."
- "You don't need another agency. You need a partner that builds with intent."

**Hard rule: zero em dashes (—).** Anywhere. Site copy, testimonials, FAQs, case studies, Creative Waves articles, email, social. Joe told me to burn this in. Replace with periods, commas, colons, semicolons, or restructure. En dashes (–) and hyphens (-) are fine. Before saving any copy, grep for `—` and clear it.

**Avoid:** generic agency-speak ("we deliver bespoke solutions"), corporate filler, hedging, exclamation marks, emojis (unless Joe asks), any AI-tells ("in today's fast-paced world", "leverage", "synergy", "in summary"). Don't over-promise. The brand has confidence because the work has substance behind it; keep that ratio.

**Joe's personal comms style** (separate from brand voice): direct, action-first, terse. He trusts recommendations — when given a decision, surface the choice + your pick + proceed rather than waiting for permission. See `feedback_drive.md` in memory.

## Joe's experience + background

Joe is the founder, designer, strategist, developer, and systems builder. He runs the studio solo. His own framing on the about page:

> "I started NAMI Creative to do the kind of work that only happens when strategy, design, and systems are built by the same hands. Direct client relationships, senior-only output, no middle layer."

LinkedIn: [brandingbyjoewilson](https://www.linkedin.com/in/brandingbyjoewilson/). Sanctified Ops is Joe's parent operating umbrella (this repo lives under `D:\SanctifiedOps\nami-site`). Photo on the about page is `/assets/images/bb.jpg`.

The work portfolio (above) is the receipts: brand systems, conversion sites, on-chain product, community infrastructure, automation pipelines. Capability is genuinely full-stack — design through to shipping production code and live alerting infra.

## The website (this repo)

- **Stack:** Next.js 15 (App Router, Turbopack), React 19, Tailwind v4, Motion (`motion/react`), Lenis smooth scroll, TypeScript strict, MDX for insights.
- **Hosting:** Netlify (`@netlify/plugin-nextjs`), project name `namicreative`. Custom domain `namicreative.co.uk`. Repo `SanctifiedOps/nami-site`, branch `main`.
- **Routes:** see `README.md` — `/`, `/work`, `/work/[slug]`, `/services`, `/services/[slug]`, `/process`, `/pricing`, `/insights`, `/insights/[slug]`, `/about`, `/contact`, `/thank-you`, `/privacy`, `/terms`.
- **APIs:** `/api/subscribe` (Mailchimp newsletter, double opt-in), `/api/contact` (Mailchimp upsert + Make.com webhook).
- **Content:** all in `lib/content/*.ts` (TypeScript modules) — services, work, process, engagement, values, faq. Insights articles are MDX in `content/insights/`.
- **Visual direction:** liquid atmosphere, flowing pink-magenta accent (`#e632af`-ish) with cyan secondary, magnetic CTAs, custom cursor, scroll-reveal letter animations.
- **Analytics:** GA4. Joe declined a consent banner — don't re-raise. See `project_analytics_decision.md`.

### Required env vars

| Var | Purpose |
| --- | --- |
| `MAILCHIMP_API_KEY` | Mailchimp Marketing API key (suffix is data-center, must end `-us8`) |
| `MAILCHIMP_AUDIENCE_ID` | Audience (list) ID; see Netlify env or `reference_mailchimp.md` |
| `CONTACT_WEBHOOK_URL` | Make.com webhook for contact intake |

Set in `.env.local` (gitignored) and Netlify env vars.

## Operations stack (live + wired)

- **Inbox:** `hello@namicreative.co.uk` (Outlook).
- **Mailchimp:** DC `us8`, audience ID stored in `MAILCHIMP_AUDIENCE_ID`. Tags: `Subscriber` / `Enquiry`, plus source/type/budget sub-tags. See `reference_mailchimp.md`.
- **Make.com:** org `Nami Creative` (id 3343287, eu2 region), team 1535336. Contact-form intake scenario id **9186508**. Webhook fires → notification email to `hello@` → Notion CRM row → optional Slack ping. See `reference_make.md`.
- **Newsletter loop:** Mailchimp webhook on `subscribe` → Make → tag + log.
- **Microsoft OAuth note:** the Outlook connection in Make expires fast. `invalid_grant` errors are usually token expiry, not logic bugs — reauthorize first. See `feedback_microsoft_oauth.md`.

## How to be useful in this repo

- **Edit content in `lib/content/*.ts`**, not the page components — the pages render from those modules and updates propagate everywhere.
- **Match the existing voice** in any copy. Re-read the signature phrases above before writing user-facing text.
- **Don't invent clients, metrics, or services** — the four case studies and five service pillars are the canon.
- **Mobile-first.** The site is built mobile-first with iOS-grade polish in mind. Test narrow viewports.
- **Respect `prefers-reduced-motion`.** Motion is informational, never decorative noise.
- **Pick defaults and proceed.** When Joe asks for a decision, recommend + execute rather than waiting. Surface the choice if it's load-bearing, but drive forward.
- **Confirm before destructive ops** — pushes, force-pushes, branch deletes, dependency removals, anything that touches Mailchimp/Make/Netlify in production.
