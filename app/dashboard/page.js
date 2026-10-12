"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";

const DAILY_LIMIT = 15;
const AD_REWARD = 0.30;
const AD_DURATION = 30;
const MONETAG_DIRECT_LINK = "https://uplcm.com/4/11999583";
const VIGNETTE_ZONE = "12010366";

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

  function tryTriggerVignette() {
    if (typeof window === "undefined") return false;
    const w = window;
    const names = [
      "show_vignette",
      "monetag_vignette",
      "vignette_show",
      `show_${VIGNETTE_ZONE}`,
      `showVignette_${VIGNETTE_ZONE}`,
      "monetag",
      "Monetag",
    ];
    for (const name of names) {
      try {
        if (typeof w[name] === "function") {
          w[name]();
          return true;
        }
      } catch {
        /* ignore */
      }
    }
    try {
      if (w.monetag && typeof w.monetag.show === "function") {
        w.monetag.show(VIGNETTE_ZONE);
        return true;
      }
    } catch {
      /* ignore */
    }
    return false;
  }

  function startWatch(slot) {
    if (watching !== null) return;

    const vignetteTriggered = tryTriggerVignette();

    if (!vignetteTriggered) {
      window.open(MONETAG_DIRECT_LINK, "_blank", "noopener,noreferrer");
    }

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

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  const slotsLeft = Math.max(0, DAILY_LIMIT - user.adsWatchedToday);
  const referralLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/register?ref=${user.referralCode}`
      : "";

  return (
    <main className="min-h-screen pb-20">
      <nav className="flex justify-between items-center px-6 py-4 max-w-6xl mx-auto border-b border-white/10">
        <Logo />
        <div className="flex gap-2 items-center">
          <Link href="/withdraw" className="btn-outline text-sm py-2">
            Withdraw
          </Link>
          <button
            onClick={logout}
            className="text-white/60 text-sm hover:text-white"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {msg && (
          <div className="bg-green-500/20 border border-green-500/50 text-green-200 p-3 rounded mb-4">
            {msg}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="text-white/60 text-sm mb-1">Balance</div>
            <div className="text-3xl font-bold text-gold">
              ${user.balance.toFixed(2)}
            </div>
          </div>
          <div className="card">
            <div className="text-white/60 text-sm mb-1">Ads Watched Today</div>
            <div className="text-3xl font-bold">
              {user.adsWatchedToday} / {DAILY_LIMIT}
            </div>
          </div>
          <div className="card">
            <div className="text-white/60 text-sm mb-1">Referrals</div>
            <div className="text-3xl font-bold">{user.referrals.length}</div>
            <div className="text-xs text-white/50">
              Earned: ${user.referralEarnings.toFixed(2)}
            </div>
          </div>
        </div>

        {slotsLeft === 0 && (
          <div className="card mb-8 text-center border-gold/50">
            <p className="text-gold font-semibold">Daily limit reached!</p>
            <p className="text-white/70">
              Next reset in: <span className="font-mono">{resetTimer}</span>
            </p>
          </div>
        )}

        <h2 className="text-xl font-bold mb-4">
          Watch Ads — ${AD_REWARD.toFixed(2)} each
        </h2>

        {watching !== null && (
          <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-lg bg-navy-900 border border-white/15 rounded-2xl overflow-hidden shadow-2xl animate-scale-in">
              <div className="flex justify-between items-center px-4 py-3 border-b border-white/10 bg-navy-950/50">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      canClaim ? "bg-green-400" : "bg-red-500 animate-pulse"
                    }`}
                  />
                  <h2 className="font-semibold text-sm">
                    {canClaim ? "Ad Complete" : "Ad Playing"}
                  </h2>
                </div>
                <button
                  onClick={cancelWatch}
                  className="text-white/50 hover:text-white text-2xl leading-none w-8 h-8 flex items-center justify-center"
                >
                  ×
                </button>
              </div>

              {!canClaim && (
                <div className="px-4 pt-3 pb-2">
                  <div className="flex justify-between text-xs text-white/60 mb-1.5">
                    <span>Time remaining</span>
                    <span className="text-gold font-mono font-bold">
                      {countdown}s
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-gold-400 to-gold-600 h-1.5 rounded-full transition-all duration-1000 ease-linear"
                      style={{
                        width: `${
                          ((AD_DURATION - countdown) / AD_DURATION) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              )}

              <div
                className="p-8 text-center"
                style={{
                  minHeight: "320px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {!canClaim ? (
                  <>
                    <div className="text-6xl mb-6 animate-pulse">📺</div>
                    <h2 className="text-2xl font-bold mb-3 text-white">
                      Ad is playing...
                    </h2>
                    <p className="text-white/60 mb-6 max-w-md">
                      Please wait and watch the ad
                    </p>
                    <div className="text-5xl font-bold text-gold mb-4 font-mono">
                      {countdown}s
                    </div>
                    <button
                      onClick={cancelWatch}
                      className="text-white/40 text-sm hover:text-white"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-7xl mb-4 animate-scale-in">✅</div>
                    <h2 className="text-2xl font-bold mb-2 text-white">
                      Ad Complete!
                    </h2>
                    <p className="text-white/60 mb-6">
                      Click below to claim your reward
                    </p>
                    <button
                      onClick={claimReward}
                      className="btn-gold px-10 py-3.5 text-base"
                    >
                      Claim ${AD_REWARD.toFixed(2)}
                    </button>
                  </>
                )}
              </div>

              {!canClaim && (
                <div className="px-4 py-3 text-center border-t border-white/10 bg-navy-950/50">
                  <p className="text-xs text-white/40">
                    ⏱️ Wait {countdown} seconds, then claim your reward
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {Array.from({ length: DAILY_LIMIT }).map((_, i) => {
            const done = i < user.adsWatchedToday;
            const disabled = done || slotsLeft === 0 || watching !== null;
            return (
              <div
                key={i}
                className={`card p-4 text-center ${done ? "opacity-50" : ""}`}
              >
                <div className="text-sm text-white/60 mb-2">Slot {i + 1}</div>
                {done ? (
                  <div className="text-green-400 font-semibold">✓ Done</div>
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
            <button
              onClick={() => {
                navigator.clipboard.writeText(referralLink);
                setMsg("Copied!");
                setTimeout(() => setMsg(""), 2000);
              }}
              className="btn-gold text-sm py-2 px-4"
            >
              Copy
            </button>
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
          <h3 className="font-semibold mb-3">
            Post a Comment (private to you)
          </h3>
          <form onSubmit={submitComment} className="flex gap-2">
            <input
              className="input"
              placeholder="Share your experience..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button type="submit" className="btn-gold text-sm py-2 px-4">
              Post
            </button>
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
