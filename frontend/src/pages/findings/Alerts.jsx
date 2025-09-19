// frontend/src/pages/findings/Alerts.jsx
import React from "react";

export default function FindingsAlerts() {
  const rows = [
    { name: "Admin role changes", sev: "High", last: "8m ago", enabled: true },
    { name: "External guest risky sign-in", sev: "High", last: "1h ago", enabled: true },
    { name: "Mass group membership change", sev: "Medium", last: "Yesterday", enabled: false },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="text-sm font-medium text-white">Real-time alerts</div>
        <p className="mt-1 text-sm text-slate-400">
          Send alert notifications to email or mobile devices. This is a foundation list you can
          expand with saving from the Search page.
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 px-4 py-3 text-sm font-medium text-white">Alerts</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-950/40 text-left text-gray-300">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Severity</th>
                <th className="px-4 py-2">Last fired</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t border-slate-800 text-gray-200">
                  <td className="px-4 py-2">{r.name}</td>
                  <td className="px-4 py-2">{r.sev}</td>
                  <td className="px-4 py-2">{r.last}</td>
                  <td className="px-4 py-2">
                    <span
                      className={
                        "rounded px-2 py-0.5 text-xs " +
                        (r.enabled
                          ? "bg-emerald-600/20 text-emerald-300"
                          : "bg-slate-700/40 text-slate-300")
                      }
                    >
                      {r.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button className="rounded border border-slate-700 px-2 py-1 text-xs hover:bg-slate-800">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-800 p-4">
          <button className="rounded bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-500">
            New alert
          </button>
        </div>
      </div>
    </div>
  );
}
