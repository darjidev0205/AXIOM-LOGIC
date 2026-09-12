import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });

    if (!user) {
      // Avoid timing attacks — still do a dummy compare
      await bcrypt.compare("dummy", "$2b$10$abcdefghijklmnopqrstuuABC123456789012345678901234567890");
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // If passwordHash is empty/placeholder (seeded data), allow in dev without checking password
    const isDev = process.env.NODE_ENV !== "production";
    const isRealBcryptHash = user.passwordHash && user.passwordHash.startsWith("$2");
    let passwordValid = false;

    if (isRealBcryptHash) {
      // Production-grade: verify against real bcrypt hash
      passwordValid = await bcrypt.compare(password ?? "", user.passwordHash);
    } else if (isDev) {
      // Dev mode: seeded users have mock hashes — accept any password so you can log in immediately
      passwordValid = true;
    }

    if (!passwordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Issue signed session cookie
    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    // Log audit event (best-effort, non-blocking)
    prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: "LOGIN",
        targetId: user.id,
        targetType: "User",
        ipAddress: request.headers.get("x-forwarded-for") ?? "unknown",
      },
    }).catch(() => {});

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      redirectTo: user.role === "ADMIN" ? "/admin" : "/connection",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Authentication error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
