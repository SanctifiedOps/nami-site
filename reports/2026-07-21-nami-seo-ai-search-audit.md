# NAMI Creative SEO and AI Search Audit

Date: 21 July 2026
Site: https://namicreative.co.uk
Primary goals: improve Google and AI discoverability for the new North East positioning, especially:

- Newcastle creatives
- North East creatives
- North East creative network
- NAMI Creative Network
- marketing services Newcastle
- content strategy Newcastle
- website support Newcastle
- creative partner North East
- small business marketing North East
- buyer journey automation
- common typo variant: northe east creatives

## Executive summary

NAMI had a mismatch between the live site copy and the SEO surfaces. The visible site had moved toward Joe, the North East, the Creative Network, and practical marketing support, but metadata and AI-readable files still described the older brand/content/systems positioning.

This pass updates the crawlable and shareable layer so search engines and AI systems understand NAMI as:

- a Joe-led marketing and creative partner in Newcastle and the North East;
- the home of NAMI Creative Network for North East creatives, artists, freelancers, and small businesses;
- a practical support offer across brand, content, websites, automation, lead flow, and buyer journeys;
- a local entity connected to Newcastle, Jarrow, Gateshead, Sunderland, Durham, Northumberland, Tyne and Wear, and North East England.

## What changed

### 1. Root metadata

Updated the site title, description, keywords, Open Graph, Twitter card, authorship, publisher, category, canonical, and social image alt text.

Old positioning centered on "Brand, Content, Systems" and automation-led language.

New positioning centers on "Newcastle Marketing & Creative Network" and North East creative discovery.

### 2. Page metadata

Updated major page titles and descriptions for:

- `/`
- `/about`
- `/network`
- `/services`
- `/services/[slug]`
- `/work`
- `/work/[slug]`
- `/process`
- `/pricing`
- `/insights`
- `/contact`
- `/thank-you`
- `/network/thank-you`

The focus is now clearer by route:

| Route | Main job |
| --- | --- |
| `/` | Brand/entity homepage for NAMI Creative |
| `/network` | North East creatives and Creative Network intent |
| `/services` | Newcastle and North East marketing services intent |
| `/work` | Proof and case study intent |
| `/about` | Joe Wilson, NAMI mission, local founder intent |
| `/contact` | Project enquiry intent |

### 3. Structured data

Rebuilt the reusable JSON-LD helper around the new entity picture:

- Organization
- ProfessionalService
- WebSite
- Person
- Service
- CreativeWork
- BreadcrumbList
- Article
- FAQPage

Added or improved:

- Instagram and LinkedIn sameAs links;
- contact point;
- area served across Newcastle and the wider North East;
- knowsAbout topics for Newcastle creatives, North East creatives, creative community building, marketing strategy, content strategy, website design, buyer journey automation, and brand positioning;
- local service area for North East England.

### 4. Sitemap

Added `/network` as a priority route and reset key page `lastModified` values to the SEO update date instead of every route using the build date.

Sitemap now gives the clearest crawl priority to:

1. Homepage
2. Creative Network
3. Services
4. Work
5. About
6. Contact
7. Insights

### 5. Robots and noindex

Added `/network/thank-you` to robots disallow rules and added page-level noindex metadata to both thank-you pages.

This keeps conversion confirmation pages out of search while preserving GA4 journey tracking.

### 6. AI-readable files

Rewrote:

- `/llms.txt`
- `/pricing.md`

These now describe NAMI in the current language and include key pages, services, region coverage, Creative Network context, and machine-readable pricing guidance.

## Search Console status

There is no Google Search Console connector available in this Codex environment. I could not directly inspect GSC performance, indexing, or submit the sitemap from here.

Site-side preparation is now in place. The next manual GSC actions are:

1. Open Google Search Console for `namicreative.co.uk`.
2. Submit or resubmit `https://namicreative.co.uk/sitemap.xml`.
3. Use URL Inspection on:
   - `https://namicreative.co.uk/`
   - `https://namicreative.co.uk/network`
   - `https://namicreative.co.uk/services`
   - `https://namicreative.co.uk/about`
4. Request indexing after deployment.
5. Check the Pages report for crawl or canonical issues after Google recrawls.
6. Check Performance queries over the next 2 to 4 weeks for the new North East and Newcastle terms.

## About Google sitelinks

Google chooses sitelinks automatically. They cannot be forced. The best site-side signals are:

- clear navigation;
- distinct page titles;
- useful internal links;
- a complete XML sitemap;
- clear structured data;
- strong brand/entity consistency.

This implementation improves those signals. Sitelinks will still depend on Google recrawling the site, understanding the hierarchy, and seeing enough branded or navigational demand.

## Next recommendations

### High impact

- Create a focused article or page around "North East creatives" that explains the network, who it is for, and how NAMI helps local people get seen.
- Add a short FAQ section to `/network` with natural questions like:
  - What is NAMI Creative Network?
  - Who can join NAMI Creative Network?
  - How do North East creatives get featured by NAMI?
  - Is the Creative Network free?
- Add internal links from homepage, about, and footer to `/network` using natural anchor text like "North East Creative Network".

### Medium impact

- Add visible author/date blocks to insights pages for E-E-A-T and AI citation strength.
- Publish monthly North East creative roundups on the site, not only Instagram, so Google can index the community work.
- Build a simple `/network/roundups` content area once the weekly roundup becomes consistent.

### Monitoring

Track these query groups monthly in GSC:

- Brand: NAMI Creative, NAMI Creative Network, Joe Wilson NAMI
- Local community: Newcastle creatives, North East creatives, North East creative network
- Service: marketing services Newcastle, content strategy Newcastle, website support Newcastle, buyer journey automation
- Misspellings: northe east creatives

## Validation

- Typecheck passed with `npm.cmd run typecheck` on 21 July 2026.
