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
}

export const projectsData: ProjectItem[] = [
  {
    id: "neos-crypto",
    title: "Neos Crypto Analytics Dashboard",
    description: "A high-fidelity real-time crypto sentiment analytics and automated trading dashboard. It integrates WebSocket sockets to capture market triggers and display live trend shifts.",
    techStack: ["Next.js 15", "TypeScript", "Zustand", "Tailwind CSS", "Framer Motion", "WebSockets"],
    points: [
      "Engineered low-latency live chart visualizers using responsive canvas layouts and custom grid rendering.",
      "Established secure user authorization gateways utilizing stateless JWT validation handshakes.",
      "Structured dynamic schema state in Zustand to synchronize client-side components with instant database updates."
    ],
    githubUrl: "https://github.com/robertwilliam/neos-crypto-analytics",
    liveUrl: "https://neos-crypto-analytics.example.com",
    status: "ACTIVE",
    index: "01",
  },
  {
    id: "express-gateway",
    title: "Express Microservices Gateway API",
    description: "A secure, scalable API gateway orchestrating internal microservices. Manages high-throughput route mapping, system rate limiting, caching, and consolidated service diagnostic logs.",
    techStack: ["Node.js", "Express.js", "MongoDB", "Redis Cache", "Docker", "JWT Auth"],
    points: [
      "Engineered a dynamic rate-limiting algorithm in Redis, mitigating DDoS overloads by 40% under peak conditions.",
      "Designed a centralized MongoDB log aggregation database schema to streamline system diagnostics.",
      "Configured robust Docker container builds to maintain automated local scaling and deployment parameters."
    ],
    githubUrl: "https://github.com/robertwilliam/express-gateway-api",
    liveUrl: null, // Test case: no live link, button should be hidden
    status: "DEPLOYED",
    index: "02",
  },
  {
    id: "atomic-state",
    title: "Zustand Atomic State Orchestrator",
    description: "A lightweight, atomic state management wrapper utility optimized for massive React form bindings. Simplifies nested key state updates and schemas.",
    techStack: ["TypeScript", "React", "Zustand", "Zod Schema", "npm / CLI"],
    points: [
      "Published a reusable npm package supporting multi-level nested form validation resolvers out-of-the-box.",
      "Optimized rendering pipelines, reducing React component re-render frequency by 70% during typing.",
      "Built clean TypeScript generic interfaces to ensure strict compile-time types safety across form fields."
    ],
    githubUrl: "https://github.com/robertwilliam/atomic-state-orchestrator",
    liveUrl: "https://www.npmjs.com/package/atomic-state-orchestrator",
    status: "PUBLISHED",
    index: "03",
  },
];
