import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description:
    "Privacy policy for Neeraj Butola's portfolio website, including contact form data handling and security practices.",
  path: "/privacy",
  keywords: ["privacy policy", "data handling", "portfolio site privacy"],
});

export default function PrivacyPage() {
  return (
    <section className="space-y-6 rounded-3xl border border-border bg-slate-950/80 p-6 text-slate-200 shadow-sm md:p-8">
      <h1 className="text-3xl font-semibold text-slate-100">Privacy Policy</h1>
      <p className="leading-relaxed text-slate-300">
        This portfolio collects only the information you provide through the contact form, such as your name, email, and message. That data is used strictly to respond to your inquiry.
      </p>
      <p className="leading-relaxed text-slate-300">
        No personal data is sold or shared for advertising purposes. Third-party services may process form delivery and hosting logs for operational reliability.
      </p>
      <p className="leading-relaxed text-slate-300">
        If you want your submitted information removed, please contact the site owner directly via email.
      </p>
    </section>
  );
}
