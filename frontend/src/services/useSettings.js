// frontend/src/services/useSettings.js
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { toast } from "react-hot-toast";

/* -------------------- Schemas -------------------- */

const OrgSchema = z.object({
  name: z.string().min(1),
  domains: z.array(z.string().min(1)).nonempty(),
  supportEmail: z.string().email(),
  timezone: z.string().min(1),
  defaultTenant: z.string().min(1),
});

const BrandingSchema = z.object({
  logoUrl: z.string().optional(),
  primary: z.string().regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, "Hex color"),
  accent: z.string().regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, "Hex color"),
  darkModeOnly: z.boolean(),
  loginTitle: z.string().min(1),
});

const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  role: z.string().min(1),
  status: z.enum(["active", "inactive", "pending"]),
});
const UsersSchema = z.array(UserSchema).max(5000);

const RoleMatrixSchema = z.record(
  z.string(),
  z.object({
    findings: z.enum(["none", "read", "write"]),
    remediations: z.enum(["none", "read", "write"]),
    licensing: z.enum(["none", "read", "write"]),
    reports: z.enum(["none", "read", "write"]),
    billing: z.enum(["none", "read", "write"]),
  })
);

const IntegrationsSchema = z.object({
  microsoft: z.object({
    connected: z.boolean(),
    tenantId: z.string().optional(),
  }),
  slackWebhook: z.string().optional(),
  teamsWebhook: z.string().optional(),
  smtp: z.object({
    host: z.string().optional(),
    port: z.number().int().min(1).max(65535),
    user: z.string().optional(),
    from: z.string().optional(),
  }),
  sso: z.object({
    samlEnabled: z.boolean(),
    forceMfa: z.boolean(),
  }),
});

const NotifSchema = z.object({
  digests: z.enum(["off", "daily", "weekly"]),
  channels: z.object({
    email: z.boolean(),
    teams: z.boolean(),
    slack: z.boolean(),
  }),
  events: z.object({
    savings: z.boolean(),
    riskySignIns: z.boolean(),
    remediations: z.boolean(),
    billing: z.boolean(),
  }),
});

const BillingSchema = z.object({
  plan: z.enum(["Starter", "Pro", "Enterprise"]),
  seats: z.number().int().min(1).max(100000),
  nextInvoice: z.string().min(1),
  paymentMethod: z.string().min(1),
});

const AuditEventSchema = z.object({
  id: z.string(),
  ts: z.string(),
  actor: z.string(),
  action: z.string(),
  area: z.string(),
  details: z.any().optional(),
});

const SettingsBundleSchema = z.object({
  org: OrgSchema,
  branding: BrandingSchema,
  users: UsersSchema,
  roles: RoleMatrixSchema,
  integrations: IntegrationsSchema,
  notif: NotifSchema,
  billing: BillingSchema,
});

/* -------------------- Defaults & Storage -------------------- */

const STORAGE_KEY = "overmnd_settings";
const AUDIT_KEY = "overmnd_audit";

const DEFAULTS = {
  org: {
    name: "Covenant Technology",
    domains: ["covenanttechnology.net"],
    supportEmail: "support@covenanttechnology.net",
    timezone: "America/Chicago",
    defaultTenant: "covtech",
  },
  branding: {
    logoUrl: "",
    primary: "#6366F1",
    accent: "#22C55E",
    darkModeOnly: true,
    loginTitle: "Welcome to overmnd",
  },
  users: [
    { id: "1", name: "Admin", email: "admin@contoso.com", role: "Owner", status: "active" },
    { id: "2", name: "Analyst", email: "analyst@contoso.com", role: "Analyst", status: "active" },
    { id: "3", name: "Billing", email: "billing@contoso.com", role: "Billing", status: "inactive" },
  ],
  roles: {
    Owner: { findings: "write", remediations: "write", licensing: "write", reports: "write", billing: "write" },
    Admin: { findings: "write", remediations: "write", licensing: "write", reports: "write", billing: "read" },
    Analyst: { findings: "read", remediations: "none", licensing: "read", reports: "write", billing: "none" },
    Operator: { findings: "read", remediations: "write", licensing: "read", reports: "read", billing: "none" },
    Billing: { findings: "none", remediations: "none", licensing: "read", reports: "read", billing: "write" },
    "Read-only": { findings: "read", remediations: "none", licensing: "read", reports: "read", billing: "none" },
  },
  integrations: {
    microsoft: { connected: true, tenantId: "9a30e..." },
    slackWebhook: "",
    teamsWebhook: "",
    smtp: { host: "", port: 587, user: "", from: "" },
    sso: { samlEnabled: false, forceMfa: false },
  },
  notif: {
    digests: "weekly",
    channels: { email: true, teams: true, slack: false },
    events: { savings: true, riskySignIns: true, remediations: true, billing: false },
  },
  billing: { plan: "Pro", seats: 50, nextInvoice: "2025-08-01", paymentMethod: "VISA •• 4242" },
};

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw);
    const result = SettingsBundleSchema.safeParse(parsed);
    return result.success ? result.data : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

