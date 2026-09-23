# NAMI Creative · Cowork Access Map

> What this assistant can actually reach, verified live on 22 May 2026. Companion to `BRAND_CONTEXT.md`. Every connector below was probed with a real read-only call, not just assumed from a list.
>
> Status legend: **Live** = connected and authorized (verified this session). **Needs setup** = capability exists but something must be connected or fixed first. **Built-in** = always available, no connector required.

---

## 1. Connected accounts + connectors

| Connector | Account / scope | Status | Verified by | What it unlocks for NAMI |
| --- | --- | --- | --- | --- |
| **Notion** | Waves Of Creative Impact hub | **Live** | Fetched the hub and its strategy sub-pages | Read and write the strategy hub: Content Ideas Backlog, Lead Tracker, Decision Log, Wins Log, ICP, positioning. Keep Notion in sync with the codebase. |
| **Make.com** | Joe Wilson · namicreativeuk@gmail.com (account 3544430, Europe/London, 2FA on) | **Live** | `users_me` returned the account | Audit, build, and fix scenarios including the contact-intake one (9186508). Inspect executions, data stores, connections. Catch the Outlook token expiry early. |
| **Microsoft 365 / Outlook** | hello@namicreative.co.uk | **Live** | Calendar search returned real events | Triage the `hello@` inbox, search email and SharePoint, read the calendar, find meeting slots for discovery calls, draft replies in brand voice (you send). |
| **Canva** | 1 NAMI brand kit available | **Live** | `list-brand-kits` returned the kit | Build carousels and NE brand spotlights from the brand kit, generate and export designs, work from brand templates. |
| **Google Drive** | namicreativeuk@gmail.com | **Live** | `list_recent_files` returned files | Read and create docs, reach the `Clients` folder tree (e.g. `Clients/VESSL/Run Stronger Carousel`) and existing carousel assets, move and copy files. |
| **Claude in Chrome** | Browser 1 (Windows, local) | **Live** | `list_connected_browsers` returned the paired browser | Browse live, read JavaScript-rendered pages, and operate sites plain fetch can't read. Acts task-by-task with your confirmation; never purchases or posts without explicit consent. |

Note: the Make.com and Drive connectors are authorized under the `namicreativeuk@gmail.com` Google identity, while Outlook is the `hello@namicreative.co.uk` mailbox. Worth keeping straight when wiring cross-tool flows.

---

## 2. Built-in capabilities (always on)

- **File system access:** read, write, and edit across both connected repos, `nami-site` (`D:\SanctifiedOps\nami-site`) and `nc-marketing-hub` (`D:\SanctifiedOps\nc-marketing-hub`), plus a private scratch workspace for drafts.
- **Shell sandbox:** an isolated Linux environment with Python and Node for running code, scripts, data work, and checks.
- **Document creation:** Word (`.docx`), PowerPoint (`.pptx`), Excel (`.xlsx`), PDF, Markdown, HTML, and SVG, saved straight into your workspace.
- **Web:** search and fetch public pages (with built-in content restrictions). For client-rendered pages, escalates to Chrome once a browser is paired.
- **Scheduled tasks:** recurring or one-off automations (daily, weekly, at a set time). None set up yet.
- **Live artifacts:** reopenable Cowork pages that pull fresh data from the connectors above each time you open them. None created yet.
- **Connector + plugin registry:** can search for and suggest new connectors or plugins when a task needs a tool you haven't connected.

---

## 3. Skills installed

Specialist toolkits the assistant can invoke automatically when relevant:

- **Document formats:** `docx`, `pdf`, `pptx`, `xlsx` (create and edit professional files).
- **theme-factory:** apply a consistent visual theme to docs, slides, and HTML.
- **web-artifacts-builder:** build richer multi-component HTML artifacts.
- **schedule:** set up recurring scheduled tasks.
- **skill-creator:** build new custom skills.
- **setup-cowork:** guided Cowork setup.
- **consolidate-memory:** tidy long-running memory and notes.

Code commands also available in the repos: `init` (scaffold a CLAUDE.md), `review` (PR review), `security-review`.

---

## 4. What this unlocks, mapped to NAMI

A practical view of capability to workflow:

- **Marketing site (`nami-site`):** edit copy in `lib/content/*.ts`, ship new Creative Waves MDX articles, build or fix components, maintain the SEO and AI-search files. Voice-matched and em-dash clean by default.
- **Owner dashboard (`nc-marketing-hub`):** build out the weekly-phase modules (tasks, content calendar, hours, invoicing, portals). Note: this is a non-standard Next.js 16, so its bundled docs get read before any code changes, and the real build state gets verified against the routes (the README is stale).
- **Ops automation (Make.com + Outlook + Notion):** monitor and repair the contact-intake scenario, re-auth the Outlook connection when it expires, route enquiries and leads into the Notion CRM, build weekly digest flows.
- **Content engine (Canva + Drive + Notion + codebase):** turn the three cornerstone articles and five case studies into social atoms and carousels, build from the NAMI brand kit, file assets into the right Drive client folders, log ideas into the Content Ideas Backlog.
- **Inbox + calendar (Outlook):** triage `hello@`, draft brand-voice replies for your approval, and book discovery calls against real availability.
- **Recurring jobs (scheduler):** stand up a Friday review against the 12-week plan, a daily content idea, or a lead and inbox digest.
- **Live dashboards (artifacts):** a reopenable lead-pipeline view, content calendar, or "what is waiting on me" page that refreshes from your connectors.

---

## 5. Gaps and known issues

- **Outlook OAuth in Make expires fast.** The `invalid_grant` errors your setup hits are usually token expiry, not logic bugs. Re-authorize the Microsoft connection in Make first when a scenario fails.
- **No automations or live artifacts exist yet.** Both are available; nothing is running.

---

## 6. Guardrails (what I will not do without your explicit go-ahead)

For safety, certain actions always wait for your confirmation in chat, every time, even with access:

- Sending email or messages, replying, or forwarding. I draft; you send.
- Posting, publishing, or changing anything public (site deploys, social posts).
- Changing sharing, permissions, or access on any file or workspace.
- Downloading files, making purchases, or accepting terms and agreements.
- Permanent deletions (files, emails, records).

The pattern: I do the research, drafting, and building right up to the edge, then hand you the irreversible click.

---

*Keep this current. When a connector is added, removed, or re-authorized, update the table in section 1 and note it here. Last verified 22 May 2026.*
