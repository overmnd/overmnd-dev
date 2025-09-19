import React, { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { IconTrash, IconPlus } from "@tabler/icons-react";

export default function Users() {
  const { users, setUsers, save, addAudit } = useOutletContext();
  const [invite, setInvite] = useState({ name: "", email: "", role: "Analyst" });
  const roles = useMemo(() => ["Owner", "Admin", "Analyst", "Operator", "Billing", "Read-only"], []);

  function addUser() {
    if (!invite.email || !invite.name) return;
    const next = [...users, { id: String(Date.now()), status: "pending", ...invite }];
    setUsers(next);
    setInvite({ name: "", email: "", role: "Analyst" });
    addAudit("Invite", "Users", { email: invite.email, role: invite.role });
  }

  function removeUser(id) {
    const victim = users.find((x) => x.id === id);
    setUsers(users.filter((u) => u.id !== id));
    addAudit("RemoveUser", "Users", { id, email: victim?.email });
  }

  return (
    <div className="space-y-6">
      {/* Invite */}
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="text-sm font-medium text-white">Invite User</div>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-4">
          <input
            className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-gray-200"
            placeholder="Name"
            value={invite.name}
            onChange={(e) => setInvite({ ...invite, name: e.target.value })}
          />
          <input
            className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-gray-200"
            placeholder="Email"
            value={invite.email}
            onChange={(e) => setInvite({ ...invite, email: e.target.value })}
          />
          <select
            className="rounded border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-gray-200"
            value={invite.role}
            onChange={(e) => setInvite({ ...invite, role: e.target.value })}
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <button
            onClick={addUser}
            className="inline-flex items-center justify-center gap-2 rounded bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-500"
          >
            <IconPlus size={16} />
            Invite
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="mb-2 text-sm font-medium text-white">Users</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              {users.map((u) => (
                <tr key={u.id} className="border-t border-slate-800">
                  <td className="px-3 py-2">{u.name}</td>
                  <td className="px-3 py-2">{u.email}</td>
                  <td className="px-3 py-2">
                    <select
                      className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-gray-200"
                      value={u.role}
                      onChange={(e) => {
                        setUsers(users.map((x) => (x.id === u.id ? { ...x, role: e.target.value } : x)));
                        addAudit("ChangeRole", "Users", { id: u.id, role: e.target.value });
                      }}
                    >
                      {roles.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={
                        "rounded px-2 py-0.5 text-xs " +
                        (u.status === "active"
                          ? "bg-emerald-600/20 text-emerald-300"
                          : u.status === "pending"
                          ? "bg-amber-600/20 text-amber-300"
                          : "bg-slate-600/20 text-slate-300")
                      }
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={() => removeUser(u.id)}
                      className="inline-flex items-center gap-1 rounded border border-slate-700 px-2 py-1 text-xs hover:bg-slate-800"
                    >
                      <IconTrash size={14} />
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => save("Users")}
            className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
