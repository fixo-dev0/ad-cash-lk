import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";
import { signToken } from "@/lib/auth";

const schema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  password: z.string().min(6),
  referralCode: z.string().optional().or(z.literal("")),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    await connectDB();

    const exists = await User.findOne({
      $or: [{ username: data.username }, { email: data.email }],
    });
    if (exists) return NextResponse.json({ error: "Username or email already exists" }, { status: 400 });

    const passwordHash = await bcrypt.hash(data.password, 10);
    const refCode = data.username.toLowerCase() + Math.random().toString(36).slice(2, 6);

    const user = await User.create({
      username: data.username,
      email: data.email.toLowerCase(),
      passwordHash,
      referralCode: refCode,
      referredBy: data.referralCode || null,
    });

    if (data.referralCode) {
      const referrer = await User.findOne({ referralCode: data.referralCode });
      if (referrer && referrer.username !== user.username) {
        referrer.referrals.push(user.username);
        await referrer.save();
      }
    }

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
    return NextResponse.json({ error: e.message || "Registration failed" }, { status: 400 });
  }
}