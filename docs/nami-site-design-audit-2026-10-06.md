# NAMI Creative site design audit

Date: 6 October 2026  
Scope: every public, member-facing and admin-facing page in the current Next.js application  
Status: audit only. No live deployment or production design change has been made.

## Executive verdict

NAMI does not look like a disposable AI-generated website. It has real subject matter, a recognisable point of view, local photography, working product features, genuine reviews and a clear magenta brand marker. Those are substantial advantages.

The site does, however, use many of the same visual shortcuts found in the attached report. The problem is cumulative. Full-height centred heroes, blurred colour fields, translucent dark panels, rounded cards, pills, glow shadows, staggered entrances and lift-on-hover effects recur across almost every route family. The result can feel assembled from a fashionable component kit even when the content is original.

The next design should not reject the existing brand. It should make the brand more disciplined. Real members, real work, North East imagery and Joe's voice should provide the character. The interface can become quieter, sharper and more varied.

**Overall design maturity: 13/20**

| Area | Score | Summary |
| --- | ---: | --- |
| Brand distinctiveness | 15/20 | Strong colour, local context and voice, weakened by familiar agency effects. |
| Visual hierarchy | 13/20 | Headline scale is clear, but repeated centred compositions flatten the journey. |
| Layout craft | 11/20 | Responsive grids work, but equal cards and repeated section recipes dominate. |
| Interaction design | 10/20 | Good feedback exists in forms, but motion and hover treatments are overused. |
| Accessibility | 12/20 | Focus and reduced motion are present, but nested landmarks, tiny interface text and missing skip navigation need work. |
| Product UI | 13/20 | Capable workflows and useful data, but the member/admin shell needs a calmer information architecture. |
| Content credibility | 18/20 | Real members, real reviews, real work and grounded copy are major strengths. |
| Technical presentation | 14/20 | Metadata and tokens are solid. Loading and route-level error experiences are missing. |

## Method

This audit combines five inputs:

1. The supplied report and its visual, structural, copy and technical warning signs.
2. A source review of all 51 page routes plus shared components, global styles and motion utilities.
3. A pattern count across `app`, `components` and `app/globals.css`.
4. A visual and accessibility-tree review of the live Network experience.
5. The four supplied design skills: Design Taste Frontend v2, Design Taste Frontend v1, Impeccable and UI/UX Pro Max.

The UI/UX Pro Max recommendation script could not execute because the Windows Python launcher failed with an unavailable logon session. Its documented accessibility, responsive, interaction and consistency checks were still applied manually.

The code and live site are not perfectly identical. The local branch contains a small set of previously pushed Network footer changes that were deliberately not deployed after the instruction to stop before pushing live. This audit treats the local source as the future working baseline and uses the live site for visual validation.

## Evidence snapshot

The site has a meaningful component system, but the current styling vocabulary is saturated:

| Pattern | Matches | Files affected |
| --- | ---: | ---: |
| Rounded pills | 198 | 62 |
| Large rounded corners | 121 | 46 |
| Centred text compositions | 95 | 42 |
| Uppercase, tracked labels | 90 | 28 |
| Hover lift | 71 | 36 |
| Backdrop blur | 62 | 30 |
| Magenta glow shadows | 50 | 30 |
| Linear gradients | 37 | 26 |
| Parallax references | 27 | 12 |
| Radial gradients | 22 | 17 |
| Letter reveal references | 20 | 8 |
| Spotlight card references | 16 | 6 |
| Image zoom on hover | 16 | 14 |

These counts include valid uses. They matter because of how widely the same treatment spreads. A premium system needs a smaller number of effects with clearer jobs.

## How NAMI stacks up against the supplied report

### Random purple gradients and glow

**Finding: needs substantial reduction, but the brand colour itself is valid.**

NAMI magenta is established and recognisable. Removing it would weaken the brand. The issue is the ambient treatment: magenta light blooms, cyan light fields, blur, glow shadows and gradient overlays frequently appear together. The home hero uses two pointer-reactive light fields over video, while shared hero and footer components add further blooms and fades. This resembles the report's warning even though the chosen colour is intentional.

