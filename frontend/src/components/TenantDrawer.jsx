import React, { useMemo, useState } from "react";
import { IconX } from "@tabler/icons-react";

/**
 * Right-side drawer with *independent scrolling* inside.
 * Shows summary + granular scopes the user can toggle (mock states for now).
 */
export default function TenantDrawer({ open, onClose, tenant }) {
  const t = tenant ?? {};
  const [scopes, setScopes] = useState({
    readDirectory: true,
    readMail: false,
    manageUsers: false,
    manageGroups: false,
    securityEvents: true,
  });

  // Reset scopes when tenant changes
  useMemo(() => {
    setScopes({
      readDirectory: true,
      readMail: false,
      manageUsers: false,
      manageGroups: false,
      securityEvents: true,
    });
  }, [t.id, t.directoryTenantId]);

  if (!open) return null;

  function toggle(k) {
    setScopes((s) => ({ ...s, [k]: !s[k] }));
  }

  function save() {
    console.log("Save scopes for tenant", t, scopes);
    onClose?.();
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
        aria-hidden
      />
      {/* Panel */}
      <aside
        className="fixed right-0 top-0 z-50 h-full w-[420px] max-w-[90vw] border-l border-slate-800 bg-slate-900 text-slate-100 shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <div>
            <div className="text-sm text-slate-400">Managing Tenant</div>
            <div className="text-lg font-semibold text-white">
              {t.name ?? "Unknown Org"}
            </div>
          </div>
          <button
            className="rounded p-1 text-slate-300 hover:bg-slate-800"
            onClick={onClose}
            aria-label="Close"
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="h-[calc(100vh-48px-60px)] overflow-y-auto px-4 py-4">
          <div className="mb-4 rounded border border-slate-800 bg-slate-900/60 p-3 text-sm">
            <div className="text-slate-300">
              <span className="text-slate-400">Domain:</span>{" "}
              {t.domain ?? "—"}
            </div>
            <div className="text-slate-300">
              <span className="text-slate-400">Directory Tenant Id:</span>{" "}
              {t.directoryTenantId ?? "—"}
            </div>
            <div className="text-slate-300">
              <span className="text-slate-400">Type:</span>{" "}
              {t.type ?? "Office 365"}
            </div>
          </div>

          <div className="mb-4">
            <div className="mb-2 text-sm font-medium text-white">Permissions</div>
            <div className="space-y-2 text-sm">
              {Object.entries(scopes).map(([k, v]) => (
                <label
                  key={k}
                  className="flex items-center justify-between rounded border border-slate-800 bg-slate-900/60 px-3 py-2"
                >
                  <span className="capitalize text-slate-200">
                    {k.replace(/([A-Z])/g, " $1")}
                  </span>
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-indigo-500"
                    checked={!!v}
                    onChange={() => toggle(k)}
                  />
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium text-white">Notes</div>
            <textarea
              className="min-h-[120px] w-full rounded border border-slate-800 bg-slate-900/60 p-2 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-slate-700"
              placeholder="Notes about this tenant…"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-800 px-4 py-3">
          <button
            className="rounded border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="rounded bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-500"
            onClick={save}
          >
            Save
          </button>
        </div>
      </aside>
    </>
  );
}
