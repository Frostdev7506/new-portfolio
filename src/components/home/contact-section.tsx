"use client";

import { FormEvent, useMemo, useState } from "react";
import { Clock3, Github, Linkedin, Mail, Send, ShieldCheck, Sparkles } from "lucide-react";
import emailjs from "@emailjs/browser";
import { siteConfig } from "@/data/site";

type ContactErrors = {
  name?: string;
  email?: string;
  message?: string;
};

type ContactValues = {
  name: string;
  email: string;
  message: string;
};

type ContactTone = "neutral" | "success" | "error";

const emptyValues: ContactValues = {
  name: "",
  email: "",
  message: "",
};

const emptyTouched = {
  name: false,
  email: false,
  message: false,
};

const isValidEmail = (input: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(input);
};

const validateContact = (values: ContactValues): ContactErrors => {
  const nextErrors: ContactErrors = {};
  const trimmedName = values.name.trim();
  const trimmedEmail = values.email.trim();
  const trimmedMessage = values.message.trim();

  if (trimmedName.length < 3) {
    nextErrors.name = "Name must be at least 3 characters.";
  }

  if (!isValidEmail(trimmedEmail)) {
    nextErrors.email = "Please enter a valid email address.";
  }

  if (trimmedMessage.length < 10) {
    nextErrors.message = "Message must be at least 10 characters.";
  }

  return nextErrors;
};

