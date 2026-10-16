import { TextLink } from "@/components/shared/text-link";

export default function NotFound() {
  return (
    <section className="document-page not-found-page">
      <h1>Nothing here just yet.</h1>
      <p>
        This page may have moved, or the link may have taken a wrong turn.
      </p>
      <TextLink href="/">Back home</TextLink>
    </section>
  );
}
