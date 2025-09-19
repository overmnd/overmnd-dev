// frontend/src/pages/LicenseOptimizer.jsx
import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import TablerShell from "../layouts/TablerShell";

const tabs = [
  { to: "/license-optimizer/dashboard", label: "Dashboard" },
  { to: "/license-optimizer/analyze", label: "Analyze" },
  { to: "/license-optimizer/optimize", label: "Optimize" },
  { to: "/license-optimizer/policies", label: "Policies" },
  { to: "/license-optimizer/simulator", label: "Simulator" },
  { to: "/license-optimizer/reports", label: "Reports" },
];

export default function LicenseOptimizer() {
  const { pathname } = useLocation();

  return (
    <TablerShell title="License Optimizer">
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-white">License Optimizer</h1>
        <p className="text-sm text-slate-400">
          Reduce Microsoft 365 spend with rule-driven insights, one-click rightsizing, and policy-based automation.
          Built for small/medium businesses—simple, fast, and clear.
        </p>
      </div>

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
