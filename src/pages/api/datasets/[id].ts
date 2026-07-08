import type { APIRoute } from "astro";
import { validateSessionToken, getUser } from "../../../lib/auth";
import { getDatasetDetail, deleteDataset } from "../../../lib/upload";

export const GET: APIRoute = async ({ params, cookies }) => {
  try {
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

    const id = params.id;
    if (!id) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing dataset id." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const detail = await getDatasetDetail(id, user.id);
    if (!detail) {
      return new Response(
        JSON.stringify({ ok: false, error: "Dataset not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ ok: true, data: detail }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to get dataset.";
    return new Response(
      JSON.stringify({ ok: false, error: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const DELETE: APIRoute = async ({ params, cookies }) => {
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

    const id = params.id;
    if (!id) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing dataset id." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const deleted = await deleteDataset(id, user.id);
    if (!deleted) {
      return new Response(
        JSON.stringify({ ok: false, error: "Dataset not found or delete failed." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete dataset.";
    return new Response(
      JSON.stringify({ ok: false, error: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
