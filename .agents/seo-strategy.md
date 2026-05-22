# NAMI Creative — SEO Strategy

*Drafted 2026-05-22. References `.agents/product-marketing-context.md` for ICP, voice, proof.*

## Context

NAMI Creative is competing in a category (brand + content + creative + automation studios) where the head terms ("brand agency", "marketing agency", "creative studio") are owned by twenty-year-old agencies with massive backlink profiles. Trying to out-rank them is a losing game. The win is in two places: (1) **niche long-tail terms** where intent-specificity beats authority, (2) **AI Overview / LLM citations** where structure and authority beat domain age. This strategy targets both.

**Honest constraint.** Search-volume figures below are directional estimates based on category-competitive intuition, not hard data. Validate exact volumes in Ahrefs/Semrush before any paid investment.

---

## 1. Keyword tier map

### Tier 0 — DO NOT TARGET

These head terms are competitive dead-ends. Mention them naturally if they fit, but don't structure pages around them.

- `brand agency`, `marketing agency`, `creative agency`, `branding agency`
- `web design`, `web designer`, `website agency`
- `marketing agency newcastle`, `branding newcastle`, `web design newcastle` (local versions are equally crowded by SMB-tier shops; attracts the wrong ICP)

**Why not:** SERPs dominated by WPP, Wieden+Kennedy, Big Spoon, Squarespace, Wix. Domain authority moat is permanent.

### Tier 1 — PRIMARY TARGETS (own these)

Proprietary framework terms NAMI has already coined. Very low competition. Build out content clusters around each.

| Term | Intent | NAMI asset | Cluster opportunity |
|---|---|---|---|
| `flow funnel` | Branded product | `/offers/flow-funnel` (live) | Sub-pages: "Flow Funnel for coaches", "Flow Funnel vs Linktree", "What is a Flow Funnel?" |
| `brand decay` | Diagnostic framework | `/insights/brand-decay` (live) | Sub-pieces on each of the four shapes (tonal, visual, promise, system) |
| `friction tax` | Operational framework | `/insights/the-friction-tax` (live) | Sub-pieces on admin friction, content friction, sales friction, ops friction |

**Why these win.** Most studios don't name their frameworks. Naming creates ownability. Six months of consistent content under each name + proper schema gives NAMI ~80% SERP coverage for the exact-match queries.

### Tier 2 — NICHE LONG-TAIL (target across services + work pages)

Mid-tail terms where intent specificity beats domain authority. These should appear naturally in page H1s, H2s, and meta titles.

**Service-led:**
- `brand and content studio`
- `brand and automation studio`
- `brand strategy and website studio`
- `creative ops agency`
- `creative partner for founders`
- `fractional creative director`
- `fractional brand director`
- `brand systems studio`
- `founder brand studio`
- `independent creative studio UK`

**Audience-led:**
- `creative studio for founders`
- `brand agency for small businesses UK`
- `landing page agency for creatives`
- `landing page agency for coaches`
- `landing funnel for freelancers`

**Outcome-led:**
- `self-sustaining marketing system`
- `brand operations agency`
- `automated lead capture for small business`

### Tier 3 — PROBLEM-AWARE LONG-TAIL (AI Overview citation gold)

These are the queries cold ICP visitors type when they don't know they need NAMI yet. Optimize content to answer them directly in 40-60 word self-contained blocks (snippet-extractable).

**"What is" queries (definition extraction):**
- `what is brand decay`
- `what is a flow funnel`
- `what is the friction tax`
- `what is creative ops`
- `what is brand drift`
- `what is a self-sustaining marketing system`
- `what is brand infrastructure`

**"How to" queries (process extraction):**
- `how to fix inconsistent marketing`
- `how to build a brand that compounds`
- `how to stop being the marketing bottleneck`
- `how to know if your brand is decaying`
- `how do founders stop drowning in admin`
- `how to capture leads from instagram`

**Comparison / decision queries:**
- `agency vs in-house creative team`
- `brand agency vs freelancers for founders`
- `should I hire a creative agency or do it myself`
- `linktree vs landing page funnel`
- `boutique studio vs agency for early stage founders`

