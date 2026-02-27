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
    image: "/boltic.png",
    altText: "Boltic AI workflow automation platform",
    link: "https://boltic.io",
    title: "Boltic",
    technologies: ["AI", "Workflow Automation", "Enterprise", "No-code"],
    description:
      "An enterprise-grade AI workflow automation platform that streamlines operations, personalizes experiences, and ensures compliance with intelligent, scalable AI solutions.",
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
    image: "/student.png",
    altText: "Student management application dashboard",
    link: "https://github.com/Frostdev7506/mern-crud-student-attendance",
    title: "Student Management Application",
    technologies: ["React", "JavaScript", "MySQL", "Express"],
    description:
      "Attendance and scheduling application for teachers with student management workflows.",
  },


];
