"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Terminal } from "lucide-react";
import { skillCategories, SkillCategory } from "@/data/skills";
import { fetchAPI } from "@/lib/api";

// =========================================================================
// 1. VISUALIZER COMPONENTS: Sci-Fi Dashboard SVGs
// =========================================================================

interface VisualizerProps {
  isHovered: boolean;
}

// FRONTEND: Morphing Sine Waves (Sonar/Radar Waves)
const RadarWaveVisualizer: React.FC<VisualizerProps> = ({ isHovered }) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-zinc-950/40 rounded-2xl border border-zinc-900/50 overflow-hidden relative">
      <svg className="w-full h-[120px]" viewBox="0 0 400 120">
        {/* Wave 1 (Base Red) */}
        <motion.path
          d="M 0,60 Q 50,20 100,60 T 200,60 T 300,60 T 400,60"
          fill="none"
          stroke="#E63925"
          strokeWidth="2.5"
          opacity="0.85"
          animate={{
            d: isHovered
              ? [
                  "M 0,60 Q 50,15 100,60 T 200,60 T 300,15 T 400,60",
                  "M 0,60 Q 50,105 100,60 T 200,60 T 300,105 T 400,60",
                  "M 0,60 Q 50,15 100,60 T 200,60 T 300,15 T 400,60",
                ]
              : [
                  "M 0,60 Q 50,40 100,60 T 200,60 T 300,40 T 400,60",
                  "M 0,60 Q 50,80 100,60 T 200,60 T 300,80 T 400,60",
                  "M 0,60 Q 50,40 100,60 T 200,60 T 300,40 T 400,60",
                ],
          }}
          transition={{
            repeat: Infinity,
            duration: isHovered ? 2.5 : 5,
            ease: "easeInOut",
          }}
        />

        {/* Wave 2 (Faded Grey Helper Wave) */}
        <motion.path
          d="M 0,60 Q 50,100 100,60 T 200,60 T 300,100 T 400,60"
          fill="none"
          stroke="#52525b"
          strokeWidth="1.5"
          opacity="0.5"
          animate={{
            d: isHovered
              ? [
                  "M 0,60 Q 50,100 100,60 T 200,60 T 300,100 T 400,60",
                  "M 0,60 Q 50,10 100,60 T 200,60 T 300,10 T 400,60",
                  "M 0,60 Q 50,100 100,60 T 200,60 T 300,100 T 400,60",
                ]
              : [
                  "M 0,60 Q 50,75 100,60 T 200,60 T 300,75 T 400,60",
                  "M 0,60 Q 50,45 100,60 T 200,60 T 300,45 T 400,60",
                  "M 0,60 Q 50,75 100,60 T 200,60 T 300,75 T 400,60",
                ],
          }}
          transition={{
            repeat: Infinity,
            duration: isHovered ? 3 : 6,
            ease: "easeInOut",
          }}
        />
      </svg>
      {/* Radial Radar Scanning Line (Placed outside SVG) */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E63925]/5 to-transparent animate-[shimmer_3s_infinite] pointer-events-none" />
    </div>
  );
};