**Identification queries:**
- `signs your brand is inconsistent`
- `signs your funnel is leaking leads`
- `signs your business has outgrown its website`

### Tier 4 — BRAND TERMS (defensive)

Own these completely. They're already mostly covered but verify Search Console for variants.

- `NAMI Creative`
- `NAMI Creative studio`
- `NAMI Newcastle`
- `Joe Wilson NAMI`
- `brandingbyjoewilson`
- `NAMI Creative Joe Wilson`

### Tier 5 — LOCAL (LIGHT TOUCH — already decided)

Per earlier strategy: Newcastle gets a footer line + LocalBusiness schema. Don't build location-specific landing pages or chase local head terms — they attract the wrong ICP (price-shopping SMB).

---

## 2. Page-by-page keyword targeting

| Route | Primary keyword | Secondary keywords | Current state | Action |
|---|---|---|---|---|
| `/` | `creative studio for founders` | brand systems studio, brand and content studio, self-sustaining creative ecosystem | Title: brand-only ("NAMI Creative · Brand, Content, Systems") | Tighten title with primary keyword, keep brand suffix |
| `/work` | `creative studio case studies` | brand strategy case studies, conversion funnel case studies | Title: "Selected work" (no keywords) | "Selected work — brand, content, and conversion case studies" |
| `/work/[slug]` | `[client] case study` + sector | brand strategy, conversion funnel, etc. | Title: "[client] · case study" (OK) | Add sector to title for long-tail match |
| `/services` | `creative studio services` | brand strategy, content systems, conversion funnel, automation | Title: "Services" (no keywords) | "Services — brand, content, websites, visual direction, automation" |
| `/services/brand-strategy` | `brand strategy studio` | positioning, identity system, brand framework | Title: from service.title (OK but generic) | Title format: "{service.title} · Brand strategy + identity studio UK" |
| `/services/content-systems` | `content systems studio` | content engine, editorial system, content automation | Same | Same pattern |
| `/services/website-funnel` | `conversion website agency` | landing page funnel, website design UK | Same | Same pattern |
| `/services/visual-direction` | `creative direction studio` | art direction, visual systems, brand visuals | Same | Same pattern |
| `/services/automation-growth` | `marketing automation agency` | lifecycle email, lead capture pipelines | Same | Same pattern |
| `/process` | `how NAMI works` | brand engagement process, design + build + ship | Title: "Process" (no keywords) | "Process — discovery, design, launch, partnership" |
| `/pricing` | `creative studio pricing` | brand engagement pricing, retainer pricing | Title: "Pricing" (no keywords) | "Pricing — project, partnership, systems engagements" |
| `/about` | `creative studio founder Newcastle` | Joe Wilson, NAMI founder | Title: "About" (no keywords) | "About — Joe Wilson, founder of NAMI Creative" |
| `/contact` | `start a project with NAMI` | book a creative studio call | Title: "Contact" (low value) | "Contact — start a brand or website project" |
| `/insights` | `creative studio insights` | brand strategy articles, content strategy notes | Title: "Creative Waves · Studio notes from NAMI Creative" (good) | Keep, minor tightening |
| `/insights/[slug]` | from MDX frontmatter | per-article | Title: from post.title (good) | Already good |
| `/insights/topic/[tag]` | `[tag] articles` | per-tag | Title: from tag (good) | Already good |
| `/offers/flow-funnel` | `flow funnel`, `landing page for founders` | landing page funnel UK, lead capture page | Title: "The Flow Funnel" (good for branded, weak for long-tail) | "The Flow Funnel — landing page + lead funnel for founders, £500" |

**Cannibalization risk to watch:** `/services/website-funnel` and `/offers/flow-funnel` both target landing-page intent. Differentiation: services page targets *bespoke £4-40k builds*; offer page targets *productised £500 builds*. Keep meta + H1 distinct.

---

## 3. AI SEO — citation strategy

The 2024 Princeton GEO research (the canonical study on what gets cited by AI search) found these levers in order of citation lift:

