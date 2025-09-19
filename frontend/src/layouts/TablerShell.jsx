import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { IconBell, IconUserCircle } from "@tabler/icons-react";
import NotificationsPopover from "../components/NotificationsPopover";
import AccountMenu from "../components/AccountMenu";
import {Outlet } from "react-router-dom";

const navItems = [
  { to: "/home", label: "Home" },
  { to: "/tenants", label: "Tenants" },
  { to: "/findings", label: "Findings" },
  { to: "/remediations", label: "Remediations" },
  { to: "/license-optimizer", label: "License Optimizer" },
  { to: "/reports", label: "Reports" },
  { to: "/settings", label: "Settings" },
];

export default function TablerShell({ children, title }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const bellRef = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Close popover on route change
  useEffect(() => {
    setNotifOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100">
      {/* Top bar (slightly lighter so it pops) */}
      <header className="sticky top-0 z-40 backdrop-blur bg-slate-900/80 border-b border-slate-800">
        <div className="mx-auto w-full px-4">
          <div className="h-14 flex items-center justify-between">
            {/* Brand + Left nav */}
            <div className="flex items-center gap-8">
              <Link to="/home" className="text-lg font-semibold tracking-tight">
                <span className="px-2 py-0.5 rounded bg-indigo-600 mr-2">./</span>
                overmnd
              </Link>

              <nav className="hidden lg:flex items-center gap-2">
                {navItems.map((n) => (
                  <NavLink
                    key={n.to}
                    to={n.to}
                    className={({ isActive }) =>
                      [
                        "text-sm px-3 py-1.5 rounded",
                        isActive
                          ? "bg-slate-800 text-white"
                          : "text-gray-300 hover:text-white hover:bg-slate-900/60",
                      ].join(" ")
                    }
                  >
                    {n.label}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Right controls */}
            <div className="relative flex items-center gap-2">
              {/* Notifications */}
              <button
                ref={bellRef}
                aria-label="Notifications"
                className="relative p-2 rounded hover:bg-slate-900 text-gray-300 hover:text-white"
                onClick={() => setNotifOpen((s) => !s)}
              >
                <IconBell size={20} />
                {/* Unread dot (controlled by popover unread count) */}
                <NotificationsPopover.TriggerBadge />
              </button>

              {/* Popover anchored to the bell */}
              <NotificationsPopover
                anchorRef={bellRef}
                open={notifOpen}
                onClose={() => setNotifOpen(false)}
                onNavigate={(to) => navigate(to)}
              />

              {/* Account menu */}
              <AccountMenu>
                <button
                  aria-label="Account"
                  className="pl-2 ml-1 flex items-center gap-2 hover:bg-slate-900 rounded pr-3 py-1 text-gray-200"
                >
                  <IconUserCircle size={22} />
                  <span className="hidden md:inline text-sm opacity-80">admin</span>
                </button>
              </AccountMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto w-full px-4 py-6">
        {title ? <h1 className="sr-only">{title}</h1> : null}
        {children}
      </main>

      <footer className="mx-auto w-full px-4 py-8 text-xs text-gray-500 text-center">
        {new Date().getFullYear()} overmnd
      </footer>
    </div>
  );
}
