import type { Metadata, Viewport } from "next";
import { Space_Mono, Space_Grotesk, Caveat } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://yatin-portfolio.vercel.app"),
  title: {
    default: "Yatin Kashyap | Full Stack Developer Portfolio",
    template: "%s | Yatin Kashyap",
  },
  description: "Personal Resume and Portfolio Website of Yatin Kashyap. Full Stack Developer specializing in React, Next.js, Python, and scalable web solutions.",
  keywords: [
    "Yatin Kashyap",
    "Full Stack Developer",
    "Python Developer",
    "Software Engineer",
    "React Developer",
    "Next.js Developer",
    "Odoo Developer",
    "Portfolio",
    "Resume",
  ],
  authors: [{ name: "Yatin Kashyap", url: "https://yatin-portfolio.vercel.app" }],
  creator: "Yatin Kashyap",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Yatin Kashyap | Full Stack Developer Portfolio",
    description: "Personal Resume and Portfolio Website of Yatin Kashyap. Full Stack Developer specializing in React, Next.js, Python, and scalable web solutions.",
    url: "https://yatin-portfolio.vercel.app",
    siteName: "Yatin Kashyap Portfolio",
    images: [
      {
        url: "/portrait.png",
        width: 1200,
        height: 900,
        alt: "Yatin Kashyap - Full Stack Developer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yatin Kashyap | Full Stack Developer Portfolio",
    description: "Personal Resume and Portfolio Website of Yatin Kashyap. Full Stack Developer specializing in React, Next.js, Python, and scalable web solutions.",
    images: ["/portrait.png"],
    creator: "@YatinKashy60844",
  },
  verification: {
    google: "GOOGLE_SEARCH_CONSOLE_PLACEHOLDER",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://yatin-portfolio.vercel.app/#person",
        "name": "Yatin Kashyap",
        "jobTitle": "Full Stack Developer",
        "url": "https://yatin-portfolio.vercel.app",
        "image": "https://yatin-portfolio.vercel.app/portrait.png",
        "email": "yatinkashyap1252@gmail.com",
        "telephone": "+91 9924111787",
        "sameAs": [
          "https://github.com/yatinkashyap1252",
          "https://www.linkedin.com/in/yatin-kashyap-96a7412b6/",
          "https://x.com/YatinKashy60844",
        ],
        "worksFor": {
          "@type": "Organization",
          "name": "Surekha Technologies",
        },
        "alumniOf": {
          "@type": "EducationalOrganization",
          "name": "Vishwakarma Government Engineering College",
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://yatin-portfolio.vercel.app/#website",
        "url": "https://yatin-portfolio.vercel.app",
        "name": "Yatin Kashyap | Portfolio",
        "description": "Personal Resume and Portfolio Website of Yatin Kashyap",
        "publisher": {
          "@id": "https://yatin-portfolio.vercel.app/#person",
        },
      },
      {
        "@type": "CreativeWork",
        "@id": "https://yatin-portfolio.vercel.app/#project-globepath",
        "name": "GlobePath Travel Platform",
        "description": "A comprehensive travel planning and booking platform designed to help users discover destinations, manage itineraries, and streamline trip organization.",
        "creator": {
          "@id": "https://yatin-portfolio.vercel.app/#person",
        },
        "codeRepository": "https://github.com/yatinkashyap1252/globepath",
      },
      {
        "@type": "CreativeWork",
        "@id": "https://yatin-portfolio.vercel.app/#project-safargo",
        "name": "Safargo - Cab Booking",
        "description": "A logistics and transportation management solution focused on shipment tracking, operational monitoring, and business workflow automation.",
        "creator": {
          "@id": "https://yatin-portfolio.vercel.app/#person",
        },
        "codeRepository": "https://github.com/yatinkashyap1252/SafarGo",
      },
      {
        "@type": "CreativeWork",
        "@id": "https://yatin-portfolio.vercel.app/#project-pixelfox",
        "name": "Pixel Fox Maze Adventure",
        "description": "A 2D adventure maze game featuring interactive gameplay mechanics, obstacle navigation, collectible systems, and engaging pixel-art environments.",
        "creator": {
          "@id": "https://yatin-portfolio.vercel.app/#person",
        },
        "codeRepository": "https://github.com/yatinkashyap1252/Pixel_Maze_Adventure",
      },
      {
        "@type": "CreativeWork",
        "@id": "https://yatin-portfolio.vercel.app/#project-blindassistant",
        "name": "AI Blind Assistant System",
        "description": "An AI-powered accessibility solution that assists visually impaired individuals through real-time object detection, voice guidance, and environmental awareness features.",
        "creator": {
          "@id": "https://yatin-portfolio.vercel.app/#person",
        },
        "codeRepository": "https://github.com/yatinkashyap1252/blind_assistant_bot",
      },
      {
        "@type": "WebApplication",
        "@id": "https://yatin-portfolio.vercel.app/#project-medclinic",
        "name": "Premium Medical Clinic",
        "description": "An MNC-grade, premium medical clinic presentation dashboard with fluid scroll animations, interactive appointment forms, team bios, and custom FAQs.",
        "creator": {
          "@id": "https://yatin-portfolio.vercel.app/#person",
        },
        "url": "https://premium-med-clinic.vercel.app",
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://yatin-portfolio.vercel.app/#project-detectivekiller",
        "name": "Detective Killer Game",
        "description": "A rich text-adventure mystery game that puts players in the shoes of a detective. Navigate branching choices, inspect evidence logs, construct suspect testimonies, and solve complex cases.",
        "creator": {
          "@id": "https://yatin-portfolio.vercel.app/#person",
        },
        "url": "https://detective-killer-game.onrender.com",
        "applicationCategory": "Game",
      },
      {
        "@type": "WebApplication",
        "@id": "https://yatin-portfolio.vercel.app/#project-fitprogym",
        "name": "FitPro Gym Suite",
        "description": "A high-fidelity premium dark-themed fitness dashboard tracking active boxing sessions, pulse counts, and bento-style metric indicators with silky-smooth micro-animations.",
        "creator": {
          "@id": "https://yatin-portfolio.vercel.app/#person",
        },
        "url": "https://fitpro-gym-app.vercel.app",
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${spaceMono.variable} ${spaceGrotesk.variable} ${caveat.variable} h-full antialiased`}
    >
      <head>
        {/* Preconnect/DNS-prefetch to critical external domains */}
        <link rel="preconnect" href="https://github.com" />
        <link rel="dns-prefetch" href="https://github.com" />
        <link rel="preconnect" href="https://linkedin.com" />
        <link rel="dns-prefetch" href="https://linkedin.com" />
        <link rel="preconnect" href="https://www.linkedin.com" />
        <link rel="dns-prefetch" href="https://www.linkedin.com" />
        
        {/* Render dynamic structured metadata schema directly in <head> */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
