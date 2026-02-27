import { NextResponse } from "next/server";
import { getGitHubRepos } from "@/lib/github";

export async function GET() {
  const repos = await getGitHubRepos();
  return NextResponse.json({ repos });
}
