"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function Register() {
  const router = useRouter();
  const params = useSearchParams();
  const [form, setForm] = useState({
    username: "", email: "", password: "",
    referralCode: params.get("ref") || "",
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr(""); setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setErr(data.error || "Registration failed");
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="card w-full max-w-md">
        <div className="flex justify-center mb-6"><Logo /></div>
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>
        {err && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded mb-4 text-sm">{err}</div>}
        <form onSubmit={submit} className="space-y-4">
          <input className="input" placeholder="Username" value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          <input className="input" type="email" placeholder="Email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="input" type="password" placeholder="Password (min 6 chars)" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <input className="input" placeholder="Referral code (optional)" value={form.referralCode}
            onChange={(e) => setForm({ ...form, referralCode: e.target.value })} />
          <button type="submit" className="btn-gold w-full" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>
        <p className="text-center text-white/60 text-sm mt-4">
          Have an account? <Link href="/login" className="text-gold">Login</Link>
        </p>
      </div>
    </main>
  );
}