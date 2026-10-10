import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";
import { signToken } from "@/lib/auth";

const schema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
});

// Simple in-memory rate limiter
const attempts = new Map();

export async function POST(req) {
  try {
    const { identifier, password } = schema.parse(await req.json());
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const key = `${ip}:${identifier.toLowerCase()}`;
    const now = Date.now();
    const rec = attempts.get(key) || { count: 0, first: now };

    if (now - rec.first > 15 * 60 * 1000) { rec.count = 0; rec.first = now; }
    if (rec.count >= 10) {
      return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
    }

    await connectDB();
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier.toLowerCase() }],
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      rec.count++;
      attempts.set(key, rec);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (user.banned) return NextResponse.json({ error: "Account banned" }, { status: 403 });

    attempts.delete(key);

    const token = signToken({ uid: user._id.toString(), username: user.username });
    const res = NextResponse.json({ ok: true });
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (e) {
    return NextResponse.json({ error: e.message || "Login failed" }, { status: 400 });
  }
}