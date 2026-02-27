export type Achievement = {
  title: string;
  description: string;
  metrics: string;
  keywords: string[];
};

export const achievements: Achievement[] = [
  {
    title: "Microservices Architecture",
    description:
      "Designed and implemented 15+ microservices using Node.js and Express.js, reducing coupling and improving release velocity.",
    metrics: "15+ services deployed",
    keywords: ["Microservices", "Node.js", "Docker", "Kubernetes", "Express.js"],
  },
  {
    title: "AWS Cloud Solutions",
    description:
      "Deployed scalable applications on AWS using EC2, Lambda, RDS, S3, and automated CI/CD pipelines.",
    metrics: "99.9% uptime",
    keywords: ["AWS", "Lambda", "EC2", "RDS", "CI/CD"],
  },
  {
    title: "Full-Stack MERN Delivery",
    description:
      "Built production-grade MERN applications and optimized frontend performance with measurable Lighthouse gains.",
    metrics: "20+ production applications",
    keywords: ["MERN", "React", "MongoDB", "Express", "Optimization"],
  },
  {
    title: "API Platform Engineering",
    description:
      "Delivered REST and GraphQL APIs with authentication, observability, and third-party integrations.",
    metrics: "50+ APIs shipped",
    keywords: ["REST", "GraphQL", "JWT", "Integrations", "Reliability"],
  },
  {
    title: "Performance Optimization",
    description:
      "Applied lazy loading, bundle splitting, and database indexing to reduce load times and query pressure.",
    metrics: "65% faster page loads",
    keywords: ["Web Vitals", "Caching", "Code Splitting", "Indexing", "Redis"],
  },
  {
    title: "Team Leadership",
    description:
      "Led engineering collaboration, mentored junior developers, and improved code quality through review standards.",
    metrics: "12+ mentees supported",
    keywords: ["Leadership", "Mentoring", "Code Review", "Agile", "Quality"],
  },
];
