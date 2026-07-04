import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function getUserFromToken() {
  const cookieStore = await cookies(); // no need for await
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return {
      error: NextResponse.json(
        { error: "Unauthorized - No access token" },
        { status: 401 }
      ),
    };
  }

  try {
    const payload = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET
    );

    return {
      userId: payload.userId,
    };
  } catch (err) {
    return {
      error: NextResponse.json(
        { error: "Access token expired or invalid" },
        { status: 401 }
      ),
    };
  }
}
