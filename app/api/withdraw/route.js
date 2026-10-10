import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { User, Withdrawal } from "@/lib/models";
import { getUserFromCookie } from "@/lib/auth";

const schema = z.object({
  amount: z.number().positive(),
  method: z.enum(["paypal", "usdt"]),
  address: z.string().min(3),
});

export async function POST(req) {
  const auth = getUserFromCookie();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = schema.parse(await req.json());
  await connectDB();
  const user = await User.findById(auth.uid);

  if (user.totalAdsWatched < 80) return NextResponse.json({ error: "Task 1 not complete" }, { status: 400 });
  if (user.referrals.length < 5) return NextResponse.json({ error: "Task 2 not complete" }, { status: 400 });
  if (user.balance <= 10) return NextResponse.json({ error: "Task 3 not complete" }, { status: 400 });
  if (body.amount > user.balance) return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });

  await Withdrawal.create({
    userId: user._id.toString(),
    username: user.username,
    amount: body.amount,
    method: body.method,
    address: body.address,
    status: "pending",
  });

  return NextResponse.json({ ok: true });
}