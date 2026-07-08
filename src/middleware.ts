import { defineMiddleware } from "astro:middleware";
import { validateSessionToken } from "./lib/auth";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/upload",
  "/chat",
  "/builder",
  "/insights",
  "/reports",
  "/projects",
  "/settings",
];

export const onRequest = defineMiddleware(
  async ({ url, cookies, redirect, locals }, next) => {
    const path = url.pathname;
    const isProtected = PROTECTED_PREFIXES.some(
      (prefix) => path === prefix || path.startsWith(prefix + "/")
    );

    const sessionToken = cookies.get("session")?.value;
    let userId: string | null = null;

    if (sessionToken) {
      const session = await validateSessionToken(sessionToken);
      if (session) {
        userId = session.userId;
      } else {
        cookies.delete("session", { path: "/" });
      }
    }

    locals.userId = userId;

    if (isProtected && !userId) {
      return redirect("/signin", 302);
    }

    return next();
  }
);
