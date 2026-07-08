import type { APIRoute } from "astro";
import { getDatasetPreview, deleteDataset } from "../../../lib/upload";

export const GET: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) {
    return new Response(
      JSON.stringify({ ok: false, error: "Missing dataset id." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const preview = await getDatasetPreview(id);
  if (!preview) {
    return new Response(
      JSON.stringify({ ok: false, error: "Dataset not found." }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ ok: true, data: preview }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};

export const DELETE: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) {
    return new Response(
      JSON.stringify({ ok: false, error: "Missing dataset id." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const deleted = await deleteDataset(id);
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
};
