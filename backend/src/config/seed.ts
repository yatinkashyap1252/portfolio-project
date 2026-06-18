import { Hero } from "../models/Hero";
import { About } from "../models/About";
import { Skill } from "../models/Skill";
import { Project } from "../models/Project";
import { Experience } from "../models/Experience";
import { Certificate } from "../models/Certificate";
import { Contact } from "../models/Contact";
import { SEO } from "../models/SEO";
import { Education } from "../models/Education";
import { SkillCategoryModel } from "../models/SkillCategory";
import { Showcase } from "../models/Showcase";

export const seedDatabase = async () => {
  try {
    console.log("=== DB SEED CHECK ===");

    // Clean up old Robert William or previous placeholder seed to force re-seed with Yatin's real details
    const [existingHero, existingAbout, projectCount] = await Promise.all([
      Hero.findOne(),
      About.findOne(),
      Project.countDocuments(),
    ]);
    
    if (
      (existingHero && existingHero.name === "Robert William") ||
      (existingAbout && existingAbout.email === "robert@william.example.com") ||
      (existingAbout && existingAbout.email === "yatin@example.com") ||
      (projectCount !== 4) // Force reseed if projects count is not equal to our 4 actual projects
    ) {
      console.log("Found default or previous placeholder seed data. Clearing database to force re-seed...");
      await Promise.all([
        Hero.deleteMany({}),
        About.deleteMany({}),
        Contact.deleteMany({}),
        SEO.deleteMany({}),
        Skill.deleteMany({}),
        Project.deleteMany({}),
        Experience.deleteMany({}),
        Certificate.deleteMany({}),
        Education.deleteMany({}),
        SkillCategoryModel.deleteMany({}),
        Showcase.deleteMany({}),
      ]);
      console.log("Database cleared successfully.");
    }

    // 1. Seed Hero
    const heroCount = await Hero.countDocuments();
    if (heroCount === 0) {
      console.log("Seeding Hero section...");
      await Hero.create({
        name: "Yatin Kashyap",
        designation: "Python Developer Trainee",
        headline: "Building Modern Scalable Applications",
        shortIntro: "Highly motivated developer specializing in React, Next.js, and Node.js.",
        resumeUrl: "/resume.pdf",
        profileImageUrl: "/portrait.png",
        githubUrl: "https://github.com/yatinkashyap1252",
        linkedinUrl: "https://linkedin.com/in/yatin-kashyap-96a7412b6",
        email: "yatinkashyap1252@gmail.com",
      });
    }

    // 2. Seed About
    const aboutCount = await About.countDocuments();
    if (aboutCount === 0) {
      console.log("Seeding About section...");
      await About.create({
        description: "I am a Full Stack Developer with professional experience building scalable web solutions. Specializing in modern React frameworks, Next.js, and TypeScript, I design robust frontend architectures while maintaining high visual fidelity and responsive, fluid layout systems. I thrive on solving complex technical problems and converting them into elegant, user-centric experiences.",
        experienceYears: 2,
        location: "Ahmedabad, Gujarat, India",
        email: "yatinkashyap1252@gmail.com",
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
        email: "yatinkashyap1252@gmail.com",
        phone: "+91 9924111787",
        location: "Ahmedabad, Gujarat, India",
        githubUrl: "github.com/yatinkashyap1252",
        linkedinUrl: "linkedin.com/in/yatin-kashyap-96a7412b6",
        twitterUrl: "twitter.com/yatin_kashyap",
      });
    }

    // 4. Seed SEO
    const seoCount = await SEO.countDocuments();
    if (seoCount === 0) {
      console.log("Seeding SEO metadata...");
      await SEO.create({
        metaTitle: "Yatin Kashyap | Python Developer Trainee",
        metaDescription: "Python Developer Trainee portfolio website showing projects and internship details.",
        keywords: ["Developer", "Portfolio", "Next.js", "React", "Node.js", "TypeScript", "Yatin Kashyap", "Python", "Odoo"],
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
    const updatedProjectCount = await Project.countDocuments();
    if (updatedProjectCount === 0) {
      console.log("Seeding Projects...");
      const defaultProjects = [
        {
          title: "GlobePath Travel Platform",
          description: "A comprehensive travel planning and booking platform designed to help users discover destinations, manage itineraries, and streamline trip organization through an intuitive user experience.\n\n* Developed responsive travel management interfaces for destination discovery, itinerary planning, and booking workflows.\n* Built scalable backend APIs and database structures to manage travel data, user accounts, and trip information.\n* Implemented optimized user experience flows to simplify travel planning and improve customer engagement.",
          technologies: ["React Native", "Firebase", "Gemini API", "Tailwind CSS"],
          githubUrl: "https://github.com/yatinkashyap1252/globepath",
          liveUrl: null,
          thumbnailUrl: "",
          isFeatured: true,
          isDraft: false,
          displayOrder: 1,
        },
        {
          title: "Safargo - Cab Booking",
          description: "A logistics and transportation management solution focused on shipment tracking, operational monitoring, and business workflow automation.\n\n* Designed and developed logistics dashboards for shipment monitoring, operational insights, and route management.\n* Integrated secure authentication and role-based access control to protect business-critical data.\n* Optimized backend services and database queries to support efficient handling of transportation operations.",
          technologies: ["React Native", "Google Maps API", "Stripe"],
          githubUrl: "https://github.com/yatinkashyap1252/SafarGo",
          liveUrl: null,
          thumbnailUrl: "",
          isFeatured: true,
          isDraft: false,
          displayOrder: 2,
        },
        {
          title: "Pixel Fox Maze Adventure",
          description: "A 2D adventure maze game featuring interactive gameplay mechanics, obstacle navigation, collectible systems, and engaging pixel-art environments.\n\n* Developed core gameplay mechanics including player movement, maze navigation, and interactive obstacle systems.\n* Implemented collectible rewards, level progression, and collision-based game logic to enhance engagement.\n* Designed optimized game environments and responsive controls for a smooth player experience.",
          technologies: ["Python", "OpenCV", "Pygame", "Computer Vision"],
          githubUrl: "https://github.com/yatinkashyap1252/Pixel_Maze_Adventure",
          liveUrl: null,
          thumbnailUrl: "",
          isFeatured: true,
          isDraft: false,
          displayOrder: 3,
        },
        {
          title: "AI Blind Assistant System",
          description: "An AI-powered accessibility solution that assists visually impaired individuals through real-time object detection, voice guidance, and environmental awareness features.\n\n* Built an object detection system capable of identifying surrounding objects and obstacles in real time.\n* Leveraged computer vision and machine learning models to improve environmental awareness and accessibility support.",
          technologies: ["Python", "OpenCV", "YOLO", "Machine Learning", "Computer Vision"],
          githubUrl: "https://github.com/yatinkashyap1252/blind_assistant_bot",
          liveUrl: null,
          thumbnailUrl: "",
          isFeatured: true,
          isDraft: false,
          displayOrder: 4,
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
          companyName: "Surekha Technologies",
          position: "Python Developer Intern",
          duration: "Jan 2026 - Present",
          description: [
            "Developing custom Odoo modules, XML views, and workflow automations while collaborating directly with clients to deliver tailored business solutions.",
            "Contributing to Odoo migration projects by optimizing PostgreSQL queries, validating module compatibility, performing testing, and resolving deployment issues."
          ],
          skillsUsed: ["Python", "Odoo", "PostgreSQL", "XML", "Owl.js", "Git"],
          displayOrder: 1,
        },
        {
          companyName: "The GoodGame Theory",
          position: "UI/UX Intern & Team Lead",
          duration: "Feb 2025 - Aug 2025",
          description: [
            "Led a team of 5 designers to create a centralized design system, reducing design-to-development rework by 20%.",
            "Designed high-fidelity prototypes, user flows, and interface improvements that increased product navigation efficiency by 25%."
          ],
          skillsUsed: ["UI Design", "UX Research", "Design Systems", "Prototyping", "Figma"],
          displayOrder: 2,
        },
        {
          companyName: "CSRBOX",
          position: "Data Analyst Intern",
          duration: "Jul 2025",
          description: [
            "Automated data analysis workflows using Python, improving efficiency in processing large structured datasets.",
            "Created interactive dashboards, visualizations, and analytical reports to support business decision-making and performance tracking."
          ],
          skillsUsed: ["Python", "Pandas", "NumPy", "Matplotlib", "Data Analysis"],
          displayOrder: 3,
        },
        {
          companyName: "Webitto Infotech",
          position: "Flutter Developer Intern",
          duration: "Jun 2025",
          description: [
            "Developed and maintained 10+ responsive Flutter screens, ensuring consistent cross-platform performance across Android and iOS devices.",
            "Integrated REST APIs and optimized asynchronous data handling, improving application responsiveness and real-time data rendering."
          ],
          skillsUsed: ["Flutter", "Dart", "REST APIs", "Firebase", "Mobile Development"],
          displayOrder: 4,
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
          name: "The Agnirva Space Internship Program (ISRO)",
          issuer: "ISRO Recognized Internship",
          date: "2025",
          credentialUrl: "https://www.linkedin.com/in/yatin-kashyap-96a7412b6/",
          displayOrder: 1,
        },
        {
          name: "Google AI Workshop Certification",
          issuer: "Google AI Training",
          date: "2025",
          credentialUrl: "https://www.linkedin.com/in/yatin-kashyap-96a7412b6/",
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
        institution: "University of Delhi",
        degree: "B.Sc. in Computer Science",
        startDate: "2022",
        endDate: "2025",
        grade: "First Class",
        displayOrder: 1,
      });
    }

    // 10. Seed Skill Categories
    const catCount = await SkillCategoryModel.countDocuments();
    if (catCount === 0) {
      console.log("Seeding Skill Categories...");
      const defaultCategories = [
        {
          id: "frontend",
          title: "Frontend Development",
          metric: "95% Performance Score",
          description: "Architecting responsive, SEO-friendly, and lightweight web layouts with polished micro-interactions and scroll animations.",
          visualizerType: "wave",
          displayOrder: 1,
        },
        {
          id: "backend",
          title: "Backend & Databases",
          metric: "99.9% Server Uptime",
          description: "Designing robust server-side infrastructures, data architectures, secure API endpoints, and clean DB queries.",
          visualizerType: "matrix",
          displayOrder: 2,
        },
        {
          id: "state",
          title: "State & Validation",
          metric: "Atomic state reactivity",
          description: "Implementing client-side state managers and establishing client-server schema definitions for structured forms.",
          visualizerType: "nodes",
          displayOrder: 3,
        },
        {
          id: "devops",
          title: "DevOps & Environment",
          metric: "Secure CI/CD Pipelines",
          description: "Handling secure authentication handshakes, asset storage integrations, container builds, and deployment pipelines.",
          visualizerType: "gauge",
          displayOrder: 4,
        },
      ];
      await SkillCategoryModel.insertMany(defaultCategories);
    }

    // 11. Seed Showcase (Wall of Fame)
    const showcaseCount = await Showcase.countDocuments();
    if (showcaseCount === 0) {
      console.log("Seeding Showcase items...");
      const defaultShowcase = [
        {
          type: "certificate",
          title: "The Agnirva Space Internship Program",
          subtitle: "ISRO Recognized Internship Program",
          content: [
            "Successfully completed the Agnirva Space Internship Program focused on space technology, innovation, and research.",
            "Gained exposure to real-world applications of aerospace and emerging technologies.",
            "Recognized for active participation and project contributions."
          ],
          link: "https://www.linkedin.com/in/yatin-kashyap-96a7412b6/overlay/Certifications/1205639962/treasury/?profileId=ACoAAEvthCIB06mEdc6RR2hq_jNwRFPK5kTX5t4",
          linkLabel: "View Certificate",
          badgeText: "ISRO",
          bgStyle: "white",
          displayOrder: 1,
        },
        {
          type: "certificate",
          title: "Google AI Workshop",
          subtitle: "Artificial Intelligence & Generative AI",
          content: [
            "Completed hands-on training covering AI fundamentals, machine learning concepts, and modern Generative AI workflows.",
            "Explored practical AI applications and industry use cases.",
            "Strengthened understanding of AI-powered product development."
          ],
          link: "https://www.linkedin.com/in/yatin-kashyap-96a7412b6/overlay/Certifications/358443216/treasury/?profileId=ACoAAEvthCIB06mEdc6RR2hq_jNwRFPK5kTX5t4",
          linkLabel: "View Certificate",
          badgeText: "GOOGLE AI",
          bgStyle: "split",
          displayOrder: 2,
        },
        {
          type: "extra-curricular",
          title: "HackNUthon 6.0 Semi-Finalist",
          subtitle: "National Level Hackathon",
          content: [
            "Reached the Semi-Final round among numerous participating teams.",
            "Collaborated in a competitive environment to build innovative solutions under strict deadlines.",
            "Demonstrated problem-solving, teamwork, and rapid prototyping skills."
          ],
          link: "https://www.linkedin.com/in/yatin-kashyap-96a7412b6/overlay/Certifications/482372370/treasury/?profileId=ACoAAEvthCIB06mEdc6RR2hq_jNwRFPK5kTX5t4",
          linkLabel: "View Achievement",
          badgeText: "HACKATHON",
          bgStyle: "dark",
          displayOrder: 3,
        },
        {
          type: "extra-curricular",
          title: "Smart India Hackathon 2024",
          subtitle: "Government of India Innovation Initiative",
          content: [
            "Participated in India's largest innovation competition.",
            "Worked on real-world problem statements and solution development.",
            "Collaborated with multidisciplinary teams to design scalable technology solutions."
          ],
          link: "https://www.linkedin.com/in/yatin-kashyap-96a7412b6/overlay/Certifications/506709670/treasury/?profileId=ACoAAEvthCIB06mEdc6RR2hq_jNwRFPK5kTX5t4",
          linkLabel: "View Details",
          badgeText: "SIH 2024",
          bgStyle: "red",
          displayOrder: 4,
        },
        {
          type: "highlight",
          title: "UI/UX Team Leadership",
          subtitle: "The GoodGame Theory",
          content: [
            "Led a team of 5 designers while serving as UI/UX Intern and Team Lead.",
            "Architected a centralized design system that reduced design-to-development rework by 20%.",
            "Improved navigation efficiency through user-centered design and prototyping."
          ],
          link: "https://www.linkedin.com/in/yatin-kashyap-96a7412b6/overlay/Position/2690723839/treasury/?profileId=ACoAAEvthCIB06mEdc6RR2hq_jNwRFPK5kTX5t4",
          linkLabel: "View Experience",
          badgeText: "LEADERSHIP",
          bgStyle: "black",
          displayOrder: 5,
        },
        {
          type: "highlight",
          title: "Enterprise Odoo Development",
          subtitle: "Surekha Technologies",
          content: [
            "Collaborated directly with clients to deliver customized ERP solutions.",
            "Developed Python-based Odoo modules, XML views, and workflow automations.",
            "Contributed to migration projects, PostgreSQL optimization, testing, and deployment."
          ],
          link: "https://www.linkedin.com/in/yatin-kashyap-96a7412b6/",
          linkLabel: "View Experience",
          badgeText: "PYTHON",
          bgStyle: "white",
          displayOrder: 6,
        },
      ];
      await Showcase.insertMany(defaultShowcase);
    }

    console.log("=== DB SEED COMPLETED ===");
  } catch (error) {
    console.error("Database seeding failure:", error);
  }
};
