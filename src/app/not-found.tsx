import { TextLink } from "@/components/shared/text-link";

export default function NotFound() {
  return (
    <section className="document-page">
      <p className="eyebrow">A missing page.</p>
      <h1>Nothing here just yet.</h1>
      <p className="my-6">
        This page may have moved, or the link may have taken a wrong turn.
      </p>
      <TextLink href="/">Back home</TextLink>
    </section>
  );
}
