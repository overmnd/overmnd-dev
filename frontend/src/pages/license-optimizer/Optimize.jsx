// frontend/src/pages/license-optimizer/Optimize.jsx
import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  IconCurrencyDollar,
  IconDeviceFloppy,
  IconCheck,
  IconFilter,
  IconTrash,
} from "@tabler/icons-react";

/**
 * Pricebook (monthly list price — illustrative; replace via API later)
 */
const LICENSE_PRICEBOOK = {
  "M365 E3": 36.0,
  "M365 E5": 57.0,
  "M365 F3": 8.0,
  "Teams Phone": 8.0,
  "Visio Plan 2": 15.0,
};

/**
 * Rule catalog (modular; return from backend later)
 */
const LICENSE_RULES = [
  {
    id: "unused-e3",
    title: "Users with E3 and no Office usage (30d)",
    suggestion: "Downgrade to F3 or remove license",
    from: "M365 E3",
    to: "M365 F3",
    sampleHits: 31,
    estPerUser: LICENSE_PRICEBOOK["M365 E3"] - LICENSE_PRICEBOOK["M365 F3"],
    rationale:
      "No Office desktop/web activity in 30 days indicates over-provisioning for these users.",
  },
  {
    id: "teams-phone-unused",
    title: "Teams Phone add-on with zero calls (60d)",
    suggestion: "Remove Teams Phone add-on",
    from: "Teams Phone",
    to: null,
    sampleHits: 26,
    estPerUser: LICENSE_PRICEBOOK["Teams Phone"],
    rationale: "No PSTN or peer calls in 60 days — remove until needed.",
  },
  {
    id: "visio-no-launch",
    title: "Visio Plan 2 never launched (90d)",
    suggestion: "Remove Visio Plan 2",
    from: "Visio Plan 2",
    to: null,
    sampleHits: 12,
    estPerUser: LICENSE_PRICEBOOK["Visio Plan 2"],
    rationale: "License assigned but app not launched and no file edits recorded.",
  },
  {
    id: "e5-no-security",
    title: "E5 users not using E5 security/calling features",
    suggestion: "Downgrade from E5 → E3",
    from: "M365 E5",
    to: "M365 E3",
    sampleHits: 7,
    estPerUser: LICENSE_PRICEBOOK["M365 E5"] - LICENSE_PRICEBOOK["M365 E3"],
    rationale: "Expensive SKU but no E5-exclusive workloads detected.",
  },
];

/** Fake user lists per rule for demo (replace with data from API) */
const FAKE_USERS = (count) =>
  Array.from({ length: count }).map((_, i) => ({
    upn: `user${(i + 1).toString().padStart(3, "0")}@contoso.com`,
    displayName: `User ${(i + 1).toString().padStart(3, "0")}`,
  }));

/**
 * Build row list for each rule with sample details.
 */
function buildOpportunities() {
  return LICENSE_RULES.map((r) => ({
    ...r,
    users: FAKE_USERS(r.sampleHits),
    selected: false,
  }));
}

