import { NextResponse } from "next/server";
import User from "@/backend/models/user";
import { getUserFromToken } from "@/backend/lib/auth";
import { connectDB } from "@/backend/lib/db";

export async function GET() {
  await connectDB();

  const auth = await getUserFromToken();
  if (auth.error) {
    return NextResponse.json({ loggedIn: false });
  }

  const user = await User.findById(auth.userId).select("name email").lean();
  if (!user) {
    return NextResponse.json({ loggedIn: false });
  }

  return NextResponse.json({
    loggedIn: true,
    user: { name: user.name, email: user.email },
  });
}
