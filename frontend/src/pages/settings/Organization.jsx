import React from "react";
import { useOutletContext } from "react-router-dom";

export default function OrgGeneral() {
  const { org, setOrg, save } = useOutletContext();

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="text-sm font-medium text-white">Organization</div>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="text-sm text-slate-300">
            Company Name
            <input
              className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-gray-200"
              value={org.name}
              onChange={(e) => setOrg({ ...org, name: e.target.value })}
            />
          </label>

          <label className="text-sm text-slate-300">
            Support Email
            <input
              className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-gray-200"
              value={org.supportEmail}
              onChange={(e) => setOrg({ ...org, supportEmail: e.target.value })}
            />
          </label>

          <label className="text-sm text-slate-300">
            Primary Domain(s)
            <input
              className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-gray-200"
              placeholder="comma,separated,domains"
              value={org.domains.join(",")}
              onChange={(e) => setOrg({ ...org, domains: e.target.value.split(",").map((d) => d.trim()).filter(Boolean) })}
            />
          </label>

          <label className="text-sm text-slate-300">
            Timezone
            <select
              className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-gray-200"
              value={org.timezone}
              onChange={(e) => setOrg({ ...org, timezone: e.target.value })}
            >
              {["America/Chicago", "America/New_York", "Europe/London", "UTC"].map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm text-slate-300">
            Default Tenant
            <select
              className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-gray-200"
              value={org.defaultTenant}
              onChange={(e) => setOrg({ ...org, defaultTenant: e.target.value })}
            >
              <option value="covtech">Covenant Technology</option>
              <option value="example">Example Holdings</option>
              <option value="acme">Acme Corp</option>
            </select>
          </label>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => save("Organization")}
            className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
