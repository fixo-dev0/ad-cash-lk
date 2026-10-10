"use client";
import { useState } from "react";
import Logo from "@/components/Logo";

export default function AdminPanel() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [search, setSearch] = useState("");
  const [err, setErr] = useState("");

  async function login(e) {
    e.preventDefault();
    setErr("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) return setErr("Invalid password");
    setAuthed(true);
    loadAll();
  }

  async function loadAll() {
    const [s, u, w] = await Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetch("/api/admin/users").then((r) => r.json()),
      fetch("/api/admin/withdrawals").then((r) => r.json()),
    ]);
    setStats(s);
    setUsers(u.users || []);
    setWithdrawals(w.withdrawals || []);
  }

  async function toggleBan(id) {
    await fetch(`/api/admin/users?id=${id}`, { method: "PATCH" });
    loadAll();
  }

  async function setStatus(id, status) {
    await fetch(`/api/admin/withdrawals?id=${id}&status=${status}`, { method: "PATCH" });
    loadAll();
  }

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <form onSubmit={login} className="card w-full max-w-sm">
          <div className="flex justify-center mb-6"><Logo /></div>
          <h1 className="text-xl font-bold mb-4 text-center">Admin Login</h1>
          {err && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded mb-4 text-sm">{err}</div>}
          <input type="password" className="input mb-4" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)} />
          <button className="btn-gold w-full">Login</button>
        </form>
      </main>
    );
  }

  const filtered = users.filter((u) => u.username.toLowerCase().includes(search.toLowerCase())
    || u.email.toLowerCase().includes(search.toLowerCase()));

  const maxVisitors = Math.max(...(stats?.traffic?.map((t) => t.visitors) || [1]), 1);

  return (
    <main className="min-h-screen px-6 py-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <Logo />
        <span className="text-gold text-sm font-semibold">ADMIN PANEL</span>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="card">
          <div className="text-white/60 text-sm">Total Users</div>
          <div className="text-3xl font-bold text-gold">{stats?.totalUsers || 0}</div>
        </div>
        <div className="card">
          <div className="text-white/60 text-sm">Ads Watched Today</div>
          <div className="text-3xl font-bold text-gold">{stats?.adsToday || 0}</div>
        </div>
        <div className="card">
          <div className="text-white/60 text-sm">Total Balance Owed</div>
          <div className="text-3xl font-bold text-gold">${(stats?.totalBalance || 0).toFixed(2)}</div>
        </div>
      </div>

      <div className="card mb-8">
        <h2 className="font-semibold mb-4">Daily Traffic (last 7 days)</h2>
        <div className="flex items-end gap-3 h-40">
          {stats?.traffic?.map((d) => (
            <div key={d.date} className="flex-1 flex flex-col items-center">
              <div className="text-xs text-white/60 mb-1">{d.visitors}</div>
              <div className="w-full bg-gold rounded-t"
                style={{ height: `${(d.visitors / maxVisitors) * 100}%`, minHeight: "4px" }} />
              <div className="text-xs text-white/50 mt-1">{d.date}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card mb-8">
        <div className="flex justify-between mb-4">
          <h2 className="font-semibold">Users ({filtered.length})</h2>
          <input className="input max-w-xs text-sm py-2" placeholder="Search..." value={search}
            onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-white/60 text-left">
              <tr><th className="py-2">Username</th><th>Email</th><th>Balance</th><th>Ads</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u._id} className="border-t border-white/10">
                  <td className="py-2">{u.username}</td>
                  <td className="text-white/70">{u.email}</td>
                  <td className="text-gold">${u.balance.toFixed(2)}</td>
                  <td>{u.totalAdsWatched}</td>
                  <td>{u.banned ? <span className="text-red-400">Banned</span> : <span className="text-green-400">Active</span>}</td>
                  <td>
                    <button onClick={() => toggleBan(u._id)}
                      className="text-xs px-3 py-1 rounded border border-white/20 hover:border-gold">
                      {u.banned ? "Unban" : "Ban"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-4">Withdrawal Requests ({withdrawals.length})</h2>
        {withdrawals.length === 0 ? (
          <p className="text-white/50 text-sm">No requests yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-white/60 text-left">
                <tr><th className="py-2">User</th><th>Amount</th><th>Method</th><th>Address</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {withdrawals.map((w) => (
                  <tr key={w._id} className="border-t border-white/10">
                    <td className="py-2">{w.username}</td>
                    <td className="text-gold">${w.amount.toFixed(2)}</td>
                    <td className="uppercase">{w.method}</td>
                    <td className="text-white/70 text-xs max-w-xs truncate">{w.address}</td>
                    <td>{w.status}</td>
                    <td className="space-x-2">
                      {w.status === "pending" && (
                        <>
                          <button onClick={() => setStatus(w._id, "approved")}
                            className="text-xs px-3 py-1 rounded bg-green-500/20 border border-green-500/50">Approve</button>
                          <button onClick={() => setStatus(w._id, "rejected")}
                            className="text-xs px-3 py-1 rounded bg-red-500/20 border border-red-500/50">Reject</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}