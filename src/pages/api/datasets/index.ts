import type { APIRoute } from "astro";
import { validateFile, parseFile, saveDataset, listDatasets } from "../../../lib/upload";

export const GET: APIRoute = async () => {
  const datasets = await listDatasets();
  return new Response(JSON.stringify({ ok: true, data: datasets }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return new Response(
        JSON.stringify({ ok: false, error: "No file provided." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const validation = validateFile(file.name, file.type, file.size);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ ok: false, error: validation.error }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const parsed = parseFile(buffer, validation.fileType!);

    const id = crypto.randomUUID();
    const dataset = await saveDataset(
      id,
      file.name,
      validation.fileType!,
      file.size,
      parsed.totalCount,
      parsed.columns,
      buffer
    );

    return new Response(
      JSON.stringify({ ok: true, data: dataset }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed.";
    return new Response(
      JSON.stringify({ ok: false, error: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
