// frontend/src/pages/remediations/Recommendations.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  {
    title: "Identity & Access",
    items: [
      {
        id: "require-mfa-admins",
        title: "Require MFA for privileged roles",
        text:
          "MFA is table-stakes. Enforce MFA on all admin roles and exempt a small set of break-glass accounts stored in a secure location.",
      },
      {
        id: "investigate-risky-user",
        title: "Respond quickly to risky users",
        text:
          "When a user is flagged as risky, block sign-in, revoke tokens, reset their password, and investigate unusual activity.",
      },
    ],
  },
  {
    title: "Email & Collaboration",
    items: [
      {
        id: "disable-legacy-auth",
        title: "Disable legacy authentication",
        text:
          "Legacy protocols enable password spray and basic auth abuse. Disable SMTP/IMAP/POP unless you have a strong exception process.",
      },
      {
        id: "tighten-external-sharing",
        title: "Tighten external sharing",
        text:
          "Require sign-in for links and add link expirations. Use guest-specific sites and least-privilege permissions.",
      },
    ],
  },
  {
    title: "Tenant Hygiene",
    items: [
      {
        id: "remove-stale-guests",
        title: "Remove stale guests",
        text:
          "Guests who haven’t signed in for months add risk. Disable or remove them after an approval window with proper change logging.",
      },
    ],
  },
];

export default function Recommendations() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="text-sm font-medium text-white">Best practices & guidance</div>
        <p className="mt-1 text-sm text-slate-400">
          A lightweight knowledge base you can act on. Each card links straight into the Remediate
          flow with sensible defaults. Perfect for small/medium businesses without a full MSP.
        </p>
      </div>

      {CATEGORIES.map((c) => (
        <div key={c.title} className="space-y-3">
          <div className="text-sm font-medium text-white">{c.title}</div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {c.items.map((it) => (
              <div key={it.id} className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                <div className="text-white font-medium">{it.title}</div>
                <div className="text-sm text-slate-400">{it.text}</div>
                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() =>
                      navigate(`/remediations/remediate?action=${encodeURIComponent(it.id)}`)
                    }
                    className="rounded bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-500"
                  >
                    Open playbook
                  </button>
                  <button
                    onClick={() => navigate(`/findings/search`)}
                    className="rounded border border-slate-700 px-3 py-1.5 text-sm text-gray-200 hover:bg-slate-800"
                  >
                    Explore logs
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
