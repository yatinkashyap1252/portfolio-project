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
    title: "Corona",
    subtitle: "3D Modeling, Animation & Framer Prototyping",
    description: "A premium interactive e-commerce storefront showcasing advanced skills in 3D modeling, interactive web animation, and high-fidelity prototyping. Features real-time responsive design and embedded interactive 3D assets.",
    techStack: ["Framer Prototyping", "Spline 3D", "3D Modeling", "Interactive Animation", "Web UI Design"],
    features: [
      "Embeds interactive 3D product viewports (using Spline) allowing users to rotate, orbit, and zoom products.",
      "Custom UI control overlays for size selection (36-40, XS-XL) and live product color customizer switching.",
      "Polished modern typography, high-contrast dark visual aesthetics, and structured grid cards.",
      "Fully responsive viewport scaling and interactive states built directly as a high-fidelity Framer prototype."
    ],
    mockUrl: "smaller-founders-314097.framer.app",
    previewUrl: "https://smaller-founders-314097.framer.app/",
    index: "02",
    badgeText: "3D FRAMER SHOP",
  },
  {
    id: "kinetic-motion",
    title: "Kinetic Motion Engine",
    subtitle: "3D Spline Physics & Framer Prototyping",
    description: "A physics-inspired creative landing experience visualizing kinetic transformations and flow automation by combining custom Spline 3D physics simulations with high-fidelity Framer interaction design.",
    techStack: ["Framer Prototyping", "Spline 3D", "3D Animation", "Physics Simulation", "Creative Coding"],
    features: [
      "Integrates a real-time Spline 3D kinetic pipe simulation showing physics-based particle transitions.",
      "Dynamic data overlays visualizing real-time metrics like Entry Speed (6.26 m/s) and Exit Speed.",
      "Polished split-pane layout design with high-contrast text and smooth scrolling triggers.",
      "Fully responsive interactive landing page developed directly as a high-fidelity Framer showcase."
    ],
    mockUrl: "expanded-course-024994.framer.app",
    previewUrl: "https://expanded-course-024994.framer.app/",
    index: "03",
    badgeText: "3D SPLINE ENGINE",
  }
];