// BACKEND: Dot-Matrix & Line Graph
const DataMatrixVisualizer: React.FC<VisualizerProps> = ({ isHovered }) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-zinc-950/40 rounded-2xl border border-zinc-900/50 overflow-hidden relative p-4">
      {/* Background Dot Grid */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 120">
        <defs>
          <pattern id="card-dot-grid" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" className="fill-zinc-800" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#card-dot-grid)" />

        {/* Dynamic Line Chart */}
        <motion.path
          d="M 30,100 L 70,85 L 120,95 L 170,45 L 210,65 L 250,25 L 290,35"
          fill="none"
          stroke="#E63925"
          strokeWidth="2.5"
          initial={{ pathLength: 0.3 }}
          animate={isHovered ? { pathLength: [0, 1] } : { pathLength: 0.6 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />

        {/* End pulse dot */}
        <motion.circle
          cx="290"
          cy="35"
          r="4.5"
          className="fill-[#E63925]"
          animate={isHovered ? { r: [4.5, 7.5, 4.5] } : { r: 4.5 }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        />

        {/* Secondary faded chart */}
        <path
          d="M 30,100 L 70,95 L 120,75 L 170,85 L 210,55 L 250,60 L 290,45"
          fill="none"
          stroke="#3f3f46"
          strokeWidth="1.5"
          opacity="0.6"
        />
      </svg>
      {/* Metric Overlay */}
      <div className="absolute bottom-3 right-4 font-mono text-[9px] text-zinc-500 flex gap-2">
        <span>LATENCY: 12ms</span>
        <span>LOAD: {isHovered ? "87%" : "16%"}</span>
      </div>
    </div>
  );
};

// STATE: Network Nodes & Data Paths
const NodeNetworkVisualizer: React.FC<VisualizerProps> = ({ isHovered }) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-zinc-950/40 rounded-2xl border border-zinc-900/50 overflow-hidden relative">
      <svg className="w-[300px] h-[120px]" viewBox="0 0 300 120">
        {/* Connection paths */}
        <line x1="60" y1="60" x2="150" y2="25" className="stroke-zinc-800 stroke-[1.5]" />
        <line x1="60" y1="60" x2="150" y2="95" className="stroke-zinc-800 stroke-[1.5]" />
        <line x1="150" y1="25" x2="240" y2="60" className="stroke-zinc-800 stroke-[1.5]" />
        <line x1="150" y1="95" x2="240" y2="60" className="stroke-zinc-800 stroke-[1.5]" />
        <line x1="150" y1="25" x2="150" y2="95" className="stroke-zinc-800 stroke-[1.5]" />

        {/* Glowing active paths on hover */}
        <motion.line
          x1="60" y1="60" x2="150" y2="25"
          className="stroke-[#E63925] stroke-[2]"
          initial={{ pathLength: 0 }}
          animate={isHovered ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.6 }}
        />
        <motion.line
          x1="150" y1="25" x2="240" y2="60"
          className="stroke-[#E63925] stroke-[2]"
          initial={{ pathLength: 0 }}
          animate={isHovered ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
        <motion.line
          x1="150" y1="25" x2="150" y2="95"
          className="stroke-[#E63925] stroke-[1.5]"
          strokeDasharray="3 3"
          initial={{ strokeDashoffset: 0 }}
          animate={isHovered ? { strokeDashoffset: -20 } : { strokeDashoffset: 0 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" as const }}
        />

        {/* Static outer circles */}
        <circle cx="60" cy="60" r="8" className="fill-zinc-900 stroke-zinc-700 stroke-2" />
        <circle cx="150" cy="25" r="8" className="fill-zinc-900 stroke-zinc-700 stroke-2" />
        <circle cx="150" cy="95" r="8" className="fill-zinc-900 stroke-zinc-700 stroke-2" />
        <circle cx="240" cy="60" r="8" className="fill-zinc-900 stroke-zinc-700 stroke-2" />

        {/* Core Glowing Points */}
        <motion.circle
          cx="60" cy="60"
          r={isHovered ? 4.5 : 3}
          className="fill-[#E63925]"
          animate={isHovered ? { scale: [1, 1.3, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
        <motion.circle cx="150" cy="25" r={isHovered ? 4.5 : 3} className="fill-[#E63925]" />
        <motion.circle cx="150" cy="95" r={isHovered ? 4.5 : 3} className="fill-[#E63925]" />
        <motion.circle
          cx="240" cy="60"
          r={isHovered ? 4.5 : 3}
          className="fill-[#E63925]"
          animate={isHovered ? { scale: [1, 1.3, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
        />
      </svg>
    </div>
  );
};

// DEVOPS: Spinning Dial / Mechanical Speedometer
const GaugeDialVisualizer: React.FC<VisualizerProps> = ({ isHovered }) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-zinc-950/40 rounded-2xl border border-zinc-900/50 overflow-hidden relative">
      <svg className="w-[180px] h-[120px]" viewBox="0 0 180 120">
        {/* Dial ring */}
        <circle cx="90" cy="65" r="35" className="fill-none stroke-zinc-800 stroke-2" />
        <circle cx="90" cy="65" r="42" className="fill-none stroke-zinc-900 stroke-[1.5] stroke-dasharray-[3,3]" />

        {/* Subdivided ticks */}
        <g transform="translate(90, 65)">
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={i}
              x1="0"
              y1="-30"
              x2="0"
              y2="-34"
              transform={`rotate(${i * 30})`}
              className="stroke-zinc-700 stroke-[1]"
            />
          ))}
        </g>

        {/* Pointer Dial Hand */}
        <motion.g
          transform="translate(90, 65)"
          animate={isHovered ? { rotate: 140 } : { rotate: 30 }}
          transition={{ type: "spring", stiffness: 80, damping: 10 }}
        >
          <line x1="0" y1="0" x2="0" y2="-28" className="stroke-[#E63925] stroke-2" />
          <circle cx="0" cy="0" r="4.5" className="fill-[#E63925]" />
        </motion.g>

        {/* Outer glowing path */}
        <motion.path
          d="M 60,65 A 30,30 0 0,1 120,65"
          fill="none"
          stroke="#E63925"
          strokeWidth="2"
          initial={{ pathLength: 0.4 }}
          animate={isHovered ? { pathLength: 0.95 } : { pathLength: 0.4 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
};

// =========================================================================
// 2. MAIN COMPONENT: Editorial Grid Layout
// =========================================================================

export default function SkillsSection() {
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [categories, setCategories] = useState(skillCategories);

  useEffect(() => {
    async function loadSkillsAndCategories() {
      try {
        const categoriesRes = await fetchAPI<any[]>("/cms/categories");
        const skillsRes = await fetchAPI<any[]>("/cms/skills");

        let baseCategories = skillCategories; // default fallback

        if (categoriesRes && categoriesRes.length > 0) {
          // Sort categories by displayOrder
          const sortedCategories = [...categoriesRes].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
          baseCategories = sortedCategories.map((cat) => ({
            id: cat.id,
            title: cat.title,
            metric: cat.metric,
            description: cat.description,
            visualizerType: cat.visualizerType || "wave",
            skills: [], // will populate below
          }));
        }

        // Now map the skills into their categories
        const skillsList = skillsRes || [];
        const mappedCategories = baseCategories.map((cat) => {
          const filteredSkills = skillsList
            .filter((s: any) => s.category === cat.id)
            .sort((a: any, b: any) => a.displayOrder - b.displayOrder)
            .map((s: any) => s.name);

          // Find fallback skills from static data if database has no skills for this category
          const fallbackCat = skillCategories.find((c) => c.id === cat.id);
          const fallbackSkills = fallbackCat ? fallbackCat.skills : [];

          return {
            ...cat,
            skills: filteredSkills.length > 0 ? filteredSkills : fallbackSkills,
          };
        });

        setCategories(mappedCategories);
      } catch (err) {
        console.error("Error loading categories and skills:", err);
      }
    }
    loadSkillsAndCategories();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <section className="bg-black py-8 px-4 md:px-8 lg:px-16 text-white flex justify-center">
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
              SECTION 03 / CAPABILITIES
            </span>
            <h2 className="text-3xl md:text-5xl font-sans font-black tracking-tight uppercase">
              Technical Stack
            </h2>
          </div>
          <div className="col-span-12 md:col-span-6 mt-4 md:mt-0 font-mono text-xs text-zinc-500 tracking-wide leading-relaxed max-w-md">
            Interactive metrics and node mesh structures mapping professional technical competencies. Hover over cards to inspect data flows.
          </div>
        </div>

        {/* 2x2 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {categories.map((category, idx) => {
            const isHovered = hoveredCardId === category.id;

            return (
              <motion.div
                key={category.id}
                variants={cardVariants}
                onMouseEnter={() => setHoveredCardId(category.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                className={`p-8 md:p-12 flex flex-col justify-between gap-8 border-b border-zinc-800 transition-colors duration-300 relative group bg-zinc-950/10 hover:bg-[#0E0E0E]
                  ${idx % 2 === 0 ? "md:border-r" : ""}
                  ${idx >= 2 ? "border-b-0" : ""}
                `}
              >
                {/* SVG Visualizer Header Box */}
                <div className="w-full h-[150px] relative">
                  {category.visualizerType === "wave" && <RadarWaveVisualizer isHovered={isHovered} />}
                  {category.visualizerType === "matrix" && <DataMatrixVisualizer isHovered={isHovered} />}
                  {category.visualizerType === "nodes" && <NodeNetworkVisualizer isHovered={isHovered} />}
                  {category.visualizerType === "gauge" && <GaugeDialVisualizer isHovered={isHovered} />}
                </div>

                {/* Text Content */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E63925]/10 text-[#E63925] border border-[#E63925]/20 uppercase tracking-widest font-mono">
                      <span className={`h-1.5 w-1.5 rounded-full bg-[#E63925] ${isHovered ? "animate-ping" : ""}`} />
                      {category.metric}
                    </span>
                    <Terminal className="h-4 w-4 text-zinc-700 group-hover:text-zinc-500 transition-colors" />
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-sans font-black uppercase tracking-wide text-zinc-100 group-hover:text-white transition-colors">
                    {category.title}
                  </h3>
                  
                  <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-light">
                    {category.description}
                  </p>
                </div>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 text-[10px] font-mono text-zinc-400 border border-zinc-900 rounded-lg bg-zinc-950/80 hover:border-zinc-700 hover:text-white transition-all duration-200 select-none flex items-center gap-1.5"
                    >
                      <span className="h-1 w-1 rounded-full bg-zinc-700" />
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
