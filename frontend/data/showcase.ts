export interface ShowcaseItem {
  id: string;
  type: "certificate" | "blog" | "article" | "extra-curricular" | "highlight";
  title: string;
  subtitle: string;
  content: string[];
  link: string;
  linkLabel: string;
  badgeText: string;
  bgStyle: "white" | "black" | "red" | "dark" | "split";
}

export const showcaseItems: ShowcaseItem[] = [
  {
    id: "nextjs-cert",
    type: "certificate",
    title: "Next.js Advanced Developer",
    subtitle: "Vercel Professional Certification",
    content: [
      "Final Score: 97%",
      "Verified skills in Server Components routing, state isolation, and bundle optimisations.",
      "Credential ID: VRC-NX-9988"
    ],
    link: "/nextjs-certificate.pdf", // Mock PDF
    linkLabel: "View Certificate PDF",
    badgeText: "NEXT.JS",
    bgStyle: "white",
  },
  {
    id: "zustand-blog",
    type: "blog",
    title: "Mastering Zustand Atomic State",
    subtitle: "Technical Blog Publication",
    content: [
      "A deep-dive tutorial explaining how atomic selectors prevent unnecessary re-render triggers in React forms.",
      "Discusses state subscription optimizations and debugging flows."
    ],
    link: "https://medium.com/example/mastering-zustand-atomic-states",
    linkLabel: "Read Article",
    badgeText: "MEDIUM BLOG",
    bgStyle: "black",
  },
  {
    id: "aws-cert",
    type: "certificate",
    title: "AWS Certified Developer",
    subtitle: "Amazon Web Services (Associate)",
    content: [
      "Validating cloud deployment workflows, Serverless architectures (Lambda/API Gateway), and MongoDB/DynamoDB scalability parameters.",
      "Verification ID: AWS-7733-DEV"
    ],
    link: "https://aws.amazon.com/verification",
    linkLabel: "Verify Credential",
    badgeText: "AWS CLOUD",
    bgStyle: "split",
  },
  {
    id: "oss-hackathon",
    type: "extra-curricular",
    title: "Open Source Champion",
    subtitle: "Global React Hackathon 2025",
    content: [
      "Awarded 1st place for designing a zero-dependency CLI typescript schema validation tool.",
      "Collaborated in a team of 3 to package, document, and publish on npm in under 48 hours."
    ],
    link: "https://github.com/example/hackathon-repo",
    linkLabel: "View Repository",
    badgeText: "AWARDS",
    bgStyle: "dark",
  },
  {
    id: "framer-sandbox",
    type: "blog",
    title: "Framer Motion Animations",
    subtitle: "Interactive Animation Sandbox",
    content: [
      "A creative sandbox showcasing custom Page Transitions, fluid SVG path morphs, and spring hover card triggers.",
      "Includes code snippets copyable for direct integration."
    ],
    link: "https://framer.com/showcase/example-motion",
    linkLabel: "Inspect Sandbox",
    badgeText: "SANDBOX",
    bgStyle: "red",
  },
  {
    id: "linkedin-rec",
    type: "highlight",
    title: "Wall of Fame Highlights",
    subtitle: "Lead Engineer Recommendation",
    content: [
      "\"Robert has a rare talent for balancing scale and structure with gorgeous, pixel-perfect user interface details. He completely overhauled our Next.js application speed.\"",
      "— Team Lead, Studio Sunlight"
    ],
    link: "https://linkedin.com/in/robert-william-dev",
    linkLabel: "View LinkedIn Profile",
    badgeText: "RECOMMENDATION",
    bgStyle: "white",
  },
];
