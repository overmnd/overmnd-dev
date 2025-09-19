// frontend/src/pages/remediations/Remediate.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { IconPlayerPlay, IconPlayerPause, IconFileSearch } from "@tabler/icons-react";

/**
 * ACTION_CATALOG defines everything the UI needs for a remediation:
 * - inputs: dynamic fields we render automatically
 * - preview(): generate a human-readable plan
 * - dryRun(): placeholder that would call backend (future)
 * - execute(): placeholder that would call backend (future)
 *
 * Back-end can later send this catalog over API so the UI stays 100% modular.
 */
const ACTION_CATALOG = {
  "disable-legacy-auth": {
    title: "Disable legacy authentication",
    category: "Security hardening",
    description:
      "Disable basic auth protocols (SMTP/IMAP/POP) and enforce modern auth across the tenant.",
    inputs: [
      {
        key: "services",
        label: "Services to block",
        type: "multiselect",
        options: ["SMTP", "IMAP", "POP", "MAPI/HTTP", "Autodiscover"],
        default: ["SMTP", "IMAP", "POP"],
      },
      {
        key: "excludeAccounts",
        label: "Accounts to exclude (user principal names)",
        type: "textarea",
        placeholder: "alice@contoso.com\nsvc-printer@contoso.com",
        default: "",
      },
    ],
    preview: (params, scope) => {
      const list = (arr) => (arr?.length ? arr.join(", ") : "(none)");
      return [
        `Tenant: ${scope.tenant || "All selected tenants"}`,
        `Services to disable: ${list(params.services)}`,
        `Exclude accounts: ${params.excludeAccounts ? params.excludeAccounts.split(/\s+/).length : 0}`,
      ];
    },
  },

  "require-mfa-admins": {
    title: "Require MFA for privileged roles",
    category: "Identity protection",
    description:
      "Create or update Conditional Access to require MFA for privileged roles (e.g., Global Admins).",
    inputs: [
      {
        key: "roles",
        label: "Target roles",
        type: "multiselect",
        options: [
          "Global Administrator",
          "Privileged Authentication Administrator",
          "Application Administrator",
          "Exchange Administrator",
        ],
        default: ["Global Administrator"],
      },
      {
        key: "breakGlassUPNs",
        label: "Break-glass accounts (UPNs)",
        type: "textarea",
        placeholder: "breakglass1@contoso.com",
        default: "",
      },
    ],
    preview: (p, scope) => [
      `Tenant: ${scope.tenant || "All selected tenants"}`,
      `Roles: ${(p.roles || []).join(", ")}`,
      `Break-glass exempt count: ${p.breakGlassUPNs ? p.breakGlassUPNs.split(/\s+/).length : 0}`,
    ],
  },

  "remove-stale-guests": {
    title: "Remove/disable stale guest users",
    category: "Tenant hygiene",
    description:
      "Find guest accounts inactive for N days and disable or remove them with an approval window.",
    inputs: [
      {
        key: "inactivityDays",
        label: "Inactive for at least (days)",
        type: "number",
        min: 30,
        max: 365,
        default: 90,
      },
      {
        key: "mode",
        label: "Action",
        type: "select",
        options: ["disable", "remove"],
        default: "disable",
      },
      {
        key: "approvalDays",
        label: "Auto-approve after (days)",
        type: "number",
        min: 0,
        max: 30,
        default: 7,
      },
    ],
    preview: (p, scope) => [
      `Tenant: ${scope.tenant || "All selected tenants"}`,
      `Inactive ≥ ${p.inactivityDays} days`,
      `Action: ${p.mode}, approval window: ${p.approvalDays} days`,
    ],
  },

  "tighten-external-sharing": {
    title: "Tighten SharePoint external sharing",
    category: "Data protection",
    description:
      "Require sign-in for file access and set link expiration. You can optionally block anonymous links.",
    inputs: [
      { key: "allowAnonymous", label: "Allow anonymous links", type: "toggle", default: false },
      { key: "linkExpiryDays", label: "Link expiration (days)", type: "number", min: 1, max: 365, default: 7 },
    ],
    preview: (p, scope) => [
      `Tenant: ${scope.tenant || "All selected tenants"}`,
      `Anonymous links: ${p.allowAnonymous ? "Allowed" : "Disabled"}`,
      `Link expiry: ${p.linkExpiryDays} days`,
    ],
  },

  "investigate-risky-user": {
    title: "Investigate risky user & reset credentials",
    category: "Incident response",
    description:
      "Block sign-in, revoke sessions, reset password, and create a case note for a risky user.",
    inputs: [
      { key: "username", label: "User principal name", type: "text", placeholder: "user@contoso.com", default: "" },
      { key: "revokeSessions", label: "Revoke refresh tokens", type: "toggle", default: true },
      { key: "notifyUser", label: "Email user with instructions", type: "toggle", default: false },
    ],
    preview: (p, scope) => [
      `Tenant: ${scope.tenant || "Detected automatically"}`,
      `Target user: ${p.username || "(not set)"}`,
      `Revoke tokens: ${p.revokeSessions ? "Yes" : "No"}, Notify: ${p.notifyUser ? "Yes" : "No"}`,
    ],
  },
};

