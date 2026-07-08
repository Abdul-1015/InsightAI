import type { APIRoute } from "astro";
import { validateSessionToken, getUser } from "../../../lib/auth";
import { listDatasets } from "../../../lib/upload";

export const GET: APIRoute = async ({ cookies }) => {
  try {
    // Check authentication
    const sessionToken = cookies.get("session")?.value;
    if (!sessionToken) {
      return new Response(
        JSON.stringify({ ok: false, error: "Authentication required." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const session = await validateSessionToken(sessionToken);
    if (!session) {
      return new Response(
        JSON.stringify({ ok: false, error: "Invalid session." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const user = await getUser(session.userId);
    if (!user) {
      return new Response(
        JSON.stringify({ ok: false, error: "User not found." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const datasets = await listDatasets(user.id);
    return new Response(JSON.stringify({ ok: true, data: datasets }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to list datasets.";
    return new Response(
      JSON.stringify({ ok: false, error: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
