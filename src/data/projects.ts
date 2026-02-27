export type Project = {
  image: string;
  altText: string;
  link: string;
  title: string;
  technologies: string[];
  description: string;
};

export const projects: Project[] = [
  {
    image: "/lyrics.png",
    altText: "Lyriks music streaming application screenshot",
    link: "https://github.com/Frostdev7506/Lyriks",
    title: "Lyriks (Music Streaming App)",
    technologies: ["React", "JavaScript", "API", "Express"],
    description:
      "Music streaming app built with React and the Shazam Core API.",
  },
  {
    image: "/bootcamp.png",
    altText: "Web development bootcamp landing page",
    link: "https://github.com/Frostdev7506/Frontend-Webdevelopment-Bootcamp",
    title: "Web Development Bootcamp",
    technologies: ["React", "JavaScript", "Mapbox API", "Express"],
    description:
      "Landing page for a web-development bootcamp using React and Mapbox API.",
  },
  {
    image: "/image-generator.png",
    altText: "OpenAI image generator dashboard",
    link: "https://github.com/Frostdev7506/open-AI-Image-Generator",
    title: "OpenAI Image Generator",
    technologies: ["React", "JavaScript", "OpenAI", "Express"],
    description:
      "Node + Express based app that generates images using OpenAI DALL-E.",
  },
  {
    image: "/student.png",
    altText: "Student management application dashboard",
    link: "https://github.com/Frostdev7506/mern-crud-student-attendance",
    title: "Student Management Application",
    technologies: ["React", "JavaScript", "MySQL", "Express"],
    description:
      "Attendance and scheduling application for teachers with student management workflows.",
  },
  {
    image: "/GreattrMerchant.png",
    altText: "Greattr merchant mobile application",
    link: "https://play.google.com/store/apps/details?id=com.merchantnative&hl=en_IN",
    title: "Greattr for Merchants",
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
    title: "Greattr Landing Page",
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
