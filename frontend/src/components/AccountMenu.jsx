// frontend/src/components/AccountMenu.jsx
// Simple click-to-open menu with links to profile, settings and sign-out.

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function useOnClickOutside(ref, handler) {
  useEffect(() => {
    function listener(e) {
      if (!ref.current || ref.current.contains(e.target)) return;
      handler(e);
    }
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}

export default function AccountMenu({ children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  useOnClickOutside(ref, () => setOpen(false));

  function signOut() {
    localStorage.removeItem("overmind_token");
    navigate("/login");
  }

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen((s) => !s)}>{children}</div>
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-800 bg-slate-900/95 backdrop-blur shadow-xl">
          <div className="px-3 py-2 text-xs text-slate-400">Signed in as</div>
          <div className="px-3 text-sm text-white truncate">admin@contoso.com</div>
          <div className="my-2 border-t border-slate-800" />
          <button
            className="block w-full text-left px-3 py-2 text-sm hover:bg-slate-800"
            onClick={() => {
              setOpen(false);
              navigate("/settings/organization");
            }}
          >
            Organization Settings
          </button>
          <button
            className="block w-full text-left px-3 py-2 text-sm hover:bg-slate-800"
            onClick={() => {
              setOpen(false);
              navigate("/settings/billing");
            }}
          >
            Billing
          </button>
          <div className="my-2 border-t border-slate-800" />
          <button
            className="block w-full text-left px-3 py-2 text-sm text-rose-300 hover:bg-rose-900/20"
            onClick={signOut}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