Recommended response: keep solid magenta for action, selection and small emphasis. Remove most glow, cursor-reactive light and decorative cyan. Let photography and composition create atmosphere.

### Sparkles, novelty icons and emoji UI

**Finding: mostly passes.**

The site uses Lucide icons consistently and does not depend on emoji for navigation. There is no strong sparkle motif in the reviewed route system. Icons still appear too often as decoration inside cards, especially service and dashboard cards, but the icon language itself is coherent.

Recommended response: keep icons where they improve scanning or identify an action. Remove them where the heading already says the same thing.

### Hover effects on every card

**Finding: fails the restraint test.**

Hover lift appears 71 times across 36 files. Spotlight cards add pointer tracking and tilt. Many media cards also zoom their image. This makes unrelated objects behave alike and creates continuous low-level movement.

Recommended response: use one quiet interactive treatment per component. A border change or text-arrow movement is enough for most cards. Reserve image zoom for image-led editorial and portfolio cards. Remove tilt from service, testimonial and utility cards.

### Fake testimonials and dead social links

**Finding: passes.**

The testimonials are attributed and the Network reviews link to their original Google reviews. Social links point to real profiles. This is a strong credibility signal and should remain.

Recommended response: make the source and context even more visible, but avoid adding decorative star rows or fabricated metrics.

### Huge icons with tiny text

**Finding: mixed.**

Public cards generally keep icons modest. Admin and dashboard surfaces use interface text as small as 9px and 10px, often next to large metrics or icon containers. This is difficult to read and makes the product feel compressed rather than considered.

Recommended response: set 12px as the practical minimum for persistent UI copy. Use 14px for explanatory text. Reduce the icon container rather than shrinking the label.

### Generic font and weak type rhythm

**Finding: partially present.**

Instrument Sans is a sound brand font, and the global type roles are a good start. Nearly every surface uses the same family, weight range and tight tracking, however. Large headings, card headings, metadata and product labels do not always establish a distinctive editorial rhythm.

Recommended response: first improve role discipline, measure and composition. Test a supporting display or editorial face only if it clearly adds character. A second font is not automatically more premium.

### Translucent header and glass cards

**Finding: overused.**

The sticky header, dropdowns, form surfaces, content cards and many panels rely on transparency and backdrop blur. The shared `glass-refractive` component explicitly combines gradient, blur, inset highlight and shadow.

Recommended response: keep translucency for the scrolled navigation if it remains useful. Convert most content and product surfaces to solid elevations or simple hairline divisions.

### Bad animation and excessive entrances

**Finding: technically careful, creatively excessive.**

Reduced motion is respected globally and on the major motion components. That is good. The site still layers Lenis smooth scrolling, character-by-character heading reveals, scroll reveals, parallax, cursor-reactive lights, magnetic buttons, spotlight cards, image zoom and hover lift. Motion is being used as a general styling layer rather than to explain state or hierarchy.

Recommended response: retain a single signature entrance for major public pages. Use standard 160 to 240ms transitions elsewhere. Product areas should prioritise state feedback over cinematic movement.

### Missing loading states

**Finding: application controls often pass, route transitions do not.**

Forms and admin actions frequently show submitting or busy states. There are no route-level `loading.tsx` files and no route-level `error.tsx` files. Data-heavy Network, dashboard and admin routes can therefore feel blank or fail without a designed recovery surface.

Recommended response: add route-family loading, empty and error states. Skeletons should mirror the final structure and avoid animated shimmer when reduced motion is enabled.

### Inconsistent component placement and misaligned grids

**Finding: the container is consistent, but section composition is not systematic enough.**

The `container-shell` provides a stable width. Individual pages then choose their own grid ratios, padding, section heights, card radii and responsive switches. The directory is especially busy because category grids, event cards, member cards, discovery panels and location pills use different internal rules on one long page.

Recommended response: define a small set of page compositions and section rhythms. Variation should come from content priority, not one-off spacing values.

### Random border radii

**Finding: needs consolidation.**

The code uses `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl` and `rounded-full` across related controls and panels. Rounded-full alone appears 198 times.

