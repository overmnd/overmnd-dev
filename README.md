1) Executive summary
Problem. Small businesses and MSPs leak access through risky file sharing and waste cash on mis-sized Microsoft 365 licenses. “Big suites” are heavy, expensive, and overkill.
Overmind (MVP). A focused, lightweight web app that does two jobs extremely well:
Sharing Guard — find dangerous SharePoint/OneDrive links; fix with one click; send a weekly digest.
License Optimizer — find downgrade/reclaim opportunities from real usage; apply with one click; log everything; make it reversible.
Positioning. “Quest-style outcomes without the Quest-size footprint.” Read-only by default; explicit consent for fixes; every action logged with a rollback path.

2) Target customers & jobs-to-be-done
Primary: Small businesses (10–250 users) on Microsoft 365. Owners want “no surprises,” not to become admins.
Channel: MSPs managing many small tenants; they need margin without heavy tooling.

Jobs:
“Clean up risky file sharing without babysitting.”
“Stop paying for unused features and seats.”
“Give me a weekly ‘state of the tenant’ I can file for compliance.”

3) What we ship in the MVP (and what we do not)
3.1 Core modules
A) Sharing Guard (v1)
Discovery
Detect “Anyone with the link” and external-domain shares across SharePoint/OneDrive.
Prioritize by risk: link age, path keywords (Finance/HR), number of external domains.
One-click fixes
Revoke anonymous links.
Re-scope to “People in your organization.”
Optional bulk-expire links >30 days.
UX & reporting
Filters + list with risk badges.
Weekly email digest (counts + deep links back).
Every fix logged with pre/post state and Undo.

B) License Optimizer (v1)
Discovery
Pull last 30 days of service usage and sign-ins.
Detect safe downgrades (e.g., M365 Business Standard → Business Basic).
Detect reclaim candidates (no sign-ins 30d; leavers).
One-click fixes
Apply batch downgrades.
Convert leaver mailbox to shared & reclaim license.
“Cart” preview + Undo per batch.
Value
Savings calculator, trend card, monthly savings email.

3.2 Platform features (MVP)
Multi-tenant picker for MSPs.
Consent model: Read-only by default; separate Fix consent for write actions.
Immutable Remediation Ledger (who/what/when/before/after/rollback).
Minimal roles: Owner, Viewer.
Notifications bell with per-user notifications (click to route to the exact item).
Invite-only accounts (self-registration off by default); user preferences persisted.
Settings with schema validation (zod), optimistic updates, shared useSettings() service, and granular audit events for each save.

3.3 Non-goals (MVP)
No tenant-to-tenant migrations.
No backups.
No deep DLP/content inspection.
No broad UAL analytics.
No mobile app.

4) Pricing & packaging (launch)
Starter (single tenant, ≤50 users): $49/mo
Growth (≤250 users): $99/mo
MSP plan: $199/mo includes 10 tenants, then $9/tenant/mo
Optional success fee: 5% of first 30 days’ savings (cap $250 per tenant).
Trial: 30 days, read-only, no card required.
Rationale: predictable spend for owners, clean MSP margin, incentive-aligned success fee.

5) Architecture (production-minded, small)
5.1 Components
Backend: FastAPI (Python) + Pydantic v2
Frontend: React + Vite + Tailwind + Framer Motion + lucide-react
Charts: ApexCharts
DB: PostgreSQL
Auth: Overmind app users (email+pwd, JWT). Tenant access via Microsoft Entra (Graph).
Jobs: APScheduler for discovery + digests.
Email: SMTP (Fastmail) for digests/verifications.
Containers: Docker Compose (dev & simple prod).

5.2 Identity & consent (Graph)
Two app registrations:
Overmind-Read (application perms): Reports.Read.All, Directory.Read.All, AuditLog.Read.All (optional), Sites.Read.All.
Overmind-Fix (consented only when enabling fixes):
License change scopes (User.* assign)
SharePoint write with Sites.Selected (per-site, not tenant-wide)
Guardrails
Read vs Fix clearly separated.
Sites.Selected is granted only to sites we touch.

