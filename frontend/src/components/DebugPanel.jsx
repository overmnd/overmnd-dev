// frontend/src/components/DebugPanel.jsx
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

function decodeJwtPart(part) {
  try {
    return JSON.parse(atob(part.replace(/-/g, "+").replace(/_/g, "/")));
  } catch { return null; }
}
const getToken = () => localStorage.getItem("overmind_token") || "";

function downloadBlob(filename, obj) {
  const data = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(data);
  const a = Object.assign(document.createElement("a"), { href: url, download: filename });
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

export default function DebugPanel() {
  const [open, setOpen] = useState(false);
  const [latency, setLatency] = useState(0);
  const [offline, setOffline] = useState(false);
  const [pingMs, setPingMs] = useState(null);
  const [grid, setGrid] = useState(false);
  const [focus, setFocus] = useState(false);
  const [borders, setBorders] = useState(false);
  const [tokenPreview, setTokenPreview] = useState(getToken());
  const navigate = useNavigate();

  // Toggle with Ctrl + `
  useEffect(() => {
    const onKey = (e) => ((e.ctrlKey || e.metaKey) && e.key === "`") && setOpen((s) => !s);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Patch fetch for latency/offline simulation (one-time)
  useEffect(() => {
    if (window.__origFetchPatched) return;
    window.__origFetchPatched = true;
    const orig = window.fetch.bind(window);
    window.__origFetch = orig;
    window.fetch = async (...args) => {
      if (window.__debugOffline) return Promise.reject(new TypeError("NetworkError: offline (simulated)"));
      const delay = window.__debugLatency || 0;
      if (delay > 0) await new Promise((r) => setTimeout(r, delay));
      return orig(...args);
    };
  }, []);
  useEffect(() => { window.__debugLatency = latency; }, [latency]);
  useEffect(() => { window.__debugOffline = offline; }, [offline]);

  // UI helpers
  useEffect(() => { document.documentElement.classList.toggle("debug-grid",   grid);   }, [grid]);
  useEffect(() => { document.documentElement.classList.toggle("debug-focus",  focus);  }, [focus]);
  useEffect(() => { document.documentElement.classList.toggle("debug-borders",borders);}, [borders]);

  useEffect(() => { setTokenPreview(getToken()); }, [open]);

  const jwtParts = useMemo(() => {
    const tok = tokenPreview;
    if (!tok || tok.split(".").length !== 3) return {};
    const [h, p] = tok.split(".");
    return { header: decodeJwtPart(h), payload: decodeJwtPart(p) };
  }, [tokenPreview]);

  async function ping() {
    try {
      const t0 = performance.now();
      const r = await fetch(`${API}/health`, { credentials: "omit" });
      const ms = Math.round(performance.now() - t0);
      setPingMs(ms);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      toast.success(`API OK · ${ms}ms`);
    } catch (e) {
      setPingMs(null);
      toast.error(`API error: ${e.message || e}`);
    }
  }
  const toggleTheme = () => {
    const el = document.documentElement;
    if (el.classList.contains("light")) { el.classList.remove("light"); toast("Dark mode", { icon: "🌙" }); }
    else { el.classList.add("light"); toast("Light mode", { icon: "🌞" }); }
  };
  const clearSession = () => { localStorage.removeItem("overmind_token"); toast.success("Token cleared"); navigate("/login"); };
  const dumpLocalStorage = () => {
    const data = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); data[k] = localStorage.getItem(k); }
    downloadBlob("overmind-localStorage.json", data);
  };
  const downloadSnapshot = () => {
    downloadBlob("overmind-debug-snapshot.json", {
      time: new Date().toISOString(),
      api: API,
      userAgent: navigator.userAgent,
      latencySimMs: latency,
      offlineSim: offline,
      tokenExists: Boolean(getToken()),
      jwt: jwtParts.payload || null,
      location: window.location.href,
    });
  };

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((s) => !s)}
        className="fixed bottom-4 right-4 z-50 px-3 py-2 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-500"
        title="Debug (Ctrl + `)"
      >
        ⚙️
      </button>

      {/* Panel (own scroll area) */}
      {open && (
        <div className="fixed bottom-16 right-4 z-50 w-[380px] bg-gray-900 text-white rounded-lg shadow-2xl border border-gray-700">
          <div className="px-4 py-2 border-b border-gray-800 flex items-center justify-between">
            <div className="font-semibold text-sm">Debug Panel</div>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-200">✕</button>
          </div>

          <div className="p-3 space-y-3 text-sm max-h-[80vh] overflow-y-auto overscroll-contain">
            {/* Quick actions */}
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => toast.success("Success toast")} className="px-2.5 py-1 rounded bg-green-700 hover:bg-green-600">Success</button>
              <button onClick={() => toast.error("Network error")} className="px-2.5 py-1 rounded bg-red-700 hover:bg-red-600">Error</button>
              <button onClick={toggleTheme} className="px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 border border-gray-700">Theme</button>
              <button onClick={clearSession} className="px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 border border-gray-700">Clear token & /login</button>
            </div>

            {/* API */}
            <div className="border border-gray-800 rounded p-2.5">
              <div className="font-semibold mb-1 text-xs text-gray-300">API</div>
              <div className="flex items-center gap-2">
                <button onClick={ping} className="px-2.5 py-1 rounded bg-indigo-700 hover:bg-indigo-600">Ping /health</button>
                <div className="text-xs text-gray-400">{pingMs === null ? "—" : `Last: ${pingMs}ms`}</div>
              </div>
              <div className="mt-1 text-xs text-gray-400">Base: {API}</div>
            </div>

            {/* Network simulation */}
            <div className="border border-gray-800 rounded p-2.5">
              <div className="font-semibold mb-1 text-xs text-gray-300">Network simulation</div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-400">Latency:</span>
                <button onClick={() => setLatency((n) => Math.max(0, n - 100))} className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 border border-gray-700 text-xs">-100ms</button>
                <button onClick={() => setLatency((n) => n + 100)} className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 border border-gray-700 text-xs">+100ms</button>
                <button onClick={() => setLatency(0)} className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 border border-gray-700 text-xs">reset</button>
                <span className="ml-2 text-xs text-gray-300">{latency}ms</span>
              </div>
              <label className="mt-2 text-xs text-gray-300 flex items-center gap-2">
                <input type="checkbox" checked={offline} onChange={(e) => setOffline(e.target.checked)} />
                Simulate offline
              </label>
            </div>

            {/* JWT */}
            <div className="border border-gray-800 rounded p-2.5">
              <div className="font-semibold mb-1 text-xs text-gray-300">JWT</div>
              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={() => { const t = getToken(); navigator.clipboard.writeText(t || ""); toast.success("Token copied"); }} className="px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 border border-gray-700">Copy token</button>
                <button onClick={() => { setTokenPreview(getToken()); toast("Token refreshed"); }} className="px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 border border-gray-700">Refresh</button>
              </div>
              <div className="mt-1 text-[11px] text-gray-400 break-all line-clamp-2">{tokenPreview || "—"}</div>
              {jwtParts.payload ? (
                <pre className="mt-2 max-h-40 overflow-auto text-[11px] bg-gray-950/70 p-2 rounded border border-gray-800">
                  {JSON.stringify(jwtParts.payload, null, 2)}
                </pre>
              ) : (<div className="mt-2 text-xs text-gray-500">No payload</div>)}
            </div>

            {/* UI helpers */}
            <div className="border border-gray-800 rounded p-2.5">
              <div className="font-semibold mb-1 text-xs text-gray-300">UI helpers</div>
              <div className="flex flex-col gap-1.5 text-xs text-gray-300">
                <label className="flex items-center gap-2"><input type="checkbox" checked={grid} onChange={(e) => setGrid(e.target.checked)} /> Show grid overlay</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={focus} onChange={(e) => setFocus(e.target.checked)} /> Always show focus outlines</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={borders} onChange={(e) => setBorders(e.target.checked)} /> Debug borders on elements</label>
              </div>
            </div>

            {/* Storage / snapshot */}
            <div className="border border-gray-800 rounded p-2.5">
              <div className="font-semibold mb-1 text-xs text-gray-300">Storage & snapshot</div>
              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={dumpLocalStorage} className="px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 border border-gray-700">Download localStorage</button>
                <button onClick={downloadSnapshot} className="px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 border border-gray-700">Download snapshot</button>
                <button onClick={() => { localStorage.clear(); toast("localStorage cleared"); }} className="px-2.5 py-1 rounded bg-red-800 hover:bg-red-700">Clear</button>
              </div>
            </div>

            <div className="text-[11px] text-gray-500">Tip: toggle with <kbd>Ctrl</kbd> + <kbd>`</kbd></div>
          </div>
        </div>
      )}

      {/* Debug styles */}
      <style>{`
        .debug-grid::before {
          content: ""; pointer-events: none; position: fixed; inset: 0;
          background-image:
            linear-gradient(to right, rgba(99,102,241,.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99,102,241,.15) 1px, transparent 1px);
          background-size: 20px 20px; z-index: 9998;
        }
        .debug-focus *:focus { outline: 2px solid #f59e0b !important; outline-offset: 2px; }
        .debug-borders * { outline: 1px dashed rgba(99,102,241,.35) !important; }
      `}</style>
    </>
  );
}
