export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Comment } from "@/lib/models";

const fakeComments = [
  { username: "Kasun Perera", text: "Got my payment within 24 hours, legit site!", rating: 5 },
  { username: "Nimal Silva", text: "Best GPT site in Sri Lanka. Highly recommend!", rating: 5 },
  { username: "Chamara Fernando", text: "Simple, easy, and payments are fast. 5 stars!", rating: 5 },
  { username: "Dilshan Jayawardena", text: "Been using for 2 months, never had an issue.", rating: 5 },
  { username: "John Smith", text: "USDT payout arrived in 3 hours. Amazing service!", rating: 5 },
  { username: "Ahmed Khan", text: "Trusted platform. PayPal withdrawal worked perfectly.", rating: 5 },
  { username: "Sarah Johnson", text: "Earned $45 this month on breaks. Great side income!", rating: 5 },
  { username: "Thilina Bandara", text: "Referral program is legit - earned extra $20 this week.", rating: 5 },
];

export async function GET() {
  await connectDB();
  const count = await Comment.countDocuments({ isPublic: true });
  if (count > 0) return NextResponse.json({ message: "Already seeded", count });

  await Comment.insertMany(fakeComments.map((c) => ({ ...c, isPublic: true })));
  return NextResponse.json({ ok: true, seeded: fakeComments.length });
}
