import type { APIRoute } from "astro";
import { google } from "../../../../lib/auth";

function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export const GET: APIRoute = async ({ redirect, cookies }) => {
  const state = crypto.randomUUID();
  const codeVerifier = generateCodeVerifier();
  const scopes = ["openid", "profile", "email"];
  const url = google.createAuthorizationURL(state, codeVerifier, scopes);

  cookies.set("oauth_code_verifier", codeVerifier, {
    path: "/",
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "lax",
    maxAge: 600,
  });

  return redirect(url.toString(), 302);
};
