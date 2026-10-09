"use client";

import { useState, type FormEvent } from "react";
import emailjs from "@emailjs/browser";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/data/site";
import {
  contactMailto,
  validateContact,
  type ContactErrors,
} from "@/lib/contact";

const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
const canSend = Boolean(serviceId && templateId && publicKey);

export function ContactForm() {
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftLink, setDraftLink] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const values = {
      name: String(data.get("user_name") || "").trim(),
      email: String(data.get("user_email") || "").trim(),
      message: String(data.get("message") || "").trim(),
    };
    const nextErrors = validateContact(values);
    setErrors(nextErrors);
    setDraftLink("");

    if (Object.keys(nextErrors).length) {
      setStatus("Please check the highlighted fields.");
      const firstField = nextErrors.name
        ? "user_name"
        : nextErrors.email
          ? "user_email"
          : "message";
      (form.elements.namedItem(firstField) as HTMLElement)?.focus();
      return;
    }

    if (!serviceId || !templateId || !publicKey) {
      setDraftLink(contactMailto(siteConfig.email, values));
      setStatus(
        "Your email is ready. Open it in your email app to review and send.",
      );
      return;
    }

    setIsSubmitting(true);
    setStatus("");
    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          user_name: values.name,
          user_email: values.email,
          message: values.message,
          to_email: siteConfig.email,
        },
        { publicKey },
      );
      setStatus("Thanks — your message has been sent.");
      form.reset();
    } catch {
      setStatus(
        "Your message could not be sent. Your draft is still here; you can send it by email instead.",
      );
      setDraftLink(contactMailto(siteConfig.email, values));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="contact-form"
      onSubmit={onSubmit}
      noValidate
      onChange={() => {
        setDraftLink("");
        setStatus("");
      }}
    >
      <fieldset disabled={isSubmitting}>
        <legend className="sr-only">Send an enquiry</legend>
        <div className="form-field">
          <label htmlFor="user_name">Your name</label>
          <input
            id="user_name"
            name="user_name"
            autoComplete="name"
            placeholder="Your name"
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className="field-error">
              {errors.name}
            </p>
          )}
        </div>
        <div className="form-field">
          <label htmlFor="user_email">Email address</label>
          <input
            id="user_email"
            name="user_email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="field-error">
              {errors.email}
            </p>
          )}
        </div>
        <div className="form-field">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows={6}
            placeholder="Tell me a little about your idea…"
            required
            aria-invalid={Boolean(errors.message)}
            aria-describedby={
              errors.message ? "message-error message-hint" : "message-hint"
            }
          />
          {errors.message && (
            <p id="message-error" className="field-error">
              {errors.message}
            </p>
          )}
          <p id="message-hint" className="field-hint">
            Please include any useful context or links.
          </p>
        </div>
      </fieldset>
      {!canSend && (
        <p className="field-hint">
          Prepare a draft to send from your own email app.
        </p>
      )}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="primary-button"
        size="lg"
      >
        {isSubmitting ? "Sending…" : canSend ? "Send message" : "Prepare email"}
        <ArrowRight aria-hidden="true" />
      </Button>
      <div role="status" aria-live="polite" className="form-status">
        {status}
        {draftLink && (
          <a href={draftLink} className="text-link">
            Open email app <ArrowRight size={19} aria-hidden="true" />
          </a>
        )}
      </div>
    </form>
  );
}
