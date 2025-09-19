// frontend/src/pages/license-optimizer/Simulator.jsx
import React, { useMemo, useState } from "react";
import { IconPlayerPlay } from "@tabler/icons-react";

export default function LOSimulator() {
  const [inputs, setInputs] = useState({
    totalE3: 620,
    totalE5: 210,
    downgradeE3Percent: 15, // percent to F3
    downgradeE5Percent: 5,  // percent to E3
    removePhone: 40,        // count
  });

  const results = useMemo(() => {
    const price = { E3: 36, E5: 57, F3: 8, Phone: 8 };
    const e3Downgrade = Math.round((inputs.totalE3 * inputs.downgradeE3Percent) / 100);
    const e5Downgrade = Math.round((inputs.totalE5 * inputs.downgradeE5Percent) / 100);
    const savings =
      e3Downgrade * (price.E3 - price.F3) +
      e5Downgrade * (price.E5 - price.E3) +
      inputs.removePhone * price.Phone;
    return { e3Downgrade, e5Downgrade, savings };
  }, [inputs]);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="text-sm font-medium text-white">Scenario Modeling</div>
        <p className="mt-1 text-sm text-slate-400">
          Test assumptions before changing licenses. Adjust sliders and see projected monthly savings.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <div className="text-sm font-medium text-white">Inputs</div>
          <div className="mt-3 space-y-3 text-sm text-gray-200">
            {[
              ["totalE3", "Total E3", 0, 5000],
              ["totalE5", "Total E5", 0, 5000],
            ].map(([k, label, min, max]) => (
              <div key={k}>
                <label className="text-xs text-slate-400">{label}</label>
                <input
                  type="number"
                  min={min}
                  max={max}
                  className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-1.5"
                  value={inputs[k]}
                  onChange={(e) => setInputs((s) => ({ ...s, [k]: Number(e.target.value) }))}
                />
              </div>
            ))}

            {[
              ["downgradeE3Percent", "Downgrade % of E3 → F3", 0, 100],
              ["downgradeE5Percent", "Downgrade % of E5 → E3", 0, 100],
            ].map(([k, label, min, max]) => (
              <div key={k}>
                <label className="text-xs text-slate-400">{label}</label>
                <input
                  type="range"
                  min={min}
                  max={max}
                  value={inputs[k]}
                  onChange={(e) => setInputs((s) => ({ ...s, [k]: Number(e.target.value) }))}
                  className="mt-2 w-full"
                />
                <div className="text-xs text-slate-400">{inputs[k]}%</div>
              </div>
            ))}

            <div>
              <label className="text-xs text-slate-400">Remove Teams Phone (count)</label>
              <input
                type="number"
                min={0}
                max={10000}
                className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-1.5"
                value={inputs.removePhone}
                onChange={(e) => setInputs((s) => ({ ...s, removePhone: Number(e.target.value) }))}
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <div className="text-sm font-medium text-white">Projection</div>
          <div className="mt-3 space-y-2 text-sm text-slate-300">
            <div>E3 → F3 downgrades: <span className="text-white">{results.e3Downgrade}</span></div>
            <div>E5 → E3 downgrades: <span className="text-white">{results.e5Downgrade}</span></div>
            <div>Phone removals: <span className="text-white">{inputs.removePhone}</span></div>
          </div>

          <div className="mt-4 rounded border border-slate-800 bg-slate-950 p-3">
            <div className="text-sm text-slate-300">Estimated Monthly Savings</div>
            <div className="text-2xl font-semibold text-emerald-300">${results.savings.toFixed(2)}</div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <div className="text-sm font-medium text-white">Next Steps</div>
          <p className="mt-2 text-sm text-slate-400">
            Happy with the results? Capture the plan and move to <em>Optimize → Plan</em> to export or submit.
          </p>
          <button className="mt-3 inline-flex items-center gap-2 rounded bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-500">
            <IconPlayerPlay size={16} /> Create Plan from Scenario
          </button>
        </div>
      </div>
    </div>
  );
}
