// frontend/src/components/InvoicesTable.jsx
// Example table matching Tabler’s "Invoices" block.

import React from "react";

const ROWS = [
  {
    no: "001401",
    subject: "Design Works",
    client: "Carlson Limited",
    vat: "87956621",
    created: "15 Dec 2017",
    status: "Paid",
    price: "$887",
  },
  {
    no: "001402",
    subject: "New Dashboard",
    client: "Apple & Co",
    vat: "87956622",
    created: "16 Dec 2017",
    status: "Pending",
    price: "$1,240",
  },
  {
    no: "001403",
    subject: "UX Review",
    client: "Globex Corp",
    vat: "87956623",
    created: "17 Dec 2017",
    status: "Paid",
    price: "$640",
  },
];

function StatusPill({ status }) {
  const map = {
    Paid: "bg-green-600/20 text-green-300 border-green-700/50",
    Pending: "bg-amber-600/20 text-amber-300 border-amber-700/50",
    Overdue: "bg-red-600/20 text-red-300 border-red-700/50",
  };
  const cls = map[status] || "bg-gray-700/30 text-gray-300 border-gray-700/50";
  return (
    <span className={`text-xs px-2 py-1 rounded border ${cls}`}>{status}</span>
  );
}

export default function InvoicesTable() {
  return (
    <div className="bg-gray-900 rounded-lg shadow text-white">
      <div className="px-4 pt-4">
        <h3 className="text-sm font-semibold">Invoices</h3>
      </div>
      <div className="overflow-x-auto px-4 pb-4">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="text-xs text-gray-400">
            <tr>
              <th className="py-2 pr-4 text-left">No.</th>
              <th className="py-2 pr-4 text-left">Invoice Subject</th>
              <th className="py-2 pr-4 text-left">Client</th>
              <th className="py-2 pr-4 text-left">VAT No.</th>
              <th className="py-2 pr-4 text-left">Created</th>
              <th className="py-2 pr-4 text-left">Status</th>
              <th className="py-2 pr-4 text-left">Price</th>
              <th className="py-2 pr-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 text-sm">
            {ROWS.map((r) => (
              <tr key={r.no}>
                <td className="py-2 pr-4 font-mono">{r.no}</td>
                <td className="py-2 pr-4 text-indigo-300 hover:text-indigo-200 cursor-pointer">
                  {r.subject}
                </td>
                <td className="py-2 pr-4">{r.client}</td>
                <td className="py-2 pr-4">{r.vat}</td>
                <td className="py-2 pr-4">{r.created}</td>
                <td className="py-2 pr-4">
                  <StatusPill status={r.status} />
                </td>
                <td className="py-2 pr-4">{r.price}</td>
                <td className="py-2 pr-0 text-right">
                  <div className="inline-flex gap-2">
                    <button className="px-2 py-1 text-xs bg-gray-800 border border-gray-700 rounded hover:bg-gray-700">
                      Manage
                    </button>
                    <button className="px-2 py-1 text-xs bg-gray-800 border border-gray-700 rounded hover:bg-gray-700">
                      Actions ▾
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
