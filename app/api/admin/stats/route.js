import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";

export async function GET() {
  if (cookies().get("admin")?.value !== "1")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const [totalUsers, agg] = await Promise.all([
    User.countDocuments(),
    User.aggregate([
      { $group: { _id: null, totalBalance: { $sum: "$balance" }, adsToday: { $sum: "$adsWatchedToday" } } },
    ]),
  ]);

  const traffic = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      date: d.toLocaleDateString("en", { month: "short", day: "numeric" }),
      visitors: Math.floor(Math.random() * 900) + 400,
    };
  });

  return NextResponse.json({
    totalUsers,
    totalBalance: agg[0]?.totalBalance || 0,
    adsToday: agg[0]?.adsToday || 0,
    traffic,
  });
}