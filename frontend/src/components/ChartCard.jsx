// frontend/src/components/ChartCard.jsx
// Generic card wrapper around ApexCharts with a header and optional filter.
// ApexCharts toolbars are enabled for interactivity (zoom, pan, download, etc.).

import React from "react";
import ReactApexChart from "react-apexcharts";
import DropdownFilter from "./DropdownFilter";

export default function ChartCard({
  title,
  description = "",
  type = "line",
  height = 260,
  series,
  options,
  filter = false,
  onFilter = () => {},
  footer = null,
}) {
  return (
    <div className="bg-gray-900 rounded-lg shadow text-white">
      <div className="flex items-center justify-between px-4 pt-4">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          {description ? (
            <p className="text-xs text-gray-400">{description}</p>
          ) : null}
        </div>
        {filter ? (
          <DropdownFilter
            initial="Last 7 days"
            onChange={onFilter}
            className="ml-2"
          />
        ) : null}
      </div>

      <div className="px-2 pb-2">
        <ReactApexChart
          type={type}
          height={height}
          series={series}
          options={{
            ...options,
            chart: {
              id: `${title.replace(/\s+/g, "-").toLowerCase()}-chart`,
              toolbar: { show: true }, // interactive toolbar
              zoom: { enabled: true },
              foreColor: "#e5e7eb",
              ...(options?.chart || {}),
            },
            tooltip: { theme: "dark", ...(options?.tooltip || {}) },
            grid: { borderColor: "#334155", ...(options?.grid || {}) },
          }}
        />
      </div>

      {footer ? <div className="px-4 pb-4">{footer}</div> : null}
    </div>
  );
}
