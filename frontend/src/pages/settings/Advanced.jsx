import React from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Advanced() {
  const { addAudit, resetAll } = useOutletContext();

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="text-sm font-medium text-white">Maintenance</div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => {
              toast.success("Caches cleared");
              addAudit("ClearCaches", "Advanced", {});
            }}
            className="rounded border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800"
          >
            Clear Caches
          </button>
          <button
            onClick={() => {
              toast("Reindex started");
              addAudit("Reindex", "Advanced", {});
            }}
            className="rounded border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800"
          >
            Reindex
          </button>
          <button
            onClick={() => {
              toast("Health check queued");
              addAudit("HealthCheck", "Advanced", {});
            }}
            className="rounded border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800"
          >
            Run Health Check
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-rose-800 bg-slate-900 p-4">
        <div className="text-sm font-medium text-white">Danger Zone</div>
        <p className="mt-1 text-sm text-slate-400">Irreversible operations. Proceed with caution.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => {
              toast("Tenant connections reset");
              addAudit("ResetConnections", "Advanced", {});
            }}
            className="rounded border border-rose-700 px-3 py-2 text-sm text-rose-300 hover:bg-rose-900/30"
          >
            Reset Tenant Connections
          </button>
          <button
            onClick={() => {
              resetAll();
            }}
            className="rounded border border-rose-700 px-3 py-2 text-sm text-rose-300 hover:bg-rose-900/30"
          >
            Reset All Settings
          </button>
        </div>
      </div>
    </div>
  );
}
