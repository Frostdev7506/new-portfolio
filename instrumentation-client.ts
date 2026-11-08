import posthog from "posthog-js";

const posthogProjectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (!posthogProjectToken || !posthogHost) {
  if (process.env.NODE_ENV !== "production") {
    const missingVariable = posthogProjectToken
      ? "NEXT_PUBLIC_POSTHOG_HOST"
      : "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN";

    console.warn(
      `PostHog analytics disabled: ${missingVariable} is not configured.`,
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
