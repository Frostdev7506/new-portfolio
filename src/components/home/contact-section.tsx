"use client";

import { FormEvent, useMemo, useState } from "react";
import emailjs from "@emailjs/browser";
import { siteConfig } from "@/data/site";

type ContactErrors = {
  name?: string;
  email?: string;
  message?: string;
};

const isValidEmail = (input: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(input);
};

export function ContactSection() {
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailJsConfig = useMemo(
    () => ({
      serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
      publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
    }),
    [],
  );

  const canSend = Boolean(
    emailJsConfig.serviceId && emailJsConfig.templateId && emailJsConfig.publicKey,
  );

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const values = {
      name: String(formData.get("user_name") || "").trim(),
      email: String(formData.get("user_email") || "").trim(),
      message: String(formData.get("message") || "").trim(),
    };

    const nextErrors: ContactErrors = {};

    if (values.name.length < 3) {
      nextErrors.name = "Name must be at least 3 characters.";
    }

    if (!isValidEmail(values.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (values.message.length < 10) {
      nextErrors.message = "Message must be at least 10 characters.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("Please fix the errors before submitting.");
      return;
    }

    if (!canSend) {
      setStatus("Email service is not configured. Use the email link below.");
      return;
    }

    setIsSubmitting(true);
    setStatus("");

    try {
      await emailjs.send(
        emailJsConfig.serviceId as string,
        emailJsConfig.templateId as string,
        {
          user_name: values.name,
          user_email: values.email,
          message: values.message,
          to_email: siteConfig.email,
        },
        { publicKey: emailJsConfig.publicKey },
      );

      setStatus("Message sent successfully.");
      form.reset();
      setErrors({});
    } catch {
      setStatus("Unable to send right now. Please use direct email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="grid gap-8 rounded-3xl border border-border bg-white p-6 shadow-sm dark:bg-slate-900 md:grid-cols-[1fr_0.85fr] md:p-8"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-brand-700 dark:text-brand-300">Contact</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">Contact Me</h2>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          Reach out for full-time opportunities, consulting, or engineering collaboration.
        </p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="user_name">
              Name
            </label>
            <input
              id="user_name"
              name="user_name"
              type="text"
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none ring-brand-400 transition focus:ring-2 dark:bg-slate-950"
              placeholder="Enter your name"
            />
            {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name}</p> : null}
          </div>

          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
              htmlFor="user_email"
            >
              Email
            </label>
            <input
              id="user_email"
              name="user_email"
              type="email"
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none ring-brand-400 transition focus:ring-2 dark:bg-slate-950"
              placeholder="Enter your email"
            />
            {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email}</p> : null}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none ring-brand-400 transition focus:ring-2 dark:bg-slate-950"
              placeholder="Enter your message"
            />
            {errors.message ? <p className="mt-1 text-xs text-red-600">{errors.message}</p> : null}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>

          {status ? <p className="text-sm text-slate-600 dark:text-slate-300">{status}</p> : null}
        </form>
      </div>

      <aside className="rounded-2xl border border-border bg-[linear-gradient(135deg,rgba(20,184,166,0.14),rgba(14,165,233,0.12),rgba(15,23,42,0.05))] p-6">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Direct Contact</h3>
        <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">
          If the form is unavailable, you can always reach me directly.
        </p>

        <ul className="mt-5 space-y-3 text-sm text-slate-700 dark:text-slate-200">
          <li>
            Email: <a className="font-medium underline" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          </li>
          <li>
            GitHub: <a className="font-medium underline" href={siteConfig.social.github}>{siteConfig.githubUsername}</a>
          </li>
          <li>
            LinkedIn: <a className="font-medium underline" href={siteConfig.social.linkedin}>View Profile</a>
          </li>
        </ul>
      </aside>
    </section>
  );
}
