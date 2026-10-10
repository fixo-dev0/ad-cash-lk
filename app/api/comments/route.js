import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Comment } from "@/lib/models";
import { getUserFromCookie } from "@/lib/auth";

export async function GET() {
  await connectDB();
  const comments = await Comment.find({ isPublic: true })
    .sort({ createdAt: -1 }).limit(20).lean();
  return NextResponse.json({ comments });
}

const schema = z.object({
  text: z.string().min(1).max(500),
  rating: z.number().min(1).max(5),
});

export async function POST(req) {
  const auth = getUserFromCookie();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = schema.parse(await req.json());
  await connectDB();

  const c = await Comment.create({
    userId: auth.uid,
    username: auth.username,
    text: body.text,
    rating: body.rating,
    isPublic: false, // private to user
  });

  return NextResponse.json({ comment: c });
}