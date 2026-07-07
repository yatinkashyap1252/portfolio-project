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
    previewUrl: "https://premium-med-clinic.vercel.app/",
    index: "01",
    badgeText: "NEXTJS PORTAL",
  },
  {
    id: "zentro-shop",
    title: "Zentro E-Commerce Showcase",
    subtitle: "Modern Product & Shop Landing Experience",
    description: "A premium interactive e-commerce and product catalog experience showcasing custom sizing, real-time discounting banners, and high-fidelity fluid card layouts.",
    techStack: ["Framer", "React", "Tailwind CSS", "E-Commerce Design", "Responsive Layout"],
    features: [
      "Dynamic discount and coupon banners for conversion rate optimization.",
      "Interactive product selection including custom sizes (XS-XL) and sneaker sizing charts.",
      "Clean modern bento-style design showcase of premium items.",
      "Fully responsive layout scaling across mobile, tablet, and desktop views."
    ],
    mockUrl: "smaller-founders-314097.framer.app",
    previewUrl: "https://smaller-founders-314097.framer.app/",
    index: "02",
    badgeText: "FRAMER STORE",
  },
  {
    id: "kinetic-motion",
    title: "Kinetic Motion Engine",
    subtitle: "Interactive Trajectory & Flow Visualizer",
    description: "A physics-inspired creative developer landing experience visualizing kinetic transformations, flow automation, and high-performance physics-based micro-interactions.",
    techStack: ["Framer Motion", "Physics Sandbox", "CSS Keyframes", "Creative Coding", "SVG Path Animation"],
    features: [
      "Stunning kinetic drop and fluid-simulation entrance triggers.",
      "Interactive speed and trajectory data indicators (e.g. entry/exit metrics).",
      "Premium dark mode aesthetic featuring glowing grid patterns and glassmorphic panels.",
      "Smooth scrolling timeline triggers mapping potential energy to kinetic motion."
    ],
    mockUrl: "expanded-course-024994.framer.app",
    previewUrl: "https://expanded-course-024994.framer.app/",
    index: "03",
    badgeText: "KINETIC SITE",
  }
];
