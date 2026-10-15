import { editorErrorResponse, uploadEditorImage } from "@/lib/blog-editor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    return Response.json(await uploadEditorImage(request), {
      status: 201,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return editorErrorResponse(error);
  }
}
