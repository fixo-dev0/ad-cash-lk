"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function Withdraw() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [method, setMethod] = useState("paypal");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [modal, setModal] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("/api/auth/me").then((r) => {
      if (!r.ok) return router.push("/login");
      return r.json();
    }).then((d) => d && setUser(d.user));
  }, []);

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const task1 = { done: user.totalAdsWatched >= 80, cur: user.totalAdsWatched, max: 80, label: "Watch 80 ads total" };
  const task2 = { done: user.referrals.length >= 5, cur: user.referrals.length, max: 5, label: "Refer 5 friends" };
  const task3 = { done: user.balance > 10, cur: user.balance, max: 10, label: "Balance over $10" };
  const allDone = task1.done && task2.done && task3.done;

  async function submit(e) {
    e.preventDefault();
    setErr("");
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return setErr("Invalid amount");
    if (amt > user.balance) return setErr("Insufficient balance");
    if (!address.trim()) return setErr("Enter payment address");

    const res = await fetch("/api/withdraw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amt, method, address }),
    });
    const data = await res.json();
    if (!res.ok) return setErr(data.error || "Failed");
    setModal(true);
  }

  function Bar({ t }) {
    const pct = Math.min(100, (t.cur / t.max) * 100);
    return (
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>{t.done ? "✅" : "⏳"} {t.label}</span>
          <span className="text-white/60">{t.cur} / {t.max}</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div className={`h-2 rounded-full ${t.done ? "bg-green-400" : "bg-gold"}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <nav className="flex justify-between items-center px-6 py-4 max-w-4xl mx-auto border-b border-white/10">
        <Logo />
        <Link href="/dashboard" className="text-white/70 text-sm hover:text-white">← Dashboard</Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Withdraw Funds</h1>

        <div className="card mb-6">
          <h2 className="font-semibold mb-4">Complete These Tasks</h2>
          <Bar t={task1} />
          <Bar t={task2} />
          <Bar t={task3} />
        </div>

        <form onSubmit={submit} className="card space-y-4">
          <div>
            <label className="text-sm text-white/70 mb-1 block">Payment Method</label>
            <select className="input" value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="paypal" className="text-black">PayPal</option>
              <option value="usdt" className="text-black">USDT (TRC20)</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-white/70 mb-1 block">
              {method === "paypal" ? "PayPal Email" : "USDT TRC20 Address"}
            </label>
            <input className="input" value={address} onChange={(e) => setAddress(e.target.value)}
              placeholder={method === "paypal" ? "you@example.com" : "T..."} />
          </div>
          <div>
            <label className="text-sm text-white/70 mb-1 block">Amount (USD)</label>
            <input className="input" type="number" step="0.01" min="0.01" value={amount}
              onChange={(e) => setAmount(e.target.value)} placeholder="10.00" />
            <div className="text-xs text-white/50 mt-1">Available: ${user.balance.toFixed(2)}</div>
          </div>
          {err && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded text-sm">{err}</div>}
          <button type="submit" className="btn-gold w-full disabled:opacity-40" disabled={!allDone}>
            {allDone ? "Request Withdrawal" : "Complete tasks to withdraw"}
          </button>
        </form>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="card max-w-md text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-bold mb-2">Withdrawal Request Submitted!</h2>
            <p className="text-white/70 mb-6">(Demo mode) — Your request will be processed within 24 hours.</p>
            <button onClick={() => { setModal(false); router.push("/dashboard"); }} className="btn-gold w-full">
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </main>
  );
}