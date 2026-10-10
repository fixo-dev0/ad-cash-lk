import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";

export async function GET() {
  if (cookies().get("admin")?.value !== "1")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const users = await User.find({})
    .select("username email balance totalAdsWatched adsWatchedToday banned createdAt")
    .sort({ createdAt: -1 }).limit(200).lean();
  return NextResponse.json({ users });
}

export async function PATCH(req) {
  if (cookies().get("admin")?.value !== "1")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  await connectDB();
  const u = await User.findById(id);
  if (!u) return NextResponse.json({ error: "Not found" }, { status: 404 });
  u.banned = !u.banned;
  await u.save();
  return NextResponse.json({ ok: true, banned: u.banned });
}