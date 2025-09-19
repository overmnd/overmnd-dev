// frontend/src/pages/license-optimizer/Analyze.jsx
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { IconCloudUpload, IconPlugConnected, IconReload } from "@tabler/icons-react";

export default function LOAnalyze() {
  const [fileName, setFileName] = useState("");

  function onUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    toast.success("File staged. Mapping columns below.");
  }

  return (
    <div className="space-y-6">
      {/* Sources */}
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="mb-1 text-sm font-medium text-white">Data Sources</div>
        <p className="text-sm text-slate-400">
          We combine telemetry from Microsoft 365 (Graph, Audit, Usage) and optional CSV/ETL uploads.
          Data freshness and coverage appear below.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              title: "Microsoft Graph",
              status: "Connected",
              desc: "Licenses, users, groups, service plans.",
            },
            { title: "Audit/Usage", status: "Connected", desc: "Office usage, Teams calls, app launches." },
            { title: "CSV Uploads", status: fileName ? `Staged: ${fileName}` : "None", desc: "Supplemental exports." },
          ].map((s) => (
            <div key={s.title} className="rounded border border-slate-800 bg-slate-950 p-3">
              <div className="text-white">{s.title}</div>
              <div className="text-xs text-emerald-300">{s.status}</div>
              <div className="text-sm text-slate-400">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload & mapping */}
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="mb-2 text-sm font-medium text-white">Import CSV / Map Columns</div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <label className="flex cursor-pointer items-center gap-2 rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-gray-200 hover:bg-slate-800">
            <IconCloudUpload size={18} />
            <span>Choose CSV …</span>
            <input type="file" accept=".csv" className="hidden" onChange={onUpload} />
          </label>

          <button
            className="flex items-center gap-2 rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-gray-200 hover:bg-slate-800"
            onClick={() => toast.success("Refreshing connectors (placeholder)…")}
          >
            <IconPlugConnected size={18} />
            Refresh Connectors
          </button>

          <button
            className="flex items-center gap-2 rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-gray-200 hover:bg-slate-800"
            onClick={() => toast.success("Rebuilding usage indexes (placeholder)…")}
          >
            <IconReload size={18} />
            Reindex Usage
          </button>
        </div>

        {/* Mapping grid (placeholder) */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { src: "userPrincipalName", dst: "UPN" },
            { src: "skuId", dst: "SKU" },
            { src: "lastOfficeActivity", dst: "OfficeLastUsed" },
            { src: "teamsCalls", dst: "TeamsCallsLast60d" },
            { src: "visioLaunches", dst: "VisioLaunches90d" },
            { src: "sharepointExternal", dst: "ExternalSites" },
          ].map((m) => (
            <div key={m.src} className="rounded border border-slate-800 bg-slate-950 p-3 text-sm text-gray-200">
              <div className="text-xs text-slate-400">Source column</div>
              <div className="text-white">{m.src}</div>
              <div className="mt-1 text-xs text-slate-400">Maps to</div>
              <select className="mt-1 w-full rounded border border-slate-700 bg-slate-900 px-2 py-1.5 text-sm">
                <option>{m.dst}</option>
                <option>Ignore</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
