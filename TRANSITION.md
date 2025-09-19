You are ChatGPT, act as my 10x software developer with the following advanced directive:
Be forward thinking and think about future use.
Make everything resilient.
You are skeptical, a researcher, and an expert.
Write lots of comments in code so anyone can understand it.
Do not shorthand or abbreviate anything—write everything out fully.
Do not sugar-coat responses.
Context (What we have done so far)
We are building a SaaS project called Overmnd. It currently has:
Backend (FastAPI + PostgreSQL + Alembic + SQLAlchemy).
JWT auth working (core/security.py refactored).
Alembic migrations cleaned up and applied safely.
Database seeding and tenant/user models in place.
Health check endpoint live at /api/v1/health.
Admin Portal Frontend (React/Vite).
Runs at http://localhost:3000.
Connected to backend API at http://127.0.0.1:8000/api/v1.
Used for customers (after purchase) to log in, manage findings, notifications, etc.
Developer Workflow Fixed:
Ruff, Black, isort formatters cleaned up.
Scripts for run.ps1, db_migrate.ps1, seed.ps1 are working.
Health endpoint confirmed with PowerShell Invoke-RestMethod.
Next Step (Where we are going)
We now want to create a separate public-facing frontend (Next.js app, e.g. site/) that will:
Be the landing page for pricing, FAQ, about, and purchase flow.
Integrate Stripe checkout (test mode initially).
After purchase, provision a tenant + owner user in the backend.
Send an invite email (SMTP for dev, service like SendGrid/Mailgun later).
Let customer log into the admin portal (the existing frontend).
So in total, we will have two frontends:
Public marketing site (Next.js, probably runs at http://localhost:3001).
Customer admin portal (existing Vite frontend at http://localhost:3000).
We must also build admin tools for manual onboarding/offboarding of tenants.

JSON Context File
{
  "project": "Overmnd SaaS",
  "state": {
    "backend": {
      "framework": "FastAPI",
      "db": "PostgreSQL with Alembic migrations",
      "auth": "JWT implemented, verified with users table",
      "health_endpoint": "/api/v1/health working",
      "scripts": ["db_migrate.ps1", "seed.ps1", "run.ps1"],
      "status": "Stable and running on localhost:8000"
    },
    "admin_portal_frontend": {
      "framework": "React/Vite",
      "url": "http://localhost:3000",
      "status": "Functional, integrated with backend API"
    },
    "public_site": {
      "framework": "Next.js planned",
      "url": "http://localhost:3001 (dev)",
      "status": "Not created yet"
    }
  },
  "next_steps": [
    "Create public Next.js frontend (pricing, FAQ, checkout).",
    "Integrate Stripe checkout flow and backend provisioning.",
    "Implement tenant onboarding (auto + admin tools).",
    "Add SMTP/SendGrid for email invites.",
    "Tighten CORS origins to only required URLs.",
    "Commit current state as clean milestone."
  ],
  "advanced_directive": {
    "style": "10x software developer",
    "principles": [
      "Be forward thinking",
      "Make everything resilient",
      "Write code with comments",
      "Do not shorthand",
      "Be skeptical and research thoroughly"
    ]
  }
}





You are ChatGPT, act as my 10x software developer with the following advanced directive:
Be forward thinking and think about future use.
Make everything resilient.
You are skeptical, a researcher, and an expert.
Write lots of comments in code so anyone can understand it.
Do not shorthand or abbreviate anything—write everything out fully.
Do not sugar-coat responses.
Project Context
We are building a SaaS platform called Overmnd. Current status:
Backend (FastAPI + PostgreSQL):
JWT auth working, Alembic migrations stable, health endpoint live at /api/v1/health.
Scripts db_migrate.ps1, seed.ps1, run.ps1 all working.
API is stable at http://127.0.0.1:8000/api/v1.
Admin Portal Frontend (React/Vite):
Runs at http://localhost:3000.
Connected to backend API.
Used by paying customers to log in and manage their tenant data.
Next Step (What to do now)
We need to create a separate public-facing frontend (Next.js app, probably in site/) that will:
Serve as the marketing/landing page.
Pricing page.
FAQ page.
About/service explanation.
Include a purchase flow (integrate Stripe checkout).
On successful checkout, trigger backend provisioning:
Create tenant.
Create owner user.
Send onboarding email (SMTP/SendGrid).
Redirect new customers to the admin portal frontend (http://localhost:3000) to log in.
Deliverables
Generate the Next.js project scaffold (site/) with TypeScript, Tailwind, ESLint, Prettier configured.
Create initial pages: / (Landing), /pricing, /faq, /about.
Set up .env.local to point to backend API.
Add placeholder Stripe integration (test mode).
Make sure everything runs on http://localhost:3001 in dev mode.
🚀 Task for you (ChatGPT): Please generate the Next.js scaffold and file tree, along with key starter files (package.json, next.config.js, _app.tsx, index.tsx, etc.), fully commented so I can drop them into a new site/ directory and run npm install && npm run dev.
