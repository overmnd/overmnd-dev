// frontend/src/pages/Reports.jsx
import React, { useMemo, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import TablerShell from "../layouts/TablerShell";
import { IconCalendar, IconBuildingSkyscraper, IconSearch } from "@tabler/icons-react";

/** Very simple preset ranges; replace with your real picker later */
const PRESETS = [
  { id: "7d", label: "Last 7d", days: 7 },
  { id: "30d", label: "Last 30d", days: 30 },
  { id: "90d", label: "Last 90d", days: 90 },
];

const tabs = [
  { to: "/reports/overview", label: "Overview" },
  { to: "/reports/licensing", label: "Licensing & Savings" },
  { to: "/reports/security", label: "Security & Audit" },
  { to: "/reports/activity", label: "Activity" },
  { to: "/reports/exports", label: "Exports" },
];

export default function Reports() {
  // Global report filters (shared with sub-pages)
  const [tenantIds, setTenantIds] = useState(["all"]);
  const [range, setRange] = useState("30d");
  const [query, setQuery] = useState("");

  const filterContext = useMemo(
    () => ({ tenantIds, setTenantIds, range, setRange, query, setQuery }),
    [tenantIds, range, query]
  );

  return (
    <TablerShell title="Reports">
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-white">Reports</h1>
        <p className="text-sm text-slate-400">
          Granular, export-ready reporting across licensing, security, and usage.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        {/* Tenants */}
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <IconBuildingSkyscraper size={16} />
            Tenants
          </div>
          <select
            className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-gray-200"
            value={tenantIds[0]}
            onChange={(e) => setTenantIds([e.target.value])}
          >
            <option value="all">All tenants</option>
            <option value="covtech">Covenant Technology</option>
            <option value="example">Example Holdings</option>
            <option value="acme">Acme Corp</option>
          </select>
        </div>

        {/* Date range */}
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <IconCalendar size={16} />
            Date Range
          </div>
          <div className="mt-2 flex gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => setRange(p.id)}
                className={
                  "rounded px-3 py-1.5 text-sm " +
                  (range === p.id ? "bg-indigo-600 text-white" : "bg-slate-950 text-gray-200 border border-slate-700 hover:bg-slate-800")
                }
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <IconSearch size={16} />
            Search
          </div>
          <input
            className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-gray-200"
            placeholder="Find user, UPN, SKU, event…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
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
                  isActive ? "bg-indigo-600 text-white" : "text-gray-300 hover:text-white hover:bg-slate-800",
                ].join(" ")
              }
            >
              {t.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <Outlet context={filterContext} />
    </TablerShell>
  );
}
