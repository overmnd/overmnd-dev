import React, { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";

export default function Audit() {
  const { audit } = useOutletContext();
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const txt = q.toLowerCase();
    return audit.filter((e) => JSON.stringify(e).toLowerCase().includes(txt));
  }, [audit, q]);

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-medium text-white">Audit Logs</div>
        <input
          className="w-64 rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-gray-200"
          placeholder="Search events"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400">
              <th className="px-3 py-2">Time</th>
              <th className="px-3 py-2">Actor</th>
              <th className="px-3 py-2">Action</th>
              <th className="px-3 py-2">Area</th>
              <th className="px-3 py-2">Details</th>
            </tr>
          </thead>
          <tbody className="text-slate-300">
            {rows.map((e) => (
              <tr key={e.id} className="border-t border-slate-800 align-top">
                <td className="px-3 py-2">{new Date(e.ts).toLocaleString()}</td>
                <td className="px-3 py-2">{e.actor}</td>
                <td className="px-3 py-2">{e.action}</td>
                <td className="px-3 py-2">{e.area}</td>
                <td className="px-3 py-2">
                  <pre className="max-w-[520px] whitespace-pre-wrap break-all text-xs text-slate-400">
                    {e.details ? JSON.stringify(e.details, null, 2) : "—"}
                  </pre>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-slate-500" colSpan={5}>
                  No audit events yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
