// frontend/src/pages/findings/SecurityDashboard.jsx
import React from "react";
import Chart from "react-apexcharts";

const lineOptions = {
  chart: { toolbar: { show: false }, foreColor: "#a3a3a3" },
  stroke: { width: 2, curve: "smooth" },
  grid: { borderColor: "rgba(148,163,184,.15)" },
  xaxis: { categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
  colors: ["#22c55e", "#ef4444"],
  legend: { labels: { colors: "#cbd5e1" } },
};
const lineSeries = [
  { name: "Successful sign-ins", data: [120, 140, 160, 155, 168, 172, 180] },
  { name: "Failed sign-ins", data: [8, 13, 10, 12, 16, 15, 19] },
];

export default function SecurityDashboard() {
  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { t: "Indicators of Compromise", v: "12", sub: "Last 24h", tone: "warn" },
          { t: "High-risk Users", v: "5", sub: "Require review", tone: "down" },
          { t: "Audit Health", v: "OK", sub: "No issues found", tone: "up" },
          { t: "External Guest Activity", v: "42", sub: "Last 7 days", tone: "default" },
        ].map((k, i) => (
          <div key={i} className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <div className="text-[11px] uppercase tracking-wide text-gray-400">{k.t}</div>
            <div className="text-2xl font-semibold text-white">{k.v}</div>
            <div
              className={
                "text-xs " +
                (k.tone === "up"
                  ? "text-emerald-400"
                  : k.tone === "down"
                  ? "text-rose-400"
                  : k.tone === "warn"
                  ? "text-amber-400"
                  : "text-gray-400")
              }
            >
              {k.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Activity chart + panels */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Chart */}
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 xl:col-span-2">
          <div className="mb-2 text-sm font-medium text-white">Sign-ins (success vs failed)</div>
          <Chart type="line" height={300} options={lineOptions} series={lineSeries} />
        </div>

        {/* IOC list */}
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <div className="mb-3 text-sm font-medium text-white">Critical Activity</div>
          <ul className="space-y-2 text-sm">
            {[
              "Multiple password spray attempts from 103.22.201.1",
              "Impossible travel detected for 3 users",
              "Elevated permissions granted to external guest",
              "Mass group membership change in HR security group",
            ].map((x, i) => (
              <li key={i} className="rounded border border-slate-800 bg-slate-950/50 px-3 py-2">
                {x}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
