// frontend/src/pages/reports/Activity.jsx
import React from "react";
import Chart from "react-apexcharts";
import { useOutletContext } from "react-router-dom";

const heatOptions = {
  chart: { foreColor: "#9CA3AF" },
  dataLabels: { enabled: false },
  colors: ["#111827", "#1f2937", "#374151", "#4b5563", "#60a5fa"],
  xaxis: { type: "category", categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
  plotOptions: { heatmap: { shadeIntensity: 0.5, colorScale: { ranges: [] } } },
};
const heatSeries = [
  { name: "Mail", data: [90, 110, 120, 130, 140, 60, 55] },
  { name: "Teams", data: [60, 80, 100, 115, 130, 45, 40] },
  { name: "SharePoint", data: [150, 160, 155, 170, 180, 75, 70] },
  { name: "Office", data: [240, 260, 250, 270, 290, 110, 100] },
].map((row) => ({ name: row.name, data: row.data.map((v, i) => ({ x: heatOptions.xaxis.categories[i], y: v })) }));

export default function ReportsActivity() {
  const { query } = useOutletContext();

  const series = heatSeries.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()) || !query);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="mb-2 text-sm font-medium text-white">Workload Activity Heat (events/day)</div>
        <Chart type="heatmap" height={310} options={heatOptions} series={series} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { title: "Top Active Users (Office)", value: "user011, user087, user214…" },
          { title: "Top Teams by Meetings", value: "Ops, Sales, Engineering…" },
          { title: "Top External Shares", value: "projects/clients/… (42)" },
        ].map((c) => (
          <div key={c.title} className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <div className="text-sm text-slate-300">{c.title}</div>
            <div className="mt-1 text-sm text-white">{c.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
