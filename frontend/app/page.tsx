import React from "react";
import Hero from "@/components/sections/Hero";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import LiveDeploymentsSection from "@/components/sections/LiveDeploymentsSection";
import ShowcaseSection from "@/components/sections/ShowcaseSection";
import ContactSection from "@/components/sections/ContactSection";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="min-h-screen bg-black flex flex-col justify-start">
      <Hero />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <LiveDeploymentsSection />
      <ShowcaseSection />
      <ContactSection />
    </main>
  );
}