5.3 Data model (MVP)
Core
tenants(id, display_name, primary_domain, created_at)
consents(id, tenant_id, scope_set, granted_at, granted_by_upn)
findings(id, tenant_id, category[sharing|license], risk_score, evidence_json, first_seen_at, last_seen_at, status)
remediations(id, finding_id, action_type, pre_state_json, post_state_json, actor_user_id, created_at, rolled_back_at)
audit_events(id, tenant_id, actor_user_id, action, payload_json, created_at)
Users & access
users(id, email UNIQUE, password_hash, role, status, is_superuser, created_at, updated_at)
user_preferences(user_id PK/FK, jsonb)
invitations(id, email, role, token, status[pending|accepted|expired|revoked], invited_by, expires_at)
MSP linking: msp_accounts, msp_tenant_links(msp_id, tenant_id)
Notifications
notifications(id, user_id, type, title, body, route, payload_json, read bool, created_at)

5.4 Security model
Least privilege (Sites.Selected per site; batched/reversible license ops).
Secrets via env; move to a secret manager later.
Ledger is append-only; undo writes a new entry.
CORS locked to app origin (dev: localhost).
JWT with short-lived access token; refresh optional post-MVP.

5.5 Telemetry & health
Structured logs (request id, tenant id, job id).
Metrics: job durations, error counts, findings discovered, fixes applied, savings realized.
/healthz liveness.

6) Product surface (pages, flows, acceptance)
6.1 Primary nav & shell
Top nav: Tenants • Home • Findings • Remediations • License Optimizer • Reports • Settings • Notifications Bell • Account Menu
Bell opens a popover: unread list → click routes to target (e.g., /tenants/... or /remediations/...).
Account menu: profile, preferences, sign out (invite-only provisioning).
Error boundary (AppBoundary) protecting the whole app.
Dark theme; consistent spacing, radius, shadows; focus states; accessible colors.

6.2 Tenants
Card grid: name, domain, tags (Office 365, Env), counters for Granted / Not Granted.
Manage opens a modal to edit metadata, tags, and granular Graph permission toggles.
Add Tenant modal with centered option card (Commercial / Office 365 tenant).
Opacity/backdrop standardized (we fixed mis-styled modals).

6.3 Findings (sub-nav)
Dashboard: KPIs (risky links, external domains, downgrades found), sparkline of sign-ins, “Critical Activity.”
Critical Assets: Tier-Zero inventory placeholder + “Connect BloodHound.”
Hybrid Identity: recent privileged actions.
Search: flexible (scaffolded) query builder.
Alerts: toggleable alerts; route into remediation where relevant.
All tables paginate, filter, and deep link into Remediate or License Optimize when actions are available.

6.4 Remediations (sub-nav)
Dashboard: Suggestions list (one-click jumps into Remediate).
Remediate: The “action catalog” engine — modular, backend-driven.
Each action has: title, description, inputs (text/textarea/toggle/number/select/multi), preview, run, and Undo.
Back end can push new actions by updating the catalog; UI renders automatically.
All runs write audit + ledger records.
Recommendations: Knowledge base (best practices for SMBs/MSPs) with “Open playbook” buttons that route into Remediate with pre-filled params.

6.5 License Optimizer (flagship; sub-sections)
Dashboard: KPIs, savings trend, quick wins.
Analyze: data sources, CSV import/mapping, data freshness.
Optimize: rule-driven opportunities (backend LICENSE_RULES catalog) + “cart” plan preview, savings estimate, Apply + Undo.
Policies: visual policy builder (schema: { field, op, value, action }), stored for later evaluation.
Simulator: “What if we downgraded X% of E3?”; instant savings modeling.
Reports: savings-to-date, exports (CSV/JSON; PDF stub).
All rule/price data is isolated via LICENSE_RULES + LICENSE_PRICEBOOK so the UI can switch to backend-supplied catalogs later without rewrites.

6.6 Reports
Overview: org KPIs & trends.
Licensing & Savings: spend, savings, SKU mix, ROI.
Security & Audit: risky events, audit volume, alert counts.
Activity: product usage heat/volume.
Exports: CSV/JSON (PDF placeholder) + scheduled report stubs.
Parent filter context (tenant, date range, search) flows down; more facets can be added later without changing children.