export default function LOOptimize() {
  const [params] = useSearchParams();
  const focus = params.get("focus") || "";

  const [rows, setRows] = useState(buildOpportunities());
  const [plan, setPlan] = useState([]); // items: { ruleId, upns[], from, to, estPerUser }

  const filtered = useMemo(() => {
    if (!focus) return rows;
    return rows.filter((r) => r.id === focus);
  }, [rows, focus]);

  const planSavings = useMemo(() => {
    return plan.reduce((sum, p) => sum + p.upns.length * (p.estPerUser || 0), 0);
  }, [plan]);

  function toggleRow(ruleId) {
    setRows((rs) => rs.map((r) => (r.id === ruleId ? { ...r, selected: !r.selected } : r)));
  }

  function addToPlan(rule) {
    const chosen = rule.users.map((u) => u.upn); // all in demo; later allow selection subset
    setPlan((p) => {
      const existing = p.find((x) => x.ruleId === rule.id);
      if (existing) return p;
      return [
        ...p,
        { ruleId: rule.id, title: rule.title, upns: chosen, from: rule.from, to: rule.to, estPerUser: rule.estPerUser },
      ];
    });
    toast.success("Added to plan");
  }

  function removeFromPlan(ruleId) {
    setPlan((p) => p.filter((x) => x.ruleId !== ruleId));
  }

  function exportPlan() {
    const payload = {
      createdAt: new Date().toISOString(),
      items: plan,
      estMonthlySavings: planSavings,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `overmnd-license-plan-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported optimization plan");
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      {/* Opportunities */}
      <div className="xl:col-span-2 space-y-4">
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-medium text-white">Opportunities</div>
            <button className="inline-flex items-center gap-1 rounded border border-slate-700 px-3 py-1.5 text-xs text-gray-200 hover:bg-slate-800">
              <IconFilter size={14} /> Filters
            </button>
          </div>

          <div className="space-y-3">
            {filtered.map((r) => (
              <div key={r.id} className="rounded border border-slate-800 bg-slate-950 p-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={r.selected}
                    onChange={() => toggleRow(r.id)}
                    className="mt-1 h-4 w-4 accent-indigo-600"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-white">{r.title}</div>
                    <div className="text-sm text-slate-400">{r.rationale}</div>
                    <div className="mt-2 text-xs text-emerald-300">
                      Est. savings per user: ${r.estPerUser.toFixed(2)} / mo
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Matches</div>
                    <div className="text-white">{r.users.length}</div>
                  </div>
                </div>

                {/* Users preview */}
                <div className="mt-3 rounded border border-slate-800 bg-slate-900 p-2 text-xs text-slate-300">
                  <div className="mb-1 text-slate-400">Sample users</div>
                  <div className="flex flex-wrap gap-2">
                    {r.users.slice(0, 6).map((u) => (
                      <span key={u.upn} className="rounded border border-slate-700 bg-slate-800 px-2 py-0.5">
                        {u.upn}
                      </span>
                    ))}
                    {r.users.length > 6 ? <span>… +{r.users.length - 6} more</span> : null}
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    className="inline-flex items-center gap-2 rounded bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-500"
                    onClick={() => addToPlan(r)}
                  >
                    <IconCheck size={16} /> Add to Plan
                  </button>
                  <span className="text-xs text-slate-400">
                    Action: {r.to ? `Downgrade ${r.from} → ${r.to}` : `Remove ${r.from}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Plan / Cart */}
      <div className="space-y-4">
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <div className="text-sm font-medium text-white">Plan</div>
          <div className="mt-3 space-y-3">
            {plan.length === 0 ? (
              <div className="rounded border border-slate-800 bg-slate-950 p-3 text-sm text-slate-400">
                Nothing added yet. Select opportunities and click <em>Add to Plan</em>.
              </div>
            ) : null}

            {plan.map((p) => (
              <div key={p.ruleId} className="rounded border border-slate-800 bg-slate-950 p-3 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-white">{p.title}</div>
                    <div className="text-xs text-slate-400">
                      Users: {p.upns.length} · Est. per user ${p.estPerUser.toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-400">
                      Action: {p.to ? `Downgrade ${p.from} → ${p.to}` : `Remove ${p.from}`}
                    </div>
                  </div>
                  <button
                    className="inline-flex items-center gap-1 rounded border border-slate-700 px-2 py-1 text-xs text-rose-300 hover:bg-slate-800"
                    onClick={() => removeFromPlan(p.ruleId)}
                  >
                    <IconTrash size={14} /> Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="rounded border border-slate-800 bg-slate-950 p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-300">Estimated Monthly Savings</div>
                <div className="text-lg font-semibold text-emerald-300">
                  ${planSavings.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={exportPlan}
                className="inline-flex items-center gap-2 rounded border border-slate-700 px-3 py-1.5 text-sm text-gray-200 hover:bg-slate-800"
              >
                <IconDeviceFloppy size={16} /> Export Plan
              </button>
              <button
                onClick={() => toast.success("Submitting plan to workflow (placeholder)…")}
                className="inline-flex items-center gap-2 rounded bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-500"
              >
                <IconCurrencyDollar size={16} /> Submit for Approval
              </button>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-xs text-slate-400">
          All calculations are estimates. Exact savings depend on your billing model and proration rules.
        </div>
      </div>
    </div>
  );
}
