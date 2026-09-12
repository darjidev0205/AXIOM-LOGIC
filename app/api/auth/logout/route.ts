import { NextResponse } from "next/server";
import { getSession, clearSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (session) {
      prisma.auditLog.create({
        data: {
          actorId: session.userId,
          action: "LOGOUT",
          targetId: session.userId,
          targetType: "User",
          ipAddress: request.headers.get("x-forwarded-for") ?? "unknown",
        },
      }).catch(() => {});
    }
    await clearSession();
    return NextResponse.redirect(new URL("/", request.url));
  } catch {
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}

