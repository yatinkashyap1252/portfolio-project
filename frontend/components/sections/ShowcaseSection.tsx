"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, FileText, Award, Layers, Sparkles, Star } from "lucide-react";
import { showcaseItems, ShowcaseItem } from "@/data/showcase";
import { fetchAPI } from "@/lib/api";

// =========================================================================
// 1. HELPER: SVG Badges & Vectors
// =========================================================================

// AWS cloud illustration for the split card
const CloudLogoVector = () => (
  <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
  </svg>
);

// Framer motion interactive sandbox nodes
const SandboxVector = () => (
  <svg className="w-20 h-20 text-white/40 animate-[spin_30s_linear_infinite]" viewBox="0 0 100 100">
    <polygon points="50,15 90,35 90,65 50,85 10,65 10,35" fill="none" stroke="currentColor" strokeWidth="1" />
    <polygon points="50,25 80,40 80,60 50,75 20,60 20,40" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
    <circle cx="50" cy="50" r="10" className="fill-[#E63925] animate-pulse" />
  </svg>
);

// =========================================================================
// 2. MAIN COMPONENT: WALL OF FAME
// =========================================================================

export default function ShowcaseSection() {
  const [items, setItems] = useState<ShowcaseItem[]>(showcaseItems);

  useEffect(() => {
    async function loadShowcase() {
      try {
        const showcaseData = await fetchAPI<any[]>("/cms/showcase");
        if (showcaseData && showcaseData.length > 0) {
          const mapped = showcaseData.map((item) => ({
            id: item._id,
            type: item.type,
            title: item.title,
            subtitle: item.subtitle,
            content: item.content || [],
            link: item.link,
            linkLabel: item.linkLabel,
            badgeText: item.badgeText,
            bgStyle: item.bgStyle || "white",
            imageUrl: item.imageUrl,
          }));
          setItems(mapped);
        } else {
          setItems(showcaseItems);
        }
      } catch (err) {
        console.error("Error loading showcase from CMS:", err);
      }
    }
    loadShowcase();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <section className="bg-black py-8 px-4 md:px-8 lg:px-16 text-white flex flex-col items-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="w-full max-w-7xl border border-zinc-800 bg-[#0A0A0A] flex flex-col"
      >
        {/* Section Header */}
        <div className="grid grid-cols-12 border-b border-zinc-800 p-8 md:p-12 items-center">
          <div className="col-span-12 md:col-span-6 space-y-3">
            <span className="font-mono text-xs text-[#E63925] tracking-widest font-bold block uppercase">
              SECTION 04 / BRAG SHEET
            </span>
            <h2 className="text-3xl md:text-5xl font-sans font-black tracking-tight uppercase">
              Wall of Fame
            </h2>
          </div>
          <div className="col-span-12 md:col-span-6 mt-4 md:mt-0 font-mono text-xs text-zinc-500 tracking-wide leading-relaxed max-w-md">
            Verified certifications, code sandboxes, technical publications, and recommendations mapping a career build index.
          </div>
        </div>

        {/* Bento Grid layout matching the slide mock layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            
            // Render Card Option 1: Split RED/WHITE slide layout (AWS card)
            if (item.bgStyle === "split") {
              return (
                <motion.div
                  key={item.id}
                  variants={cardVariants}
                  className="grid grid-cols-2 border-b border-zinc-800 md:border-r last:border-b-0 min-h-[350px] group overflow-hidden"
                >
                  {/* Left Half (Red Visualizer) */}
                  <div className="bg-[#E63925] flex flex-col justify-center items-center p-6 relative">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className="w-16 h-16 object-contain rounded bg-white/10 p-1" />
                    ) : (
                      <CloudLogoVector />
                    )}
                    <span className="absolute bottom-4 left-4 font-mono text-[9px] text-white/80 uppercase tracking-widest">
                      // COMPUTE.
                    </span>
                  </div>

                  {/* Right Half (White Info details) */}
                  <div className="bg-white text-black p-6 flex flex-col justify-between">
                    <div className="space-y-4">
                      <span className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-widest border border-zinc-300 rounded px-2 py-0.5">
                        {item.badgeText}
                      </span>
                      <h3 className="font-sans font-black text-lg tracking-tight uppercase leading-none mt-2">
                        {item.title}
                      </h3>
                      <p className="font-mono text-[10px] text-zinc-500 font-bold uppercase leading-none">
                        {item.subtitle}
                      </p>
                      <ul className="space-y-2 font-sans text-xs text-zinc-700 leading-relaxed font-light pt-2">
                        {item.content.map((pt, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-[#E63925] mt-1.5 shrink-0 block h-1 w-1 rounded-full" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between p-2.5 bg-black text-white rounded-lg font-mono text-[9px] uppercase tracking-wider hover:bg-[#E63925] transition-colors"
                    >
                      <span>{item.linkLabel}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </motion.div>
              );
            }

            // Render Card Option 2: White Background Slide Card (Next.js Cert, Testimonials)
            if (item.bgStyle === "white") {
              return (
                <motion.div
                  key={item.id}
                  variants={cardVariants}
                  className="bg-white text-black p-8 md:p-10 flex flex-col justify-between border-b border-zinc-800 md:border-r min-h-[350px] relative group overflow-hidden"
                >
                  {/* Rotating decorative stamp in top corner */}
                  <div className="absolute top-6 right-6 select-none rotate-[12deg] transform border-2 border-dashed border-[#E63925]/30 rounded-xl px-2.5 py-1 text-[8px] font-mono text-[#E63925] font-bold tracking-widest uppercase">
                    ★ VERIFIED
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[9px] font-bold text-zinc-400 bg-zinc-100 border border-zinc-200 rounded px-2.5 py-1 uppercase tracking-widest">
                        {item.badgeText}
                      </span>
                      {item.imageUrl && (
                        <img src={item.imageUrl} alt={item.badgeText} className="h-8 w-auto object-contain rounded" />
                      )}
                    </div>
                    
                    <h3 className="font-sans font-black text-2xl md:text-3xl tracking-tighter uppercase leading-[0.9] pt-2">
                      {item.title}
                    </h3>
                    
                    <p className="font-mono text-[10px] text-[#E63925] font-bold uppercase leading-none">
                      // {item.subtitle}
                    </p>

                    <div className="space-y-2 pt-4 border-t border-zinc-100">
                      {item.content.map((pt, i) => (
                        <p
                          key={i}
                          className={`font-sans text-xs md:text-sm leading-relaxed font-light
                            ${item.type === "highlight" && i === 0 ? "italic text-zinc-800 font-bold border-l-2 border-zinc-900 pl-3 py-1" : "text-zinc-600"}
                          `}
                        >
                          {pt}
                        </p>
                      ))}
                    </div>
                  </div>

                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between p-3 bg-black text-white rounded-lg font-mono text-[10px] uppercase tracking-wider hover:bg-[#E63925] transition-colors mt-6 shadow-md"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5" />
                      {item.linkLabel}
                    </span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </motion.div>
              );
            }

            // Render Card Option 3: Vermilion Red Background Slide Card (Framer Sandbox)
            if (item.bgStyle === "red") {
              return (
                <motion.div
                  key={item.id}
                  variants={cardVariants}
                  className="bg-[#E63925] text-white p-8 md:p-10 flex flex-col justify-between border-b border-zinc-800 md:border-r min-h-[350px] relative group overflow-hidden"
                >
                  {/* Radial vector graphics bg */}
                  <div className="absolute right-[-20px] bottom-[-20px] pointer-events-none opacity-40">
                    <SandboxVector />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[9px] font-bold text-white/80 bg-white/10 border border-white/20 rounded px-2.5 py-1 uppercase tracking-widest">
                        {item.badgeText}
                      </span>
                      {item.imageUrl && (
                        <img src={item.imageUrl} alt={item.badgeText} className="h-8 w-auto object-contain brightness-0 invert rounded" />
                      )}
                    </div>

                    <h3 className="font-sans font-black text-3xl tracking-tighter uppercase leading-[0.9] pt-2">
                      {item.title}
                    </h3>

                    <p className="font-mono text-[10px] text-white/60 font-bold uppercase leading-none">
                      // {item.subtitle}
                    </p>

                    <div className="space-y-2 pt-4 border-t border-white/20">
                      {item.content.map((pt, i) => (
                        <p key={i} className="font-sans text-xs md:text-sm leading-relaxed font-light text-white/90">
                          {pt}
                        </p>
                      ))}
                    </div>
                  </div>

                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between p-3 bg-black text-white rounded-lg font-mono text-[10px] uppercase tracking-wider hover:bg-zinc-950 transition-colors mt-6 shadow-md z-10"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5" />
                      {item.linkLabel}
                    </span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </motion.div>
              );
            }

            // Render Card Option 4: Dark Charcoal Background Card (Hackathon/Collage)
            if (item.bgStyle === "dark") {
              return (
                <motion.div
                  key={item.id}
                  variants={cardVariants}
                  className="bg-zinc-950 text-white p-8 md:p-10 flex flex-col justify-between border-b border-zinc-800 md:border-r last:border-b-0 min-h-[350px] relative group overflow-hidden"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[9px] font-bold text-[#E63925] bg-[#E63925]/10 border border-[#E63925]/20 rounded px-2.5 py-1 uppercase tracking-widest">
                        {item.badgeText}
                      </span>
                      {item.imageUrl && (
                        <img src={item.imageUrl} alt={item.badgeText} className="h-8 w-auto object-contain rounded" />
                      )}
                    </div>

                    <h3 className="font-sans font-black text-2xl tracking-tight uppercase leading-none pt-2">
                      {item.title}
                    </h3>

                    <p className="font-mono text-[10px] text-zinc-500 font-bold uppercase leading-none">
                      // {item.subtitle}
                    </p>

                    <div className="space-y-2 pt-4 border-t border-zinc-900">
                      {item.content.map((pt, i) => (
                        <p key={i} className="font-sans text-xs md:text-sm leading-relaxed font-light text-zinc-400">
                          {pt}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Collage overlays from reference slide 4 */}
                  <div className="relative h-20 my-2 flex items-center justify-center select-none pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                    <div className="absolute left-[15%] h-14 w-14 bg-zinc-900 rounded-xl rotate-[-12deg] border border-zinc-800 overflow-hidden shadow-lg flex items-center justify-center font-mono text-[8px] text-zinc-600">
                      RESOLVER
                    </div>
                    <div className="absolute left-[35%] h-14 w-14 bg-zinc-900 rounded-xl rotate-[6deg] border border-[#E63925]/20 overflow-hidden shadow-xl z-10 translate-y-1.5 flex items-center justify-center font-mono text-[8px] text-[#E63925]">
                      CLI_TOOL
                    </div>
                    <div className="absolute left-[55%] h-14 w-14 bg-zinc-900 rounded-xl rotate-[-6deg] border border-zinc-800 overflow-hidden shadow-2xl z-20 flex items-center justify-center font-mono text-[8px] text-zinc-500">
                      PACKAGE
                    </div>
                  </div>

                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between p-3 bg-zinc-900 text-zinc-300 rounded-lg font-mono text-[10px] uppercase tracking-wider hover:border-zinc-700 hover:text-white transition-all duration-200 border border-zinc-800 shadow-md"
                  >
                    <span className="flex items-center gap-2">
                      <Award className="h-3.5 w-3.5" />
                      {item.linkLabel}
                    </span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </motion.div>
              );
            }

            // Render Card Option 5: Solid Black Card Layout (Zustand Blog)
            return (
              <motion.div
                key={item.id}
                variants={cardVariants}
                className="bg-black text-white p-8 md:p-10 flex flex-col justify-between border-b border-zinc-800 md:border-r last:border-b-0 min-h-[350px] relative group overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[9px] font-bold text-zinc-500 bg-zinc-950 border border-zinc-900 rounded px-2.5 py-1 uppercase tracking-widest">
                      {item.badgeText}
                    </span>
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.badgeText} className="h-8 w-auto object-contain rounded" />
                    )}
                  </div>

                  <h3 className="font-sans font-black text-2xl tracking-tight uppercase leading-none pt-2">
                    {item.title}
                  </h3>

                  <p className="font-mono text-[10px] text-[#E63925] font-bold uppercase leading-none">
                    // {item.subtitle}
                  </p>

                  <div className="space-y-2 pt-4 border-t border-zinc-900">
                    {item.content.map((pt, i) => (
                      <p key={i} className="font-sans text-xs md:text-sm leading-relaxed font-light text-zinc-400">
                        {pt}
                      </p>
                    ))}
                  </div>
                </div>

                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between p-3 bg-zinc-950 text-zinc-300 rounded-lg font-mono text-[10px] uppercase tracking-wider hover:border-zinc-800 hover:text-white transition-all border border-zinc-900 shadow-md"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="h-3.5 w-3.5" />
                    {item.linkLabel}
                  </span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </motion.div>
            );

          })}
        </div>
      </motion.div>
    </section>
  );
}
