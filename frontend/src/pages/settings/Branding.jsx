import React, { useRef } from "react";
import { useOutletContext } from "react-router-dom";

export default function Branding() {
  const { branding, setBranding, save } = useOutletContext();
  const fileRef = useRef(null);

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <div className="xl:col-span-2 rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="text-sm font-medium text-white">Branding</div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="text-sm text-slate-300">
            Primary Color
            <input
              type="color"
              className="mt-2 h-10 w-20 cursor-pointer rounded border border-slate-700 bg-slate-950"
              value={branding.primary}
              onChange={(e) => setBranding({ ...branding, primary: e.target.value })}
            />
          </label>

          <label className="text-sm text-slate-300">
            Accent Color
            <input
              type="color"
              className="mt-2 h-10 w-20 cursor-pointer rounded border border-slate-700 bg-slate-950"
              value={branding.accent}
              onChange={(e) => setBranding({ ...branding, accent: e.target.value })}
            />
          </label>

          <label className="text-sm text-slate-300 md:col-span-2">
            Login Title
            <input
              className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-gray-200"
              value={branding.loginTitle}
              onChange={(e) => setBranding({ ...branding, loginTitle: e.target.value })}
            />
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={branding.darkModeOnly}
              onChange={(e) => setBranding({ ...branding, darkModeOnly: e.target.checked })}
            />
            Force dark mode
          </label>

          <div className="text-sm text-slate-300 md:col-span-2">
            Logo
            <div className="mt-2 flex items-center gap-3">
              <button
                onClick={() => fileRef.current?.click()}
                className="rounded border border-slate-700 px-3 py-2 text-sm text-gray-200 hover:bg-slate-800"
              >
                Upload…
              </button>
              <span className="text-xs text-slate-400 truncate">{branding.logoUrl || "No logo uploaded"}</span>
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                onChange={(e) => setBranding({ ...branding, logoUrl: e.target.files?.[0]?.name || "" })}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => save("Branding")}
            className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500"
          >
            Save
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="text-sm font-medium text-white">Preview</div>
        <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950 p-6">
          <div className="text-lg font-semibold" style={{ color: branding.primary }}>
            {branding.loginTitle}
          </div>
          <div className="mt-1 text-sm text-slate-400">Primary {branding.primary} · Accent {branding.accent}</div>
          <div className="mt-4">
            <button className="rounded px-4 py-2 text-sm text-white" style={{ backgroundColor: branding.primary }}>
              Primary Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
