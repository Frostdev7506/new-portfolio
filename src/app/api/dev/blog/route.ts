import {
  assertEditorRequest,
  editorErrorResponse,
  getEditorIndex,
} from "@/lib/blog-editor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    assertEditorRequest(request);
    return Response.json(await getEditorIndex(), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return editorErrorResponse(error);
  }
}
