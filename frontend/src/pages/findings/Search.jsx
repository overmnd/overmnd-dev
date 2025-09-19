// frontend/src/pages/findings/Search.jsx
import React, { useState } from "react";

export default function FindingsSearch() {
  const [rows, setRows] = useState([
    { field: "Time Detected", op: "during last", value: "7 days" },
    { field: "Service", op: "equals", value: "Active Directory" },
  ]);

  function addRow() {
    setRows((r) => [...r, { field: "Activity", op: "contains", value: "" }]);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="text-sm font-medium text-white">Responsive, flexible search</div>
        <p className="mt-1 text-sm text-slate-400">
          Compose queries with simple filters, then save, run, or alert on results.
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 px-4 py-3 text-sm font-medium text-white">Query</div>
        <div className="p-4 space-y-2">
          {rows.map((r, i) => (
            <div
              key={i}
              className="grid grid-cols-1 gap-2 md:grid-cols-[220px_160px_1fr_auto] items-center"
            >
              <select
                value={r.field}
                onChange={(e) => {
                  const v = e.target.value;
                  setRows((all) => all.map((x, j) => (j === i ? { ...x, field: v } : x)));
                }}
                className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-gray-200"
              >
                {["Time Detected", "Service", "Activity", "User (Actor)", "Target", "Azure AD Category"].map(
                  (o) => (
                    <option key={o}>{o}</option>
                  )
                )}
              </select>

              <select
                value={r.op}
                onChange={(e) => {
                  const v = e.target.value;
                  setRows((all) => all.map((x, j) => (j === i ? { ...x, op: v } : x)));
                }}
                className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-gray-200"
              >
                {["equals", "contains", "during last", "not equals", "starts with"].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>

              <input
                value={r.value}
                onChange={(e) => {
                  const v = e.target.value;
                  setRows((all) => all.map((x, j) => (j === i ? { ...x, value: v } : x)));
                }}
                placeholder="value"
                className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-gray-200"
              />

              <button
                onClick={() => setRows((all) => all.filter((_, j) => j !== i))}
                className="ml-2 rounded border border-slate-700 px-2 py-1 text-xs text-gray-300 hover:bg-slate-800"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="pt-2">
            <button
              onClick={addRow}
              className="rounded border border-slate-700 px-3 py-1.5 text-sm text-gray-200 hover:bg-slate-800"
            >
              + Add filter
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800 px-4 py-3">
          <div className="text-xs text-slate-400">Previewing 0 results (placeholder)</div>
          <div className="flex gap-2">
            <button className="rounded border border-slate-700 px-3 py-1.5 text-sm hover:bg-slate-800">
              Save
            </button>
            <button className="rounded border border-slate-700 px-3 py-1.5 text-sm hover:bg-slate-800">
              Alert
            </button>
            <button className="rounded bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-500">
              Run
            </button>
          </div>
        </div>
      </div>

      {/* Results placeholder */}
      <div className="rounded-lg border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 px-4 py-3 text-sm font-medium text-white">
          Results
        </div>
        <div className="p-4 text-sm text-slate-400">Results will render here.</div>
      </div>
    </div>
  );
}
