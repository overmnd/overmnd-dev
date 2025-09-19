// frontend/src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Existing pages
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Tenants from "./pages/Tenants.jsx";

// Findings (already added earlier)
import Findings from "./pages/Findings.jsx";
import SecurityDashboard from "./pages/findings/SecurityDashboard.jsx";
import CriticalAssets from "./pages/findings/CriticalAssets.jsx";
import HybridIdentity from "./pages/findings/HybridIdentity.jsx";
import FindingsSearch from "./pages/findings/Search.jsx";
import FindingsAlerts from "./pages/findings/Alerts.jsx";

// NEW: Remediations
import Remediations from "./pages/Remediations.jsx";
import RemedDash from "./pages/remediations/Dashboard.jsx";
import Remediate from "./pages/remediations/Remediate.jsx";
import Recommendations from "./pages/remediations/Recommendations.jsx";

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

/** Minimal error boundary */
class AppBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, err: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, err: error };
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
            <div className="text-sm text-gray-400">
              If this persists, check the browser console for details.
            </div>
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

            {/* NEW: Remediations */}
            <Route path="/remediations" element={<Remediations />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<RemedDash />} />
              <Route path="remediate" element={<Remediate />} />
              <Route path="recommendations" element={<Recommendations />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AppBoundary>

      <Toaster position="bottom-center" />
    </BrowserRouter>
  );
}