1. **Cite sources** (+40%) — link to authoritative references
2. **Add statistics** (+37%) — specific numbers with sources
3. **Add quotations** (+30%) — expert quotes with name + title
4. **Authoritative tone** (+25%)
5. **Improve clarity** (+20%)

NAMI's existing content is already strong on tone + clarity. The leverage now is in **statistics + citations** inside the insights articles + framework definitions.

### Action: add `/llms.txt`

A 50-line context file at site root that gives AI systems a quick overview of NAMI: what it is, who it serves, key pages. AI assistants reference these when forming answers about a brand.

### Action: add `/pricing.md`

A machine-readable pricing file for AI agents that are evaluating creative studios on behalf of buyers. Lists the three engagement models (Project, Partnership, Systems+Product) plus the Flow Funnel productised tier. Drastically improves AI-mediated buyer-journey inclusion.

### Action: explicit AI bot allow rules in `robots.txt`

Current robots.txt uses wildcard `User-agent: *`. Adding explicit allow rules for `GPTBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended`, `Bingbot`, and `ChatGPT-User` is best practice. Signals to AI platforms that NAMI explicitly welcomes citation.

### Action: definition micro-sections for framework terms

Add a single-paragraph definition near the top of each cornerstone page, structured for snippet extraction (40-60 words, leads with a direct definition, no preamble):

- `/offers/flow-funnel` → "A Flow Funnel is..."
- `/insights/brand-decay` → "Brand decay is..." (likely already in the article, verify)
- `/insights/the-friction-tax` → "The friction tax is..." (likely already in the article, verify)

These are the answer-paragraphs Google AI Overviews and ChatGPT-search will lift verbatim when someone asks "what is a flow funnel" / "what is brand decay" / "what is friction tax."

---

## 4. Technical SEO — implementation checklist

### High-leverage (ship now)

- [x] Sitemap dynamic, registers offers route — done previous session
- [x] JSON-LD foundation (Organization, LocalBusiness, Service, FAQPage, Article, CreativeWork, Person, WebSite) — done previous session
- [ ] Refine meta titles across all routes (per table in §2)
- [ ] Refine meta descriptions where they're weak or duplicate
- [ ] Add `/llms.txt` to public root
- [ ] Add `/pricing.md` to public root
- [ ] Add explicit AI bot allow rules to robots.ts
- [ ] Add `BreadcrumbList` JSON-LD to nested routes (`/work/[slug]`, `/services/[slug]`, `/insights/[slug]`, `/offers/flow-funnel`, `/insights/topic/[tag]`)
- [ ] Audit + add `alt` attributes on every Image component across the site
- [ ] Add definition micro-sections for Flow Funnel + verify Brand Decay + Friction Tax openings

### Medium-leverage (next sprint)

- [ ] Internal linking pass: every services page links to relevant case studies + relevant insights
- [ ] Internal linking: case studies link to the services they used
- [ ] Insights articles: cross-link related articles within each cluster
- [ ] Add `last updated` dates visibly to insights articles (already in frontmatter, may not be rendered)
- [ ] Author bio on insights articles (Joe Wilson, founder of NAMI Creative, link to /about)

### Defer (require content production)

- [ ] Build Brand Decay cluster: 4 sub-articles, one per shape
- [ ] Build Friction Tax cluster: 3-4 sub-articles, one per friction type
- [ ] Build Flow Funnel cluster: "Flow Funnel for coaches", "Flow Funnel vs Linktree", "What is a Flow Funnel?"
- [ ] Wikipedia entity work (citation flywheel — only worth it once cluster content depth is in place)
- [ ] Comparison/alternative pages ("NAMI Creative vs [agency type]")
- [ ] Submit sitemap to Google Search Console + Bing Webmaster Tools

---

## 5. E-E-A-T strengthening

NAMI's `/about` page already does most of this — Joe's name, photo, LinkedIn link, signed story, named clients (real businesses with public footprints), case studies with metrics. The gaps:

