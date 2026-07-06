import type { AstroCookies } from "astro";
import { SESSION_SECRET } from "./config";

const encoder = new TextEncoder();

async function getKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createSessionToken(userId: string): Promise<string> {
  const key = await getKey();
  const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30;
  const data = encoder.encode(`${userId}:${expiresAt}`);
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, data);
  const signature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)));
  return `${userId}:${expiresAt}.${signature}`;
}

export async function validateSessionToken(
  token: string
): Promise<{ userId: string } | null> {
  try {
    const key = await getKey();
    const dotIndex = token.lastIndexOf(".");
    if (dotIndex === -1) return null;

    const payloadPart = token.slice(0, dotIndex);
    const signatureBase64 = token.slice(dotIndex + 1);

    const colonIndex = payloadPart.indexOf(":");
    if (colonIndex === -1) return null;

    const userId = payloadPart.slice(0, colonIndex);
    const expiresAt = parseInt(payloadPart.slice(colonIndex + 1), 10);

    if (!userId || isNaN(expiresAt) || Date.now() / 1000 > expiresAt) {
      return null;
    }

    const data = encoder.encode(payloadPart);
    const signatureBytes = Uint8Array.from(atob(signatureBase64), (c) =>
      c.charCodeAt(0)
    );
    const valid = await crypto.subtle.verify("HMAC", key, signatureBytes, data);

    return valid ? { userId } : null;
  } catch {
    return null;
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
