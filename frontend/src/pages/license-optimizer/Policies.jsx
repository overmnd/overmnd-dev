// frontend/src/pages/license-optimizer/Policies.jsx
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { IconPlus, IconTrash, IconShieldCheck } from "@tabler/icons-react";

const DEFAULT_POLICY = {
  name: "Default Rightsizing",
  description: "Baseline rules to catch common over-licensing",
  rules: [
    { field: "OfficeUsageDays", op: ">=", value: 30, action: "DOWNGRADE_E3_TO_F3" },
    { field: "TeamsCalls60d", op: "=", value: 0, action: "REMOVE_TEAMS_PHONE" },
  ],
  scope: "All tenants",
  approval: "Required",
};

export default function LOPolicies() {
  const [policy, setPolicy] = useState(DEFAULT_POLICY);

  function addRule() {
    setPolicy((p) => ({
      ...p,
      rules: [...p.rules, { field: "VisioLaunches90d", op: "=", value: 0, action: "REMOVE_VISIO_P2" }],
    }));
  }
  function removeRule(idx) {
    setPolicy((p) => ({ ...p, rules: p.rules.filter((_, i) => i !== idx) }));
  }
  function savePolicy() {
    toast.success("Policy saved locally (placeholder). Wire this to API.");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-white">
          <IconShieldCheck size={18} />
          Policy Builder
        </div>
        <p className="mt-1 text-sm text-slate-400">
          Define conditions that automatically suggest or apply rightsizing with approval.
          This structure is backend-friendly for future automation.
        </p>
      </div>

      {/* Editor */}
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="text-xs text-slate-400">Policy name</label>
            <input
              className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-gray-200"
              value={policy.name}
              onChange={(e) => setPolicy((p) => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">Scope</label>
            <select
              className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-gray-200"
              value={policy.scope}
              onChange={(e) => setPolicy((p) => ({ ...p, scope: e.target.value }))}
            >
              <option>All tenants</option>
              <option>Only flagged tenants</option>
              <option>Custom groups</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400">Approval</label>
            <select
              className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-gray-200"
              value={policy.approval}
              onChange={(e) => setPolicy((p) => ({ ...p, approval: e.target.value }))}
            >
              <option>Required</option>
              <option>Auto-apply (low impact)</option>
              <option>Suggest only</option>
            </select>
          </div>
        </div>

        {/* Rules */}
        <div className="mt-4">
          <div className="mb-2 text-sm font-medium text-white">Rules</div>
          <div className="space-y-2">
            {policy.rules.map((r, idx) => (
              <div key={idx} className="flex flex-wrap items-center gap-2 rounded border border-slate-800 bg-slate-950 p-2">
                <select
                  className="rounded border border-slate-700 bg-slate-900 px-2 py-1.5 text-sm text-gray-200"
                  value={r.field}
                  onChange={(e) =>
                    setPolicy((p) => {
                      const rules = [...p.rules];
                      rules[idx] = { ...rules[idx], field: e.target.value };
                      return { ...p, rules };
                    })
                  }
                >
                  <option value="OfficeUsageDays">OfficeUsageDays</option>
                  <option value="TeamsCalls60d">TeamsCalls60d</option>
                  <option value="VisioLaunches90d">VisioLaunches90d</option>
                </select>

                <select
                  className="rounded border border-slate-700 bg-slate-900 px-2 py-1.5 text-sm text-gray-200"
                  value={r.op}
                  onChange={(e) =>
                    setPolicy((p) => {
                      const rules = [...p.rules];
                      rules[idx] = { ...rules[idx], op: e.target.value };
                      return { ...p, rules };
                    })
                  }
                >
                  <option>=</option>
                  <option>{">"}</option>
                  <option>{">="}</option>
                  <option>{"<"}</option>
                  <option>{"<="}</option>
                </select>

                <input
                  className="w-28 rounded border border-slate-700 bg-slate-900 px-2 py-1.5 text-sm text-gray-200"
                  value={r.value}
                  onChange={(e) =>
                    setPolicy((p) => {
                      const rules = [...p.rules];
                      rules[idx] = { ...rules[idx], value: e.target.value };
                      return { ...p, rules };
                    })
                  }
                />

                <span className="text-xs text-slate-400">→</span>

                <select
                  className="rounded border border-slate-700 bg-slate-900 px-2 py-1.5 text-sm text-gray-200"
                  value={r.action}
                  onChange={(e) =>
                    setPolicy((p) => {
                      const rules = [...p.rules];
                      rules[idx] = { ...rules[idx], action: e.target.value };
                      return { ...p, rules };
                    })
                  }
                >
                  <option value="DOWNGRADE_E3_TO_F3">Downgrade E3 → F3</option>
                  <option value="REMOVE_TEAMS_PHONE">Remove Teams Phone</option>
                  <option value="REMOVE_VISIO_P2">Remove Visio Plan 2</option>
                </select>

                <button
                  className="ml-auto inline-flex items-center gap-1 rounded border border-slate-700 px-2 py-1 text-xs text-rose-300 hover:bg-slate-800"
                  onClick={() => removeRule(idx)}
                >
                  <IconTrash size={14} /> Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={addRule}
              className="inline-flex items-center gap-2 rounded border border-slate-700 px-3 py-1.5 text-sm text-gray-200 hover:bg-slate-800"
            >
              <IconPlus size={16} /> Add Rule
            </button>
            <button
              onClick={savePolicy}
              className="inline-flex items-center gap-2 rounded bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-500"
            >
              Save Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
