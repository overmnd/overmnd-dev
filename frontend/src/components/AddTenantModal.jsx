// frontend/src/components/AddTenantModal.jsx
import React, { useEffect } from "react";
import { IconBuildingSkyscraper, IconX } from "@tabler/icons-react";

export default function AddTenantModal({ open, onClose, onSelect }) {
  useEffect(() => {
    if (open) {
      document.documentElement.classList.add("overflow-hidden");
      return () =>
        document.documentElement.classList.remove("overflow-hidden");
    }
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[61] flex items-center justify-center p-4">
        <div className="w-full max-w-3xl rounded-xl bg-slate-900 shadow-2xl ring-1 ring-white/10">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="text-sm font-medium text-white">Add Tenant</div>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-slate-400 hover:text-slate-200"
              aria-label="Close"
            >
              <IconX size={18} />
            </button>
          </div>

          <div className="px-6 py-5">
            <h3 className="text-center text-base font-medium text-white">
              What Type of Tenant Do You Want to Add?
            </h3>
            <p className="mt-1 text-center text-[13px] text-slate-400">
              Tenants are dedicated Microsoft Entra instances your org owns and manages.
            </p>

            {/* centered single option */}
            <div className="mx-auto mt-6 grid max-w-xl grid-cols-1">
              <div className="rounded-lg border border-white/10 bg-slate-900/60 p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-md bg-indigo-600/15 text-indigo-300">
                    <IconBuildingSkyscraper size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">
                      Commercial / Office 365 Tenant
                    </div>
                    <div className="mt-1 text-[13px] text-slate-400">
                      Standard Microsoft 365 tenants (commercial). Supported by overmnd.
                    </div>

                    <button
                      onClick={() => {
                        onClose?.();
                        onSelect?.("o365");
                      }}
                      className="mt-3 rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-500"
                    >
                      Add Commercial (Office 365) Tenant
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={onClose}
                className="rounded-md bg-slate-800/70 px-3 py-1.5 text-sm text-slate-200 ring-1 ring-inset ring-white/10 hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
