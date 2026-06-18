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
  imageUrl?: string;
}

export const showcaseItems: ShowcaseItem[] = [
  {
    id: "isro-internship",
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
  },

  {
    id: "google-ai",
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
  },

  {
    id: "hacknuthon",
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
  },

  {
    id: "sih-2024",
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
  },

  {
    id: "goodgame-lead",
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
  },

  {
    id: "surekha-odoo",
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
  },
];