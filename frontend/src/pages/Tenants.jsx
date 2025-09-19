// frontend/src/pages/Tenants.jsx
import React, { useEffect, useState } from "react";
import TablerShell from "../layouts/TablerShell";
import TenantCard from "../components/TenantCard";
import TenantModal from "../components/TenantModal";
import AddTenantModal from "../components/AddTenantModal";
import { listTenants } from "../../services/Tenants.js";
import DebugPanel from "../components/DebugPanel";

export default function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [manageOpen, setManageOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [activeTenant, setActiveTenant] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await listTenants();
        setTenants(data);
      } catch (e) {
        console.error("Failed to fetch tenants:", e);
      }
    })();
  }, []);

  function openManage(t) {
    setActiveTenant(t);
    setManageOpen(true);
  }

  return (
    <TablerShell title="Tenants">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Tenants</h1>
          <p className="text-sm text-slate-400">
            One card per tenant. Click <em>Manage</em> to drill into granular
            permissions for overmnd in that org.
          </p>
        </div>

        <button
          className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-500"
          onClick={() => setAddOpen(true)}
        >
          + Add Tenant
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {tenants.map((t) => (
          <TenantCard key={t.id} tenant={t} onManage={openManage} />
        ))}
      </div>

      {/* Manage modal */}
      <TenantModal
        open={manageOpen}
        onClose={() => setManageOpen(false)}
        tenant={activeTenant}
        onSave={(updated) => {
          setTenants((prev) =>
            prev.map((t) => (t.id === updated.id ? updated : t))
          );
          setManageOpen(false);
        }}
      />

      {/* Add tenant modal */}
      <AddTenantModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSelect={() => {
          alert("Redirect to Entra (stub)");
        }}
      />

      {/* Per-page debug */}
      <DebugPanel />
    </TablerShell>
  );
}
