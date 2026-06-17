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
    id: "frontend",
    title: "Frontend Development",
    skills: ["Next.js 15+", "React 19", "TypeScript", "Tailwind CSS", "Framer Motion"],
    metric: "95% Performance Score",
    description: "Architecting responsive, SEO-friendly, and lightweight web layouts with polished micro-interactions and scroll animations.",
    visualizerType: "wave",
  },
  {
    id: "backend",
    title: "Backend & Databases",
    skills: ["Node.js", "Express.js", "MongoDB", "Mongoose", "REST APIs"],
    metric: "99.9% Server Uptime",
    description: "Designing robust server-side infrastructures, data architectures, secure API endpoints, and clean DB queries.",
    visualizerType: "matrix",
  },
  {
    id: "state",
    title: "State & Validation",
    skills: ["Zustand", "Redux Toolkit", "React Hook Form", "Zod Validation"],
    metric: "Atomic state reactivity",
    description: "Implementing client-side state managers and establishing client-server schema definitions for structured forms.",
    visualizerType: "nodes",
  },
  {
    id: "devops",
    title: "DevOps & Environment",
    skills: ["Docker", "Git / GitHub", "JWT Auth", "Cloudinary SDK", "npm / npx"],
    metric: "Secure CI/CD Pipelines",
    description: "Handling secure authentication handshakes, asset storage integrations, container builds, and deployment pipelines.",
    visualizerType: "gauge",
  },
];
