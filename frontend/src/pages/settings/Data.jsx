import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Data() {
  const { addAudit } = useOutletContext();
  const [retention, setRetention] = useState(365);
  const [residency, setResidency] = useState("US");
  const [maskEmails, setMaskEmails] = useState(false);

  function exportJson() {
    const payload = { exportedAt: new Date().toISOString(), retention, residency, maskEmails };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "overmnd-export.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export queued");
    addAudit("Export", "Data", { type: "json" });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="text-sm font-medium text-white">Data Controls</div>
        <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-3">
          <label className="text-sm text-slate-300">
            Retention (days)
            <input
              type="number"
              className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-gray-200"
              value={retention}
              onChange={(e) => setRetention(Number(e.target.value))}
            />
          </label>
          <label className="text-sm text-slate-300">
            Data Residency
            <select
              value={residency}
              onChange={(e) => setResidency(e.target.value)}
              className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-gray-200"
            >
              <option value="US">US</option>
              <option value="EU">EU</option>
              <option value="APAC">APAC</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" checked={maskEmails} onChange={(e) => setMaskEmails(e.target.checked)} />
            Mask emails in exports
          </label>
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={exportJson} className="rounded border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800">
            Export JSON
          </button>
          <button
            onClick={() => {
              toast("CSV export not implemented");
              addAudit("Export", "Data", { type: "csv" });
            }}
            className="rounded border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800"
          >
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}
