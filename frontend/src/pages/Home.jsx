// frontend/src/pages/Home.jsx
import React, { useMemo } from "react";
import TablerShell from "../layouts/TablerShell";
import Chart from "react-apexcharts";
import {
  IconUsers,
  IconCurrencyDollar,
  IconTrendingUp,
  IconTrendingDown,
  IconMessageCircle,
  IconReportAnalytics,
  IconBox,
  IconDots,
} from "@tabler/icons-react";
import DebugPanel from "../components/DebugPanel";

/* ---------- helpers ---------- */

function FilterBadge({ children = "Last 7 days" }) {
  return (
    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md border border-gray-700/60 bg-gray-800/60 px-2 py-0.5 text-[11px] text-gray-300">
      {children}
      <IconDots size={14} className="opacity-70" />
    </span>
  );
}

function StatCard({ icon: Icon, title, value, sub, tone = "default" }) {
  const toneClass = {
    default: "bg-gray-800/60 border-gray-700/60",
    up: "bg-gray-800/60 border-gray-700/60",
    down: "bg-gray-800/60 border-gray-700/60",
  }[tone];

  const subClass =
    tone === "up"
      ? "text-emerald-400"
      : tone === "down"
      ? "text-rose-400"
      : "text-gray-400";

  return (
    <div className={`relative rounded-lg border ${toneClass} p-4`}>
      <FilterBadge />
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-md bg-indigo-700/30 text-indigo-300">
          <Icon size={18} />
        </div>
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-wide text-gray-400">
            {title}
          </div>
          <div className="text-lg font-semibold text-white">{value}</div>
          {sub ? <div className={`text-[11px] ${subClass}`}>{sub}</div> : null}
        </div>
      </div>
    </div>
  );
}

/* ---------- charts data ---------- */

