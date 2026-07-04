// POST /api/refresh
import jwt from "jsonwebtoken";
import User from "@/backend/models/user";
import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/db";

export async function POST(req) {
  await connectDB();

  const refreshToken = req.cookies.get("refreshToken")?.value;
  if (!refreshToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
  }

  const user = await User.findById(payload.userId);
  if (!user || user.refreshToken !== refreshToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Issue new access token
  const newAccessToken = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );

  const response = NextResponse.json({ success: true });

  response.cookies.set("accessToken", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 15,
  });

  return response;
}
