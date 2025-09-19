// frontend/src/pages/Remediations.jsx
import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import TablerShell from "../layouts/TablerShell";

const tabs = [
  { to: "/remediations/dashboard", label: "Dashboard" },
  { to: "/remediations/remediate", label: "Remediate" },
  { to: "/remediations/recommendations", label: "Recommendations" },
];

export default function Remediations() {
  const { pathname } = useLocation();

  return (
    <TablerShell title="Remediations">
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-white">Remediations</h1>
        <p className="text-sm text-slate-400">
          One-click fixes, guided playbooks, and best-practice recommendations. Everything is modular
          so we can plug in new actions as we grow.
        </p>
      </div>

      {/* Sub-nav */}
      <div className="sticky top-[58px] z-30 mb-6 overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/80 backdrop-blur">
        <nav className="flex items-center gap-2 px-2 py-2">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              className={({ isActive }) =>
                [
                  "px-3 py-1.5 rounded text-sm whitespace-nowrap",
                  isActive || pathname.startsWith(t.to)
                    ? "bg-indigo-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-slate-800",
                ].join(" ")
              }
            >
              {t.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <Outlet />
    </TablerShell>
  );
}
