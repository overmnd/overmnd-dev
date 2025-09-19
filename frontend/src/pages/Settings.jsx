// frontend/src/pages/Settings.jsx
import React, { useMemo } from "react";
import { NavLink, Outlet } from "react-router-dom";
import TablerShell from "../layouts/TablerShell";
import {
  IconBuildingSkyscraper,
  IconPalette,
  IconUsers,
  IconShieldLock,
  IconPlugConnected,
  IconBell,
  IconCreditCard,
  IconDatabaseExport,
  IconReportAnalytics,
  IconWebhook,
  IconSettings2,
} from "@tabler/icons-react";
import { useSettings } from "../services/useSettings";

const tabs = [
  { to: "/settings/organization", label: "Organization", icon: IconBuildingSkyscraper },
  { to: "/settings/branding", label: "Branding", icon: IconPalette },
  { to: "/settings/users", label: "Users", icon: IconUsers },
  { to: "/settings/access", label: "Access Control", icon: IconShieldLock },
  { to: "/settings/integrations", label: "Integrations", icon: IconPlugConnected },
  { to: "/settings/notifications", label: "Notifications", icon: IconBell },
  { to: "/settings/billing", label: "Billing", icon: IconCreditCard },
  { to: "/settings/data", label: "Data & Export", icon: IconDatabaseExport },
  { to: "/settings/audit", label: "Audit Logs", icon: IconReportAnalytics },
  { to: "/settings/api", label: "API & Webhooks", icon: IconWebhook },
  { to: "/settings/advanced", label: "Advanced", icon: IconSettings2 },
];

export default function Settings() {
  const ctx = useSettings();

  // Provide context to children via Outlet (pages use useOutletContext)
  const outletCtx = useMemo(() => ctx, [ctx]);

  return (
    <TablerShell title="Settings">
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-white">Settings</h1>
        <p className="text-sm text-slate-400">
          Configure organization, access, branding, integrations, notifications, billing and more.
        </p>
      </div>

      <div className="sticky top-[58px] z-30 mb-6 overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/80 backdrop-blur">
        <nav className="flex items-center gap-2 px-2 py-2">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              className={({ isActive }) =>
                [
                  "px-3 py-1.5 rounded text-sm whitespace-nowrap inline-flex items-center gap-2",
                  isActive ? "bg-indigo-600 text-white" : "text-gray-300 hover:text-white hover:bg-slate-800",
                ].join(" ")
              }
            >
              <t.icon size={16} />
              {t.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <Outlet context={outletCtx} />
    </TablerShell>
  );
}
