export interface SkillCategory {
  id: string;
  title: string;
  skills: string[];
  metric: string;
  description: string;
  visualizerType: "wave" | "matrix" | "nodes" | "gauge";
}

export const skillCategories: SkillCategory[] = [
  {
    id: "fullstack",
    title: "Full Stack Development",
    skills: [
      "React.js",
      "Next.js",
      "Node.js",
      "JavaScript",
      "MongoDB"
    ],
    metric: "4+ Production Projects",
    description:
      "Building scalable web and mobile applications with modern frontend frameworks, backend services, database integration, and responsive user experiences.",
    visualizerType: "wave",
  },

  {
    id: "mobile",
    title: "Mobile App Development",
    skills: [
      "React Native",
      "Flutter",
      "Firebase",
      "REST APIs",
      "Google Maps API"
    ],
    metric: "Cross-Platform Expertise",
    description:
      "Developing high-performance mobile applications with authentication, API integration, real-time synchronization, and platform-consistent user interfaces.",
    visualizerType: "matrix",
  },

  {
    id: "python",
    title: "Python & Enterprise Solutions",
    skills: [
      "Python",
      "Odoo",
      "Owl.js",
      "PostgreSQL",
      "Workflow Automation"
    ],
    metric: "Enterprise ERP Development",
    description:
      "Creating custom business solutions, workflow automations, ERP modules, database optimizations, and migration processes for enterprise clients.",
    visualizerType: "nodes",
  },

  {
    id: "ai",
    title: "AI & Data Analytics",
    skills: [
      "TensorFlow",
      "OpenCV",
      "Scikit-Learn",
      "Pandas",
      "NumPy"
    ],
    metric: "AI-Powered Applications",
    description:
      "Building intelligent systems involving computer vision, machine learning, data analysis, predictive modeling, and real-time AI-driven experiences.",
    visualizerType: "gauge",
  },
];