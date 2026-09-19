"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiLogIn, FiArrowRight } from "react-icons/fi";
import { FaBookOpen } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid credentials");
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch {
      setError("Connection failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0c1d3d] via-[#132b5e] to-[#1a3a7a] items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500 rounded-full blur-3xl opacity-10" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-10" />
        <div className="text-center relative">
          <div className="w-20 h-20 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-amber-500/25">
            <FaBookOpen className="text-white text-4xl" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Carthage Library</h1>
          <p className="text-white/60 text-lg max-w-sm">Access your account to borrow books, manage your profile, and discover new reads.</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12">
        <div className="w-full max-w-md mx-auto">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-[#0c1d3d] transition mb-8">
            <FiArrowRight className="rotate-180" /> Back to Library
          </Link>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-gray-500 mb-8">
            Don&apos;t have an account? <Link href="/register" className="text-amber-600 hover:text-amber-500 font-medium">Create one</Link>
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <FiLock className="text-red-400" /> {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition bg-gray-50 focus:bg-white"
                  placeholder="you@example.test"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition bg-gray-50 focus:bg-white"
                  placeholder="Enter your password"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0c1d3d] text-white py-3.5 rounded-xl font-semibold hover:bg-[#132b5e] transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-[#0c1d3d]/20"
            >
              {loading ? "Signing in..." : <><FiLogIn /> Sign in</>}
            </button>
          </form>

          <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-xl">
            <p className="text-xs text-amber-800 font-medium mb-1">Demo Accounts</p>
            <p className="text-xs text-amber-700">demo@example.test / password123</p>
            <p className="text-xs text-amber-700">admin@example.test / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
