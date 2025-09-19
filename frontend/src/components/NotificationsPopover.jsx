// frontend/src/components/NotificationsPopover.jsx
// Small, anchored popover that shows notifications, allows mark-read / mark-all,
// and deep-links to the appropriate page (e.g., Tenants → grant consent).
// Reads/writes via services/notifications.js (JWT handled by api.js)

import React, { useEffect, useMemo, useRef, useState } from "react";
import { IconCheck, IconCircleDot, IconChevronRight, IconAlertTriangle } from "@tabler/icons-react";
import { listNotifications, markNotificationRead, markAllRead } from "../services/notifications";
import { toast } from "react-hot-toast";

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

export default function NotificationsPopover({ anchorRef, open, onClose, onNavigate }) {
  const popRef = useRef(null);
  useOnClickOutside(popRef, () => open && onClose?.());

  const [items, setItems] = useState([]);
  const unread = useMemo(() => items.filter((n) => !n.read).length, [items]);

  // Expose a tiny badge component for the bell
  NotificationsPopover.TriggerBadge = function TriggerBadge() {
    if (!unread) return null;
    return (
      <span className="absolute right-1 top-1 block h-2 w-2 rounded-full bg-rose-500 ring-2 ring-slate-900" />
    );
  };

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const data = await listNotifications();
        setItems(data);
      } catch (e) {
        toast.error("Failed to load notifications");
      }
    })();
  }, [open]);

  async function handleMarkRead(id) {
    try {
      await markNotificationRead(id);
      setItems((arr) => arr.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch {
      toast.error("Could not mark as read");
    }
  }

  async function handleMarkAll() {
    try {
      await markAllRead();
      setItems((arr) => arr.map((n) => ({ ...n, read: true })));
    } catch {
      toast.error("Could not mark all read");
    }
  }

  function go(n) {
    // Default route if backend didn’t provide one
    const to = n.route || "/home";
    onNavigate?.(to);
    onClose?.();
  }

  // Positioning
  const style = useMemo(() => {
    const anchor = anchorRef?.current;
    if (!anchor) return { opacity: 0, pointerEvents: "none" };
    const rect = anchor.getBoundingClientRect();
    const top = rect.bottom + 8 + window.scrollY;
    const left = rect.right - 320 + window.scrollX; // 320 = popover width
    return { top, left, opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" };
  }, [anchorRef, open]);

  return (
    <div
      ref={popRef}
      style={{ position: "absolute", ...style }}
      className="z-50 w-80 rounded-lg border border-slate-800 bg-slate-900/95 backdrop-blur shadow-2xl"
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800">
        <div className="text-xs font-semibold text-gray-200">Notifications</div>
        <button
          onClick={handleMarkAll}
          className="text-[11px] text-indigo-300 hover:text-white"
        >
          Mark all read
        </button>
      </div>

      <div className="max-h-80 overflow-auto py-1">
        {items.length === 0 && (
          <div className="px-3 py-6 text-center text-sm text-slate-400">No notifications</div>
        )}
        {items.map((n) => (
          <div
            key={n.id}
            className={[
              "flex items-start gap-2 px-3 py-2 border-b border-slate-800/60 hover:bg-slate-800/40 cursor-pointer",
              n.read ? "opacity-80" : "",
            ].join(" ")}
            onClick={() => go(n)}
          >
            <div className="pt-0.5">
              {n.severity === "high" ? (
                <IconAlertTriangle size={18} className="text-rose-400" />
              ) : (
                <IconCircleDot size={18} className="text-indigo-300" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] text-white truncate">{n.title}</div>
              {n.body ? (
                <div className="text-[12px] text-slate-400 line-clamp-2">{n.body}</div>
              ) : null}
              <div className="mt-0.5 text-[11px] text-slate-500">{n.when || ""}</div>
            </div>
            {!n.read ? (
              <button
                className="p-1 rounded hover:bg-slate-800"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkRead(n.id);
                }}
                title="Mark read"
              >
                <IconCheck size={16} />
              </button>
            ) : (
              <IconChevronRight size={16} className="opacity-60" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