// Mock tenants (replace with real API later)
const TENANTS = [
  { id: "t1", name: "Covenant Technology", domain: "covenanttechnology.net" },
  { id: "t2", name: "Example Holdings", domain: "example.com" },
  { id: "t3", name: "Acme Corp", domain: "acme.org" },
];

function useQueryAction() {
  const [params] = useSearchParams();
  const { state } = useLocation();
  const id = params.get("action") || "";
  const seed = state?.seed || null;
  return { id, seed };
}

export default function Remediate() {
  const { id: initialId, seed } = useQueryAction();
  const [actionId, setActionId] = useState(initialId || "disable-legacy-auth");

  const def = ACTION_CATALOG[actionId];
  const [params, setParams] = useState({});
  const [scope, setScope] = useState({ tenant: TENANTS[0]?.name, targets: "All" });

  // Seed parameters from dashboard suggestion
  useEffect(() => {
    if (seed && def) {
      setParams((prev) => ({ ...prev, ...seed }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialId]);

  // Initialize defaults when action changes
  useEffect(() => {
    if (!def) return;
    const next = {};
    def.inputs?.forEach((i) => {
      if (typeof i.default !== "undefined") next[i.key] = i.default;
    });
    setParams((p) => ({ ...next, ...p })); // keep any seeded values
  }, [actionId]); // eslint-disable-line

  const previewLines = useMemo(() => {
    if (!def) return [];
    return def.preview ? def.preview(params, scope) : [];
  }, [def, params, scope]);

  function updateField(key, value) {
    setParams((p) => ({ ...p, [key]: value }));
  }

  function DryRun() {
    toast.loading("Dry-run queued… (placeholder)", { id: "dryrun" });
    setTimeout(() => toast.success("Dry-run complete. Review the plan below.", { id: "dryrun" }), 800);
  }

  function Execute() {
    toast.loading("Executing remediation… (placeholder)", { id: "exec" });
    setTimeout(() => toast.success("Remediation dispatched successfully.", { id: "exec" }), 1100);
  }

  return (
    <div className="space-y-6">
      {/* Playbook header */}
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="text-sm font-medium text-white">Remediate</div>
        <p className="mt-1 text-sm text-slate-400">
          Choose a playbook, set parameters, scope the change, preview, then dry-run or execute.
          Everything here is driven by an action catalog, so we can add new playbooks quickly.
        </p>
      </div>

      {/* Step 1: Choose a playbook */}
      <section className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="mb-3 text-sm font-medium text-white">1) Select playbook</div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs text-slate-400">Playbook</label>
            <select
              value={actionId}
              onChange={(e) => setActionId(e.target.value)}
              className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-gray-200"
            >
              {Object.entries(ACTION_CATALOG).map(([id, a]) => (
                <option key={id} value={id}>
                  {a.title}
                </option>
              ))}
            </select>
          </div>

          <div className="text-sm text-slate-400">
            <div className="text-white">{def?.title}</div>
            <div>{def?.description}</div>
            <div className="mt-1 text-xs text-indigo-300">{def?.category}</div>
          </div>
        </div>
      </section>

      {/* Step 2: Parameters (dynamic) */}
      <section className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="mb-3 text-sm font-medium text-white">2) Parameters</div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {def?.inputs?.map((i) => {
            const val = params[i.key];
            if (i.type === "text") {
              return (
                <div key={i.key}>
                  <label className="text-xs text-slate-400">{i.label}</label>
                  <input
                    className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-gray-200"
                    placeholder={i.placeholder || ""}
                    value={val || ""}
                    onChange={(e) => updateField(i.key, e.target.value)}
                  />
                </div>
              );
            }
            if (i.type === "textarea") {
              return (
                <div key={i.key} className="md:col-span-2">
                  <label className="text-xs text-slate-400">{i.label}</label>
                  <textarea
                    rows={4}
                    className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-gray-200"
                    placeholder={i.placeholder || ""}
                    value={val || ""}
                    onChange={(e) => updateField(i.key, e.target.value)}
                  />
                </div>
              );
            }
            if (i.type === "toggle") {
              return (
                <div key={i.key} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={!!val}
                    onChange={(e) => updateField(i.key, e.target.checked)}
                    className="h-4 w-4 accent-indigo-600"
                  />
                  <span className="text-sm text-gray-200">{i.label}</span>
                </div>
              );
            }
            if (i.type === "number") {
              return (
                <div key={i.key}>
                  <label className="text-xs text-slate-400">{i.label}</label>
                  <input
                    type="number"
                    min={i.min}
                    max={i.max}
                    value={val ?? i.default ?? 0}
                    onChange={(e) => updateField(i.key, Number(e.target.value))}
                    className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-gray-200"
                  />
                </div>
              );
            }
            if (i.type === "select") {
              return (
                <div key={i.key}>
                  <label className="text-xs text-slate-400">{i.label}</label>
                  <select
                    value={val ?? i.default}
                    onChange={(e) => updateField(i.key, e.target.value)}
                    className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-gray-200"
                  >
                    {i.options.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }
            if (i.type === "multiselect") {
              return (
                <div key={i.key}>
                  <label className="text-xs text-slate-400">{i.label}</label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {i.options.map((o) => {
                      const selected = Array.isArray(val) ? val.includes(o) : false;
                      return (
                        <button
                          type="button"
                          key={o}
                          onClick={() => {
                            const current = Array.isArray(val) ? val : [];
                            updateField(
                              i.key,
                              selected
                                ? current.filter((x) => x !== o)
                                : [...current, o]
                            );
                          }}
                          className={
                            "rounded border px-2 py-1 text-xs " +
                            (selected
                              ? "border-indigo-500 bg-indigo-600/20 text-white"
                              : "border-slate-700 bg-slate-800 text-gray-200 hover:bg-slate-700")
                          }
                        >
                          {o}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      </section>

      {/* Step 3: Scope */}
      <section className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="mb-3 text-sm font-medium text-white">3) Scope</div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="text-xs text-slate-400">Tenant</label>
            <select
              value={scope.tenant}
              onChange={(e) => setScope((s) => ({ ...s, tenant: e.target.value }))}
              className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-gray-200"
            >
              {TENANTS.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name} ({t.domain})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400">Targets</label>
            <select
              value={scope.targets}
              onChange={(e) => setScope((s) => ({ ...s, targets: e.target.value }))}
              className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-gray-200"
            >
              <option>All</option>
              <option>Only flagged items</option>
              <option>Custom selection</option>
            </select>
          </div>

          <div className="text-xs text-slate-400">
            You’ll be able to review every change in the next step.
          </div>
        </div>
      </section>

      {/* Step 4: Review & Execute */}
      <section className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="mb-3 text-sm font-medium text-white">4) Review & Execute</div>

        <div className="rounded border border-slate-800 bg-slate-950 p-3 text-sm text-slate-300">
          <div className="mb-2 flex items-center gap-2 text-white">
            <IconFileSearch size={18} />
            Planned actions
          </div>
          <ul className="list-disc pl-5 space-y-1">
            {previewLines.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            onClick={DryRun}
            className="inline-flex items-center gap-2 rounded border border-slate-700 px-3 py-1.5 text-sm text-gray-200 hover:bg-slate-800"
          >
            <IconPlayerPause size={16} /> Dry-run
          </button>
          <button
            onClick={Execute}
            className="inline-flex items-center gap-2 rounded bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-500"
          >
            <IconPlayerPlay size={16} /> Execute
          </button>
        </div>
      </section>
    </div>
  );
}
