import { getSession } from "@/lib/auth-client";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(session);
}
