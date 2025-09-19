// frontend/src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Pages
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Tenants from "./pages/Tenants.jsx";

// Findings (parent + children)
import Findings from "./pages/Findings.jsx";
import SecurityDashboard from "./pages/findings/SecurityDashboard.jsx";
import CriticalAssets from "./pages/findings/CriticalAssets.jsx";
import HybridIdentity from "./pages/findings/HybridIdentity.jsx";
import FindingsSearch from "./pages/findings/Search.jsx";
import FindingsAlerts from "./pages/findings/Alerts.jsx";

// Remediations (parent + children)
import Remediations from "./pages/Remediations.jsx";
import RemediationDashboard from "./pages/remediations/Dashboard.jsx";
import Remediate from "./pages/remediations/Remediate.jsx";
import Recommendations from "./pages/remediations/Recommendations.jsx";

// License Optimizer (parent + children)
import LicenseOptimizer from "./pages/LicenseOptimizer.jsx";
import LODashboard from "./pages/license-optimizer/Dashboard.jsx";
import LOAnalyze from "./pages/license-optimizer/Analyze.jsx";
import LOOptimize from "./pages/license-optimizer/Optimize.jsx";
import LOPolicies from "./pages/license-optimizer/Policies.jsx";
import LOSimulator from "./pages/license-optimizer/Simulator.jsx";
import LOReports from "./pages/license-optimizer/Reports.jsx";

// Reports (parent + children)
import Reports from "./pages/Reports.jsx";
import ReportsOverview from "./pages/reports/Overview.jsx";
import ReportsLicensing from "./pages/reports/Licensing.jsx";
import ReportsSecurity from "./pages/reports/Security.jsx";
import ReportsActivity from "./pages/reports/Activity.jsx";
import ReportsExports from "./pages/reports/Exports.jsx";

// Settings (parent + children) — NEW
import Settings from "./pages/Settings.jsx";
import OrgGeneral from "./pages/settings/Organization.jsx";
import Branding from "./pages/settings/Branding.jsx";
import Users from "./pages/settings/Users.jsx";
import Access from "./pages/settings/Access.jsx";
import Integrations from "./pages/settings/Integrations.jsx";
import Notifications from "./pages/settings/Notifications.jsx";
import Billing from "./pages/settings/Billing.jsx";
import Data from "./pages/settings/Data.jsx";
import Audit from "./pages/settings/Audit.jsx";
import Api from "./pages/settings/Api.jsx";
import Advanced from "./pages/settings/Advanced.jsx";

/** Private-route guard */
function RequireAuth() {
  const token = localStorage.getItem("overmind_token");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

/** Redirect authed users away from auth routes */
function RedirectIfAuthed() {
  const token = localStorage.getItem("overmind_token");
  return token ? <Navigate to="/home" replace /> : <Outlet />;
}

/** Error boundary */
class AppBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.error("App crashed:", error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-gray-100 flex items-center justify-center p-8">
          <div className="max-w-xl w-full rounded-lg border border-slate-800 bg-slate-900 p-6">
            <div className="text-lg font-semibold mb-2">Something went wrong.</div>
            <div className="text-sm text-gray-400">If this persists, check the browser console for details.</div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <AppBoundary>
        <Routes>
          {/* Public routes */}
          <Route element={<RedirectIfAuthed />}>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Private routes */}
          <Route element={<RequireAuth />}>
            <Route path="/home" element={<Home />} />
            <Route path="/tenants" element={<Tenants />} />

            {/* Findings */}
            <Route path="/findings" element={<Findings />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<SecurityDashboard />} />
              <Route path="critical-assets" element={<CriticalAssets />} />
              <Route path="hybrid-identity" element={<HybridIdentity />} />
              <Route path="search" element={<FindingsSearch />} />
              <Route path="alerts" element={<FindingsAlerts />} />
            </Route>

            {/* Remediations */}
            <Route path="/remediations" element={<Remediations />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<RemediationDashboard />} />
              <Route path="remediate" element={<Remediate />} />
              <Route path="recommendations" element={<Recommendations />} />
            </Route>

            {/* License Optimizer */}
            <Route path="/license-optimizer" element={<LicenseOptimizer />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<LODashboard />} />
              <Route path="analyze" element={<LOAnalyze />} />
              <Route path="optimize" element={<LOOptimize />} />
              <Route path="policies" element={<LOPolicies />} />
              <Route path="simulator" element={<LOSimulator />} />
              <Route path="reports" element={<LOReports />} />
            </Route>

            {/* Reports */}
            <Route path="/reports" element={<Reports />}>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<ReportsOverview />} />
              <Route path="licensing" element={<ReportsLicensing />} />
              <Route path="security" element={<ReportsSecurity />} />
              <Route path="activity" element={<ReportsActivity />} />
              <Route path="exports" element={<ReportsExports />} />
            </Route>

            {/* Settings — NEW */}
            <Route path="/settings" element={<Settings />}>
              <Route index element={<Navigate to="organization" replace />} />
              <Route path="organization" element={<OrgGeneral />} />
              <Route path="branding" element={<Branding />} />
              <Route path="users" element={<Users />} />
              <Route path="access" element={<Access />} />
              <Route path="integrations" element={<Integrations />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="billing" element={<Billing />} />
              <Route path="data" element={<Data />} />
              <Route path="audit" element={<Audit />} />
              <Route path="api" element={<Api />} />
              <Route path="advanced" element={<Advanced />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AppBoundary>

      {/* Global toaster */}
      <Toaster position="bottom-center" />
    </BrowserRouter>
  );
}