6.7 Settings (heavy-duty; sub-nav)
Org Profile: company info, brand, contacts.
Users & Access: user table, roles, invites (invite-only model), RBAC matrix (simple now).
Integrations: Entra/Graph consents; SMTP; webhooks; SSO toggles.
Notifications: per-user preferences (digests, alerts).
Billing & Subscription: plan, usage, invoices (stubs wired to toasts).
Data & Export: JSON/CSV export; data retention policy selector.
Audit Log: every save action with diff.
Standards baked in: Zod schema validation; optimistic updates; shared useSettings() service (context + persistence); every save emits an audit event.

6.8 Authentication
Sign-in only (self-registration removed).
Invites: /api/v1/users/invite creates pending users. Accepting the invite sets password and activates.
Preferences: /api/v1/users/me/preferences reads/writes user_preferences.jsonb.
Frontend: Login page + AuthForm component; “Create account” links removed.
Backend: /auth/login, /users/me, /users/invite, /users/me/preferences.

7) Engineering standards
7.1 Frontend
Stack: React + Vite, Tailwind CSS, Framer Motion, ApexCharts, lucide-react.
UI kit: shadcn/ui patterns (cards, inputs, dialogs), but kept framework-agnostic.
Layout: grid-based; 8-pt spacing; 2xl rounded corners; soft shadows; accessible color contrast.

State/data:
Local component state for view concerns.
API through services/api (Axios instance with token injection & 401 handling).
useSettings() for settings context + persistence.
Optimistic updates with rollback on failure.
Forms: react-hook-form + zod for schema validation; error messages inline.
Routing: React Router v6; feature sub-nav via nested routes.
Guards: RequireAuth.
Error boundary: AppBoundary.
Notifications UI: NotificationsPopover fetches /api/v1/notifications, supports mark-read and deep linking.
Loading & empty states: skeletons, toasts, empty illustrations.
Accessibility: keyboard nav, focus states, labels, ARIA on dialogs/popovers.

