"use client";

import { ArrowRight, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContactForm } from "./use-contact-form";

export function ContactForm() {
  const { errors, status, isSubmitting, draftLink, canSend, onSubmit, clearStatus } =
    useContactForm();
  const submitLabel = canSend ? "Send message" : "Prepare email";

  return (
    <form
      className="contact-form"
      onSubmit={onSubmit}
      noValidate
      onChange={clearStatus}
      aria-busy={isSubmitting}
    >
      <fieldset disabled={isSubmitting}>
        <legend className="sr-only">Send an enquiry</legend>
        <div className="form-field">
          <label htmlFor="user_name">Your name</label>
          <input
            id="user_name"
            name="user_name"
            autoComplete="name"
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
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
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
        {isSubmitting ? "Sending…" : submitLabel}
        {isSubmitting ? (
          <LoaderCircle className="contact-submit-spinner" aria-hidden="true" />
        ) : (
          <ArrowRight aria-hidden="true" />
        )}
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
