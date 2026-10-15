import {
  assertEditorRequest,
  editorErrorResponse,
  getEditorDocument,
  readEditorJson,
  saveEditorDocument,
} from "@/lib/blog-editor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(request: Request, context: RouteContext) {
  try {
    assertEditorRequest(request);
    const { slug } = await context.params;
    return Response.json(await getEditorDocument(slug), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return editorErrorResponse(error);
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    assertEditorRequest(request, true);
    const { slug } = await context.params;
    const input = await readEditorJson(request);
    return Response.json(await saveEditorDocument(slug, input), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return editorErrorResponse(error);
  }
}
