"use client";

import { FormEvent, useMemo, useState } from "react";
import emailjs from "@emailjs/browser";
import { siteConfig } from "@/data/site";
import { Send, Clock, ShieldCheck } from "lucide-react";

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

  if (trimmedName.length < 2) nextErrors.name = "Please enter your name.";
  if (!isValidEmail(trimmedEmail)) nextErrors.email = "A valid email is required.";
  if (trimmedMessage.length < 10) nextErrors.message = "Please share a bit more detail (min 10 characters).";

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
      setStatus({ message: "Please check the fields above and try again.", tone: "error" });
      return;
    }

    if (!canSend) {
      setStatus({
        message: "Form is currently unavailable. Please email me directly.",
        tone: "error",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ message: "Sending your message...", tone: "neutral" });

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

      setStatus({ message: "Thanks for reaching out! I'll get back to you soon. 😊", tone: "success" });
      setValues(emptyValues);
      setErrors({});
      setTouched(emptyTouched);
    } catch {
      setStatus({
        message: "Oops! Something went wrong. Please email me directly instead.",
        tone: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 lg:py-32 border-b border-border/40">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight w-full max-w-xl mb-6">
            Let&apos;s create something great together
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg font-light leading-relaxed">
            I&apos;m always excited to connect, whether it&apos;s for a project, a partnership, or just a quick chat. Drop me a message below!
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
        <div className="lg:col-span-7">
          <form className="space-y-8" onSubmit={onSubmit} noValidate>
            <div className="group relative">
              <label
                className="block text-sm font-medium text-foreground mb-2"
                htmlFor="user_name"
              >
                What should I call you?
              </label>
              <input
                id="user_name"
                name="user_name"
                type="text"
                value={values.name}
                onChange={(event) => handleFieldChange("name", event.target.value)}
                onBlur={() => handleFieldBlur("name")}
                className="w-full bg-muted/30 border border-border/50 py-3 px-4 text-foreground rounded-xl transition-all duration-300 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none placeholder:text-muted-foreground/50 hover:border-border"
                placeholder="e.g., Jane Doe"
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name && (
                <p className="absolute -bottom-6 left-0 text-xs font-medium text-destructive">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="group relative">
              <label
                className="block text-sm font-medium text-foreground mb-2"
                htmlFor="user_email"
              >
                Where can I reach you?
              </label>
              <input
                id="user_email"
                name="user_email"
                type="email"
                value={values.email}
                onChange={(event) => handleFieldChange("email", event.target.value)}
                onBlur={() => handleFieldBlur("email")}
                className="w-full bg-muted/30 border border-border/50 py-3 px-4 text-foreground rounded-xl transition-all duration-300 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none placeholder:text-muted-foreground/50 hover:border-border"
                placeholder="e.g., jane@example.com"
                inputMode="email"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && (
                <p className="absolute -bottom-6 left-0 text-xs font-medium text-destructive">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="group relative">
              <label
                className="block text-sm font-medium text-foreground mb-2"
                htmlFor="message"
              >
                How can I help?
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={values.message}
                onChange={(event) => handleFieldChange("message", event.target.value)}
                onBlur={() => handleFieldBlur("message")}
                className="w-full bg-muted/30 border border-border/50 py-3 px-4 text-foreground rounded-xl transition-all duration-300 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none resize-none placeholder:text-muted-foreground/50 hover:border-border"
                placeholder="Tell me about your project, idea, or just say hi..."
                aria-invalid={Boolean(errors.message)}
              />
              {errors.message && (
                <p className="absolute -bottom-6 left-0 text-xs font-medium text-destructive">
                  {errors.message}
                </p>
              )}
            </div>

            <div className="pt-6 flex flex-col sm:flex-row sm:items-center gap-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-14 items-center justify-center gap-2 bg-primary px-8 text-sm font-semibold text-primary-foreground rounded-full transition-all duration-300 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 shadow-sm"
              >
                {isSubmitting ? "Sending..." : "Send message ✨"}
                <Send className="h-4 w-4 ml-1" />
              </button>

              {status.message && (
                <p
                  className={`text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-300 ${status.tone === "success"
                    ? "text-emerald-500"
                    : status.tone === "error"
                      ? "text-destructive"
                      : "text-muted-foreground"
                    }`}
                  role={status.tone === "error" ? "alert" : "status"}
                  aria-live="polite"
                >
                  {status.message}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-8 pt-6 border-t border-border/40 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary/70" />
                <span>Usually respond within 24 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary/70" />
                <span>Your details are kept private</span>
              </div>
            </div>
          </form>
        </div>

        <aside className="lg:col-span-4 flex flex-col gap-10 lg:pl-8 mt-12 lg:mt-0 lg:border-l border-border/30">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-6 flex items-center gap-2">
              <span className="w-8 h-px bg-primary/30 inline-block"></span>
              Direct Channels
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  className="group flex flex-col gap-1 transition-all p-4 -mx-4 rounded-2xl hover:bg-muted/30"
                  href={`mailto:${siteConfig.email}`}
                >
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">Email</span>
                  <span className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary break-all">
                    {siteConfig.email}
                  </span>
                </a>
              </li>
              <li>
                <a
                  className="group flex flex-col gap-1 transition-all p-4 -mx-4 rounded-2xl hover:bg-muted/30"
                  href={siteConfig.social.github}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">GitHub</span>
                  <span className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                    {siteConfig.githubUsername}
                  </span>
                </a>
              </li>
              <li>
                <a
                  className="group flex flex-col gap-1 transition-all p-4 -mx-4 rounded-2xl hover:bg-muted/30"
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">Professional Profile</span>
                  <span className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                    LinkedIn /neerajbutola
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}

