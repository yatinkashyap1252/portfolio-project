export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface EducationItem {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  grade?: string;
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
  education: EducationItem[];
  awards: AwardItem[];
  contact: ContactInfo;
}

export const aboutData: AboutData = {
  recruiterMessage: "Thank you for visiting my portfolio. I am a passionate developer focused on building clean, high-performance web applications that combine pixel-perfect design with solid, maintainable code. I am always open to discussing new opportunities, full-time positions, or interesting collaborations. Let's create something exceptional together!",
  signatureName: "Yatin Kashyap",
  aboutText: "I am a Full Stack Developer with professional experience building scalable web solutions. Specializing in modern React frameworks, Next.js, and TypeScript, I design robust frontend architectures while maintaining high visual fidelity and responsive, fluid layout systems. I thrive on solving complex technical problems and converting them into elegant, user-centric experiences.",
  experiences: [
    {
      company: "Surekha Technologies",
      role: "Python Developer Intern",
      period: "Jan 2026 - Present",
      description:
        "Developing custom Odoo modules, XML views, and workflow automations while collaborating directly with clients to deliver tailored business solutions. Contributing to migration projects, PostgreSQL optimization, testing, and deployment activities."
    },
    {
      company: "The GoodGame Theory",
      role: "UI/UX Intern & Team Lead",
      period: "Feb 2025 - Aug 2025",
      description:
        "Led a team of 5 designers to create a centralized design system and high-fidelity prototypes. Improved product navigation efficiency and streamlined collaboration between design and development teams."
    },
    {
      company: "CSRBOX",
      role: "Data Analyst Intern",
      period: "Jul 2025",
      description:
        "Automated data analysis workflows using Python and created interactive visualizations and reports that supported data-driven business decisions."
    },
    {
      company: "Webitto Infotech",
      role: "Flutter Developer Intern",
      period: "Jun 2025",
      description:
        "Developed responsive Flutter applications, integrated REST APIs, and optimized performance to deliver seamless cross-platform mobile experiences."
    }
  ],
  awards: [
    {
      title: "Semi-Finalist - HackNUthon 6.0",
      year: "2025"
    },
    {
      title: "Participant - Smart India Hackathon",
      year: "2024"
    },
    {
      title: "The Agnirva Space Internship Program (ISRO)",
      year: "2025"
    },
    {
      title: "Google AI Workshop Certification",
      year: "2025"
    }
  ],
  education: [
    {
      institution: "University of Delhi",
      degree: "B.Sc. in Computer Science",
      startDate: "2022",
      endDate: "2025",
      grade: "First Class"
    }
  ],

  contact: {
    phone: "+91 9924111787 99999",
    email: "yatinkashyap1252@example.com",
    facebook: "facebook.com",
    linkedin: "https://www.linkedin.com/in/yatin-kashyap-96a7412b6/"
  }
};
