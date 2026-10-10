import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { password } = await req.json();
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });

  const ok = await bcrypt.compare(password || "", hash);
  if (!ok) return NextResponse.json({ error: "Invalid password" }, { status: 401 });

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin", "1", { httpOnly: true, path: "/", maxAge: 60 * 60 * 4 });
  return res;
}