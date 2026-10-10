"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";

const DAILY_LIMIT = 15;
const AD_REWARD = 0.30;
const AD_DURATION = 30; // තත්පර 30
const MONETAG_DIRECT_LINK = "https://uplcm.com/4/11999583"; // ඔබේ ලින්ක් එක

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [myComments, setMyComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [watching, setWatching] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [canClaim, setCanClaim] = useState(false);
  const [resetTimer, setResetTimer] = useState("");
  const [msg, setMsg] = useState("");
  const timerRef = useRef(null);

  async function load() {
    const res = await fetch("/api/auth/me");
    if (!res.ok) return router.push("/login");
    const data = await res.json();
    setUser(data.user);
    setMyComments(data.myComments || []);
  }

  async function loadComments() {
    const res = await fetch("/api/comments");
    const data = await res.json();
    setComments(data.comments || []);
  }

  useEffect(() => {
    load();
    loadComments();
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (!user) return;
    const t = setInterval(() => {
      const last = new Date(user.lastAdResetAt).getTime();
      const next = last + 24 * 60 * 60 * 1000;
      const diff = next - Date.now();
      if (diff <= 0) {
        setResetTimer("");
        load();
      } else {
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setResetTimer(`${h}h ${m}m ${s}s`);
      }
    }, 1000);
    return () => clearInterval(t);
  }, [user]);

  function startWatch(slot) {
    if (watching !== null) return;

    // Monetag ලින්ක් එක අලුත් ටැබ් එකක open කරනවා
    window.open(MONETAG_DIRECT_LINK, "_blank");

    // ඔරිජිනල් පිටුවේ ටයිමර් එක පටන් ගන්නවා
    setWatching(slot);
    setCountdown(AD_DURATION);
    setCanClaim(false);

    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timerRef.current);
          setCanClaim(true);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }

  async function claimReward() {
    const res = await fetch("/api/ads/watch", { method: "POST" });
    const data = await res.json();
    if (res.ok) {
      setMsg(`+$${AD_REWARD.toFixed(2)} added!`);
      setTimeout(() => setMsg(""), 3000);
      setWatching(null);
      setCanClaim(false);
      load();
    } else {
      setMsg(data.error || "Error");
      setTimeout(() => setMsg(""), 3000);
    }
  }

  function cancelWatch() {
    clearInterval(timerRef.current);
    setWatching(null);
    setCanClaim(false);
    setCountdown(0);
  }

  async function submitComment(e) {
    e.preventDefault();
    if (!newComment.trim()) return;
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newComment, rating: 5 }),
    });
    if (res.ok) {
      setNewComment("");
      load();
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const slotsLeft = Math.max(0, DAILY_LIMIT - user.adsWatchedToday);
  const referralLink = typeof window !== "undefined"
    ? `${window.location.origin}/register?ref=${user.referralCode}` : "";

  return (
    <main className="min-h-screen pb-20">
      <nav className="flex justify-between items-center px-6 py-4 max-w-6xl mx-auto border-b border-white/10">
        <Logo />
        <div className="flex gap-2 items-center">
          <Link href="/withdraw" className="btn-outline text-sm py-2">Withdraw</Link>
          <button onClick={logout} className="text-white/60 text-sm hover:text-white">Logout</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {msg && <div className="bg-green-500/20 border border-green-500/50 text-green-200 p-3 rounded mb-4">{msg}</div>}

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="text-white/60 text-sm mb-1">Balance</div>
            <div className="text-3xl font-bold text-gold">${user.balance.toFixed(2)}</div>
          </div>
          <div className="card">
            <div className="text-white/60 text-sm mb-1">Ads Watched Today</div>
            <div className="text-3xl font-bold">{user.adsWatchedToday} / {DAILY_LIMIT}</div>
          </div>
          <div className="card">
            <div className="text-white/60 text-sm mb-1">Referrals</div>
            <div className="text-3xl font-bold">{user.referrals.length}</div>
            <div className="text-xs text-white/50">Earned: ${user.referralEarnings.toFixed(2)}</div>
          </div>
        </div>

        {slotsLeft === 0 && (
          <div className="card mb-8 text-center border-gold/50">
            <p className="text-gold font-semibold">Daily limit reached!</p>
            <p className="text-white/70">Next reset in: <span className="font-mono">{resetTimer}</span></p>
          </div>
        )}

        <h2 className="text-xl font-bold mb-4">Watch Ads — ${AD_REWARD.toFixed(2)} each</h2>

        {watching !== null && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="card max-w-md w-full text-center">
              {!canClaim ? (
                <>
                  <div className="text-6xl mb-4">📺</div>
                  <h2 className="text-xl font-bold mb-2">Ad is playing...</h2>
                  <p className="text-white/70 mb-6">Please wait and watch the ad</p>

                  <div className="text-5xl font-bold text-gold mb-6">{countdown}s</div>

                  <div className="w-full bg-white/10 rounded-full h-3 mb-6">
                    <div
                      className="bg-gold h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${((AD_DURATION - countdown) / AD_DURATION) * 100}%` }}
                    />
                  </div>

                  <p className="text-white/60 text-sm mb-4">
                    Ad opens in a new tab. Return after watching.
                  </p>

                  <button onClick={cancelWatch} className="text-white/40 text-xs hover:text-white">
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4">✅</div>
                  <h2 className="text-xl font-bold mb-2">Ad Complete!</h2>
                  <p className="text-white/70 mb-6">Click below to claim your reward</p>

                  <button
                    onClick={claimReward}
                    className="btn-gold w-full"
                  >
                    Claim ${AD_REWARD.toFixed(2)}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {Array.from({ length: DAILY_LIMIT }).map((_, i) => {
            const done = i < user.adsWatchedToday;
            const disabled = done || slotsLeft === 0 || watching !== null;
            return (
              <div key={i} className={`card p-4 text-center ${done ? "opacity-50" : ""}`}>
                <div className="text-sm text-white/60 mb-2">Slot {i + 1}</div>
                {done ? (
                  <div className="text-green-400">✓ Done</div>
                ) : (
                  <button
                    onClick={() => startWatch(i)}
                    disabled={disabled}
                    className="btn-gold text-xs py-2 w-full disabled:opacity-40"
                  >
                    Watch Ad
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="card mb-8">
          <h3 className="font-semibold mb-2">Your Referral Link</h3>
          <div className="flex gap-2">
            <input className="input text-sm" readOnly value={referralLink} />
            <button onClick={() => { navigator.clipboard.writeText(referralLink); setMsg("Copied!"); setTimeout(() => setMsg(""), 2000); }}
              className="btn-gold text-sm py-2 px-4">Copy</button>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">Community Comments</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {comments.map((c) => (
            <div key={c._id} className="card">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">{c.username}</span>
                <span className="text-gold">{"★".repeat(c.rating)}</span>
              </div>
              <p className="text-white/80 text-sm">{c.text}</p>
            </div>
          ))}
        </div>

        <div className="card mb-4">
          <h3 className="font-semibold mb-3">Post a Comment (private to you)</h3>
          <form onSubmit={submitComment} className="flex gap-2">
            <input className="input" placeholder="Share your experience..." value={newComment}
              onChange={(e) => setNewComment(e.target.value)} />
            <button type="submit" className="btn-gold text-sm py-2 px-4">Post</button>
          </form>
        </div>

        {myComments.length > 0 && (
          <>
            <h3 className="font-semibold mb-3">Your Private Comments</h3>
            <div className="space-y-2">
              {myComments.map((c) => (
                <div key={c._id} className="card text-sm">
                  <div className="text-gold mb-1">{"★".repeat(c.rating)}</div>
                  <p>{c.text}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
    }
