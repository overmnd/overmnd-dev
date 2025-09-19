// frontend/src/pages/remediations/RemediationDashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  IconAlertTriangle,
  IconShieldLock,
  IconUserExclamation,
  IconTrash,
  IconSettings,
} from "@tabler/icons-react";

const SUGGESTIONS = [
  {
    id: "disable-legacy-auth",
    title: "Disable legacy authentication",
    desc: "Block basic auth protocols in Exchange/SMTP/IMAP/POP to stop password-spray.",
    impact: "High risk reduction",
    icon: IconShieldLock,
    color: "text-emerald-300",
    seed: { services: ["SMTP", "IMAP", "POP"], excludeAccounts: [] },
  },
  {
    id: "require-mfa-admins",
    title: "Require MFA for privileged roles",
    desc: "Enforce MFA for Global Admins, Privileged Auth Admins, and App Admins.",
    impact: "Critical",
    icon: IconAlertTriangle,
    color: "text-amber-300",
    seed: { roles: ["Global Administrator", "Privileged Authentication Administrator"] },
  },
  {
    id: "remove-stale-guests",
    title: "Remove or disable stale guest users",
    desc: "Find external guests inactive for 90+ days and disable or remove them.",
    impact: "Medium",
    icon: IconTrash,
    color: "text-rose-300",
    seed: { inactivityDays: 90, mode: "disable" },
  },
  {
    id: "tighten-external-sharing",
    title: "Tighten SharePoint external sharing",
    desc: "Restrict anonymous links and require sign-in for file access.",
    impact: "Medium",
    icon: IconSettings,
    color: "text-blue-300",
    seed: { allowAnonymous: false, linkExpiryDays: 7 },
  },
  {
    id: "investigate-risky-user",
    title: "Investigate risky user & reset credentials",
    desc: "Automate investigation flow: block sign-in, reset password, revoke refresh tokens.",
    impact: "High",
    icon: IconUserExclamation,
    color: "text-indigo-300",
    seed: { username: "", revokeSessions: true },
  },
];

export default function RemediationDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="text-sm font-medium text-white">At-a-glance suggestions</div>
        <p className="mt-1 text-sm text-slate-400">
          Pick a quick fix to jump into the guided Remediate flow. You can customize everything
          before executing.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {SUGGESTIONS.map((s) => (
          <div
            key={s.id}
            className="rounded-lg border border-slate-800 bg-slate-900 p-4 flex flex-col"
          >
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 ${s.color}`}>
                <s.icon size={22} />
              </div>
              <div className="min-w-0">
                <div className="text-white font-medium">{s.title}</div>
                <div className="text-sm text-slate-400">{s.desc}</div>
                <div className="mt-2 text-xs text-emerald-300">{s.impact}</div>
              </div>
            </div>

            <div className="mt-4 flex-1" />

            <div className="flex items-center justify-between">
              <button
                onClick={() =>
                  navigate(`/remediations/remediate?action=${encodeURIComponent(s.id)}`, {
                    state: { seed: s.seed },
                  })
                }
                className="rounded bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-500"
              >
                Remediate
              </button>
              <button
                onClick={() =>
                  navigate(`/remediations/recommendations`, {
                    state: { focus: s.id },
                  })
                }
                className="rounded border border-slate-700 px-3 py-1.5 text-sm text-gray-200 hover:bg-slate-800"
              >
                Learn more
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
