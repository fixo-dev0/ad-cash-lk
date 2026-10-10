"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr(""); setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setErr(data.error || "Login failed");
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="card w-full max-w-md">
        <div className="flex justify-center mb-6"><Logo /></div>
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome Back</h1>
        {err && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded mb-4 text-sm">{err}</div>}
        <form onSubmit={submit} className="space-y-4">
          <input className="input" placeholder="Username or Email" value={form.identifier}
            onChange={(e) => setForm({ ...form, identifier: e.target.value })} required />
          <input className="input" type="password" placeholder="Password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <button type="submit" className="btn-gold w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center text-white/60 text-sm mt-4">
          No account? <Link href="/register" className="text-gold">Register</Link>
        </p>
      </div>
    </main>
  );
}