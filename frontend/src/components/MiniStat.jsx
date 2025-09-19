// frontend/src/components/MiniStat.jsx
// Small metric tiles like "132 Sales", "78 Orders", etc.

import React from "react";

export default function MiniStat({ label, value, sublabel }) {
  return (
    <div className="bg-gray-900 rounded-lg shadow p-4 text-white">
      <div className="text-xl font-semibold">{value}</div>
      <div className="text-sm text-gray-300">{label}</div>
      {sublabel ? (
        <div className="text-xs text-gray-400 mt-1">{sublabel}</div>
      ) : null}
    </div>
  );
}
