import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/backend/models/user";
import { getUserFromToken } from "../../../backend/lib/auth";
import { connectDB } from "@/backend/lib/db";


export async function POST(req) {
  await connectDB();
  try {
    const { oldPassword, newPassword, confirmPassword } = await req.json();

    if (!oldPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { message: "New passwords do not match" },
        { status: 400 },
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    const auth = await getUserFromToken();
    if (auth.error) return auth.error;

    // console.log("url fetch", auth);
    const userId = auth.userId;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Plain text comparison (INSECURE)
    if (user.password !== oldPassword) {
      return NextResponse.json(
        { message: "Old password is incorrect" },
        { status: 401 },
      );
    }

    user.password = newPassword;
    await user.save();

    return NextResponse.json(
      { message: "Password changed successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}


export async function GET() {
  await connectDB();
  try {
    const auth = await getUserFromToken();
    if (!auth?.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(auth.userId)
      .select("email name")
      .lean();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.error("Get user error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