- **Author attribution on insights:** insights pages should clearly attribute to Joe Wilson (with link to `/about`) and show "Last updated" dates prominently. AI systems weight authored, dated content much higher than unattributed.
- **Citations within articles:** insights articles like Brand Decay and Friction Tax open with specific business scenarios. Adding a short "Sources" or "Examples" footer with linked references (industry studies, named brands as examples) materially lifts AI citation potential per the Princeton research.
- **Structured author markup:** Person schema is wired on `/about`. The insights articles' Article schema already references that Person via `@id`. Verify and extend.

---

## 6. Content cluster strategy (the long game)

The cornerstone moat for NAMI's SEO is content clusters around the three proprietary terms. Each cluster has:

- **Pillar page** (the "What is X?" definitive guide) — exists for all three
- **Sub-pages** answering specific sub-queries
- **Internal linking** between pillar and subs + back-references to relevant services + relevant case studies
- **Updated quarterly** to maintain freshness signals

### Brand Decay cluster

- Pillar: `/insights/brand-decay` (live, strong)
- Subs to build (Tier 2 priority):
  1. `Tonal decay — how brand voice drifts and how to catch it`
  2. `Visual decay — the four ways identity falls apart`
  3. `Promise decay — when positioning stops matching the product`
  4. `System decay — why brand books die in Dropbox`
- Cross-links: from Brand Decay → `/services/brand-strategy` + relevant case studies (ECA, The League)

### Friction Tax cluster

- Pillar: `/insights/the-friction-tax` (live)
- Subs to build:
  1. `The admin friction tax — the hidden hours founders give up every Friday`
  2. `The content friction tax — why your team ships less than they could`
  3. `The sales friction tax — what every founder pays before closing a deal`
- Cross-links: from Friction Tax → `/services/automation-growth` + Barking Puppy / MILLIONS case studies

### Flow Funnel cluster

- Pillar: `/offers/flow-funnel` (live)
- Subs to build:
  1. `What is a Flow Funnel? The £500 alternative to a £4k website` (definitional, AI-citation magnet)
  2. `Flow Funnel vs Linktree — why a real funnel out-converts a bio link`
  3. `Flow Funnel for coaches / for freelancers / for small businesses` (programmatic-ish, three variations)
- Cross-links: from each sub → `/offers/flow-funnel` + VESSL case study

**Editorial cadence:** minimum monthly publishing, ideally biweekly. Two months of weekly cornerstone content seeds the clusters; then settle into monthly maintenance.

---

## 7. Monitoring

### Search Console + Analytics

- Submit sitemap to Google Search Console (one-off task)
- Submit to Bing Webmaster Tools (Microsoft Copilot pulls from Bing)
- Monthly: review GSC for impression growth on Tier 1-3 keywords
- Monthly: review GA4 for organic landing-page mix and behaviour on `/offers/flow-funnel`

### AI visibility (manual, monthly)

For Tier 1 + Tier 3 queries, manually check:
- Google AI Overviews (is NAMI cited?)
- ChatGPT search (is NAMI cited? Who is?)
- Perplexity (same)

Log in a simple spreadsheet, track month-over-month. After 3 months of cluster content, if NAMI isn't appearing for "what is brand decay" / "what is a flow funnel" / "what is the friction tax", revisit the cluster depth and authority signals.

---

## 8. What to do FIRST (this session's scope)

Tightened to what's actually shippable now without writing new article content:

1. ✅ Strategy doc (this file)
2. Refine meta titles + descriptions across every route
3. Add `/llms.txt`
4. Add `/pricing.md`
5. Update `robots.ts` with explicit AI bot allow rules
6. Add `BreadcrumbList` JSON-LD to nested routes
7. Audit + add image alt text site-wide
8. Add Flow Funnel definition micro-section near top of `/offers/flow-funnel`
9. Verify Brand Decay + Friction Tax MDX articles have answer-paragraph openings (read-only check, recommend if needed)
10. Internal linking polish where natural

Cluster content production (Brand Decay subs, Friction Tax subs, Flow Funnel subs) is deferred. That's editorial work that needs Joe's voice and time — out of scope for this implementation pass.
