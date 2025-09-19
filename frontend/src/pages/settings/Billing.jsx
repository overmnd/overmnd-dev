import React from "react";
import { useOutletContext } from "react-router-dom";

export default function Billing() {
  const { billing, setBilling, save } = useOutletContext();

  const invoices = [
    ["INV-1009", "2025-07-01", "$1,240.00", "Paid"],
    ["INV-1008", "2025-06-01", "$1,240.00", "Paid"],
    ["INV-1007", "2025-05-01", "$1,240.00", "Paid"],
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <div className="text-sm font-medium text-white">Subscription</div>
          <div className="mt-3 grid grid-cols-1 gap-3">
            <label className="text-sm text-slate-300">
              Plan
              <select
                className="mt-1 w/full rounded border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-gray-200"
                value={billing.plan}
                onChange={(e) => setBilling({ ...billing, plan: e.target.value })}
              >
                <option>Starter</option>
                <option>Pro</option>
                <option>Enterprise</option>
              </select>
            </label>
            <label className="text-sm text-slate-300">
              Seats
              <input
                type="number"
                className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-gray-200"
                value={billing.seats}
                onChange={(e) => setBilling({ ...billing, seats: Number(e.target.value) })}
              />
            </label>
            <div className="text-sm text-slate-300">Next Invoice: {billing.nextInvoice}</div>
            <div className="text-sm text-slate-300">Payment Method: {billing.paymentMethod}</div>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="rounded border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800">Update Card</button>
            <button className="rounded border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800">
              Manage Subscription
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <div className="mb-2 text-sm font-medium text-white">Invoices</div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400">
                  <th className="px-3 py-2">Invoice</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {invoices.map((r) => (
                  <tr key={r[0]} className="border-t border-slate-800">
                    {r.map((c, i) => (
                      <td key={i} className="px-3 py-2">
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => save("Billing")}
              className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
