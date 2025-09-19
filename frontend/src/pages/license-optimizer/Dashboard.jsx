// frontend/src/pages/license-optimizer/Dashboard.jsx
import React from "react";
import Chart from "react-apexcharts";
import { useNavigate } from "react-router-dom";
import { IconArrowDownRight, IconCurrencyDollar, IconUsers, IconAlertTriangle } from "@tabler/icons-react";

const lineOptions = {
  chart: { toolbar: { show: false }, foreColor: "#9CA3AF" },
  stroke: { width: 2, curve: "smooth" },
  grid: { borderColor: "rgba(148,163,184,.15)" },
  xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"] },
  colors: ["#60a5fa", "#22c55e"],
  legend: { labels: { colors: "#cbd5e1" } },
};
const lineSeries = [
  { name: "Monthly Spend ($)", data: [8200, 8400, 8350, 8300, 8100, 7950, 7800] },
  { name: "Projected After Optimization ($)", data: [8200, 8200, 8000, 7600, 7200, 6900, 6600] },
];

export default function LODashboard() {
  const navigate = useNavigate();

  const kpis = [
    {
      icon: IconCurrencyDollar,
      title: "Current Monthly Spend",
      value: "$7,800",
      sub: "−$250 over last month",
      tone: "up",
    },
    {
      icon: IconArrowDownRight,
      title: "Potential Savings (Est.)",
      value: "$1,350/mo",
      sub: "Found across 3 rules",
      tone: "up",
    },
    {
      icon: IconUsers,
      title: "Licenses Assigned",
      value: "1,246",
      sub: "72 unused last 30 days",
      tone: "down",
    },
    {
      icon: IconAlertTriangle,
      title: "High-waste Signals",
      value: "5",
      sub: "Review in Optimize",
      tone: "down",
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((s, i) => (
          <div key={i} className="rounded-lg border border-gray-700/60 bg-gray-800/60 p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-md bg-indigo-700/30 text-indigo-300">
                <s.icon size={18} />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] uppercase tracking-wide text-gray-400">{s.title}</div>
                <div className="text-lg font-semibold text-white">{s.value}</div>
                <div
                  className={
                    "text-[11px] " +
                    (s.tone === "up"
                      ? "text-emerald-400"
                      : s.tone === "down"
                      ? "text-rose-400"
                      : "text-gray-400")
                  }
                >
                  {s.sub}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trend */}
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="mb-2 text-sm font-medium text-white">Spend Trend & Projection</div>
        <Chart type="line" height={280} options={lineOptions} series={lineSeries} />
      </div>

      {/* Quick wins */}
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="mb-2 text-sm font-medium text-white">Quick Wins</div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {[
            {
              id: "unused-e3",
              title: "Downgrade E3 users with no Office usage (30d)",
              est: "$620/mo",
              desc: "Users licensed for E3 but no Office app activity in last 30 days.",
            },
            {
              id: "teams-phone-unused",
              title: "Remove Teams Phone where calls = 0 (60d)",
              est: "$210/mo",
              desc: "Phone System add-on on accounts with zero calls for 60 days.",
            },
            {
              id: "visio-no-launch",
              title: "Remove Visio Plan 2 for users not launching app (90d)",
              est: "$160/mo",
              desc: "High-priced add-on with no app launches or file edits recorded.",
            },
          ].map((q) => (
            <div key={q.id} className="rounded border border-slate-800 bg-slate-950 p-3">
              <div className="text-white">{q.title}</div>
              <div className="text-sm text-slate-400">{q.desc}</div>
              <div className="mt-2 text-xs text-emerald-300">Est. Savings: {q.est}</div>
              <div className="mt-3">
                <button
                  onClick={() =>
                    navigate(`/license-optimizer/optimize?focus=${encodeURIComponent(q.id)}`)
                  }
                  className="rounded bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-500"
                >
                  Review in Optimize
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