7.2 Backend
FastAPI with Pydantic models; typed codebase.
DB access: SQLAlchemy ORM; simple session dependency (get_db()) with correct generator type.
Auth: JWT; password hashing via passlib[bcrypt].
API design:
Versioned under /api/v1/*.
Consistent response envelopes (list endpoints → arrays; detail endpoints → objects).
Pagination params (limit, offset) on list endpoints (to add as we wire live data).
Errors: { detail: string | { code, message } } with correct HTTP status.
Notifications: notifications table & endpoints
GET /notifications (mine), POST /notifications/_seed (dev only), POST /notifications/{id}/read, POST /notifications/mark_all_read.
Users: GET /users/me, GET /users, PATCH /users/{id}, POST /users/invite, GET/PUT /users/me/preferences.
Audit events: on every settings save & remediation run.
Jobs: APScheduler for discovery/digests (interval + cron).

7.3 Code quality
Frontend: ESLint + Prettier; strict TS optional later.
Backend: ruff + black (or isort/flake8 equivalent).
Commits: Conventional Commits; sensible PR size; small, frequent merges.

Testing:
Backend: pytest for services/routers; faker for seeds.
Frontend: React Testing Library for components; Playwright for critical flows (login, remediation run, notification mark-read).
Observability: structured logs with correlation ids; 4xx/5xx meters; job metrics.

7.4 Performance & resilience
API timeouts, retries for Graph calls; exponential backoff.
Client query caching where appropriate (later via TanStack Query if needed).
Defensive parsing (unknown Graph shapes → keep raw payload in evidence_json).

7.5 Security & privacy
Principle of least privilege; explicit Fix consent.
No content reading; only link scopes & license assignments.
Append-only ledger; undo is a new record.
CORS restricted; HTTPS everywhere in prod.
PII minimal; retention policy configurable.

8) User flows (acceptance)
First run (read-only)
Add tenant → grant Read → in <10 minutes dashboard shows risky links & license opportunities → welcome email with report link.
Enable fixes
Toggle Enable Fixes → grant Fix → use one-click actions (Revoke/Rescope/Downgrade/Reclaim) → ledger entry + Undo → next discovery reflects state.
Weekly digest
Scheduler compiles per-tenant open items → sends simple HTML → links open filtered views.

9) Success metrics
Time-to-value (consent → first findings).
Remediation rate (resolved within 7 days).
Savings captured (first 30 days).
MSP stickiness (avg tenants per MSP).
Conversion to Fix after a week in read-only.

10) Risks & mitigations
Graph drift: pin versions; config-driven provider rules; monthly changelog scan.
False positives (sharing): suggest-then-approve; age/path context; fast Undo.
Email deliverability: warm domain; plain-text option; DKIM/SPF/DMARC.
Scope creep: two-module discipline until revenue & references.
Trust: read-only default; transparent permission page; clear ledger & rollbacks.

11) Timeline (solo dev, no Azure hosting at first)
Week 1 — Local proof: containerized stack; manual seeded findings; end-to-end remediation ledger & digest; landing page.
Week 2 — Real discovery (read-only): Overmind-Read app reg; Sharing/License discovery; downloadable read-only report (PDF stub ok).
Week 3 — Real remediation: Overmind-Fix app reg; link revoke/rescope; license batch with rollback.
Week 4 — MSP view & early sales: multi-tenant dashboard; white-label PDFs; 10 design partners; secure 2 pilots.

12) Approx. Budget (remaining $500)
$12 secondary domain (optional optics).
$0 Cloudflare DNS/HTTPS/Email Routing.
$50 logo/brand kit.
$100 transactional email credits.
$150 design-partner incentives.
$50–$80 first-month minimal hosting.
Remainder for icons/copy/incidentals.

13) Deliverables checklist
Landing page + privacy/security overview.
Two Entra app regs (Read/Fix) with scope docs.
DB migration #1 (tenants, consents, findings, remediations, audit, users, preferences, invitations, notifications).
Discovery adapters (sharing/license) with pagination/backoff.
Remediation adapters (link revoke/rescope; license assign) with rollback.
Weekly digest & monthly savings email.
Remediation Ledger with CSV/JSON export (PDF stub).
MSP dashboard.
“Before/after” case-study screenshots.

14) Team split
You (impl & field): run local stack; connect first tenant; validate real findings; recruit 5–10 MSP design partners; landing page + email setup.
Me (arch & product): consent flows; discovery/remediation adapters; ledger/reporting; “Provider Rules Catalog” page.

15) Acceptance test scripts
Sharing Guard
Create public link → run discovery → item appears with age/path → click Revoke → link dies → ledger has pre/post → Undo recreates.
License Optimizer
Mark user inactive (lab) → discovery flags downgrade/reclaim → Apply → assignments change → savings reflect → Undo reinstates.
Digest
Force digest → email delivered → links open filtered views → counts match DB.

16) Implementation notes (what’s already built)
Front: Tenants, Findings (multi-tab), Remediations (Dashboard/Remediate/Recommendations), License Optimizer (Dashboard/Analyze/Optimize/Policies/Simulator/Reports), Reports (Overview/Licensing & Savings/Security & Audit/Activity/Exports), Settings (deep).
Notifications bell with /api/v1/notifications; mark-read & seed endpoints.
Invite-only auth (signup removed). Invite + preferences endpoints present.
Error boundary, consistent modals/backdrops, centered “Add Tenant” option card.
Settings standards: zod/yup validation, optimistic updates, shared useSettings() service, granular audit events per save.

17) Dev how-tos (local)
Build & start:
docker compose up -d --build backend
docker compose up -d --build frontend
Logs: docker compose logs -f backend / frontend
Reset containers: docker compose down then docker compose up -d

18) Plain-English guardrails
We don’t read content. We change link scopes and license assignments only.
We never request Fix rights until the customer explicitly enables fixes.
Every change is reversible, and the ledger proves it.
Appendix — API sketch (v1, implemented/ready)
Auth: POST /auth/login
Users: GET /users/me, GET /users, PATCH /users/{id},
POST /users/invite, GET/PUT /users/me/preferences
Notifications: GET /notifications, POST /notifications/{id}/read, POST /notifications/mark_all_read, POST /notifications/_seed (dev)
Findings/Remediations/License: list endpoints returning arrays; action endpoints accept {action, params} and return {ok, ledgerId} (stubs ⇒ live adapters).
Reports: server returns metrics JSON; CSV/JSON export endpoints for tables.