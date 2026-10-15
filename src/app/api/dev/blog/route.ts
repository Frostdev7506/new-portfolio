export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ error: "Not found." }, { status: 404, headers: { "Cache-Control": "no-store" } });
  }
  const { assertEditorRequest, editorErrorResponse, getEditorIndex } = await import("@/lib/blog-editor");
  try {
    assertEditorRequest(request);
    return Response.json(await getEditorIndex(), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return editorErrorResponse(error);
  }
}