const lineOptions = {
  chart: { toolbar: { show: false }, foreColor: "#9CA3AF" },
  stroke: { width: 2, curve: "smooth" },
  grid: { borderColor: "rgba(148,163,184,.15)" },
  xaxis: { categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
  colors: ["#22c55e", "#60a5fa"],
  legend: { labels: { colors: "#cbd5e1" } },
};
const lineSeries = [
  { name: "New Tickets", data: [8, 14, 15, 22, 18, 35, 32] },
  { name: "Closed Today", data: [5, 9, 11, 19, 21, 28, 26] },
];

const donutOptions = {
  chart: { toolbar: { show: false }, foreColor: "#9CA3AF" },
  dataLabels: { enabled: false },
  labels: ["Returning", "New"],
  colors: ["#22c55e", "#16a34a"],
  legend: { labels: { colors: "#cbd5e1" } },
};
const donutSeries = [63, 37];

const pieOptions = {
  chart: { toolbar: { show: false }, foreColor: "#9CA3AF" },
  labels: ["A", "B", "C", "D"],
  colors: ["#93c5fd", "#60a5fa", "#1d4ed8", "#3b82f6"],
  legend: { labels: { colors: "#cbd5e1" } },
  dataLabels: { enabled: false },
};
const pieSeries = [47.2, 32.9, 10.4, 9.5];

/* ---------- page ---------- */

export default function Home() {
  const smallStat = useMemo(
    () => [
      {
        icon: IconUsers,
        title: "Users",
        value: "1,234",
        sub: "+5% from last week",
        tone: "up",
      },
      {
        icon: IconCurrencyDollar,
        title: "Revenue",
        value: "$12,345",
        sub: "+2.3% from last week",
        tone: "up",
      },
      {
        icon: IconTrendingUp,
        title: "Growth",
        value: "8.2%",
        sub: "+0.7% this month",
        tone: "up",
      },
      {
        icon: IconTrendingDown,
        title: "Churn",
        value: "1.3%",
        sub: "-0.1% this month",
        tone: "down",
      },
    ],
    []
  );

  const microStats = useMemo(
    () => [
      {
        icon: IconTrendingUp,
        title: "New Tickets",
        value: "43",
        sub: "+6%",
        tone: "up",
      },
      {
        icon: IconReportAnalytics,
        title: "Closed Today",
        value: "17",
        sub: "-3%",
        tone: "down",
      },
      {
        icon: IconMessageCircle,
        title: "New Replies",
        value: "7",
        sub: "+9%",
        tone: "up",
      },
      {
        icon: IconUsers,
        title: "Followers",
        value: "27.3k",
        sub: "+3%",
        tone: "up",
      },
      {
        icon: IconCurrencyDollar,
        title: "Daily earnings",
        value: "$95",
        sub: "-2%",
        tone: "down",
      },
      {
        icon: IconBox,
        title: "Products",
        value: "621",
        sub: "-1%",
        tone: "down",
      },
    ],
    []
  );

  return (
    <TablerShell title="Home">
      {/* Top metric row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {smallStat.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* Micro stat row */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {microStats.map((s, i) => (
          <div key={i} className="relative rounded-lg border border-gray-700/60 bg-gray-800/60 p-4">
            <FilterBadge />
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-md bg-indigo-700/30 text-indigo-300">
                <s.icon size={16} />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] uppercase tracking-wide text-gray-400">
                  {s.title}
                </div>
                <div className="text-lg font-semibold text-white">{s.value}</div>
                <div
                  className={`text-[11px] ${
                    s.tone === "up"
                      ? "text-emerald-400"
                      : s.tone === "down"
                      ? "text-rose-400"
                      : "text-gray-400"
                  }`}
                >
                  {s.sub}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="relative rounded-lg border border-gray-700/60 bg-gray-800/60 p-4">
          <FilterBadge />
          <div className="mb-2 text-sm font-medium text-white">A</div>
          <Chart type="line" height={280} options={lineOptions} series={lineSeries} />
          <div className="mt-2 flex items-center gap-4 text-xs text-gray-300">
            <span className="inline-flex items-center gap-1 before:h-2 before:w-2 before:rounded-full before:bg-emerald-500">
              New Tickets
            </span>
            <span className="inline-flex items-center gap-1 before:h-2 before:w-2 before:rounded-full before:bg-blue-400">
              Closed Today
            </span>
          </div>
        </div>

        <div className="relative rounded-lg border border-gray-700/60 bg-gray-800/60 p-4">
          <FilterBadge />
          <div className="mb-2 text-sm font-medium text-white">B</div>
          <Chart type="donut" height={280} options={donutOptions} series={donutSeries} />
          <div className="mt-2 text-xs text-gray-300">Returning / New</div>
        </div>

        <div className="relative rounded-lg border border-gray-700/60 bg-gray-800/60 p-4">
          <FilterBadge />
          <div className="mb-2 text-sm font-medium text-white">C</div>
          <Chart type="pie" height={280} options={pieOptions} series={pieSeries} />
        </div>
      </div>

      {/* quick stats row */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { title: "Sales", value: "132", sub: "12 waiting payments" },
          { title: "Orders", value: "78", sub: "32 shipped" },
          { title: "Members", value: "1,352", sub: "163 registered today" },
          { title: "Comments", value: "132", sub: "16 waiting" },
        ].map((k, i) => (
          <div key={i} className="rounded-lg border border-gray-700/60 bg-gray-800/60 p-4">
            <div className="text-2xl font-semibold text-white">{k.value}</div>
            <div className="text-sm text-gray-300">{k.title}</div>
            <div className="text-[11px] text-gray-400">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Invoices & bottom widgets */}
      <div className="mt-6 rounded-lg border border-gray-700/60 bg-gray-800/60">
        <div className="border-b border-gray-700/60 px-4 py-3 text-sm font-medium text-white">
          Invoices
        </div>

        {/* Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[12px] uppercase tracking-wide text-gray-400">
          <div className="col-span-2">No.</div>
          <div className="col-span-3">Invoice Subject</div>
          <div className="col-span-2">Client</div>
          <div className="col-span-2">VAT No.</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Price</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* Row */}
        <div className="grid grid-cols-12 items-center gap-4 border-t border-gray-700/60 px-4 py-3 text-sm text-gray-200">
          <div className="col-span-2">001401</div>
          <div className="col-span-3 text-indigo-300 hover:underline">Design Works</div>
          <div className="col-span-2">Carlson Limited</div>
          <div className="col-span-2">87956621</div>
          <div className="col-span-1">
            <span className="rounded bg-emerald-600/20 px-2 py-0.5 text-[11px] text-emerald-300">
              Paid
            </span>
          </div>
          <div className="col-span-1">$887</div>
          <div className="col-span-1 text-right">
            <button className="rounded-md border border-gray-700/60 px-2 py-1 text-[12px] hover:bg-gray-700/50">
              Manage
            </button>
            <button className="ml-2 rounded-md border border-gray-700/60 px-2 py-1 text-[12px] hover:bg-gray-700/50">
              Actions ▾
            </button>
          </div>
        </div>

        {/* KPI mini tiles */}
        <div className="grid grid-cols-1 gap-4 border-t border-gray-700/60 p-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { title: "New feedback", value: "62", bar: "bg-rose-400" },
            { title: "Today profit", value: "$652", bar: "bg-emerald-400" },
            { title: "Users online", value: "76", bar: "bg-amber-400" },
            { title: "Users online", value: "76", bar: "bg-amber-400" },
          ].map((x, i) => (
            <div key={i} className="rounded-lg border border-gray-700/60 bg-gray-800/60 p-4">
              <div className="text-3xl font-semibold text-white">{x.value}</div>
              <div className="text-sm text-gray-300">{x.title}</div>
              <div className="mt-3 h-1.5 w-full rounded bg-gray-700/60">
                <div className={`h-1.5 w-1/2 rounded ${x.bar}`} />
              </div>
            </div>
          ))}
        </div>

        {/* User / Usage / Payment+Activity / Satisfaction */}
        <div className="grid grid-cols-1 gap-4 border-t border-gray-700/60 p-4 xl:grid-cols-4">
          {/* User */}
          <div className="rounded-lg border border-gray-700/60 bg-gray-800/60 p-4">
            <div className="flex items-center gap-3">
              <img
                alt="user"
                className="h-10 w-10 rounded-full object-cover"
                src="https://i.pravatar.cc/80?img=68"
              />
              <div>
                <div className="font-medium text-white">Elizabeth Martin</div>
                <div className="text-[11px] text-gray-400">Registered: Mar 19, 2018</div>
              </div>
            </div>
          </div>

          {/* Usage */}
          <div className="rounded-lg border border-gray-700/60 bg-gray-800/60 p-4">
            <div className="text-sm text-gray-300">Usage</div>
            <div className="mt-1 text-2xl font-semibold text-white">42%</div>
            <div className="mt-3 h-1.5 w-full rounded bg-gray-700/60">
              <div className="h-1.5 w-[42%] rounded bg-indigo-400" />
            </div>
            <div className="mt-2 text-[11px] text-gray-400">Jun 11, 2015 – Jul 10, 2015</div>
          </div>

          {/* Payment / Activity */}
          <div className="rounded-lg border border-gray-700/60 bg-gray-800/60 p-4">
            <div className="text-sm text-gray-300">Payment</div>
            <div className="mt-1 text-[12px] text-gray-400">Price: $887</div>
            <div className="mt-4 text-sm text-gray-300">Activity</div>
            <div className="text-[12px] text-gray-400">Last login 4 minutes ago</div>
          </div>

          {/* Satisfaction */}
          <div className="rounded-lg border border-gray-700/60 bg-gray-800/60 p-4">
            <div className="text-sm text-gray-300">Satisfaction</div>
            <div className="mt-1 text-2xl font-semibold text-white">42%</div>
            <div className="mt-3 h-1.5 w-full rounded bg-gray-700/60">
              <div className="h-1.5 w-[42%] rounded bg-emerald-400" />
            </div>
          </div>
        </div>

        {/* Browser / Projects / Members */}
        <div className="grid grid-cols-1 gap-4 border-t border-gray-700/60 p-4 xl:grid-cols-3">
          {/* Browser stats */}
          <div className="rounded-lg border border-gray-700/60 bg-gray-800/60 p-4">
            <div className="mb-2 text-sm font-medium text-white">Browser Stats</div>
            <div className="flex items-center justify-between text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-indigo-400" />
                Google Chrome
              </div>
              <div className="text-[12px] text-gray-400">23%</div>
            </div>
          </div>

          {/* Projects */}
          <div className="rounded-lg border border-gray-700/60 bg-gray-800/60 p-4">
            <div className="mb-2 text-sm font-medium text-white">Projects</div>
            <div className="flex items-center justify-between text-sm text-gray-300">
              <div>Admin Template</div>
              <div className="text-[12px] text-gray-400">85%</div>
            </div>
            <div className="mt-2 h-1.5 w-full rounded bg-gray-700/60">
              <div className="h-1.5 w-[85%] rounded bg-blue-400" />
            </div>
          </div>

          {/* Members */}
          <div className="rounded-lg border border-gray-700/60 bg-gray-800/60 p-4">
            <div className="mb-2 text-sm font-medium text-white">Members</div>
            <div className="flex items-center gap-3">
              <img
                alt="member"
                className="h-9 w-9 rounded-full object-cover"
                src="https://i.pravatar.cc/80?img=48"
              />
              <div>
                <div className="text-sm text-white">Amanda Hunt</div>
                <div className="text-[12px] text-gray-400">amanda_hunt@example.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Per-page debug */}
      <DebugPanel />
    </TablerShell>
  );
}
