import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import User from "@/backend/models/user";
import { connectDB } from "@/backend/lib/db";

export async function POST() {
  await connectDB();

  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (refreshToken) {
    await User.updateOne(
      { refreshToken },
      { $unset: { refreshToken: "" } }
    );
  }

  const response = NextResponse.json({ success: true });

  // Clear access token
  response.cookies.set("accessToken", "", {
    expires: new Date(0),
    path: "/",
  });

  // Clear refresh token
  response.cookies.set("refreshToken", "", {
    expires: new Date(0),
    path: "/api/refresh",
  });

  return response;
}
