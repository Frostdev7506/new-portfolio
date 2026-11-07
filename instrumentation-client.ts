import posthog from "posthog-js";

const posthogProjectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (!posthogProjectToken || !posthogHost) {
  if (process.env.NODE_ENV !== "production") {
    const missingVariable = posthogProjectToken
      ? "NEXT_PUBLIC_POSTHOG_HOST"
      : "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN";

    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    );
  }
} else {
  posthog.init(posthogProjectToken, {
    api_host: posthogHost,
    capture_exceptions: true,
    defaults: "2025-05-24",
    debug: process.env.NODE_ENV === "development",
  });
}
