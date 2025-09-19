// frontend/src/pages/license-optimizer/Reports.jsx
import React from "react";

export default function LOReports() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="text-sm font-medium text-white">Savings to Date</div>
        <p className="mt-1 text-sm text-slate-400">
          Historical reporting and exports. Wire this up to your backend summaries.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { title: "Last 30 days", value: "$1,120" },
          { title: "Last quarter", value: "$3,470" },
          { title: "YTD", value: "$5,960" },
        ].map((k) => (
          <div key={k.title} className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <div className="text-sm text-slate-400">{k.title}</div>
            <div className="text-xl font-semibold text-white">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="mb-2 text-sm font-medium text-white">Recent Actions</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Action</th>
                <th className="px-3 py-2">Users</th>
                <th className="px-3 py-2">Est. Savings</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              {[
                ["2025-07-06", "Downgrade E3 → F3", "31", "$868", "Approved"],
                ["2025-07-03", "Remove Teams Phone", "26", "$208", "Applied"],
                ["2025-06-28", "Remove Visio P2", "12", "$180", "Applied"],
              ].map((r, i) => (
                <tr key={i} className="border-t border-slate-800">
                  {r.map((c, j) => (
                    <td key={j} className="px-3 py-2">{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <button className="rounded border border-slate-700 px-3 py-1.5 text-sm text-gray-200 hover:bg-slate-800">
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}
