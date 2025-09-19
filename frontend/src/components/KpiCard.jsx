// frontend/src/components/KpiCard.jsx
// KPI tile with icon, value, delta, and a neat pill filter.
// New: `filterEdge` places the pill flush against the card corner & adds a bit of top padding.

import React from "react";
import clsx from "clsx";
import DropdownFilter from "./DropdownFilter";

export default function KpiCard({
  icon: Icon,
  title,
  value,
  delta,
  positive = true,
  filter = false,
  filterEdge = false, // <- NEW: when true, pin pill at absolute corner
  onFilter = () => {},
}) {
  return (
    <div
      className={clsx(
        "relative bg-gray-900 rounded-lg shadow text-white overflow-hidden",
        "p-4",
        filterEdge && "pt-6" // add breathing room if pill sits over the top border
      )}
    >
      {/* Corner pill */}
      {filter && (
        <DropdownFilter
          initial="Last 7 days"
          onChange={onFilter}
          size="sm"
          className={clsx(
            "absolute",
            filterEdge ? "-top-2 -right-2" : "top-2 right-2"
          )}
        />
      )}

      <div className="flex items-center space-x-3">
        <div className="p-3 bg-indigo-600 rounded-lg">
          <Icon size={22} />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-semibold leading-tight">{value}</p>
        </div>
      </div>

      <p
        className={clsx(
          "mt-2 text-xs",
          positive ? "text-green-400" : "text-red-400"
        )}
      >
        {delta}
      </p>
    </div>
  );
}
