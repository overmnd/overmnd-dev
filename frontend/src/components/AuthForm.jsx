// frontend/src/components/AuthForm.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export default function AuthForm() {
  const [showPwd, setShowPwd] = useState(false);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "support@overmind.bot",
      password: "overmind"
    }
  });

  async function onSignIn({ email, password }) {
    try {
      setStatus("Signing in…");
      const res = await api.post("/auth/login", { email, password });
      const token = res.data?.access_token;
      if (!token) throw new Error("No token returned by server");
      localStorage.setItem("overmind_token", token);
      setStatus("Signed in ✔️");
      navigate("/home");
    } catch (e) {
      const msg =
        e?.response?.data?.detail ||
        e?.message ||
        "Login failed. Check credentials and try again.";
      setStatus(`Error: ${String(msg)}`);
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl shadow-card overflow-hidden bg-om-card border border-om-border">
      {/* Hero */}
      <div
        className="h-32 flex items-end px-6 pb-4"
        style={{
          backgroundImage:
            "linear-gradient(90deg, var(--gradStart, #9333ea), var(--gradEnd, #4f46e5)), url('https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1200&auto=format&fit=crop')",
          backgroundBlendMode: "overlay",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderTopLeftRadius: "1rem",
          borderTopRightRadius: "1rem",
          "--gradStart": "#9333ea",
          "--gradEnd": "#4f46e5"
        }}
      >
        <h2 className="text-2xl font-extrabold text-white drop-shadow">overmind</h2>
      </div>

      {/* Body */}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-1 text-center text-om-text">Welcome Back</h3>
        <p className="text-sm text-om-sub mb-6 text-center">Sign in to continue your journey</p>

        <form className="space-y-4" onSubmit={handleSubmit(onSignIn)}>
          {/* Email */}
          <div>
            <label className="block text-sm text-om-sub mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-om-sub" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0b1220] border border-om-border focus:outline-none focus:ring-2 focus:ring-purple-500 text-om-text placeholder:text-om-sub"
                {...register("email")}
                autoComplete="username"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-om-sub mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-om-sub" />
              <input
                type={showPwd ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full pl-9 pr-10 py-2 rounded-lg bg-[#0b1220] border border-om-border focus:outline-none focus:ring-2 focus:ring-purple-500 text-om-text placeholder:text-om-sub"
                {...register("password")}
                autoComplete="current-password"
              />
              <button
                type="button"
                aria-label={showPwd ? "Hide password" : "Show password"}
                onClick={() => setShowPwd((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-om-sub hover:text-om-text"
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
            )}
          </div>

          {/* Sign in */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-om-gradStart to-om-gradEnd hover:opacity-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
          >
            Sign In
          </motion.button>
        </form>

        {status && (
          <div className="mt-4 text-center text-sm text-om-sub">
            <strong>Status:</strong> {status}
          </div>
        )}
      </div>
    </div>
  );
}