Recommended response: use 8px for controls and compact panels, 12px for large media or feature panels, and full rounding only for true pills, avatars and selected primary actions.

### Generic taglines and overloaded heroes

**Finding: copy is stronger than the report's examples, but the hero recipe is repetitive.**

NAMI's headings and body copy are specific to the business and the North East. The shared `PageHero` still places almost every inner page in a full-height, centred, animated hero with background media and light effects. The pages become visually interchangeable before their content begins.

Recommended response: create distinct hero archetypes for consultancy, case study, directory, editorial and product contexts. Not every page needs a viewport-height opening.

### Missing metadata and non-functional controls

**Finding: metadata passes; control quality is generally good.**

The root layout provides titles, descriptions, canonical metadata, Open Graph, Twitter cards, favicon and structured data. Dynamic directory, news, event, service and work pages generate metadata. Forms use labels, disabled states and error messaging in the inspected flows.

Recommended response: preserve this foundation and regression-test it throughout the overhaul.

## What is already working well

### The content is real

Member profiles, portfolio images, events, reviews and stories do more for the brand than any glow effect. They immediately separate NAMI from a generic landing page.

### The brand has a clear anchor

The dark base, white type and magenta accent are recognisable. The redesign needs fewer additions, not a different colour identity.

### The site has useful shared foundations

Global colour tokens, type roles, focus-visible styling, reduced-motion handling, responsive containers and shared content components already exist. The overhaul can improve the system rather than starting from nothing.

### Forms communicate state

The join form disables submission, exposes `aria-busy`, reports errors and supports broad image selection. Admin actions also expose busy states. These behaviours should survive any visual rewrite.

### SEO presentation is well established

Metadata, social images, favicons, schema and dynamic page metadata are already implemented. The visual overhaul should not alter routes or remove crawlable content.

## System-level findings

### P0: no immediate visual blocker

There is no design fault that requires an emergency live change. The current site is usable and recognisable. Work should happen in an isolated local preview as requested.

### P1: landmark structure is invalid on multiple pages

The root layout provides `<main id="main">`, while 14 page or feature components render another `<main>` inside it. This affects member articles, news, events, member profiles, contribution screens and admin screens.

Impact: assistive technology receives nested main landmarks, and future app-shell work becomes harder.

Fix: keep one main landmark per rendered page. Change nested page wrappers to `div`, `section` or `article`, or move the main landmark into route-group layouts.

### P1: public and product surfaces share one shell

The root layout always renders the marketing header and footer. Member and admin screens then add their own navigation, spacing and fixed mobile controls inside that shell.

Impact: operational pages feel like marketing pages with a dashboard inserted into them. Hierarchy, mobile space and keyboard navigation suffer.

Fix: introduce route groups with a shared brand foundation but distinct shells:

- `(marketing)` for consultancy pages.
- `(network-public)` for directory, stories and events.
- `(member)` for login, account, dashboard, contributions and event management.
- `(admin)` for moderation and operations.

This is a code organisation change only. Public URLs stay the same.

### P1: the effects budget is uncontrolled

Gradients, blur, glow, parallax, character reveals and hover movement are individually reusable, but there is no rule limiting how many appear in one section or route.

Fix: adopt an effects budget. One atmospheric device per public page opening, one interaction signal per clickable component, and no decorative motion in member/admin surfaces.

### P1: card monoculture reduces hierarchy

Services, proof points, benefits, testimonials, member groups, events, dashboards and calls to action often become bordered rounded rectangles. Content with different importance looks structurally similar.

Fix: define content-specific components. Use editorial rows, split features, image-led stories, comparison tables, numbered process lists, flat data groups and simple ruled lists where appropriate.

### P1: route-level waiting and failure are undesigned

There is one app-level not-found page but no `loading.tsx` or `error.tsx` route surfaces.

Fix: add scoped states for Network public data, member tools and admin tools. Preserve form-level status handling.

### P2: type roles exist but are not enforced

Global type roles are present, yet many pages use direct arbitrary sizes, 9px or 10px labels, custom tracking and one-off line heights.

Fix: make named roles the default and add product-specific UI roles. Audit line length and heading wraps at real content lengths.

