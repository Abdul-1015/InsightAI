import type { APIRoute } from "astro";
import { validateSessionToken, getUser } from "../../../lib/auth";

export const GET: APIRoute = async ({ cookies }) => {
  const sessionToken = cookies.get("session")?.value;
  if (!sessionToken) {
    return new Response(JSON.stringify({ user: null }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const session = await validateSessionToken(sessionToken);
  if (!session) {
    return new Response(JSON.stringify({ user: null }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const user = await getUser(session.userId);
  if (!user) {
    return new Response(JSON.stringify({ user: null }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        provider: user.provider,
      },
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};
