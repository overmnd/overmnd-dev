import React from "react";
import { useOutletContext } from "react-router-dom";

export default function Notifications() {
  const { notif, setNotif, save } = useOutletContext();

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="text-sm font-medium text-white">Preferences</div>

        <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-3">
          <label className="text-sm text-slate-300">
            Digest Frequency
            <select
              className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-gray-200"
              value={notif.digests}
              onChange={(e) => setNotif({ ...notif, digests: e.target.value })}
            >
              <option value="off">Off</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </label>

          <div className="text-sm text-slate-300">
            Channels
            <div className="mt-2 grid grid-cols-1 gap-2">
              {["email", "teams", "slack"].map((c) => (
                <label key={c} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={notif.channels[c]}
                    onChange={(e) => setNotif({ ...notif, channels: { ...notif.channels, [c]: e.target.checked } })}
                  />
                  {c.toUpperCase()}
                </label>
              ))}
            </div>
          </div>

          <div className="text-sm text-slate-300">
            Events
            <div className="mt-2 grid grid-cols-1 gap-2">
              {[
                ["savings", "License savings"],
                ["riskySignIns", "Risky sign-ins"],
                ["remediations", "Remediation actions"],
                ["billing", "Billing events"],
              ].map(([k, label]) => (
                <label key={k} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={notif.events[k]}
                    onChange={(e) => setNotif({ ...notif, events: { ...notif.events, [k]: e.target.checked } })}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => save("Notifications")}
            className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
