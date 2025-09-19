import React from "react";
import { useOutletContext } from "react-router-dom";
import { IconExternalLink } from "@tabler/icons-react";
import { toast } from "react-hot-toast";

export default function Integrations() {
  const { integrations, setIntegrations, save, addAudit } = useOutletContext();

  function regrant() {
    toast("Grant flow will redirect to Entra (stub).");
    addAudit("RegrantConsent", "Integrations", { provider: "Microsoft" });
  }

  return (
    <div className="space-y-6">
      {/* Microsoft */}
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="mb-2 text-sm font-medium text-white">Microsoft Entra / Graph</div>
        <div className="text-sm text-slate-300">
          Status:{" "}
          <span
            className={
              "rounded px-2 py-0.5 text-xs " +
              (integrations.microsoft.connected ? "bg-emerald-600/20 text-emerald-300" : "bg-slate-600/20 text-slate-300")
            }
          >
            {integrations.microsoft.connected ? "Connected" : "Disconnected"}
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-400">Tenant Id: {integrations.microsoft.tenantId || "—"}</div>
        <div className="mt-3 flex gap-2">
          <button className="rounded border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800" onClick={regrant}>
            Re-grant Consent
          </button>
          <a
            className="inline-flex items-center gap-2 rounded border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              addAudit("OpenPermissions", "Integrations", { provider: "Microsoft" });
            }}
          >
            Open Microsoft Permissions <IconExternalLink size={16} />
          </a>
        </div>
      </div>

      {/* Webhooks / SMTP */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <div className="text-sm font-medium text-white">Teams & Slack</div>
          <label className="mt-3 block text-sm text-slate-300">
            Teams Incoming Webhook
            <input
              className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-gray-200"
              placeholder="https://outlook.office.com/webhook/..."
              value={integrations.teamsWebhook}
              onChange={(e) => setIntegrations({ ...integrations, teamsWebhook: e.target.value })}
            />
          </label>
          <label className="mt-3 block text-sm text-slate-300">
            Slack Incoming Webhook
            <input
              className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-gray-200"
              placeholder="https://hooks.slack.com/services/..."
              value={integrations.slackWebhook}
              onChange={(e) => setIntegrations({ ...integrations, slackWebhook: e.target.value })}
            />
          </label>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <div className="text-sm font-medium text-white">SMTP</div>
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            <label className="text-sm text-slate-300">
              Host
              <input
                className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-gray-200"
                value={integrations.smtp.host}
                onChange={(e) => setIntegrations({ ...integrations, smtp: { ...integrations.smtp, host: e.target.value } })}
              />
            </label>
            <label className="text-sm text-slate-300">
              Port
              <input
                type="number"
                className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-gray-200"
                value={integrations.smtp.port}
                onChange={(e) =>
                  setIntegrations({ ...integrations, smtp: { ...integrations.smtp, port: Number(e.target.value) } })
                }
              />
            </label>
            <label className="text-sm text-slate-300">
              User
              <input
                className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-gray-200"
                value={integrations.smtp.user}
                onChange={(e) => setIntegrations({ ...integrations, smtp: { ...integrations.smtp, user: e.target.value } })}
              />
            </label>
            <label className="text-sm text-slate-300">
              From
              <input
                className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-gray-200"
                value={integrations.smtp.from}
                onChange={(e) => setIntegrations({ ...integrations, smtp: { ...integrations.smtp, from: e.target.value } })}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => save("Integrations")}
          className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500"
        >
          Save
        </button>
      </div>
    </div>
  );
}
