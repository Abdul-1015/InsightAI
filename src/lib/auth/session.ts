import type { AstroCookies } from "astro";
import { eq, and, gt } from "drizzle-orm";
import { getDb } from "../db";
import { sessions } from "../db/schema";
import { SESSION_SECRET } from "./config";

const encoder = new TextEncoder();
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

async function getKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function generateSessionToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function signToken(token: string): Promise<string> {
  const key = await getKey();
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(token));
  const signature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)));
  return `${token}.${signature}`;
}

async function verifySignedToken(signed: string): Promise<string | null> {
  try {
    const key = await getKey();
    const dotIndex = signed.lastIndexOf(".");
    if (dotIndex === -1) return null;

    const token = signed.slice(0, dotIndex);
    const signatureBase64 = signed.slice(dotIndex + 1);

    const signatureBytes = Uint8Array.from(atob(signatureBase64), (c) => c.charCodeAt(0));
    const valid = await crypto.subtle.verify("HMAC", key, signatureBytes, encoder.encode(token));
    return valid ? token : null;
  } catch {
    return null;
  }
}

export async function createSessionToken(userId: string): Promise<string> {
  const db = getDb();
  const rawToken = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);

  await db.insert(sessions).values({
    userId,
    token: rawToken,
    expiresAt,
  });

  return signToken(rawToken);
}

export async function validateSessionToken(
  signedToken: string
): Promise<{ userId: string } | null> {
  try {
    const token = await verifySignedToken(signedToken);
    if (!token) return null;

    const db = getDb();
    const now = new Date();
    const rows = await db
      .select()
      .from(sessions)
      .where(and(eq(sessions.token, token), gt(sessions.expiresAt, now)))
      .limit(1);

    if (rows.length === 0) return null;
    return { userId: rows[0].userId };
  } catch {
    return null;
  }
}

export async function deleteSession(signedToken: string): Promise<void> {
  try {
    const token = await verifySignedToken(signedToken);
    if (!token) return;

    const db = getDb();
    await db.delete(sessions).where(eq(sessions.token, token));
  } catch {
    // ignore errors on cleanup
  }
}

export function setSessionCookie(
  cookies: AstroCookies,
  token: string,
  maxAge: number
) {
  cookies.set("session", token, {
    path: "/",
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "lax",
    maxAge,
  });
}

export function clearSessionCookie(cookies: AstroCookies) {
  cookies.delete("session", { path: "/" });
}
