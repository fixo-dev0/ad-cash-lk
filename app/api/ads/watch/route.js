import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";
import { getUserFromCookie } from "@/lib/auth";

const AD_REWARD = 0.30;
const DAILY_LIMIT = 15;

export async function POST() {
  const auth = getUserFromCookie();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const user = await User.findById(auth.uid);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const lastReset = new Date(user.lastAdResetAt).getTime();
  if (Date.now() - lastReset >= 24 * 60 * 60 * 1000) {
    user.adsWatchedToday = 0;
    user.lastAdResetAt = new Date();
  }

  if (user.adsWatchedToday >= DAILY_LIMIT) {
    return NextResponse.json({ error: "Daily limit reached" }, { status: 400 });
  }

  user.adsWatchedToday += 1;
  user.totalAdsWatched += 1;
  user.balance = +(user.balance + AD_REWARD).toFixed(2);

  // Credit referrer 10%
  if (user.referredBy) {
    const referrer = await User.findOne({ referralCode: user.referredBy });
    if (referrer) {
      referrer.referralEarnings = +((referrer.referralEarnings || 0) + AD_REWARD * 0.1).toFixed(4);
      referrer.balance = +(referrer.balance + AD_REWARD * 0.1).toFixed(4);
      await referrer.save();
    }
  }

  await user.save();
  return NextResponse.json({ ok: true, balance: user.balance, adsWatchedToday: user.adsWatchedToday });
}