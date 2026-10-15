export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(request: Request, context: RouteContext) {
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ error: "Not found." }, { status: 404, headers: { "Cache-Control": "no-store" } });
  }
  const { assertEditorRequest, editorErrorResponse, getEditorDocument } = await import("@/lib/blog-editor");
  try {
    assertEditorRequest(request);
    const { slug } = await context.params;
    return Response.json(await getEditorDocument(slug), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return editorErrorResponse(error);
  }
}

export async function PUT(request: Request, context: RouteContext) {
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ error: "Not found." }, { status: 404, headers: { "Cache-Control": "no-store" } });
  }
  const { assertEditorRequest, editorErrorResponse, readEditorJson, saveEditorDocument } = await import("@/lib/blog-editor");
  try {
    assertEditorRequest(request, true);
    const { slug } = await context.params;
    const input = await readEditorJson(request);
    return Response.json(await saveEditorDocument(slug, input), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return editorErrorResponse(error);
  }
}
