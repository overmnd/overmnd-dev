// frontend/src/pages/reports/Overview.jsx
import React from "react";
import Chart from "react-apexcharts";
import { useOutletContext } from "react-router-dom";
import { IconCurrencyDollar, IconShieldLock, IconUsers, IconActivity } from "@tabler/icons-react";

const areaOptions = {
  chart: { toolbar: { show: false }, foreColor: "#9CA3AF" },
  dataLabels: { enabled: false },
  stroke: { curve: "smooth", width: 2 },
  fill: { type: "gradient", gradient: { shadeIntensity: 0.6, opacityFrom: 0.5, opacityTo: 0.1 } },
  grid: { borderColor: "rgba(148,163,184,.15)" },
  xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"] },
  colors: ["#60a5fa", "#22c55e"],
  legend: { labels: { colors: "#cbd5e1" } },
};
const areaSeries = [
  { name: "Spend ($)", data: [8200, 8400, 8350, 8300, 8100, 7950, 7800] },
  { name: "Savings ($)", data: [0, 360, 720, 1080, 3000, 4000, 6800] },
];

export default function ReportsOverview() {
  const { tenantIds, range } = useOutletContext();

  const kpis = [
    { icon: IconCurrencyDollar, title: "Current Monthly Spend", value: "$7,800", tone: "neutral" },
    { icon: IconCurrencyDollar, title: "Savings (last 30d)", value: "$1,120", tone: "up" },
    { icon: IconUsers, title: "Active Users", value: "1,246", tone: "neutral" },
    { icon: IconShieldLock, title: "Security Alerts (30d)", value: "14", tone: "down" },
  ];

  return (
    <div className="space-y-6">
      {/* Context line */}
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-3 text-sm text-slate-300">
        Reporting for <span className="text-white">{tenantIds[0] === "all" ? "All tenants" : tenantIds[0]}</span>{" "}
        · Range <span className="text-white">{range}</span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k, i) => (
          <div key={i} className="rounded-lg border border-gray-700/60 bg-gray-800/60 p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-md bg-indigo-700/30 text-indigo-300">
                <k.icon size={18} />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] uppercase tracking-wide text-gray-400">{k.title}</div>
                <div className="text-lg font-semibold text-white">{k.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Spend vs Savings */}
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-sm font-medium text-white">Spend vs Savings</div>
          <div className="text-xs text-slate-400">Monthly</div>
        </div>
        <Chart type="area" height={280} options={areaOptions} series={areaSeries} />
      </div>

      {/* Activity snapshot */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { title: "Office App Launches", value: "18,903", delta: "+4.2%" },
          { title: "Teams Meetings", value: "9,421", delta: "+2.1%" },
          { title: "SharePoint/OneDrive Files Edited", value: "53,800", delta: "+3.3%" },
        ].map((c) => (
          <div key={c.title} className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <div className="text-sm text-slate-300">{c.title}</div>
            <div className="mt-1 text-xl font-semibold text-white">{c.value}</div>
            <div className="text-xs text-emerald-300">{c.delta} vs prior period</div>
          </div>
        ))}
      </div>
    </div>
  );
}
