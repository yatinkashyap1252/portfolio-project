export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface AwardItem {
  title: string;
  year: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  facebook: string;
  linkedin: string;
}

export interface AboutData {
  recruiterMessage: string;
  signatureName: string;
  aboutText: string;
  experiences: ExperienceItem[];
  awards: AwardItem[];
  contact: ContactInfo;
}

export const aboutData: AboutData = {
  recruiterMessage: "Thank you for visiting my portfolio. I am a passionate developer focused on building clean, high-performance web applications that combine pixel-perfect design with solid, maintainable code. I am always open to discussing new opportunities, full-time positions, or interesting collaborations. Let's create something exceptional together!",
  signatureName: "Robert William",
  aboutText: "I am a Senior Software Developer with over 6 years of professional experience building scalable web solutions. Specializing in modern React frameworks, Next.js, and TypeScript, I design robust frontend architectures while maintaining high visual fidelity and responsive, fluid layout systems. I thrive on solving complex technical problems and converting them into elegant, user-centric experiences.",
  experiences: [
    {
      company: "Studio Sunlight In UK",
      role: "Lead Full Stack Developer",
      period: "2019 - Present",
      description: "Responsible for orchestrating frontend architectures in Next.js, optimizing RESTful APIs, and implementing reusable design systems. Achieved a 45% reduction in page load speed and mentored junior developers on clean code standards."
    },
    {
      company: "Studio Mirror In UK",
      role: "Senior Frontend Engineer",
      period: "2016 - 2019",
      description: "Spearheaded the migration of legacy dashboards to modern React. Created a shared Tailwind-based component library that accelerated feature delivery times by 30% across multiple teams."
    }
  ],
  awards: [
    { title: "Best Consultant", year: "2024" },
    { title: "Gold Innovation Award", year: "2023" },
    { title: "International CS Developer", year: "2022" },
    { title: "Great Consultant", year: "2020" }
  ],
  contact: {
    phone: "000-827333-3837",
    email: "robert@william.example.com",
    facebook: "facebook.com/robert.william.dev",
    linkedin: "linkedin.com/in/robert-william-dev"
  }
};
