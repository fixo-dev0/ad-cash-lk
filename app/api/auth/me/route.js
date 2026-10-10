export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User, Comment } from "@/lib/models";
import { getUserFromCookie } from "@/lib/auth";

export async function GET() {
  const auth = getUserFromCookie();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const user = await User.findById(auth.uid).lean();
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const lastReset = new Date(user.lastAdResetAt).getTime();
  if (Date.now() - lastReset >= 24 * 60 * 60 * 1000) {
    await User.updateOne({ _id: user._id }, { adsWatchedToday: 0, lastAdResetAt: new Date() });
    user.adsWatchedToday = 0;
    user.lastAdResetAt = new Date();
  }

  const myComments = await Comment.find({ userId: auth.uid, isPublic: false })
    .sort({ createdAt: -1 }).lean();

  return NextResponse.json({
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      balance: user.balance,
      adsWatchedToday: user.adsWatchedToday,
      totalAdsWatched: user.totalAdsWatched,
      lastAdResetAt: user.lastAdResetAt,
      referralCode: user.referralCode,
      referrals: user.referrals,
      referralEarnings: user.referralEarnings || 0,
    },
    myComments,
  });
      }