### P2: shape and spacing have drifted

Related components choose from five radii and many one-off padding combinations. Section padding tends to default to large symmetrical blocks.

Fix: publish a small radius scale and section rhythm matrix. Use asymmetric spacing only when the composition benefits from it.

### P2: global smooth scrolling adds cost without enough value

Lenis runs on every non-reduced-motion desktop session. The site already uses many animated layers.

Fix: test native scrolling against the current implementation. Remove Lenis unless it produces a clear, measurable improvement.

### P2: the cursor treatment weakens native familiarity

The global CSS replaces the desktop arrow and hand with pink SVG cursors. The separate animated cursor component is currently not mounted, which avoids the more disruptive version.

Fix: test the branded cursor with real users. The premium default is the native cursor plus strong focus and hover states. If the pink cursor remains, keep it simple and never hide native interaction cues.

## Route-family audit

### Homepage

Strengths: direct proposition, live Network proof, local imagery and a clear connection between consultancy and community.

Issues: the opening combines video, two reactive blurred lights, parallax, character reveal, magnetic buttons and glow. Later sections return to rounded panels and sticky compositions. The first impression is more effects-led than work-led.

Direction: use one decisive visual idea. A restrained film or strong still can carry the opening. Move proof closer to the proposition, expose selected work earlier and use the Network as a living content strip rather than another group of cards.

### About

Strengths: Joe's biography and the Network story are credible and personal.

Issues: the page moves from a standard full-height hero into a portrait card, statistics, another split Network section and a three-card expectation grid. The closing grid makes personal qualities look like product features.

Direction: build the page as an editorial profile with portrait, pull quotes, a chronological proof rail and a clear bridge between client work and the Network. Reduce card framing.

### Services and service detail

Strengths: services are concrete and linked to useful outcomes.

Issues: the six-cell service grid, icons, spotlight response, glass, rounded corners and CTA cell look like a component-library showcase. Detail pages repeat effects and section blocks.

Direction: make the services index a clear decision page. Use a ruled service list or asymmetric index with scope, outcome and fit. Give each detail page a consistent anatomy: problem, approach, deliverables, proof, process and next step.

### Work and case studies

Strengths: named organisations and real outcomes provide strong proof.

Issues: cards carry overlays, pills, icons, tags, glow and hover zoom around the work. The presentation can feel more decorated than the evidence.

Direction: make case-study imagery and outcomes dominant. Use fewer labels, larger images, clear before-and-after narrative and restrained project metadata.

### Process and pricing

Strengths: these pages answer high-intent questions directly.

Issues: they inherit the same hero and reveal language, so their practical job is diluted.

Direction: make both pages exceptionally clear. Process should feel sequential. Pricing should feel comparable, transparent and calm, with edge cases handled in plain language.

### Contact

Strengths: the form is focused and the hero uses relevant local imagery.

Issues: it still opens as a cinematic campaign page before asking the visitor to act. The member tooltip adds useful proof but competes with the enquiry intent.

Direction: use a shorter split hero that pairs the promise with response expectations, direct contact routes and the form. Keep the Network proof compact.

### Campaign offers

Strengths: both offer pages have specific conversion goals and detailed copy.

Issues: the Flow Funnel page is the most motion-heavy route in the code audit. Both campaigns use many gradients, glows and repeated conversion blocks. Their visual language drifts away from the main brand.

Direction: retain campaign specificity but bring both into one offer template system with a stronger proof hierarchy, fewer effects and consistent form behaviour.

### Network join page

Strengths: the value, eligibility, reviews and post-application process are all explained. The content is much stronger than a typical community sign-up page.

Issues: the page is long and repeatedly returns to centred headings, three or four equal cards and rounded panels. The full-height opening delays the practical journey. The join form arrives after several visually similar sections.

Direction: create a more deliberate narrative: why it exists, who is already here, what members can do, what happens after joining, proof, then form. Use member work as the layout, not as decoration inside a card system.

### Directory and category pages

Strengths: this is NAMI's most defensible product. Real members, work categories, places and events create genuine utility.