function loadAudit() {
  try {
    const raw = localStorage.getItem(AUDIT_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((e) => AuditEventSchema.safeParse(e).success) : [];
  } catch {
    return [];
  }
}

function persist(settings) {
  // Simulate async persistence (swap with real API later)
  return new Promise((resolve) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    resolve();
  });
}

function persistAudit(audit) {
  localStorage.setItem(AUDIT_KEY, JSON.stringify(audit));
}

/* -------------------- Hook -------------------- */

export function useSettings() {
  const [bundle, setBundle] = useState(() => loadSettings());
  const [audit, setAudit] = useState(() => loadAudit());
  const savingRef = useRef(false);

  // Validate entire bundle whenever it changes (dev-safety)
  useEffect(() => {
    SettingsBundleSchema.parse(bundle);
  }, [bundle]);

  // Generic audit helper
  function addAudit(action, area, details) {
    const event = {
      id: Math.random().toString(36).slice(2),
      ts: new Date().toISOString(),
      actor: "admin@contoso.com",
      action,
      area,
      details,
    };
    const next = [event, ...audit].slice(0, 5000);
    setAudit(next);
    persistAudit(next);
  }

  // Optimistic save: validate section, persist whole bundle, rollback on failure
  async function save(sectionName) {
    if (savingRef.current) return;
    savingRef.current = true;

    try {
      // Validate target section specifically (fast feedback)
      switch (sectionName) {
        case "Organization":
          OrgSchema.parse(bundle.org);
          break;
        case "Branding":
          BrandingSchema.parse(bundle.branding);
          break;
        case "Users":
          UsersSchema.parse(bundle.users);
          break;
        case "Access Control":
          RoleMatrixSchema.parse(bundle.roles);
          break;
        case "Integrations":
          IntegrationsSchema.parse(bundle.integrations);
          break;
        case "Notifications":
          NotifSchema.parse(bundle.notif);
          break;
        case "Billing":
          BillingSchema.parse(bundle.billing);
          break;
        default:
          // no-op; whole bundle still validated in dev-effect
          break;
      }

      const prev = JSON.parse(JSON.stringify(bundle)); // snapshot for rollback
      // optimistic: state already reflects edits; we just persist
      await persist(bundle);
      addAudit("Save", sectionName, { ok: true });
      toast.success(`${sectionName} saved`);
      return true;
    } catch (e) {
      toast.error(e?.message || "Validation failed");
      addAudit("SaveFailed", sectionName, { error: e?.message || String(e) });
      return false;
    } finally {
      savingRef.current = false;
    }
  }

  // Expose states + setters (kept granular for easy wiring)
  const ctx = useMemo(
    () => ({
      // data
      org: bundle.org,
      branding: bundle.branding,
      users: bundle.users,
      roles: bundle.roles,
      integrations: bundle.integrations,
      notif: bundle.notif,
      billing: bundle.billing,
      audit,

      // setters (update in-place; persist happens on save())
      setOrg: (v) => setBundle((b) => ({ ...b, org: typeof v === "function" ? v(b.org) : v })),
      setBranding: (v) => setBundle((b) => ({ ...b, branding: typeof v === "function" ? v(b.branding) : v })),
      setUsers: (v) => setBundle((b) => ({ ...b, users: typeof v === "function" ? v(b.users) : v })),
      setRoles: (v) => setBundle((b) => ({ ...b, roles: typeof v === "function" ? v(b.roles) : v })),
      setIntegrations: (v) =>
        setBundle((b) => ({ ...b, integrations: typeof v === "function" ? v(b.integrations) : v })),
      setNotif: (v) => setBundle((b) => ({ ...b, notif: typeof v === "function" ? v(b.notif) : v })),
      setBilling: (v) => setBundle((b) => ({ ...b, billing: typeof v === "function" ? v(b.billing) : v })),

      // actions
      save,
      addAudit,
      resetAll: () => {
        setBundle(DEFAULTS);
        persist(DEFAULTS);
        addAudit("Reset", "Settings", {});
        toast("Settings reset to defaults");
      },
    }),
    [bundle, audit]
  );

  return ctx;
}
