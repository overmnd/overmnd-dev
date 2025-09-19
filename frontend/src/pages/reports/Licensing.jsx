// frontend/src/pages/reports/Licensing.jsx
import React from "react";
import Chart from "react-apexcharts";
import { useOutletContext } from "react-router-dom";

const barOptions = {
  chart: { toolbar: { show: false }, foreColor: "#9CA3AF" },
  plotOptions: { bar: { horizontal: false, columnWidth: "45%", borderRadius: 4 } },
  dataLabels: { enabled: false },
  grid: { borderColor: "rgba(148,163,184,.15)" },
  xaxis: { categories: ["E1/F3", "E3", "E5", "Add-ons"] },
  colors: ["#60a5fa", "#22c55e"],
  legend: { labels: { colors: "#cbd5e1" } },
};
const barSeries = [
  { name: "Assigned", data: [210, 620, 210, 180] },
  { name: "Unused/Over", data: [12, 72, 9, 38] },
];

const donutOptions = {
  chart: { foreColor: "#9CA3AF" },
  labels: ["E1/F3", "E3", "E5", "Add-ons"],
  colors: ["#60a5fa", "#34d399", "#fbbf24", "#a78bfa"],
  legend: { labels: { colors: "#cbd5e1" } },
};
const donutSeries = [210, 620, 210, 180];

export default function ReportsLicensing() {
  const { range } = useOutletContext();

  return (
    <div className="space-y-6">
      {/* Top row */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-lg border border-slate-800 bg-slate-900 p-4">
          <div className="mb-2 text-sm font-medium text-white">Licenses: Assigned vs Unused · {range}</div>
          <Chart type="bar" height={280} options={barOptions} series={barSeries} />
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <div className="mb-2 text-sm font-medium text-white">SKU Mix</div>
          <Chart type="donut" height={280} options={donutOptions} series={donutSeries} />
        </div>
      </div>

      {/* Savings table (exportable) */}
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-sm font-medium text-white">Optimization Savings (last 90d)</div>
          <button
            onClick={() => {
              const rows = [
                ["Date", "Action", "Users", "EstSavings"],
                ["2025-07-06", "E3→F3", "31", "868"],
                ["2025-07-03", "Remove Teams Phone", "26", "208"],
                ["2025-06-28", "Remove Visio P2", "12", "180"],
              ];
              const csv = rows.map((r) => r.join(",")).join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "license_savings.csv";
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="rounded border border-slate-700 px-3 py-1.5 text-sm text-gray-200 hover:bg-slate-800"
          >
            Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Action</th>
                <th className="px-3 py-2">Users</th>
                <th className="px-3 py-2">Estimated Savings</th>
                <th className="px-3 py-2">Requester</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              {[
                ["2025-07-06", "Downgrade E3 → F3", "31", "$868", "ops@contoso", "Approved"],
                ["2025-07-03", "Remove Teams Phone", "26", "$208", "ops@contoso", "Applied"],
                ["2025-06-28", "Remove Visio P2", "12", "$180", "ops@contoso", "Applied"],
              ].map((r, i) => (
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
