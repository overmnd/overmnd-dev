// frontend/src/pages/findings/HybridIdentity.jsx
import React from "react";

export default function HybridIdentity() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="text-sm font-medium text-white">Hybrid identity auditing</div>
        <p className="mt-1 text-sm text-slate-400">
          Combine on-prem AD activity and Microsoft 365 signals for a single audit view. Use the
          table below as a foundation for recent high-value actions.
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 px-4 py-3 text-sm font-medium text-white">
          Recent privileged actions
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-950/40 text-left text-gray-300">
              <tr>
                <th className="px-4 py-2">Time</th>
                <th className="px-4 py-2">Actor</th>
                <th className="px-4 py-2">Action</th>
                <th className="px-4 py-2">Target</th>
                <th className="px-4 py-2">Origin</th>
                <th className="px-4 py-2">Service</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["10:14", "admin@contoso", "Add user to role", "Global Reader", "Cloud", "AAD"],
                ["09:40", "svc-sync", "Sync password hash", "j.smith", "On-prem", "AD Connect"],
                ["08:31", "helpdesk1", "Reset password", "k.chan", "Cloud", "AAD"],
                ["Yesterday", "pim-flow", "Activate role", "Privileged Auth Admin", "Cloud", "PIM"],
              ].map((r, i) => (
                <tr key={i} className="border-t border-slate-800 text-gray-200">
                  <td className="px-4 py-2">{r[0]}</td>
                  <td className="px-4 py-2">{r[1]}</td>
                  <td className="px-4 py-2">{r[2]}</td>
                  <td className="px-4 py-2">{r[3]}</td>
                  <td className="px-4 py-2">{r[4]}</td>
                  <td className="px-4 py-2">{r[5]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
