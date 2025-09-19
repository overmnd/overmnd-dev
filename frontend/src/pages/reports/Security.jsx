// frontend/src/pages/reports/Security.jsx
import React from "react";
import Chart from "react-apexcharts";
import { useOutletContext } from "react-router-dom";

const stackedOptions = {
  chart: { stacked: true, toolbar: { show: false }, foreColor: "#9CA3AF" },
  grid: { borderColor: "rgba(148,163,184,.15)" },
  xaxis: { categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
  colors: ["#f87171", "#fb923c", "#60a5fa", "#34d399"],
  legend: { labels: { colors: "#cbd5e1" } },
};
const stackedSeries = [
  { name: "Risky sign-ins", data: [3, 2, 1, 4, 7, 2, 1] },
  { name: "Admin changes", data: [5, 4, 3, 6, 5, 2, 2] },
  { name: "External sharing", data: [11, 9, 13, 10, 12, 7, 8] },
  { name: "Alerts resolved", data: [8, 9, 7, 10, 13, 5, 6] },
];

export default function ReportsSecurity() {
  const { query } = useOutletContext();

  const rows = [
    ["2025-07-07 10:22", "Risky sign-in detected", "user144@contoso.com", "Medium", "Resolved"],
    ["2025-07-06 18:05", "Global admin role assigned", "admin@contoso.com", "High", "Investigate"],
    ["2025-07-05 12:11", "External file shared", "user072@contoso.com", "Low", "Reviewed"],
  ].filter((r) => r.join(" ").toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="mb-2 text-sm font-medium text-white">Security Signals (weekly)</div>
        <Chart type="bar" height={280} options={stackedOptions} series={stackedSeries} />
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="mb-2 text-sm font-medium text-white">Notable Events</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="px-3 py-2">Time</th>
                <th className="px-3 py-2">Event</th>
                <th className="px-3 py-2">Actor</th>
                <th className="px-3 py-2">Severity</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              {rows.map((r, i) => (
                <tr key={i} className="border-t border-slate-800">
                  {r.map((c, j) => (
                    <td key={j} className="px-3 py-2">{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
