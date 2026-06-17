import { Hero } from "../models/Hero";
import { About } from "../models/About";
import { Skill } from "../models/Skill";
import { Project } from "../models/Project";
import { Experience } from "../models/Experience";
import { Certificate } from "../models/Certificate";
import { Contact } from "../models/Contact";
import { SEO } from "../models/SEO";
import { Education } from "../models/Education";

export const seedDatabase = async () => {
  try {
    console.log("=== DB SEED CHECK ===");

    // 1. Seed Hero
    const heroCount = await Hero.countDocuments();
    if (heroCount === 0) {
      console.log("Seeding Hero section...");
      await Hero.create({
        name: "Robert William",
        designation: "Senior Software Developer",
        headline: "Building Modern Scalable Applications",
        shortIntro: "Highly motivated developer specializing in React, Next.js, and Node.js.",
        resumeUrl: "/resume.pdf",
        profileImageUrl: "/portrait.png",
        githubUrl: "https://github.com/robertwilliam",
        linkedinUrl: "https://linkedin.com/in/robert-william-dev",
        email: "robert@william.example.com",
      });
    }

    // 2. Seed About
    const aboutCount = await About.countDocuments();
    if (aboutCount === 0) {
      console.log("Seeding About section...");
      await About.create({
        description: "I am a Senior Software Developer with over 6 years of professional experience building scalable web solutions. Specializing in modern React frameworks, Next.js, and TypeScript, I design robust frontend architectures while maintaining high visual fidelity and responsive, fluid layout systems. I thrive on solving complex technical problems and converting them into elegant, user-centric experiences.",
        experienceYears: 6,
        location: "London, UK",
        email: "robert@william.example.com",
        highlights: ["React Expert", "Next.js Specialist", "Node.js Architect", "TypeScript Developer"],
        signatureUrl: "",
        recruiterMessage: "Thank you for visiting my portfolio. I am a passionate developer focused on building clean, high-performance web applications that combine pixel-perfect design with solid, maintainable code. I am always open to discussing new opportunities, full-time positions, or interesting collaborations. Let's create something exceptional together!",
      });
    }

    // 3. Seed Contact
    const contactCount = await Contact.countDocuments();
    if (contactCount === 0) {
      console.log("Seeding Contact section...");
      await Contact.create({
        email: "robert@william.example.com",
        phone: "000-827333-3837",
        location: "London, UK",
        githubUrl: "github.com/robertwilliam",
        linkedinUrl: "linkedin.com/in/robert-william-dev",
        twitterUrl: "twitter.com/robert_william",
      });
    }

    // 4. Seed SEO
    const seoCount = await SEO.countDocuments();
    if (seoCount === 0) {
      console.log("Seeding SEO metadata...");
      await SEO.create({
        metaTitle: "Robert William | Senior Software Developer",
        metaDescription: "Senior Software Developer portfolio website showing Next.js, React, Node.js, and TypeScript project details.",
        keywords: ["Software Developer", "Portfolio", "Next.js", "React", "Node.js", "TypeScript", "Robert William"],
        ogImageUrl: "/portrait.png",
      });
    }

    // 5. Seed Skills
    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      console.log("Seeding Technical Skills...");
      const defaultSkills = [
        // Frontend
        { name: "Next.js 15+", category: "frontend", proficiency: 95, displayOrder: 1 },
        { name: "React 19", category: "frontend", proficiency: 98, displayOrder: 2 },
        { name: "TypeScript", category: "frontend", proficiency: 94, displayOrder: 3 },
        { name: "Tailwind CSS", category: "frontend", proficiency: 90, displayOrder: 4 },
        { name: "Framer Motion", category: "frontend", proficiency: 88, displayOrder: 5 },
        // Backend
        { name: "Node.js", category: "backend", proficiency: 92, displayOrder: 6 },
        { name: "Express.js", category: "backend", proficiency: 90, displayOrder: 7 },
        { name: "MongoDB", category: "backend", proficiency: 86, displayOrder: 8 },
        { name: "Mongoose", category: "backend", proficiency: 85, displayOrder: 9 },
        { name: "REST APIs", category: "backend", proficiency: 95, displayOrder: 10 },
        // State
        { name: "Zustand", category: "state", proficiency: 90, displayOrder: 11 },
        { name: "Redux Toolkit", category: "state", proficiency: 82, displayOrder: 12 },
        { name: "React Hook Form", category: "state", proficiency: 92, displayOrder: 13 },
        { name: "Zod Validation", category: "state", proficiency: 95, displayOrder: 14 },
        // DevOps
        { name: "Docker", category: "devops", proficiency: 80, displayOrder: 15 },
        { name: "Git / GitHub", category: "devops", proficiency: 92, displayOrder: 16 },
        { name: "JWT Auth", category: "devops", proficiency: 95, displayOrder: 17 },
        { name: "Cloudinary SDK", category: "devops", proficiency: 85, displayOrder: 18 },
        { name: "npm / npx", category: "devops", proficiency: 90, displayOrder: 19 },
      ];
      await Skill.insertMany(defaultSkills);
    }

    // 6. Seed Projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      console.log("Seeding Projects...");
      const defaultProjects = [
        {
          title: "Neos Crypto Analytics Dashboard",
          description: "A high-fidelity real-time crypto sentiment analytics and automated trading dashboard. It integrates WebSocket sockets to capture market triggers and display live trend shifts.\n\n* Engineered low-latency live chart visualizers using responsive canvas layouts and custom grid rendering.\n* Established secure user authorization gateways utilizing stateless JWT validation handshakes.\n* Structured dynamic schema state in Zustand to synchronize client-side components with instant database updates.",
          technologies: ["Next.js 15", "TypeScript", "Zustand", "Tailwind CSS", "Framer Motion", "WebSockets"],
          githubUrl: "https://github.com/robertwilliam/neos-crypto-analytics",
          liveUrl: "https://neos-crypto-analytics.example.com",
          thumbnailUrl: "/portrait.png",
          isFeatured: true,
          isDraft: false,
          displayOrder: 1,
        },
        {
          title: "Express Microservices Gateway API",
          description: "A secure, scalable API gateway orchestrating internal microservices. Manages high-throughput route mapping, system rate limiting, caching, and consolidated service diagnostic logs.\n\n* Engineered a dynamic rate-limiting algorithm in Redis, mitigating DDoS overloads by 40% under peak conditions.\n* Designed a centralized MongoDB log aggregation database schema to streamline system diagnostics.\n* Configured robust Docker container builds to maintain automated local scaling and deployment parameters.",
          technologies: ["Node.js", "Express.js", "MongoDB", "Redis Cache", "Docker", "JWT Auth"],
          githubUrl: "https://github.com/robertwilliam/express-gateway-api",
          thumbnailUrl: "/portrait.png",
          isFeatured: true,
          isDraft: false,
          displayOrder: 2,
        },
        {
          title: "Zustand Atomic State Orchestrator",
          description: "A lightweight, atomic state management wrapper utility optimized for massive React form bindings. Simplifies nested key state updates and schemas.\n\n* Published a reusable npm package supporting multi-level nested form validation resolvers out-of-the-box.\n* Optimized rendering pipelines, reducing React component re-render frequency by 70% during typing.\n* Built clean TypeScript generic interfaces to ensure strict compile-time types safety across form fields.",
          technologies: ["TypeScript", "React", "Zustand", "Zod Schema", "npm / CLI"],
          githubUrl: "https://github.com/robertwilliam/atomic-state-orchestrator",
          liveUrl: "https://www.npmjs.com/package/atomic-state-orchestrator",
          thumbnailUrl: "/portrait.png",
          isFeatured: true,
          isDraft: false,
          displayOrder: 3,
        },
      ];
      await Project.insertMany(defaultProjects);
    }

    // 7. Seed Experience
    const experienceCount = await Experience.countDocuments();
    if (experienceCount === 0) {
      console.log("Seeding Experience...");
      const defaultExperience = [
        {
          companyName: "Studio Sunlight In UK",
          position: "Lead Full Stack Developer",
          duration: "2019 - Present",
          description: [
            "Responsible for orchestrating frontend architectures in Next.js, optimizing RESTful APIs, and implementing reusable design systems.",
            "Achieved a 45% reduction in page load speed and mentored junior developers on clean code standards."
          ],
          skillsUsed: ["Next.js", "TypeScript", "REST APIs", "Node.js"],
          displayOrder: 1,
        },
        {
          companyName: "Studio Mirror In UK",
          position: "Senior Frontend Engineer",
          duration: "2016 - 2019",
          description: [
            "Spearheaded the migration of legacy dashboards to modern React.",
            "Created a shared Tailwind-based component library that accelerated feature delivery times by 30% across multiple teams."
          ],
          skillsUsed: ["React", "JavaScript", "Tailwind CSS", "Redux"],
          displayOrder: 2,
        },
      ];
      await Experience.insertMany(defaultExperience);
    }

    // 8. Seed Certificates
    const certificateCount = await Certificate.countDocuments();
    if (certificateCount === 0) {
      console.log("Seeding Certificates...");
      const defaultCertificates = [
        {
          name: "Next.js Advanced Developer",
          issuer: "Vercel Professional Certification",
          date: "2024",
          credentialUrl: "https://vercel.com/verification",
          displayOrder: 1,
        },
        {
          name: "AWS Certified Developer",
          issuer: "Amazon Web Services (Associate)",
          date: "2023",
          credentialUrl: "https://aws.amazon.com/verification",
          displayOrder: 2,
        },
      ];
      await Certificate.insertMany(defaultCertificates);
    }

    // 9. Seed Education
    const educationCount = await Education.countDocuments();
    if (educationCount === 0) {
      console.log("Seeding Education...");
      await Education.create({
        institution: "University of London",
        degree: "B.Sc. in Computer Science",
        startDate: "2012",
        endDate: "2015",
        grade: "First Class Honours",
        displayOrder: 1,
      });
    }

    console.log("=== DB SEED COMPLETED ===");
  } catch (error) {
    console.error("Database seeding failure:", error);
  }
};
