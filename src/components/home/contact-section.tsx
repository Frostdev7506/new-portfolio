"use client";

import { FormEvent, useMemo, useState } from "react";
import emailjs from "@emailjs/browser";
import { siteConfig } from "@/data/site";
import { ArrowUpRight } from "lucide-react";

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

  if (trimmedName.length < 3) nextErrors.name = "Name must be at least 3 characters.";
  if (!isValidEmail(trimmedEmail)) nextErrors.email = "Please enter a valid email address.";
  if (trimmedMessage.length < 10) nextErrors.message = "Message must be at least 10 characters.";

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
      setStatus({ message: "Fix errors to proceed.", tone: "error" });
      return;
    }

    if (!canSend) {
      setStatus({
        message: "Form unavailable. Please use direct email.",
        tone: "error",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ message: "Transmitting...", tone: "neutral" });

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

      setStatus({ message: "Transmission complete.", tone: "success" });
      setValues(emptyValues);
      setErrors({});
      setTouched(emptyTouched);
    } catch {
      setStatus({
        message: "Delivery failed. Try direct email.",
        tone: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 lg:py-32 border-b border-border/40">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
        <div>
          <h2 className="text-4xl font-black tracking-tighter w-full max-w-[10ch] uppercase mb-4 leading-none">Start a Dialogue</h2>
          <p className="text-muted-foreground/80 max-w-sm font-light tracking-wide mt-8">
            I am currently open to select engineering opportunities and rigorous challenges.
          </p>
        </div>
        <div className="hidden md:block text-[10px] uppercase tracking-[0.4em] font-bold text-muted-foreground/30 text-right">
          07 // Contact
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
        <div className="lg:col-span-8">
          <form className="space-y-12" onSubmit={onSubmit} noValidate>
            <div className="group relative">
              <label
                className={`absolute left-0 transition-all duration-300 font-medium tracking-[0.2em] uppercase text-[10px] ${values.name || touched.name ? '-top-5 text-muted-foreground' : 'top-4 text-muted-foreground'}`}
                htmlFor="user_name"
              >
                Identification
              </label>
              <input
                id="user_name"
                name="user_name"
                type="text"
                value={values.name}
                onChange={(event) => handleFieldChange("name", event.target.value)}
                onBlur={() => handleFieldBlur("name")}
                className="w-full bg-transparent border-b border-border/40 py-4 text-foreground rounded-none transition duration-300 focus:border-primary focus:outline-none placeholder:text-transparent"
                placeholder="Identification"
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name && (
                <p className="absolute -bottom-6 left-0 text-[10px] tracking-widest uppercase text-destructive">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="group relative mt-12">
              <label
                className={`absolute left-0 transition-all duration-300 font-medium tracking-[0.2em] uppercase text-[10px] ${values.email || touched.email ? '-top-5 text-muted-foreground' : 'top-4 text-muted-foreground'}`}
                htmlFor="user_email"
              >
                Return Address
              </label>
              <input
                id="user_email"
                name="user_email"
                type="email"
                value={values.email}
                onChange={(event) => handleFieldChange("email", event.target.value)}
                onBlur={() => handleFieldBlur("email")}
                className="w-full bg-transparent border-b border-border/40 py-4 text-foreground rounded-none transition duration-300 focus:border-primary focus:outline-none placeholder:text-transparent"
                placeholder="Return Address"
                inputMode="email"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && (
                <p className="absolute -bottom-6 left-0 text-[10px] tracking-widest uppercase text-destructive">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="group relative mt-12">
              <label
                className={`absolute left-0 transition-all duration-300 font-medium tracking-[0.2em] uppercase text-[10px] ${values.message || touched.message ? '-top-5 text-muted-foreground' : 'top-4 text-muted-foreground'}`}
                htmlFor="message"
              >
                Correspondence
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={values.message}
                onChange={(event) => handleFieldChange("message", event.target.value)}
                onBlur={() => handleFieldBlur("message")}
                className="w-full bg-transparent border-b border-border/40 py-4 text-foreground rounded-none transition duration-300 focus:border-primary focus:outline-none resize-none placeholder:text-transparent"
                placeholder="Correspondence"
                aria-invalid={Boolean(errors.message)}
              />
              {errors.message && (
                <p className="absolute -bottom-6 left-0 text-[10px] tracking-widest uppercase text-destructive">
                  {errors.message}
                </p>
              )}
            </div>

            <div className="pt-8 flex flex-wrap items-center gap-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-16 items-center justify-center gap-4 bg-primary px-12 text-[10px] tracking-[0.3em] font-bold uppercase text-primary-foreground transition duration-500 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Transmitting..." : "Send Dispatch"}
                <ArrowUpRight className="h-4 w-4" />
              </button>

              {status.message && (
                <p
                  className={`text-[10px] uppercase tracking-[0.2em] font-medium ${status.tone === "success"
                      ? "text-primary"
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
          </form>
        </div>

        <aside className="lg:col-span-4 flex flex-col gap-16 mt-12 lg:mt-0">
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground mb-6">Direct Channels</h3>
            <ul className="space-y-6">
              <li>
                <a
                  className="group flex flex-col gap-1 transition-colors"
                  href={`mailto:${siteConfig.email}`}
                >
                  <span className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {siteConfig.email}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-muted-foreground/60 mt-1">Email</span>
                </a>
              </li>
              <li>
                <a
                  className="group flex flex-col gap-1 transition-colors"
                  href={siteConfig.social.github}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <span className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {siteConfig.githubUsername}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-muted-foreground/60 mt-1">GitHub</span>
                </a>
              </li>
              <li>
                <a
                  className="group flex flex-col gap-1 transition-colors"
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <span className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    LinkedIn /neerajbutola
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-muted-foreground/60 mt-1">Professional Profile</span>
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
