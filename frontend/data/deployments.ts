export interface DeploymentItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  techStack: string[];
  features: string[];
  mockUrl: string;
  previewUrl: string;
  index: string;
  badgeText: string;
}

export const deploymentsData: DeploymentItem[] = [
  {
    id: "med-clinic",
    title: "Premium Medical Clinic",
    subtitle: "Luxurious Patient Care Showcase Portal",
    description: "An MNC-grade, premium medical clinic presentation dashboard with fluid scroll animations, interactive appointment forms, team bios, and custom FAQs.",
    techStack: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "Lucide Icons"],
    features: [
      "Luxurious aesthetic with gold accents, deep dark overlays, and Google Fonts Outfit typography.",
      "Interactive appointment scheduler form with visual validation and state management.",
      "High-performance bento grid layout displaying clinic services and medical facilities.",
      "Silky-smooth entrance transitions and scrolling triggers designed with Framer Motion."
    ],
    mockUrl: "premium-med-clinic.vercel.app",
    previewUrl: "http://localhost:5173",
    index: "01",
    badgeText: "NEXTJS PORTAL",
  },
  {
    id: "detective-killer",
    title: "Detective Killer Game",
    subtitle: "Interactive Branching Murder Mystery Engine",
    description: "A rich text-adventure mystery game that puts players in the shoes of a detective. Navigate branching choices, inspect evidence logs, construct suspect testimonies, and solve complex cases directly in the browser.",
    techStack: ["HTML5", "CSS3", "JavaScript", "Audio System", "Render Deployment"],
    features: [
      "Branching dialogue systems and dynamic story paths based on player decisions.",
      "Interactive clue and evidence inspector panel logs.",
      "Real-time suspect profiles and relationship metrics tracking.",
      "Ambient background soundscape elements utilizing web audio triggers."
    ],
    mockUrl: "detective-killer-game.onrender.com",
    previewUrl: "https://detective-killer-game.onrender.com/",
    index: "02",
    badgeText: "WEB GAME",
  },
  {
    id: "fitpro-gym",
    title: "FitPro Gym Suite",
    subtitle: "Mobile-First Interactive Fitness Dashboard",
    description: "A high-fidelity premium dark-themed fitness dashboard tracking active boxing sessions, pulse counts, and bento-style metric indicators with silky-smooth micro-animations.",
    techStack: ["React", "Vite", "Tailwind CSS", "Framer Motion", "Lucide Icons"],
    features: [
      "Simulated interactive iOS device frame on desktop, adapting to full viewport on mobile screen shares.",
      "Live active workout module showcasing boxing with real-time pulsing heart rate (BPM) animations.",
      "Bento-grid dashboard cards with animated health scores and fluid hydration wave path graphics.",
      "Clickable tab bar navigation and responsive hover/tap feedbacks for a native mobile experience."
    ],
    mockUrl: "fitpro-gym-app.vercel.app",
    previewUrl: "http://localhost:5000",
    index: "03",
    badgeText: "MOBILE REACT",
  }
];
