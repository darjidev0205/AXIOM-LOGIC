import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import crypto from "crypto";

const SECRET = process.env.AUTH_SECRET;
if (!SECRET) throw new Error("AUTH_SECRET environment variable is not set. Set it in Vercel/Render environment variables.");
const COOKIE_NAME = "axiom_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// ── Token creation & verification ────────────────────────────────────────────

function sign(payload: string): string {
  const hmac = crypto.createHmac("sha256", SECRET!);
  hmac.update(payload);
  return hmac.digest("hex");
}

function encodeSession(data: SessionPayload): string {
  const json = JSON.stringify(data);
  const b64 = Buffer.from(json).toString("base64url");
  const sig = sign(b64);
  return `${b64}.${sig}`;
}

function decodeSession(token: string): SessionPayload | null {
  try {
    const dotIdx = token.lastIndexOf(".");
    if (dotIdx === -1) return null;
    const b64 = token.slice(0, dotIdx);
    const sig = token.slice(dotIdx + 1);
    const expected = sign(b64);
    // Constant-time comparison
    if (
      sig.length !== expected.length ||
      !crypto.timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"))
    ) {
      return null;
    }
    const json = Buffer.from(b64, "base64url").toString("utf-8");
    return JSON.parse(json) as SessionPayload;
  } catch {
    return null;
  }
}

// ── Session types ────────────────────────────────────────────────────────────

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
  exp: number; // Unix timestamp seconds
}

// ── Server-component helpers (use inside Server Components / Route Handlers) ─

export async function createSession(payload: Omit<SessionPayload, "exp">) {
  const cookieStore = await cookies();
  const full: SessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + COOKIE_MAX_AGE,
  };
  const token = encodeSession(full);
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = decodeSession(token);
  if (!payload) return null;
  if (payload.exp < Math.floor(Date.now() / 1000)) return null; // expired
  return payload;
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// ── Request-level helper (use in middleware / API route handlers) ─────────────

export function getSessionFromRequest(req: NextRequest): SessionPayload | null {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = decodeSession(token);
  if (!payload) return null;
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}

// ── Role helpers ─────────────────────────────────────────────────────────────

export function isAdmin(session: SessionPayload | null): boolean {
  return session?.role === "ADMIN";
}

export function isBusinessUser(session: SessionPayload | null): boolean {
  return (
    session?.role === "BUSINESS_OWNER" ||
    session?.role === "RETAILER" ||
    session?.role === "USER"
  );
}
