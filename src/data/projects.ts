export type Project = {
  image: string;
  altText: string;
  link: string;
  linkLabel: string;
  title: string;
  summary: string;
  technologies: string[];
  description: string;
};

export const projects: Project[] = [
  {
    image: "/lyrics.png",
    altText: "Lyriks music streaming application screenshot",
    link: "https://github.com/Frostdev7506/Lyriks",
    linkLabel: "View source",
    title: "Lyriks",
    summary: "Music discovery, built with React.",
    technologies: ["React", "JavaScript", "API", "Express"],
    description:
      "Music streaming app built with React and the Shazam Core API.",
  },
  {
    image: "/illustrations/image-generator.png",
    altText: "An illustrated text prompt generates mountain landscape images",
    link: "https://github.com/Frostdev7506/open-AI-Image-Generator",
    linkLabel: "View source",
    title: "OpenAI Image Generator",
    summary: "From a text prompt to an image.",
    technologies: ["React", "JavaScript", "OpenAI", "Express"],
    description:
      "Node + Express based app that generates images using OpenAI DALL-E.",
  },
  {
    image: "/illustrations/student.png",
    altText: "Illustrated student attendance notebook and calendar",
    link: "https://github.com/Frostdev7506/mern-crud-student-attendance",
    linkLabel: "View source",
    title: "Student Management",
    summary: "Attendance and scheduling for teachers.",
    technologies: ["React", "JavaScript", "MySQL", "Express"],
    description:
      "Attendance and scheduling application for teachers with student management workflows.",
  },
  {
    image: "/illustrations/bootcamp.png",
    altText: "Illustrated bootcamp notebook with code and a map",
    link: "https://github.com/Frostdev7506/Frontend-Webdevelopment-Bootcamp",
    linkLabel: "View source",
    title: "Web Development Bootcamp",
    summary: "A home for learning web development.",
    technologies: ["React", "JavaScript", "Mapbox API", "Express"],
    description:
      "Landing page for a web-development bootcamp using React and Mapbox API.",
  },
  {
    image: "/illustrations/merchant.png",
    altText: "Illustrated storefront and merchant mobile application",
    link: "https://play.google.com/store/apps/details?id=com.merchantnative&hl=en_IN",
    linkLabel: "View on Google Play",
    title: "Greattr for Merchants",
    summary: "Customer financing for small businesses.",
    technologies: [
      "React",
      "JavaScript",
      "REST API",
      "Express",
      "Node.js",
      "MSSQL",
      "Socket.io",
    ],
    description:
      "MSME merchant application for transparent customer financing options.",
  },
  {
    image: "/GreattrLandingPage.png",
    altText: "Greattr landing page",
    link: "https://www.greattr.com",
    linkLabel: "Visit website",
    title: "Greattr Landing Page",
    summary: "Merchant registration and onboarding.",
    technologies: [
      "React",
      "JavaScript",
      "REST API",
      "Express",
      "Node.js",
      "MSSQL",
      "Socket.io",
    ],
    description:
      "Landing experience with merchant registration and OKYC Aadhaar verification flow.",
  },
];
