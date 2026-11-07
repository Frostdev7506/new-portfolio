import { SeverityNumber } from "@opentelemetry/api-logs";
import { NextResponse, after } from "next/server";
import { posthogLoggerProvider } from "@/instrumentation";
import { getGitHubRepos } from "@/lib/github";

const posthogLogger = posthogLoggerProvider?.getLogger("portfolio-posthog-logs");

export async function GET() {
  const repos = await getGitHubRepos();

  posthogLogger?.emit({
    body: "github_repositories_served",
    severityNumber: SeverityNumber.INFO,
    attributes: {
      repository_count: repos.length,
    },
  });

  if (posthogLoggerProvider) {
    const loggerProvider = posthogLoggerProvider;
    after(() => {
      void loggerProvider.forceFlush().catch(() => {});
    });
  }

  return NextResponse.json({ repos });
}
