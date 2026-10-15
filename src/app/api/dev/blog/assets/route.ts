export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ error: "Not found." }, { status: 404, headers: { "Cache-Control": "no-store" } });
  }
  const { editorErrorResponse, uploadEditorImage } = await import("@/lib/blog-editor");
  try {
    return Response.json(await uploadEditorImage(request), {
      status: 201,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return editorErrorResponse(error);
  }
}
