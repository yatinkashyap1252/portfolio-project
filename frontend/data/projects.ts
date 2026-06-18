export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  points: string[];
  githubUrl: string;
  liveUrl: string | null;
  status: string;
  index: string;
  thumbnailUrl?: string;
}

export const projectsData: ProjectItem[] = [
  {
    id: "globepath",
    title: "GlobePath Travel Platform",
    description:
      "A comprehensive travel planning and booking platform designed to help users discover destinations, manage itineraries, and streamline trip organization through an intuitive user experience.",
    techStack: [
      "React Native",
      "Firebase",
      "Gemini API",
      "Tailwind CSS"
    ],
    points: [
      "Developed responsive travel management interfaces for destination discovery, itinerary planning, and booking workflows.",
      "Built scalable backend APIs and database structures to manage travel data, user accounts, and trip information.",
      "Implemented optimized user experience flows to simplify travel planning and improve customer engagement."
    ],
    githubUrl: "https://github.com/yatinkashyap1252/globepath",
    liveUrl: null,
    status: "RESEARCH",
    index: "01",
  },

  {
    id: "safargo",
    title: "Safargo - Cab Booking",
    description:
      "A logistics and transportation management solution focused on shipment tracking, operational monitoring, and business workflow automation.",
    techStack: [
      "React Native",
      "Google Maps API",
      "Stripe"
    ],
    points: [
      "Designed and developed logistics dashboards for shipment monitoring, operational insights, and route management.",
      "Integrated secure authentication and role-based access control to protect business-critical data.",
      "Optimized backend services and database queries to support efficient handling of transportation operations."
    ],
    githubUrl: "https://github.com/yatinkashyap1252/SafarGo",
    liveUrl: null,
    status: "COMPLETED",
    index: "02",
  },

  {
    id: "pixel-fox-maze",
    title: "Pixel Fox Maze Adventure",
    description:
      "A 2D adventure maze game featuring interactive gameplay mechanics, obstacle navigation, collectible systems, and engaging pixel-art environments.",
    techStack: [
      "Python",
      "OpenCV",
      "Pygame",
      "Computer Vision"
    ],
    points: [
      "Developed core gameplay mechanics including player movement, maze navigation, and interactive obstacle systems.",
      "Implemented collectible rewards, level progression, and collision-based game logic to enhance engagement.",
      "Designed optimized game environments and responsive controls for a smooth player experience."
    ],
    githubUrl: "https://github.com/yatinkashyap1252/Pixel_Maze_Adventure",
    liveUrl: null,
    status: "COMPLETED",
    index: "03",
  },

  {
    id: "ai-blind-assistant",
    title: "AI Blind Assistant System",
    description:
      "An AI-powered accessibility solution that assists visually impaired individuals through real-time object detection, voice guidance, and environmental awareness features.",
    techStack: [
      "Python",
      "OpenCV",
      "YOLO",
      "Machine Learning",
      "Computer Vision"
    ],
    points: [
      "Built an object detection system capable of identifying surrounding objects and obstacles in real time.",
      "Leveraged computer vision and machine learning models to improve environmental awareness and accessibility support."
    ],
    githubUrl: "https://github.com/yatinkashyap1252/blind_assistant_bot",
    liveUrl: null,
    status: "RESEARCH",
    index: "04",
  },
];