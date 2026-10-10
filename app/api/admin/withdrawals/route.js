import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import { Withdrawal, User } from "@/lib/models";

export async function GET() {
  if (cookies().get("admin")?.value !== "1")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const withdrawals = await Withdrawal.find({}).sort({ createdAt: -1 }).limit(200).lean();
  return NextResponse.json({ withdrawals });
}

export async function PATCH(req) {
  if (cookies().get("admin")?.value !== "1")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const status = searchParams.get("status");
  if (!["approved", "rejected"].includes(status))
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });

  await connectDB();
  const w = await Withdrawal.findById(id);
  if (!w) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (w.status !== "pending") return NextResponse.json({ ok: true });

  w.status = status;
  await w.save();

  if (status === "approved") {
    await User.findByIdAndUpdate(w.userId, { $inc: { balance: -w.amount } });
  }
  return NextResponse.json({ ok: true });
}