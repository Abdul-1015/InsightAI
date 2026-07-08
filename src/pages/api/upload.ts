import type { APIRoute } from "astro";
import { validateSessionToken, getUser } from "../../lib/auth";
import { validateFile, saveDataset } from "../../lib/upload";

export const POST: APIRoute = async ({ request, cookies }) => {
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

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return new Response(
        JSON.stringify({ ok: false, error: "No file provided." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate file
    const validation = validateFile(file.name, file.type, file.size);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ ok: false, error: validation.error }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Read file buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Generate dataset ID
    const datasetId = crypto.randomUUID();

    // Save dataset to storage and database
    const dataset = await saveDataset(
      datasetId,
      user.id,
      file.name,
      validation.fileType!,
      file.size,
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
