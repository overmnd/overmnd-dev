// frontend/src/components/TenantCard.jsx
import React from "react";
import {
  IconBuildingSkyscraper,
  IconPointFilled,
  IconCheck,
  IconX,
  IconDotsVertical,
  IconCopy,
} from "@tabler/icons-react";

function Pill({ children, tone = "default" }) {
  const tones = {
    default: "bg-slate-800/70 text-slate-300 border-slate-700/60",
    green: "bg-emerald-900/30 text-emerald-300 border-emerald-800/40",
    yellow: "bg-amber-900/30 text-amber-300 border-amber-800/40",
    red: "bg-rose-900/30 text-rose-300 border-rose-800/40",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export default function TenantCard({ tenant, onManage }) {
  const { name, domain, tags = [], status, granted, notGranted, tenantId } =
    tenant;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 shadow-lg ring-1 ring-white/5">
      {/* header */}
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-indigo-600/15 text-indigo-300">
            <IconBuildingSkyscraper size={18} className="shrink-0" />
          </div>
          <div>
            <div className="text-sm font-medium text-white leading-tight">
              {name}
            </div>
            <div className="text-[11px] text-slate-400">{domain}</div>
          </div>
        </div>

        {status ? (
          <Pill tone={status === "connected" ? "green" : status === "warning" ? "yellow" : "red"}>
            <IconPointFilled size={10} className="shrink-0" />
            {status}
          </Pill>
        ) : null}
      </div>

      {/* tags */}
      <div className="px-4 pt-3">
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <Pill key={t}>{t}</Pill>
          ))}
        </div>
      </div>

      {/* granted / not granted – icons aligned */}
      <div className="grid grid-cols-2 gap-3 px-4 pt-4">
        <div className="rounded-lg bg-slate-900/60 px-3 py-2">
          <div className="flex items-center justify-between text-slate-300">
            <span className="inline-flex items-center gap-1">
              <IconCheck size={14} className="shrink-0 text-emerald-400" />
              <span className="text-xs">Granted</span>
            </span>
            <span className="text-sm font-medium text-white">{granted}</span>
          </div>
        </div>
        <div className="rounded-lg bg-slate-900/60 px-3 py-2">
          <div className="flex items-center justify-between text-slate-300">
            <span className="inline-flex items-center gap-1">
              <IconX size={14} className="shrink-0 text-rose-400" />
              <span className="text-xs">Not Granted</span>
            </span>
            <span className="text-sm font-medium text-white">{notGranted}</span>
          </div>
        </div>
      </div>

      {/* tenant id */}
      <div className="px-4 pt-3">
        <div className="flex items-center gap-2 rounded-lg bg-slate-900/60 px-3 py-2 text-[12px] text-slate-300">
          <span className="text-slate-400">Directory Tenant Id</span>
        </div>
        <div className="mt-1 flex items-center justify-between rounded-lg bg-slate-950/50 px-3 py-2 text-[12px] text-slate-300 ring-1 ring-inset ring-white/5">
          <code className="truncate">{tenantId}</code>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(tenantId || "")}
            className="inline-flex items-center rounded-md p-1 text-slate-400 hover:text-slate-200"
            title="Copy"
          >
            <IconCopy size={16} />
          </button>
        </div>
      </div>

      {/* footer */}
      <div className="flex items-center justify-between px-4 pb-4 pt-3">
        <button
          onClick={() => onManage(tenant)}
          className="rounded-md bg-slate-800/70 px-3 py-1.5 text-sm text-slate-200 ring-1 ring-inset ring-white/10 hover:bg-slate-800"
        >
          Manage
        </button>

        <button
          className="inline-flex items-center gap-1 rounded-md bg-slate-800/70 px-3 py-1.5 text-sm text-slate-200 ring-1 ring-inset ring-white/10 hover:bg-slate-800"
          title="Open"
        >
          Open
          <IconDotsVertical size={16} className="opacity-70" />
        </button>
      </div>
    </div>
  );
}
