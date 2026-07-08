import type { APIRoute } from "astro";
import { deleteSession, clearSessionCookie } from "../../../lib/auth";

export const POST: APIRoute = async ({ cookies, redirect }) => {
  const sessionToken = cookies.get("session")?.value;
  if (sessionToken) {
    await deleteSession(sessionToken);
  }
  clearSessionCookie(cookies);
  return redirect("/", 302);
};

export const GET: APIRoute = async ({ cookies, redirect }) => {
  const sessionToken = cookies.get("session")?.value;
  if (sessionToken) {
    await deleteSession(sessionToken);
  }
  clearSessionCookie(cookies);
  return redirect("/", 302);
};
