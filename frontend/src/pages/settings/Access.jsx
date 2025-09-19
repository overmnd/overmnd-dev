import React from "react";
import { useOutletContext } from "react-router-dom";

const scopes = ["findings", "remediations", "licensing", "reports", "billing"];
const levels = ["none", "read", "write"];

export default function Access() {
  const { roles, setRoles, save, addAudit } = useOutletContext();

  function setLevel(role, scope, level) {
    setRoles({ ...roles, [role]: { ...roles[role], [scope]: level } });
    addAudit("SetPermission", "Access Control", { role, scope, level });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="mb-3 text-sm font-medium text-white">Roles & Permissions</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="px-3 py-2">Role</th>
                {scopes.map((s) => (
                  <th key={s} className="px-3 py-2 capitalize">
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-slate-300">
              {Object.keys(roles).map((r) => (
                <tr key={r} className="border-t border-slate-800">
                  <td className="px-3 py-2">{r}</td>
                  {scopes.map((s) => (
                    <td key={s} className="px-3 py-2">
                      <select
                        value={roles[r][s]}
                        onChange={(e) => setLevel(r, s, e.target.value)}
                        className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-gray-200"
                      >
                        {levels.map((lv) => (
                          <option key={lv} value={lv}>
                            {lv}
                          </option>
                        ))}
                      </select>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => save("Access Control")}
            className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
