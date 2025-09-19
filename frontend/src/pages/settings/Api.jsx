import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Api() {
  const { addAudit } = useOutletContext();
  const [keys, setKeys] = useState([{ id: "ak_live_1234", label: "Server key", created: "2025-06-01" }]);
  const [label, setLabel] = useState("");
  const [webhooks, setWebhooks] = useState([{ url: "https://example.com/hook", event: "report.ready" }]);

  function createKey() {
    if (!label) return;
    const id = "ak_" + Math.random().toString(36).slice(2, 10);
    const next = [...keys, { id, label, created: new Date().toISOString().slice(0, 10) }];
    setKeys(next);
    setLabel("");
    toast.success("API key created");
    addAudit("CreateKey", "API", { id, label });
  }

  return (
    <div className="space-y-6">
      {/* API Keys */}
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="text-sm font-medium text-white">API Keys</div>
        <div className="mt-3 flex gap-2">
          <input
            className="w-64 rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-gray-200"
            placeholder="Label (e.g., Server)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <button onClick={createKey} className="rounded bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-500">
            Create
          </button>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="px-3 py-2">Key</th>
                <th className="px-3 py-2">Label</th>
                <th className="px-3 py-2">Created</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              {keys.map((k) => (
                <tr key={k.id} className="border-t border-slate-800">
                  <td className="px-3 py-2 font-mono">{k.id}</td>
                  <td className="px-3 py-2">{k.label}</td>
                  <td className="px-3 py-2">{k.created}</td>
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(k.id);
                        toast("Copied");
                        addAudit("CopyKey", "API", { id: k.id });
                      }}
                      className="rounded border border-slate-700 px-2 py-1 text-xs hover:bg-slate-800"
                    >
                      Copy
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Webhooks */}
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="text-sm font-medium text-white">Webhooks</div>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
          {webhooks.map((w, i) => (
            <div key={i} className="rounded border border-slate-800 bg-slate-950 p-3">
              <div className="text-xs text-slate-400">{w.event}</div>
              <div className="mt-1 text-sm text-white break-all">{w.url}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
