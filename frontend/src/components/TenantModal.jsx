// frontend/src/components/TenantModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  IconX,
  IconExternalLink,
  IconLock,
  IconShieldCheck,
  IconShield,
  IconMail,
  IconUsers,
  IconUserCog,
  IconLogs,
  IconTopologyStar3,
} from "@tabler/icons-react";

function Tag({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-2.5 py-1 text-[11px] ring-1 ring-inset ${
        active
          ? "bg-indigo-600 text-white ring-indigo-500"
          : "bg-slate-800/70 text-slate-300 ring-white/10 hover:bg-slate-800"
      }`}
    >
      {children}
    </button>
  );
}

function RowCheck({ icon: Icon, label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between rounded-md bg-slate-900/70 px-3 py-2 ring-1 ring-inset ring-white/5">
      <span className="inline-flex items-center gap-2 text-sm text-slate-200">
        <Icon size={16} className="shrink-0 text-slate-300" />
        {label}
      </span>
      <input
        type="checkbox"
        className="h-3.5 w-3.5 accent-indigo-500"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}

export default function TenantModal({ open, onClose, tenant, onSave }) {
  const [local, setLocal] = useState(null);

  useEffect(() => {
    if (open) {
      setLocal(tenant);
      // lock page scroll while open
      document.documentElement.classList.add("overflow-hidden");
      return () =>
        document.documentElement.classList.remove("overflow-hidden");
    }
  }, [open, tenant]);

  const tags = useMemo(
    () => ["Office 365", "On-Prem", "Hybrid", "Production", "Sandbox", "Dev", "Staging"],
    []
  );

  if (!open || !local) return null;

  const perms = local.perms || {};
  const setPerm = (key, val) =>
    setLocal((p) => ({ ...p, perms: { ...(p.perms || {}), [key]: val } }));

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[60] bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-[61] flex items-center justify-center p-4">
        <div className="w-full max-w-5xl rounded-xl bg-slate-900 shadow-2xl ring-1 ring-white/10">
          {/* Title bar */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="text-sm font-medium text-white">
              Manage Tenant — {local.name}
            </div>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-slate-400 hover:text-slate-200"
              aria-label="Close"
            >
              <IconX size={18} />
            </button>
          </div>

          <div className="grid gap-6 p-4 md:grid-cols-2">
            {/* Left column */}
            <div className="space-y-4">
              <div>
                <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                  General
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-[11px] text-slate-400">
                      Name
                    </label>
                    <input
                      disabled
                      value={local.name || ""}
                      className="w-full cursor-not-allowed rounded-md bg-slate-950/50 px-3 py-2 text-sm text-slate-300 ring-1 ring-inset ring-white/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] text-slate-400">
                      Domain
                    </label>
                    <input
                      disabled
                      value={local.domain || ""}
                      className="w-full cursor-not-allowed rounded-md bg-slate-950/50 px-3 py-2 text-sm text-slate-300 ring-1 ring-inset ring-white/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] text-slate-400">
                      Directory Tenant Id
                    </label>
                    <input
                      disabled
                      value={local.tenantId || ""}
                      className="w-full cursor-not-allowed rounded-md bg-slate-950/50 px-3 py-2 text-sm text-slate-300 ring-1 ring-inset ring-white/10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                  Type &amp; Tags
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <Tag
                      key={t}
                      active={(local.tags || []).includes(t)}
                      onClick={() =>
                        setLocal((p) => {
                          const cur = new Set(p.tags || []);
                          cur.has(t) ? cur.delete(t) : cur.add(t);
                          return { ...p, tags: Array.from(cur) };
                        })
                      }
                    >
                      {t}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <div>
                <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                  Microsoft Permissions (granular)
                </div>
                <div className="space-y-2">
                  <RowCheck
                    icon={IconShieldCheck}
                    label="Read Directory"
                    checked={!!perms.readDirectory}
                    onChange={(v) => setPerm("readDirectory", v)}
                  />
                  <RowCheck
                    icon={IconMail}
                    label="Read Mail"
                    checked={!!perms.readMail}
                    onChange={(v) => setPerm("readMail", v)}
                  />
                  <RowCheck
                    icon={IconUsers}
                    label="Manage Users"
                    checked={!!perms.manageUsers}
                    onChange={(v) => setPerm("manageUsers", v)}
                  />
                  <RowCheck
                    icon={IconUserCog}
                    label="Manage Groups"
                    checked={!!perms.manageGroups}
                    onChange={(v) => setPerm("manageGroups", v)}
                  />
                  <RowCheck
                    icon={IconTopologyStar3}
                    label="Read Graph Data"
                    checked={!!perms.readGraph}
                    onChange={(v) => setPerm("readGraph", v)}
                  />
                  <RowCheck
                    icon={IconLogs}
                    label="Read Audit Logs"
                    checked={!!perms.readAudit}
                    onChange={(v) => setPerm("readAudit", v)}
                  />
                </div>
                <div className="mt-3 text-[11px] text-slate-400">
                  You can review what we request at any time in Microsoft Entra.{" "}
                  <a
                    className="inline-flex items-center text-indigo-400 hover:text-indigo-300"
                    href="#"
                    onClick={(e) => e.preventDefault()}
                  >
                    Open Microsoft Permissions <IconExternalLink size={14} className="ml-1" />
                  </a>
                </div>
              </div>

              <div>
                <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                  Restrict overmnd access to a security group (Object ID)
                </div>
                <div className="flex items-center gap-2">
                  <IconLock size={16} className="text-slate-400" />
                  <input
                    value={local.securityGroup || ""}
                    onChange={(e) =>
                      setLocal((p) => ({ ...p, securityGroup: e.target.value }))
                    }
                    placeholder="00000000-0000-0000-0000-000000000000"
                    className="w-full rounded-md bg-slate-950/50 px-3 py-2 text-sm text-slate-300 ring-1 ring-inset ring-white/10 placeholder:text-slate-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
            <button
              onClick={onClose}
              className="rounded-md bg-slate-800/70 px-3 py-1.5 text-sm text-slate-200 ring-1 ring-inset ring-white/10 hover:bg-slate-800"
            >
              Close
            </button>
            <div className="flex items-center gap-2">
              <button
                className="rounded-md bg-rose-700 px-3 py-1.5 text-sm text-white hover:bg-rose-600"
                onClick={() => alert("Revoke consent (stub)")}
              >
                Revoke Consent
              </button>
              <button
                className="rounded-md bg-slate-800/70 px-3 py-1.5 text-sm text-slate-200 ring-1 ring-inset ring-white/10 hover:bg-slate-800"
                onClick={() => onSave?.(local)}
              >
                Save
              </button>
              <button
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-500"
                onClick={() => alert("Grant consent (stub)")}
              >
                Grant Consent
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
