// frontend/src/pages/reports/Exports.jsx
import React from "react";
import { useOutletContext } from "react-router-dom";
import { IconFileSpreadsheet, IconFileTypePdf, IconClock } from "@tabler/icons-react";
import { toast } from "react-hot-toast";

export default function ReportsExports() {
  const { tenantIds, range } = useOutletContext();

  function exportJSON() {
    const payload = {
      tenant: tenantIds[0],
      range,
      generatedAt: new Date().toISOString(),
      kpis: { spend: 7800, savings30d: 1120, activeUsers: 1246 },
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `overmnd-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported JSON");
  }

  function exportCSV() {
    const rows = [
      ["Metric", "Value"],
      ["Spend", "7800"],
      ["Savings30d", "1120"],
      ["ActiveUsers", "1246"],
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "overmnd-report.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported CSV");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="text-sm font-medium text-white">Export Center</div>
        <p className="mt-1 text-sm text-slate-400">
          Generate on-demand exports or schedule recurring delivery.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <button
          onClick={exportCSV}
          className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900 p-4 text-left hover:bg-slate-800"
        >
          <IconFileSpreadsheet size={24} className="text-emerald-300" />
          <div>
            <div className="text-white">CSV Export</div>
            <div className="text-sm text-slate-400">KPI summary for the selected filters</div>
          </div>
        </button>

        <button
          onClick={() => toast("PDF export will render server-side (placeholder).")}
          className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900 p-4 text-left hover:bg-slate-800"
        >
          <IconFileTypePdf size={24} className="text-rose-300" />
          <div>
            <div className="text-white">PDF Export</div>
            <div className="text-sm text-slate-400">Branded, board-ready PDF</div>
          </div>
        </button>

        <button
          onClick={() => toast.success("Scheduled weekly report (placeholder).")}
          className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900 p-4 text-left hover:bg-slate-800"
        >
          <IconClock size={24} className="text-indigo-300" />
          <div>
            <div className="text-white">Schedule</div>
            <div className="text-sm text-slate-400">Email weekly CSV/PDF to stakeholders</div>
          </div>
        </button>
      </div>
    </div>
  );
}
