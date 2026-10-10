"use client";

import { useState, type FormEvent } from "react";
import emailjs from "@emailjs/browser";
import { siteConfig } from "@/data/site";
import { contactMailto, validateContact, type ContactErrors } from "@/lib/contact";

const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
const canSend = Boolean(serviceId && templateId && publicKey);

export function useContactForm() {
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
      let firstField = "message";
      if (nextErrors.name) firstField = "user_name";
      else if (nextErrors.email) firstField = "user_email";
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

  function clearStatus() {
    setDraftLink("");
    setStatus("");
  }

  return { errors, status, isSubmitting, draftLink, canSend, onSubmit, clearStatus };
}
