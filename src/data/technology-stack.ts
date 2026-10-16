export type Technology = {
  name: string;
  logo: string;
  role?: string;
};

export const technologyStackCopy = {
  eyebrow: "My toolkit.",
  title: "Across the stack.",
  mern: "MERN",
  cloud: "Cloud platforms",
};

export const mernStack: readonly Technology[] = [
  { name: "MongoDB", logo: "mongodb", role: "Database" },
  { name: "Express", logo: "express", role: "API" },
  { name: "React", logo: "react", role: "Interface" },
  { name: "Node.js", logo: "nodejs", role: "Runtime" },
];

export const cloudPlatforms: readonly Technology[] = [
  { name: "AWS", logo: "amazonwebservices" },
  { name: "Azure", logo: "azure" },
  { name: "Google Cloud", logo: "googlecloud" },
];

export const supportingTechnologies = [
  {
    label: "Web",
    technologies: [
      { name: "JavaScript", logo: "javascript" },
      { name: "TypeScript", logo: "typescript" },
      { name: "Next.js", logo: "nextjs" },
      { name: "Tailwind CSS", logo: "tailwindcss" },
    ],
  },
  {
    label: "Services & data",
    technologies: [
      { name: "Python", logo: "python" },
      { name: "PostgreSQL", logo: "postgresql" },
      { name: "MySQL", logo: "mysql" },
      { name: "Redis", logo: "redis" },
      { name: "Kafka", logo: "apachekafka" },
    ],
  },
  {
    label: "Delivery",
    technologies: [
      { name: "Docker", logo: "docker" },
      { name: "Kubernetes", logo: "kubernetes" },
      { name: "GitHub Actions", logo: "githubactions" },
    ],
  },
] as const;
