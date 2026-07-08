import type { APIRoute } from "astro";
import {
  google,
  upsertUser,
  createSessionToken,
  setSessionCookie,
  SESSION_MAX_AGE,
} from "../../../../lib/auth";

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const code = url.searchParams.get("code");
  if (!code) {
    return redirect("/signin?error=missing_code", 302);
  }

  const codeVerifier = cookies.get("oauth_code_verifier")?.value;
  if (!codeVerifier) {
    return redirect("/signin?error=missing_code_verifier", 302);
  }

  cookies.delete("oauth_code_verifier", { path: "/" });

  try {
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);
    const accessToken = tokens.accessToken();

    const userResponse = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!userResponse.ok) {
      return redirect("/signin?error=userinfo_failed", 302);
    }

    const userinfo = await userResponse.json();
    const user = await upsertUser({
      email: userinfo.email,
      name: userinfo.name || userinfo.email,
      avatar: userinfo.picture || null,
      provider: "google",
    });

    const token = await createSessionToken(user.id);
    setSessionCookie(cookies, token, SESSION_MAX_AGE);

    return redirect("/dashboard", 302);
  } catch (err) {
    console.error("Google OAuth callback error:", err);
    return redirect("/signin?error=oauth_failed", 302);
  }
};