export function ContactSection() {
  const [values, setValues] = useState<ContactValues>(emptyValues);
  const [touched, setTouched] = useState(emptyTouched);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<{ message: string; tone: ContactTone }>({
    message: "",
    tone: "neutral",
  });
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

  const handleFieldChange = (field: keyof ContactValues, value: string) => {
    setValues((prev) => {
      const next = { ...prev, [field]: value };

      if (touched[field]) {
        const nextErrors = validateContact(next);
        setErrors((prevErrors) => ({ ...prevErrors, [field]: nextErrors[field] }));
      }

      return next;
    });
  };

  const handleFieldBlur = (field: keyof ContactValues) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    const nextErrors = validateContact(values);
    setErrors((prevErrors) => ({ ...prevErrors, [field]: nextErrors[field] }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedValues: ContactValues = {
      name: values.name.trim(),
      email: values.email.trim(),
      message: values.message.trim(),
    };

    const nextErrors = validateContact(normalizedValues);

    setErrors(nextErrors);
    setTouched({ name: true, email: true, message: true });

    if (Object.keys(nextErrors).length > 0) {
      setStatus({ message: "Please fix the highlighted fields before submitting.", tone: "error" });
      return;
    }

    if (!canSend) {
      setStatus({
        message: "Form delivery is unavailable right now. Please use direct email below.",
        tone: "error",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ message: "Sending message...", tone: "neutral" });

    try {
      await emailjs.send(
        emailJsConfig.serviceId as string,
        emailJsConfig.templateId as string,
        {
          user_name: normalizedValues.name,
          user_email: normalizedValues.email,
          message: normalizedValues.message,
          to_email: siteConfig.email,
        },
        { publicKey: emailJsConfig.publicKey },
      );

      setStatus({ message: "Message sent successfully. I will get back to you soon.", tone: "success" });
      setValues(emptyValues);
      setErrors({});
      setTouched(emptyTouched);
    } catch {
      setStatus({
        message: "Unable to send right now. Please use direct email.",
        tone: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden rounded-3xl border border-border bg-[linear-gradient(155deg,rgba(56,189,248,0.12),rgba(15,23,42,0.94),rgba(2,6,23,0.97))] p-4 sm:p-6 md:p-8"
    >
      <div className="pointer-events-none absolute -left-14 top-10 h-36 w-36 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-8 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-border bg-slate-950/80 p-5 sm:p-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-slate-900/80 px-3 py-1 text-xs uppercase tracking-[0.18em] text-brand-300">
            <Sparkles className="h-3.5 w-3.5" />
            Contact
          </p>
          <h2 className="mt-4 text-2xl font-semibold text-slate-100 sm:text-3xl">Start a project conversation</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
            Short brief is enough. I&apos;ll follow up quickly.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {[
              { label: "Response", value: "< 24 hours" },
              { label: "Availability", value: "Open to projects" },
              { label: "Mode", value: "Remote / Hybrid" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-slate-700/80 bg-slate-900/80 px-3 py-2">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                <p className="mt-1 text-xs font-medium text-slate-200">{item.value}</p>
              </div>
            ))}
          </div>

          <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-200" htmlFor="user_name">
                Name
              </label>
              <input
                id="user_name"
                name="user_name"
                type="text"
                value={values.name}
                onChange={(event) => handleFieldChange("name", event.target.value)}
                onBlur={() => handleFieldBlur("name")}
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-300)]"
                placeholder="Your full name"
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "contact-name-error" : undefined}
              />
              {errors.name ? (
                <p id="contact-name-error" role="alert" className="mt-1 text-xs text-rose-300">
                  {errors.name}
                </p>
              ) : null}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-200" htmlFor="user_email">
                Email
              </label>
              <input
                id="user_email"
                name="user_email"
                type="email"
                value={values.email}
                onChange={(event) => handleFieldChange("email", event.target.value)}
                onBlur={() => handleFieldBlur("email")}
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-300)]"
                placeholder="you@company.com"
                inputMode="email"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "contact-email-error" : undefined}
              />
              {errors.email ? (
                <p id="contact-email-error" role="alert" className="mt-1 text-xs text-rose-300">
                  {errors.email}
                </p>
              ) : null}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-200" htmlFor="message">
                Project details
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={values.message}
                onChange={(event) => handleFieldChange("message", event.target.value)}
                onBlur={() => handleFieldBlur("message")}
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-300)]"
                placeholder="Share timeline, scope, and goals."
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "contact-message-error" : undefined}
              />
              {errors.message ? (
                <p id="contact-message-error" role="alert" className="mt-1 text-xs text-rose-300">
                  {errors.message}
                </p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-medium text-white transition duration-200 hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-300)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>

            {status.message ? (
              <p
                className={`text-sm ${
                  status.tone === "success"
                    ? "text-emerald-300"
                    : status.tone === "error"
                      ? "text-rose-300"
                      : "text-slate-300"
                }`}
                role={status.tone === "error" ? "alert" : "status"}
                aria-live="polite"
              >
                {status.message}
              </p>
            ) : null}
          </form>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-slate-950/80 p-5">
            <h3 className="text-xl font-semibold text-slate-100">Direct channels</h3>

            <ul className="mt-4 space-y-3">
              <li>
                <a
                  className="inline-flex w-full cursor-pointer items-center justify-between rounded-xl border border-slate-700/80 bg-slate-900/70 px-4 py-3 text-sm text-slate-200 transition duration-200 hover:border-brand-300/70 hover:text-white"
                  href={`mailto:${siteConfig.email}`}
                >
                  <span className="inline-flex items-center gap-2">
                    <Mail className="h-4 w-4 text-brand-300" />
                    {siteConfig.email}
                  </span>
                  <span className="text-xs uppercase tracking-[0.16em] text-slate-400">Email</span>
                </a>
              </li>
              <li>
                <a
                  className="inline-flex w-full cursor-pointer items-center justify-between rounded-xl border border-slate-700/80 bg-slate-900/70 px-4 py-3 text-sm text-slate-200 transition duration-200 hover:border-brand-300/70 hover:text-white"
                  href={siteConfig.social.github}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <span className="inline-flex items-center gap-2">
                    <Github className="h-4 w-4 text-brand-300" />
                    {siteConfig.githubUsername}
                  </span>
                  <span className="text-xs uppercase tracking-[0.16em] text-slate-400">GitHub</span>
                </a>
              </li>
              <li>
                <a
                  className="inline-flex w-full cursor-pointer items-center justify-between rounded-xl border border-slate-700/80 bg-slate-900/70 px-4 py-3 text-sm text-slate-200 transition duration-200 hover:border-brand-300/70 hover:text-white"
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <span className="inline-flex items-center gap-2">
                    <Linkedin className="h-4 w-4 text-brand-300" />
                    View Profile
                  </span>
                  <span className="text-xs uppercase tracking-[0.16em] text-slate-400">LinkedIn</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-slate-950/80 p-5">
            <h3 className="text-base font-semibold text-slate-100">Quick checklist</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li className="inline-flex items-start gap-2">
                <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
                Share timeline + goal.
              </li>
              <li className="inline-flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
                Mention constraints.
              </li>
              <li className="inline-flex items-start gap-2">
                <Send className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
                Reply window: under 24h.
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
