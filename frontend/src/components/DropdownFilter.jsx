// frontend/src/components/DropdownFilter.jsx
// Compact pill-style dropdown. Works anywhere, but looks best as a top-right badge.

import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";

export default function DropdownFilter({
  options = ["Today", "Yesterday", "Last 7 days", "Last 30 days"],
  initial = "Last 7 days",
  onChange = () => {},
  className = "",
  size = "sm", // 'sm' | 'md'
}) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState(initial);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const sz =
    size === "md"
      ? "px-3 py-1 text-xs rounded-full"
      : "px-2 py-0.5 text-[10px] rounded-full";

  return (
    <div ref={ref} className={clsx("relative inline-block text-left", className)}>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className={clsx(
          "bg-gray-800/90 hover:bg-gray-700 border border-gray-700 text-gray-200",
          "shadow-sm backdrop-blur",
          sz
        )}
        aria-label="Change date range"
      >
        {label} ▾
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-44 rounded-md shadow-xl bg-gray-900 ring-1 ring-black ring-opacity-5 z-30">
          <ul className="py-1">
            {options.map((o) => (
              <li key={o}>
                <button
                  onClick={() => {
                    setLabel(o);
                    setOpen(false);
                    onChange(o);
                  }}
                  className={clsx(
                    "w-full text-left px-3 py-1.5 text-sm",
                    o === label ? "text-indigo-400" : "text-gray-200",
                    "hover:bg-gray-800"
                  )}
                >
                  {o}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