Issues: the main directory stacks many visual systems in one route. Featured creative, category groups, event cards, location pills, other categories and discovery panels compete for attention. Cards and pills carry too much of the layout.

Direction: treat the directory as a browsing product. Strengthen search and filter hierarchy, introduce clear content bands, keep member cards consistent, and let category pages use a leaner shell. Provide loading, empty and no-results states.

### Member profiles

Strengths: profiles contain meaningful biographies, portfolios, links and shareable identity.

Issues: the long page still inherits decorative public-page conventions. Profile utility can be obscured by visual sections and repeated CTAs.

Direction: establish a strong profile header, concise facts, portfolio, about, links, events and stories. Make contact and sharing actions persistent but quiet. Keep the member's work visually dominant.

### News hub and articles

Strengths: the article reader is one of the strongest directions in the site. It uses editorial scale, a readable column and member attribution. The member-written policy is explicit.

Issues: the hub has been iterated section by section and does not yet feel like one publication system. The article component creates a nested main landmark. Several metadata labels are small and heavily tracked.

Direction: develop a true magazine hierarchy with one lead story, a current stream, recurring sections and useful routes into members and events. Keep the reader quieter than the hub. Standardise image ratios and contribution rendering.

### Events

Strengths: event pages offer practical details, organiser context and calendar actions.

Issues: event cards use the familiar image-overlay, gradient, rounded-corner and hover-lift recipe. Detail pages contain many rounded panels.

Direction: treat date and place as primary information. Use poster-like event cards and a simple event detail structure. Make expired, cancelled, free and sold-out states unmistakable.

### Authentication and account recovery

Strengths: the flows are separated and copy is generally clear.

Issues: they inherit the full global marketing shell and have no shared authentication layout or route-level error boundary.

Direction: create one compact authentication shell with strong status messaging, clear recovery paths and minimal distraction.

### Member dashboard, contributions and event management

Strengths: the underlying workflows are useful and increasingly complete. Draft, preview, save and submit concepts are present.

Issues: marketing styling, very large headings, fixed controls, bordered panels and many button styles compete with the task. Some responsive controls become dense. The builder needs a clearer separation between document structure, content, status and preview.

Direction: create a dedicated member workspace. Use persistent status, predictable action placement, autosave feedback, clear mobile tool access and a quieter editor canvas.

### Admin dashboard and moderation

Strengths: the dashboard includes operational data, queues, integrations, growth, tickets, events and approvals.

Issues: it is a very large client component with many inline subcomponents and dense card grids. Text falls to 9px and 10px. Most information uses similar rounded panels, so urgent tasks do not dominate enough.

Direction: design around decisions. Start with an inbox of work requiring action, then health exceptions, then performance. Move reporting into dedicated views. Use tables and lists when comparison matters. Split the implementation into route-level modules.

### Thank-you, legal and error pages

Strengths: the content exists and follows the brand.

Issues: success pages are more decorative than necessary, legal pages are long, and there are no designed route errors or loading states.

Direction: make success pages concise with one next step. Improve legal-page reading width and in-page navigation. Add reliable not-found, error and retry patterns for each shell.

## Proposed premium design direction

### One brand, four layout grammars

NAMI should feel connected without forcing every page into one template.

1. **Consultancy:** editorial, outcome-led and confident.
2. **Network public:** energetic because of people and work, not effects.
3. **Editorial:** magazine-like hierarchy and calm reading.
4. **Product:** compact, stable, task-led and accessible.

### Make magenta earn its place

Use magenta for the primary action, active state, focus ring, selected filter and a small amount of editorial emphasis. Do not use it simultaneously as a glow, gradient, border, background and shadow around the same object.

### Use photography as evidence

North East photographs, member portraits and project images are the bespoke visual material. Increase their quality, cropping discipline and scale. Avoid covering them with unnecessary badges, gradients and icons.

### Replace card grids with editorial structures

Use cards only where an item truly needs a self-contained click target. Elsewhere use ruled lists, indexes, split layouts, tables, sequences, feature bands and asymmetric story groupings.

### Separate atmosphere from interaction

