import { getNewsletterUrl } from "../lib/newsletter.ts";

export const siteConfig = {
  name: "Neeraj Butola",
  shortName: "DevelopedByNeeraj",
  role: "Fullstack AI Engineer",
  description:
    "Neeraj Butola’s open notebook: fullstack AI engineering, web applications, cloud systems, and notes on what I learn along the way.",
  longDescription:
    "I’m a Fullstack AI Engineer. I build web applications and cloud systems, and write about what I learn along the way.",
  url: process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "") || "https://neerajbutola.in",
  locale: "en_US",
  language: "en",
  image: "/dev-ed-wave.png",
  email: "neeraj.butola.dev@gmail.com",
  newsletterUrl: getNewsletterUrl(
    process.env.NEXT_PUBLIC_NEWSLETTER_URL ?? "https://neeraj-butola.kit.com/92676d5ac2",
  ),
  location: "India",
  resumeUrl:
    "https://raw.githubusercontent.com/Frostdev7506/Auto-resume/build/Neeraj_Butola_Resume.pdf",
  githubUsername: "Frostdev7506",
  social: {
    github: "https://github.com/Frostdev7506",
    linkedin: "https://www.linkedin.com/in/neeraj-butola/",
    twitter: "https://twitter.com/frostdev7506",
    youtube: "https://www.youtube.com/@NeerajSSinghButola",
  },
  nav: [
    { label: "Blog", href: "/blog" },
    { label: "Projects", href: "/projects" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  skills: [
    "AWS",
    "MERN Stack",
    "Microservices",
    "React/Next.js",
    "Node/Express",
  ],
};

export const defaultKeywords = [
  "Neeraj Butola",
  "Fullstack AI Engineer",
  "MERN developer",
  "Next.js developer portfolio",
  "full stack developer",
  "AWS cloud engineer",
  "React developer",
  "Node.js engineer",
  "software portfolio",
];
