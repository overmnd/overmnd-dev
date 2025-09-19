// frontend/src/pages/findings/CriticalAssets.jsx
import React from "react";

export default function CriticalAssets() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="text-sm font-medium text-white">Tier Zero (Critical Asset) Overview</div>
        <p className="mt-1 text-sm text-slate-400">
          Integrate with BloodHound to identify Tier Zero assets and continuously monitor for
          suspicious changes. Below is a starting inventory list you can expand later.
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 px-4 py-3 text-sm font-medium text-white">
          Tier Zero assets
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-950/40 text-left text-gray-300">
              <tr>
                <th className="px-4 py-2">Object</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Risk</th>
                <th className="px-4 py-2">Last Activity</th>
                <th className="px-4 py-2">Owner</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Domain Admins", "Group", "High", "2h ago", "Security"],
                ["Key Vault – prod", "Service", "Medium", "1d ago", "Platform"],
                ["Conditional Access – Baseline", "Policy", "High", "3h ago", "SecOps"],
                ["SAML App – Legacy HR", "Application", "High", "5d ago", "Apps"],
              ].map((r, i) => (
                <tr key={i} className="border-t border-slate-800 text-gray-200">
                  <td className="px-4 py-2">{r[0]}</td>
                  <td className="px-4 py-2">{r[1]}</td>
                  <td className="px-4 py-2">{r[2]}</td>
                  <td className="px-4 py-2">{r[3]}</td>
                  <td className="px-4 py-2">{r[4]}</td>
                  <td className="px-4 py-2 text-right">
                    <button className="rounded border border-slate-700 px-2 py-1 text-xs hover:bg-slate-800">
                      View graph
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-800 p-4">
          <button className="rounded bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-500">
            Connect BloodHound (placeholder)
          </button>
        </div>
      </div>
    </div>
  );
}