A section may have atmosphere, or it may be highly interactive. It rarely needs both. Keep cursor response and parallax away from forms, filters, dashboards and reading pages.

## Local overhaul plan

### Safeguard first

1. Create a local `design/reimagined` branch from the current source.
2. Tag or record the current baseline commit.
3. Keep all public URLs, content records, API routes, metadata and analytics unchanged.
4. Add a local-only design switch such as `NAMI_DESIGN_PREVIEW=1` so the original components remain available during review.
5. Never run the Cloudflare deployment command during the redesign phase.

### Phase 1: foundations

- Correct the landmark structure.
- Introduce route-group shells without changing URLs.
- Consolidate colour, type, spacing, radius, elevation and motion tokens.
- Remove unused or duplicate effect primitives.
- Add skip navigation.
- Add route-level loading and error states.
- Establish desktop, tablet and mobile visual test widths.

### Phase 2: global chrome

- Rebuild the header around clarity and calm.
- Simplify dropdown styling and keyboard behaviour.
- Refine footer information hierarchy.
- Define consultancy and Network CTA variants without duplicating them on destination pages.
- Test whether the custom cursor and Lenis scrolling provide enough value to keep.

### Phase 3: consultancy pages

- Homepage.
- About.
- Services index and service template.
- Work index and case-study template.
- Process, pricing and contact.
- Shared proof, testimonials and enquiry patterns.

### Phase 4: Network public experience

- Join page.
- Directory index, category and all-member views.
- Member profile template.
- Events index and detail.
- Shared member, event, filter and discovery components.

### Phase 5: publishing hub

- News homepage and section navigation.
- Story cards and featured-story system.
- Article reader, attribution and contribution CTA.
- Member, article and event cross-linking.

### Phase 6: member product

- Authentication and account recovery shell.
- Member dashboard and account management.
- Event submission and management.
- Contribution list, editor and live preview.
- Mobile action system and saved-state feedback.

### Phase 7: admin product

- Task inbox and approval flows.
- Member, event and article moderation.
- Operations health and failed jobs.
- Reporting and growth views.
- Responsive tables, accessible charts and clear empty states.

### Phase 8: campaign, legal and completion surfaces

- Flow Funnel and Creator Wave offers.
- Thank-you pages.
- Privacy and terms.
- Not-found, loading, error and recovery states.

### Phase 9: verification

- Keyboard-only walkthrough.
- Screen-reader landmark and form check.
- Reduced-motion check.
- 320px, 375px, 768px, 1024px, 1440px and wide-screen review.
- Real-content stress test for long names, missing images and large portfolios.
- Lighthouse and bundle review.
- Metadata, canonical, sitemap, robots and schema regression check.
- Form, authentication, image upload and moderation smoke tests.

## Review checkpoints

The local redesign should be reviewed in four deliberate passes:

1. **Foundations and homepage:** confirm the new visual language before it spreads.
2. **Directory and member profile:** prove that the Network can feel richer with fewer effects.
3. **Article reader and member workspace:** confirm editorial and product systems belong to the same brand.
4. **Full route sweep:** compare every template at desktop and mobile before considering deployment.

## Definition of done

- NAMI remains immediately recognisable without relying on glow or gradients.
- No route looks like the same hero and card grid with different copy.
- Public pages use real work and people as the main visual material.
- Member and admin pages have a dedicated, calm product shell.
- There is one main landmark per page and a keyboard skip route.
- Persistent interface text does not fall below 12px.
- All asynchronous routes and actions have loading, empty, success and error states.
- Motion has a stated purpose and reduced-motion alternatives.
- Components use the approved type, spacing, radius and colour roles.
- Existing URLs, content, analytics, forms and SEO features continue to work.
- Nothing is deployed until the local redesign has been reviewed and explicitly approved.

## Recommended first build slice

Start with the foundations, global header and footer, then reimagine three representative screens:

1. Homepage, to establish the public brand language.
2. Directory, to establish the Network browsing language.
3. Contribution editor, to establish the member product language.

Those three screens expose nearly every design problem in the current system. Once they feel related but appropriately different, the remaining templates can be rebuilt with far less rework.
