// frontend/src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Login() {
  // Prefill to speed up testing
  const [email, setEmail] = useState("support@overmnd.com");
  const [password, setPassword] = useState("overmind");
  const [showPwd, setShowPwd] = useState(false);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  async function handleSignIn(e) {
    e.preventDefault();
    try {
      setStatus("Signing in…");
      const res = await api.post("/auth/login", { email, password });
      const token = res.data?.access_token;
      if (!token) throw new Error("No token returned by server");
      localStorage.setItem("overmind_token", token);
      setStatus("Signed in ✔️");
      navigate("/home");
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        "Login failed. Check your credentials and try again.";
      setStatus(`Error: ${String(msg)}`);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#0b1220]">
      <div className="w-full max-w-xl">
        <div className="mx-auto w-full max-w-md rounded-2xl shadow-[0_20px_70px_rgba(0,0,0,0.35)] overflow-hidden bg-[#0f172a] border border-[#1e293b]">
          {/* Header */}
          <div
            className="h-32 px-6 pb-4 flex items-end"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #4f46e5, #9333ea), url('https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1200&auto=format&fit=crop')",
              backgroundBlendMode: "overlay",
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderTopLeftRadius: "1rem",
              borderTopRightRadius: "1rem"
            }}
          >
            <h1 className="text-2xl font-extrabold text-white drop-shadow">./overmnd</h1>
          </div>

          {/* Body */}
          <form className="p-6 space-y-4" onSubmit={handleSignIn}>
            <div>
              <h2 className="text-lg font-semibold text-white">Welcome Back</h2>
              <p className="text-sm text-gray-300">Sign in to continue your journey</p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-white mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0b1220] border border-[#1e293b] focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder:text-gray-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-white mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-10 py-2 rounded-lg bg-[#0b1220] border border-[#1e293b] focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder:text-gray-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-100"
                  onClick={() => setShowPwd((s) => !s)}
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-gradient-to-r from-[#9333ea] to-[#4f46e5] hover:opacity-95 text-white font-medium"
            >
              Sign In
            </button>

            {status && (
              <div className="text-center text-sm text-white/90">
                <strong>Status:</strong> {status}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
