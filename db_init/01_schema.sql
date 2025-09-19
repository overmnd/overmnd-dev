-- db_init/01_schema.sql
-- overmnd: PostgreSQL bootstrap with strict multi-tenant isolation
-- NOTE: This runs automatically on first container start via docker-entrypoint-initdb.d

----------------------------
-- 0. Safety & extensions --
----------------------------
CREATE SCHEMA IF NOT EXISTS meta;
-- Vector extension for future analytics/search (safe to keep in MVP+)
--CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;

-- We use a custom GUC (Grand Unified Config) key to carry tenant id per connection.
-- You do NOT need to predefine it; Postgres allows arbitrary "app.*" settings.
-- We will SET it from the app per request: SET LOCAL app.current_tenant_id = '<tenant_id>';

----------------
-- 1. Tenants --
----------------
CREATE TABLE public.tenants (
  id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  display_name     TEXT        NOT NULL,
  primary_domain   TEXT        NOT NULL,
  status           TEXT        NOT NULL DEFAULT 'active',   -- active | suspended | cancelled
  plan_tier        TEXT        NOT NULL DEFAULT 'standard', -- free | standard | pro (simple start)
  settings_json    JSONB       NOT NULL DEFAULT '{}'::jsonb,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Helpful index if you ever look tenants up by domain during SSO flows:
CREATE UNIQUE INDEX tenants_primary_domain_idx ON public.tenants (primary_domain);

----------------
-- 2. Users   --
----------------
-- We normalize roles as an enum so we cannot "fat-finger" arbitrary strings.
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('owner', 'admin', 'member', 'viewer');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE public.users (
  id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tenant_id      BIGINT NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  email          TEXT   NOT NULL UNIQUE,
  password_hash  TEXT   NOT NULL,               -- bcrypt or argon2
  role           user_role NOT NULL DEFAULT 'member',
  status         TEXT NOT NULL DEFAULT 'active', -- active | invited | disabled
  is_superuser   BOOLEAN DEFAULT false,         -- platform-level, not tenant-level
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX users_tenant_idx ON public.users (tenant_id);

-----------------------
-- 3. Invitations    --
-----------------------
CREATE TABLE public.invitations (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tenant_id     BIGINT NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  email         TEXT   NOT NULL,
  role          user_role NOT NULL DEFAULT 'member',
  token         TEXT   NOT NULL,
  status        TEXT   NOT NULL DEFAULT 'pending', -- pending | accepted | expired | revoked
  invited_by    BIGINT REFERENCES public.users(id) ON DELETE SET NULL,
  expires_at    TIMESTAMPTZ NOT NULL
);

CREATE INDEX invitations_tenant_idx ON public.invitations (tenant_id);
CREATE INDEX invitations_email_idx  ON public.invitations (email);

-------------------
-- 4. Consents   --
-------------------
-- Tracks Microsoft Graph (or other) consent grants
CREATE TABLE public.consents (
  id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tenant_id        BIGINT REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id          BIGINT REFERENCES public.users(id) ON DELETE SET NULL,
  scope_set        TEXT   NOT NULL, -- e.g. "Mail.Send Calendars.Read"
  granted_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  granted_by_upn   TEXT   NOT NULL
);

CREATE INDEX consents_tenant_idx ON public.consents (tenant_id);

-------------------
-- 5. Findings   --
-------------------
DO $$ BEGIN
  CREATE TYPE finding_severity AS ENUM ('low', 'medium', 'high', 'critical');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE public.findings (
  id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tenant_id      BIGINT REFERENCES public.tenants(id) ON DELETE CASCADE,
  category       TEXT NOT NULL,            -- e.g., "sharing_guard", "license_optimizer"
  severity       finding_severity NOT NULL DEFAULT 'medium',
  risk_score     INTEGER NOT NULL,         -- numeric score (0..100 or your scale)
  evidence_json  JSONB   NOT NULL,
  first_seen_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  status         TEXT NOT NULL DEFAULT 'open' -- open | acknowledged | suppressed | resolved
);

CREATE INDEX findings_tenant_idx ON public.findings (tenant_id);

----------------------
-- 6. Remediations  --
----------------------
DO $$ BEGIN
  CREATE TYPE remediation_status AS ENUM ('pending', 'applied', 'failed', 'rolled_back');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE public.remediations (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tenant_id       BIGINT NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  finding_id      BIGINT REFERENCES public.findings(id) ON DELETE SET NULL,
  action_type     TEXT   NOT NULL,      -- e.g., "revoke_public_link", "downgrade_license"
  pre_state_json  JSONB  NOT NULL,
  post_state_json JSONB  NOT NULL,
  actor_user_id   BIGINT REFERENCES public.users(id) ON DELETE SET NULL,
  status          remediation_status NOT NULL DEFAULT 'pending',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  rolled_back_at  TIMESTAMPTZ
);

CREATE INDEX remediations_tenant_idx ON public.remediations (tenant_id);
CREATE INDEX remediations_finding_idx ON public.remediations (finding_id);

------------------------
-- 7. Audit Events    --
------------------------
CREATE TABLE public.audit_events (
  id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tenant_id      BIGINT REFERENCES public.tenants(id) ON DELETE CASCADE,
  actor_user_id  BIGINT REFERENCES public.users(id) ON DELETE SET NULL,
  action         TEXT  NOT NULL,      -- "login", "invite_sent", "remediation.applied", etc.
  payload_json   JSONB NOT NULL,
  created_at     TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX audit_events_tenant_idx ON public.audit_events (tenant_id);

----------------------
-- 8. Notifications --
----------------------
CREATE TABLE public.notifications (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tenant_id     BIGINT NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id       BIGINT REFERENCES public.users(id) ON DELETE CASCADE,
  type          TEXT NOT NULL,
  title         TEXT NOT NULL,
  body          TEXT NOT NULL,
  route         TEXT NOT NULL,
  payload_json  JSONB NOT NULL DEFAULT '{}'::jsonb,
  read          BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX notifications_tenant_idx ON public.notifications (tenant_id);
CREATE INDEX notifications_user_idx   ON public.notifications (user_id);

-------------------------
-- 9. User Preferences --
-------------------------
CREATE TABLE public.user_preferences (
  user_id          BIGINT PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  tenant_id        BIGINT NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  preferences_json JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX user_prefs_tenant_idx ON public.user_preferences (tenant_id);

--------------------
-- 10. Tenant Data --
--------------------
-- General-purpose tenant KV/JSON bucket for snapshots, usage, etc.
CREATE TABLE public.tenant_data (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tenant_id  BIGINT NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  data       JSONB  NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX tenant_data_tenant_idx ON public.tenant_data (tenant_id);

-----------------------
-- 11. Embeddings    --
-----------------------
-- Keep meta.* separate; not tenant-scoped by default. If you need per-tenant
-- embeddings later, add tenant_id and RLS there too.
--CREATE TABLE meta.embeddings (
--  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
--  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
--  content    TEXT NOT NULL,
--  embedding  public.vector(384) NOT NULL
--);

------------------------------
-- 12. Row Level Security   --
------------------------------
-- We DO NOT trust developers to “remember” tenant filters.
-- The database enforces it based on the app-set GUC: app.current_tenant_id.

-- Helper: a small function to fetch current tenant id as bigint.
CREATE OR REPLACE FUNCTION public.current_tenant_id() RETURNS BIGINT LANGUAGE sql STABLE AS $$
  SELECT NULLIF(current_setting('app.current_tenant_id', true), '')::bigint
$$;

-- Enable and lock down RLS on every tenant-scoped table.
-- Read policies (USING) and write policies (WITH CHECK) both constrain tenant_id.

-- users: only allow access to users within current tenant (superuser bypass is done in app).
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY users_isolation_select ON public.users
  FOR SELECT USING (tenant_id = public.current_tenant_id());
CREATE POLICY users_isolation_mod ON public.users
  FOR INSERT WITH CHECK (tenant_id = public.current_tenant_id());
CREATE POLICY users_isolation_upd ON public.users
  FOR UPDATE USING (tenant_id = public.current_tenant_id())
                 WITH CHECK (tenant_id = public.current_tenant_id());
CREATE POLICY users_isolation_del ON public.users
  FOR DELETE USING (tenant_id = public.current_tenant_id());

-- invitations
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY invitations_isolation_select ON public.invitations
  FOR SELECT USING (tenant_id = public.current_tenant_id());
CREATE POLICY invitations_isolation_mod ON public.invitations
  FOR INSERT WITH CHECK (tenant_id = public.current_tenant_id());
CREATE POLICY invitations_isolation_upd ON public.invitations
  FOR UPDATE USING (tenant_id = public.current_tenant_id())
                 WITH CHECK (tenant_id = public.current_tenant_id());
CREATE POLICY invitations_isolation_del ON public.invitations
  FOR DELETE USING (tenant_id = public.current_tenant_id());

-- consents
ALTER TABLE public.consents ENABLE ROW LEVEL SECURITY;
CREATE POLICY consents_isolation_select ON public.consents
  FOR SELECT USING (tenant_id = public.current_tenant_id());
CREATE POLICY consents_isolation_mod ON public.consents
  FOR INSERT WITH CHECK (tenant_id = public.current_tenant_id());
CREATE POLICY consents_isolation_upd ON public.consents
  FOR UPDATE USING (tenant_id = public.current_tenant_id())
                 WITH CHECK (tenant_id = public.current_tenant_id());
CREATE POLICY consents_isolation_del ON public.consents
  FOR DELETE USING (tenant_id = public.current_tenant_id());

-- findings
ALTER TABLE public.findings ENABLE ROW LEVEL SECURITY;
CREATE POLICY findings_isolation_select ON public.findings
  FOR SELECT USING (tenant_id = public.current_tenant_id());
CREATE POLICY findings_isolation_mod ON public.findings
  FOR INSERT WITH CHECK (tenant_id = public.current_tenant_id());
CREATE POLICY findings_isolation_upd ON public.findings
  FOR UPDATE USING (tenant_id = public.current_tenant_id())
                 WITH CHECK (tenant_id = public.current_tenant_id());
CREATE POLICY findings_isolation_del ON public.findings
  FOR DELETE USING (tenant_id = public.current_tenant_id());

-- remediations
ALTER TABLE public.remediations ENABLE ROW LEVEL SECURITY;
CREATE POLICY remediations_isolation_select ON public.remediations
  FOR SELECT USING (tenant_id = public.current_tenant_id());
CREATE POLICY remediations_isolation_mod ON public.remediations
  FOR INSERT WITH CHECK (tenant_id = public.current_tenant_id());
CREATE POLICY remediations_isolation_upd ON public.remediations
  FOR UPDATE USING (tenant_id = public.current_tenant_id())
                 WITH CHECK (tenant_id = public.current_tenant_id());
CREATE POLICY remediations_isolation_del ON public.remediations
  FOR DELETE USING (tenant_id = public.current_tenant_id());

-- audit_events
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY audit_isolation_select ON public.audit_events
  FOR SELECT USING (tenant_id = public.current_tenant_id());
CREATE POLICY audit_isolation_mod ON public.audit_events
  FOR INSERT WITH CHECK (tenant_id = public.current_tenant_id());
CREATE POLICY audit_isolation_upd ON public.audit_events
  FOR UPDATE USING (tenant_id = public.current_tenant_id())
                 WITH CHECK (tenant_id = public.current_tenant_id());
CREATE POLICY audit_isolation_del ON public.audit_events
  FOR DELETE USING (tenant_id = public.current_tenant_id());

-- notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY notif_isolation_select ON public.notifications
  FOR SELECT USING (tenant_id = public.current_tenant_id());
CREATE POLICY notif_isolation_mod ON public.notifications
  FOR INSERT WITH CHECK (tenant_id = public.current_tenant_id());
CREATE POLICY notif_isolation_upd ON public.notifications
  FOR UPDATE USING (tenant_id = public.current_tenant_id())
                 WITH CHECK (tenant_id = public.current_tenant_id());
CREATE POLICY notif_isolation_del ON public.notifications
  FOR DELETE USING (tenant_id = public.current_tenant_id());

-- user_preferences
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY prefs_isolation_select ON public.user_preferences
  FOR SELECT USING (tenant_id = public.current_tenant_id());
CREATE POLICY prefs_isolation_mod ON public.user_preferences
  FOR INSERT WITH CHECK (tenant_id = public.current_tenant_id());
CREATE POLICY prefs_isolation_upd ON public.user_preferences
  FOR UPDATE USING (tenant_id = public.current_tenant_id())
                 WITH CHECK (tenant_id = public.current_tenant_id());
CREATE POLICY prefs_isolation_del ON public.user_preferences
  FOR DELETE USING (tenant_id = public.current_tenant_id());

-- tenant_data (general KV/snapshots)
ALTER TABLE public.tenant_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY td_isolation_select ON public.tenant_data
  FOR SELECT USING (tenant_id = public.current_tenant_id());
CREATE POLICY td_isolation_mod ON public.tenant_data
  FOR INSERT WITH CHECK (tenant_id = public.current_tenant_id());
CREATE POLICY td_isolation_upd ON public.tenant_data
  FOR UPDATE USING (tenant_id = public.current_tenant_id())
                 WITH CHECK (tenant_id = public.current_tenant_id());
CREATE POLICY td_isolation_del ON public.tenant_data
  FOR DELETE USING (tenant_id = public.current_tenant_id());
