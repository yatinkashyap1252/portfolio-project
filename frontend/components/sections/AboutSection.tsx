"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, Award, ArrowRight, Star } from "lucide-react";
import { aboutData } from "@/data/about";
import { heroData } from "@/data/hero";
import { fetchAPI } from "@/lib/api";

const formatUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `https://${url}`;
};

const getCleanUsername = (url: string, platform: "linkedin" | "github" | "twitter" | "facebook") => {
  if (!url) return "";
  let clean = url.replace(/^(https?:\/\/)?(www\.)?/, "");
  
  if (platform === "linkedin") {
    clean = clean.replace(/^linkedin\.com\/in\//, "");
  } else if (platform === "github") {
    clean = clean.replace(/^github\.com\//, "");
  } else if (platform === "twitter") {
    clean = clean.replace(/^(twitter\.com|x\.com)\//, "");
  }
  
  clean = clean.split("?")[0].replace(/\/$/, "");
  
  if (platform === "twitter" && !clean.startsWith("@")) {
    return `@${clean}`;
  }
  
  return clean;
};

export default function AboutSection() {
  const [formattedDate, setFormattedDate] = useState("");
  const [about, setAbout] = useState({ ...aboutData, signatureUrl: "" });
  const [hero, setHero] = useState(heroData);

  // Dynamically set date on client-side to prevent hydration mismatches
  useEffect(() => {
    const today = new Date();
    setFormattedDate(
      today.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    );
  }, []);

  useEffect(() => {
    async function loadAboutData() {
      const heroRes = await fetchAPI<any>("/cms/hero");
      const aboutRes = await fetchAPI<any>("/cms/about");
      const expRes = await fetchAPI<any[]>("/cms/experience");
      const eduRes = await fetchAPI<any[]>("/cms/education");
      const certRes = await fetchAPI<any[]>("/cms/certificates");
      const contactRes = await fetchAPI<any>("/cms/contact");

      if (heroRes) {
        setHero((prev) => ({
          ...prev,
          name: heroRes.name || prev.name,
          role: heroRes.designation || prev.role,
          image: heroRes.profileImageUrl || prev.image,
          email: heroRes.email || prev.email,
        }));
      }

      if (aboutRes) {
        setAbout((prev) => ({
          ...prev,
          aboutText: aboutRes.description || prev.aboutText,
          recruiterMessage: aboutRes.recruiterMessage || prev.recruiterMessage,
          signatureName: heroRes?.name || prev.signatureName,
          signatureUrl: aboutRes.signatureUrl || "",
        }));
      }

      if (expRes && expRes.length > 0) {
        const mappedExp = expRes.map((exp: any) => ({
          company: exp.companyName,
          role: exp.position,
          period: exp.duration,
          description: exp.description ? exp.description.join(" ") : "",
        }));
        setAbout((prev) => ({
          ...prev,
          experiences: mappedExp,
        }));
      }

      if (eduRes && eduRes.length > 0) {
        const mappedEdu = eduRes.map((edu: any) => ({
          institution: edu.institution,
          degree: edu.degree,
          startDate: edu.startDate,
          endDate: edu.endDate,
          grade: edu.grade,
        }));
        setAbout((prev) => ({
          ...prev,
          education: mappedEdu,
        }));
      }

      if (certRes && certRes.length > 0) {
        const mappedCerts = certRes.map((cert: any) => ({
          title: cert.name,
          year: cert.date,
        }));
        setAbout((prev) => ({
          ...prev,
          awards: mappedCerts,
        }));
      }

      if (contactRes) {
        setAbout((prev) => ({
          ...prev,
          contact: {
            phone: contactRes.phone || prev.contact.phone,
            email: contactRes.email || prev.contact.email,
            facebook: contactRes.twitterUrl || prev.contact.facebook,
            linkedin: contactRes.linkedinUrl || prev.contact.linkedin,
            github: contactRes.githubUrl || prev.contact.github,
          },
        }));
      }
    }
    loadAboutData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="bg-black py-8 px-4 md:px-8 lg:px-16 text-white flex justify-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="w-full max-w-7xl border border-zinc-800 bg-[#0A0A0A] flex flex-col"
      >
        {/* ========================================================================= */}
        {/* HEADER BANNER: Creative Cohesive Abstract Geometric Composition */}
        {/* ========================================================================= */}
        <div className="h-[260px] md:h-[320px] w-full grid grid-cols-12 border-b border-zinc-800 relative overflow-hidden">
          {/* Vertical Name Box (Col 3) */}
          <div className="col-span-4 md:col-span-3 bg-white flex items-center justify-center border-r border-zinc-800 select-none">
            <h2 className="text-black font-sans font-black text-4xl md:text-6xl tracking-[0.15em] uppercase select-none origin-center rotate-[-90deg] whitespace-nowrap">
              ABOUT
            </h2>
          </div>

          {/* SVG Tech / Editorial Art Panel (Col 8 / 9) */}
          <div className="col-span-8 md:col-span-9 bg-zinc-950 relative overflow-hidden flex items-center justify-between p-8">
            {/* Dynamic Date on Top Right */}
            <div className="absolute top-6 right-6 font-mono text-[11px] md:text-xs text-zinc-500 tracking-widest z-10">
              {formattedDate || "June 17, 2026"}
            </div>

            {/* Creative SVG Abstract Art */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 md:opacity-75">
              {/* Technical Dot Matrix Grid */}
              <defs>
                <pattern id="dot-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" className="fill-zinc-800" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dot-grid)" />

              {/* Bold Red Accent Circles */}
              <circle cx="20%" cy="50%" r="90" className="fill-[#E63925]/20 stroke-[#E63925]/40 stroke-2" />
              <circle cx="20%" cy="50%" r="50" className="fill-[#E63925] opacity-80" />

              {/* Dark Overlapping Ring */}
              <circle cx="25%" cy="45%" r="75" className="fill-none stroke-zinc-700 stroke-[1.5] stroke-dasharray-[5,5]" />

              {/* Connecting Tech Lines */}
              <line x1="0" y1="50%" x2="100%" y2="50%" className="stroke-zinc-800 stroke-[1.5]" />
              <line x1="20%" y1="0" x2="20%" y2="100%" className="stroke-zinc-800 stroke-[1.5]" />
              
              {/* Abstract Floating Vector Shapes */}
              <g transform="translate(180, 80) rotate(25)">
                <rect x="0" y="0" width="12" height="120" className="fill-zinc-800" />
                <rect x="25" y="40" width="12" height="80" className="fill-zinc-700" />
                <circle cx="6" cy="130" r="6" className="fill-[#E63925]" />
              </g>

              {/* Additional Decorative Details */}
              <circle cx="80%" cy="60%" r="60" className="fill-none stroke-zinc-800 stroke-2" />
              <circle cx="80%" cy="60%" r="8" className="fill-[#E63925]" />
              <line x1="80%" y1="10%" x2="80%" y2="90%" className="stroke-zinc-900 stroke-1" />
            </svg>

            {/* Editorial Labels inside banner */}
            <div className="relative z-10 mt-auto max-w-[280px] md:max-w-md space-y-2 select-none">
              <span className="font-mono text-xs text-[#E63925] tracking-widest font-bold block uppercase">
                SECTION 02 / CLIENT UI
              </span>
              <h3 className="text-xl md:text-3xl font-sans font-extrabold tracking-tight leading-none text-zinc-100 uppercase">
                Profile & <br className="hidden md:inline" /> Qualifications
              </h3>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TWO-COLUMN DETAILS GRID */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* -------------------------------------------------- */}
          {/* LEFT COLUMN: Message & Recruiter Intro (Span 5) */}
          {/* -------------------------------------------------- */}
          <div className="lg:col-span-5 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-zinc-800 flex flex-col justify-between">
            
            {/* Owner Header */}
            <div className="space-y-4 mb-8">
              <h3 className="text-2xl md:text-3xl font-sans font-black tracking-tight uppercase leading-none">
                {hero.name}
              </h3>
              <p className="font-mono text-xs md:text-sm text-zinc-500 uppercase tracking-widest leading-none">
                {hero.role}
              </p>
            </div>

            {/* Profile Photo with rounded corners and rotating text badge */}
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 mb-8 max-w-sm self-center lg:self-start group">
              <img
                src={hero.image}
                alt={hero.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-out"
              />

              {/* Rotating Circular Text Emblem overlay in bottom-right */}
              <div className="absolute bottom-4 right-4 w-24 h-24 pointer-events-none">
                {/* SVG circular path */}
                <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_16s_linear_infinite]">
                  <path
                    id="textPath"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    fill="none"
                  />
                  <text className="text-[7.5px] uppercase font-mono tracking-[0.2em] fill-white font-bold drop-shadow-md">
                    <textPath href="#textPath" startOffset="0%">
                      * {hero.name} * Developer Portfolio
                    </textPath>
                  </text>
                </svg>
                {/* Center Star */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Star className="h-4.5 w-4.5 text-[#E63925] fill-[#E63925]" />
                </div>
              </div>
            </div>

            {/* Recruiter Message */}
            <div className="space-y-6 pt-4 border-t border-zinc-900">
              <span className="font-sans font-black text-sm uppercase tracking-widest text-[#E63925] block">
                Dear Visitor,
              </span>
              <p className="text-zinc-400 text-sm leading-relaxed tracking-wide font-light">
                {about.recruiterMessage}
              </p>

              {/* Handwritten signature section */}
              <div className="mt-8 pt-4 flex flex-col items-start gap-1">
                {about.signatureUrl ? (
                  <img
                    src={about.signatureUrl}
                    alt="Signature"
                    loading="lazy"
                    className="h-16 w-auto object-contain select-none max-w-[200px] brightness-125"
                  />
                ) : (
                  <span className="font-signature text-4xl text-zinc-100 rotate-[-2deg] transform origin-left tracking-wide block py-2 select-none">
                    {about.signatureName}
                  </span>
                )}
                <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
                  // {about.signatureName}
                </span>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------- */}
          {/* RIGHT COLUMN: About text, Experience, Contacts (Span 7) */}
          {/* -------------------------------------------------- */}
          <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-start gap-12">
            
            {/* About Me Section */}
            <div className="space-y-4">
              <h4 className="font-sans font-black text-base uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#E63925]" />
                About Me
              </h4>
              <p className="text-zinc-300 text-sm md:text-base leading-relaxed tracking-wide font-light">
                {about.aboutText}
              </p>
            </div>

            {/* My Experience Timeline */}
            <div className="space-y-6">
              <h4 className="font-sans font-black text-base uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#E63925]" />
                My Experience
              </h4>
              
              <div className="space-y-8">
                {about.experiences.map((exp, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 group">
                    {/* Index Number */}
                    <div className="md:col-span-2 font-mono text-3xl font-black text-zinc-800 group-hover:text-[#E63925] transition-colors leading-none">
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                    {/* Details */}
                    <div className="md:col-span-10 space-y-2">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                        <h5 className="font-sans font-extrabold text-zinc-200 group-hover:text-white transition-colors text-sm uppercase tracking-wider">
                          {exp.role} / <span className="text-zinc-400">{exp.company}</span>
                        </h5>
                        <span className="font-mono text-xs text-zinc-500 tracking-wider">
                          {exp.period}
                        </span>
                      </div>
                      <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-light">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* My Education Timeline */}
            {about.education && about.education.length > 0 && (
              <div className="space-y-6">
                <h4 className="font-sans font-black text-base uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#E63925]" />
                  My Education
                </h4>
                
                <div className="space-y-8">
                  {about.education.map((edu, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 group">
                      {/* Index Number */}
                      <div className="md:col-span-2 font-mono text-3xl font-black text-zinc-800 group-hover:text-[#E63925] transition-colors leading-none">
                        {String(idx + 1).padStart(2, "0")}
                      </div>
                      {/* Details */}
                      <div className="md:col-span-10 space-y-2">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                          <h5 className="font-sans font-extrabold text-zinc-200 group-hover:text-white transition-colors text-sm uppercase tracking-wider">
                            {edu.degree} / <span className="text-zinc-400">{edu.institution}</span>
                          </h5>
                          <span className="font-mono text-xs text-zinc-500 tracking-wider">
                            {edu.startDate} - {edu.endDate}
                          </span>
                        </div>
                        {edu.grade && (
                          <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-light">
                            Grade: {edu.grade}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Info List */}
            <div className="space-y-6">
              <h4 className="font-sans font-black text-base uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#E63925]" />
                Contact Info
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                {/* Phone */}
                <a
                  href={`tel:${about.contact.phone}`}
                  className="flex items-center justify-between p-4 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-950/40 rounded-xl transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-zinc-900/60 flex items-center justify-center group-hover:bg-[#E63925]/10 group-hover:text-[#E63925] transition-colors">
                      <Phone className="h-4 w-4 text-zinc-400 group-hover:text-[#E63925] transition-colors" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-zinc-600 uppercase tracking-widest block">Phone</span>
                      <span className="text-zinc-300 font-bold group-hover:text-white">{about.contact.phone}</span>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-zinc-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </a>

                {/* GitHub */}
                <a
                  href={formatUrl(about.contact.github)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-950/40 rounded-xl transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-zinc-900/60 flex items-center justify-center group-hover:bg-[#E63925]/10 group-hover:text-[#E63925] transition-colors">
                      <svg className="h-4 w-4 text-zinc-400 group-hover:text-[#E63925] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-zinc-600 uppercase tracking-widest block">GitHub</span>
                      <span className="text-zinc-300 font-bold group-hover:text-white truncate max-w-[130px] block">
                        {getCleanUsername(about.contact.github, "github")}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-zinc-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </a>

                {/* Linkedin */}
                <a
                  href={formatUrl(about.contact.linkedin)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-950/40 rounded-xl transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-zinc-900/60 flex items-center justify-center group-hover:bg-[#E63925]/10 group-hover:text-[#E63925] transition-colors">
                      <svg className="h-4 w-4 text-zinc-400 group-hover:text-[#E63925] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-zinc-600 uppercase tracking-widest block">LinkedIn</span>
                      <span className="text-zinc-300 font-bold group-hover:text-white truncate max-w-[130px] block">
                        {getCleanUsername(about.contact.linkedin, "linkedin")}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-zinc-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </a>

                {/* Twitter / X */}
                <a
                  href={formatUrl(about.contact.facebook)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-950/40 rounded-xl transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-zinc-900/60 flex items-center justify-center group-hover:bg-[#E63925]/10 group-hover:text-[#E63925] transition-colors">
                      <svg className="h-4 w-4 text-zinc-400 group-hover:text-[#E63925] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-zinc-600 uppercase tracking-widest block">Twitter / X</span>
                      <span className="text-zinc-300 font-bold group-hover:text-white truncate max-w-[130px] block">
                        {getCleanUsername(about.contact.facebook, "twitter")}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-zinc-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </a>
              </div>
            </div>

            {/* Awards section */}
            <div className="space-y-6">
              <h4 className="font-sans font-black text-base uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#E63925]" />
                Awards
              </h4>
              
              <div className="border border-zinc-900 rounded-xl overflow-hidden">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="bg-zinc-950 text-zinc-500 uppercase tracking-wider text-[9px] border-b border-zinc-900">
                      <th className="p-4 font-bold">Award Title</th>
                      <th className="p-4 font-bold text-right">Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {about.awards.map((award, index) => (
                      <tr
                        key={index}
                        className="border-b border-zinc-950 hover:bg-zinc-950/20 transition-colors duration-150 last:border-b-0"
                      >
                        <td className="p-4 text-zinc-300 flex items-center gap-2">
                          <Award className="h-3.5 w-3.5 text-[#E63925]" />
                          {award.title}
                        </td>
                        <td className="p-4 text-zinc-400 text-right">{award.year}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tiny Footer disclaimer text from image reference */}
            <div className="text-[10px] text-zinc-700 font-mono tracking-wider leading-relaxed pt-6 border-t border-zinc-950 select-none">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
