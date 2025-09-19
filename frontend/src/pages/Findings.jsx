// frontend/src/pages/Findings.jsx
import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import TablerShell from "../layouts/TablerShell";

const tabs = [
  { to: "/findings/dashboard", label: "Dashboard" },
  { to: "/findings/critical-assets", label: "Critical Assets" },
  { to: "/findings/hybrid-identity", label: "Hybrid Identity" },
  { to: "/findings/search", label: "Search" },
  { to: "/findings/alerts", label: "Alerts" },
];

export default function Findings() {
  const { pathname } = useLocation();

  return (
    <TablerShell title="Findings">
      {/* Page header */}
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-white">Findings</h1>
        <p className="text-sm text-slate-400">
          Audit & security insights across Microsoft 365 and hybrid identity. Choose a feature below.
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

      {/* Routed content */}
      <Outlet />
    </TablerShell>
  );
}
