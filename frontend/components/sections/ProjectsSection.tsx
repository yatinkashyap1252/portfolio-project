"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Cpu, HardDrive, Share2, FileText } from "lucide-react";
import { projectsData, ProjectItem } from "@/data/projects";
import { fetchAPI } from "@/lib/api";

// =========================================================================
// 1. PROJECT-SPECIFIC VECTOR COVER ART
// =========================================================================

interface VisualizerProps {
  isHovered: boolean;
}

// Project 1 Cover: Crypto Pulsing Analytics Graph
const CryptoVisualizer: React.FC<VisualizerProps> = ({ isHovered }) => {
  return (
    <div className="w-full h-full relative flex items-center justify-center bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-900">
      <svg className="w-full h-full" viewBox="0 0 320 200">
        <defs>
          <pattern id="crypto-grid" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" className="fill-zinc-800" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#crypto-grid)" />

        {/* Pulse grid lines */}
        <line x1="0" y1="100" x2="320" y2="100" className="stroke-zinc-900 stroke-[1]" />
        <line x1="160" y1="0" x2="160" y2="200" className="stroke-zinc-900 stroke-[1]" />

        {/* Wavy charts */}
        <motion.path
          d="M 20,130 Q 70,60 120,120 T 220,100 T 300,50"
          fill="none"
          stroke="#E63925"
          strokeWidth="3"
          initial={{ pathLength: 0.4 }}
          animate={isHovered ? { pathLength: [0, 1] } : { pathLength: 0.6 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        
        {/* Support lines */}
        <path
          d="M 20,140 Q 70,90 120,140 T 220,120 T 300,70"
          fill="none"
          stroke="#52525b"
          strokeWidth="1.5"
          opacity="0.4"
        />

        {/* Circle indicators */}
        <motion.circle
          cx="170"
          cy="110"
          r={isHovered ? 8 : 5}
          className="fill-none stroke-[#E63925] stroke-[2]"
          animate={isHovered ? { scale: [1, 1.4, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
        <circle cx="170" cy="110" r="3" className="fill-[#E63925]" />
      </svg>
      <div className="absolute top-4 left-4 font-mono text-[9px] text-[#E63925] tracking-widest uppercase flex items-center gap-1.5 bg-black/80 px-2.5 py-1 border border-zinc-900 rounded-full">
        <Cpu className="h-3 w-3" /> System Analytics
      </div>
    </div>
  );
};

// Project 2 Cover: API gateway routing data packets
const GatewayVisualizer: React.FC<VisualizerProps> = ({ isHovered }) => {
  return (
    <div className="w-full h-full relative flex items-center justify-center bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-900">
      <svg className="w-full h-full" viewBox="0 0 320 200">
        {/* Center gateway node */}
        <circle cx="160" cy="100" r="28" className="fill-[#0A0A0A] stroke-zinc-800 stroke-2" />
        <circle cx="160" cy="100" r="18" className="fill-none stroke-[#E63925] stroke-2" />
        
        {/* Connection pathways */}
        <line x1="30" y1="50" x2="132" y2="100" className="stroke-zinc-900 stroke-2" />
        <line x1="30" y1="100" x2="132" y2="100" className="stroke-zinc-900 stroke-2" />
        <line x1="30" y1="150" x2="132" y2="100" className="stroke-zinc-900 stroke-2" />
        
        <line x1="188" y1="100" x2="290" y2="50" className="stroke-zinc-900 stroke-2" />
        <line x1="188" y1="100" x2="290" y2="100" className="stroke-zinc-900 stroke-2" />
        <line x1="188" y1="100" x2="290" y2="150" className="stroke-zinc-900 stroke-2" />

        {/* Dynamic routing indicators */}
        <motion.line
          x1="30" y1="100" x2="132" y2="100"
          className="stroke-[#E63925] stroke-[2.5]"
          initial={{ pathLength: 0 }}
          animate={isHovered ? { pathLength: [0, 1] } : { pathLength: 0 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        />
        <motion.line
          x1="188" y1="100" x2="290" y2="50"
          className="stroke-[#E63925] stroke-[2.5]"
          initial={{ pathLength: 0 }}
          animate={isHovered ? { pathLength: [0, 1] } : { pathLength: 0 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.3 }}
        />

        {/* Nodes */}
        <circle cx="30" cy="50" r="6" className="fill-zinc-800" />
        <circle cx="30" cy="100" r="6" className="fill-zinc-800" />
        <circle cx="30" cy="150" r="6" className="fill-zinc-800" />

        <circle cx="290" cy="50" r="6" className="fill-zinc-800" />
        <circle cx="290" cy="100" r="6" className="fill-zinc-800" />
        <circle cx="290" cy="150" r="6" className="fill-zinc-800" />
      </svg>
      <div className="absolute top-4 left-4 font-mono text-[9px] text-[#E63925] tracking-widest uppercase flex items-center gap-1.5 bg-black/80 px-2.5 py-1 border border-zinc-900 rounded-full">
        <HardDrive className="h-3 w-3" /> Gateway API
      </div>
    </div>
  );
};

// Project 3 Cover: Orbiting atomic particle nodes
const AtomicVisualizer: React.FC<VisualizerProps> = ({ isHovered }) => {
  return (
    <div className="w-full h-full relative flex items-center justify-center bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-900">
      <svg className="w-full h-full" viewBox="0 0 320 200">
        {/* Core */}
        <circle cx="160" cy="100" r="14" className="fill-[#E63925] stroke-none" />
        <motion.circle
          cx="160"
          cy="100"
          r={isHovered ? 24 : 14}
          className="fill-none stroke-[#E63925]/30 stroke-[2]"
          animate={isHovered ? { scale: [1, 1.3, 1] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
        />

        {/* Orbit Ellipses */}
        <ellipse cx="160" cy="100" rx="80" ry="24" transform="rotate(-30 160 100)" className="fill-none stroke-zinc-800 stroke-[1.5]" />
        <ellipse cx="160" cy="100" rx="80" ry="24" transform="rotate(30 160 100)" className="fill-none stroke-zinc-800 stroke-[1.5]" />

        {/* Orbit Node 1 */}
        <motion.g
          transform="translate(160, 100)"
          animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        >
          <ellipse cx="0" cy="0" rx="80" ry="24" transform="rotate(-30)" className="fill-none stroke-transparent" />
          {/* We place particle on standard rotated coordinates */}
          <circle cx="69" cy="-40" r="5.5" className="fill-[#E63925]" />
        </motion.g>

        {/* Orbit Node 2 */}
        <motion.g
          transform="translate(160, 100)"
          animate={isHovered ? { rotate: -360 } : { rotate: 0 }}
          transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
        >
          <circle cx="-69" cy="-40" r="5.5" className="fill-zinc-600" />
        </motion.g>
      </svg>
      <div className="absolute top-4 left-4 font-mono text-[9px] text-[#E63925] tracking-widest uppercase flex items-center gap-1.5 bg-black/80 px-2.5 py-1 border border-zinc-900 rounded-full">
        <Share2 className="h-3 w-3" /> State Library
      </div>
    </div>
  );
};

// =========================================================================
// 2. MAIN COMPONENT: PROJECTS SECTION
// =========================================================================

function getVisualizerTypeByIndex(idx: number): string {
  const types = ["neos-crypto", "express-gateway", "atomic-state"];
  return types[idx % types.length];
}

export default function ProjectsSection() {
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectItem[]>(projectsData);

  useEffect(() => {
    async function loadProjects() {
      const dbProjects = await fetchAPI<any[]>("/cms/projects");
      if (dbProjects && dbProjects.length > 0) {
        // Filter out drafts
        const activeProjects = dbProjects.filter((p) => !p.isDraft);
        if (activeProjects.length > 0) {
          const mapped = activeProjects.map((p, idx) => {
            // Parse accomplishments (points) from description
            const points: string[] = [];
            let cleanDesc = p.description || "";
            if (cleanDesc.includes("\n*")) {
              const parts = cleanDesc.split(/\n\s*\*\s*/);
              cleanDesc = parts[0].trim();
              points.push(...parts.slice(1).map((item: string) => item.trim()));
            } else if (cleanDesc.includes("\n-")) {
              const parts = cleanDesc.split(/\n\s*-\s*/);
              cleanDesc = parts[0].trim();
              points.push(...parts.slice(1).map((item: string) => item.trim()));
            } else {
              const lines = cleanDesc.split("\n").map((l: string) => l.trim()).filter((l: string) => l.length > 0);
              if (lines.length > 1) {
                cleanDesc = lines[0];
                points.push(...lines.slice(1));
              } else {
                cleanDesc = p.description || "";
                points.push("Designed and engineered system architecture.", "Optimized performance and UI responsiveness.");
              }
            }

            return {
              id: p._id || idx.toString(),
              visualizerType: getVisualizerTypeByIndex(idx),
              title: p.title,
              description: cleanDesc,
              techStack: p.technologies || [],
              points,
              githubUrl: p.githubUrl,
              liveUrl: p.liveUrl || null,
              status: p.isFeatured ? "FEATURED" : "ACTIVE",
              index: String(p.displayOrder || idx + 1).padStart(2, "0"),
              thumbnailUrl: p.thumbnailUrl,
              articleUrl: p.articleUrl || projectsData.find(pd => pd.id === (p._id || p.id) || pd.title === p.title)?.articleUrl || null,
            };
          });
          setProjects(mapped);
        }
      }
    }
    loadProjects();
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

  const projectVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" as const },
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
        {/* ========================================================================= */}
        {/* BRACKET TOP HEADER: Giant high-impact layout heading */}
        {/* ========================================================================= */}
        <div className="border-b border-zinc-800 bg-zinc-950/60 py-8 select-none overflow-hidden relative">
          <h2 className="font-sans font-black text-6xl md:text-8xl tracking-[0.22em] text-zinc-900/60 text-center uppercase select-none leading-none">
            FEATURED
          </h2>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="font-mono text-xs text-[#E63925] uppercase tracking-[0.4em] font-bold">
              SECTION 04 / WORK DIRECTORY
            </span>
          </div>
        </div>

        {/* Projects Cards List */}
        <div className="flex flex-col">
          {projects.map((project, idx) => {
            const isHovered = hoveredCardId === project.id;
            const visualizerType = project.visualizerType || getVisualizerTypeByIndex(idx);

            return (
              <motion.div
                key={project.id}
                variants={projectVariants}
                onMouseEnter={() => setHoveredCardId(project.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                className="grid grid-cols-1 lg:grid-cols-12 border-b border-zinc-800 last:border-b-0 group transition-colors duration-300 hover:bg-[#0E0E0E]"
              >
                {/* Visual Cover (Col 5) */}
                <div className="lg:col-span-5 p-6 md:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-zinc-800 flex items-center justify-center relative bg-zinc-950/15 overflow-hidden">
                  <div className="w-full aspect-video lg:aspect-auto lg:h-[340px] relative z-10 flex items-center justify-center">
                    {visualizerType === "neos-crypto" && <CryptoVisualizer isHovered={isHovered} />}
                    {visualizerType === "express-gateway" && <GatewayVisualizer isHovered={isHovered} />}
                    {visualizerType === "atomic-state" && <AtomicVisualizer isHovered={isHovered} />}
                  </div>

                  {/* Giant floating diagonal arrow ↗ from reference screenshot */}
                  <motion.div
                    className="absolute bottom-6 right-6 h-12 w-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-lg group-hover:bg-[#E63925] group-hover:border-[#E63925] transition-colors duration-300 z-20 cursor-pointer"
                    animate={isHovered ? { scale: 1.1, rotate: 45 } : { scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 12 }}
                  >
                    <ArrowUpRight className="h-5 w-5 text-zinc-400 group-hover:text-white transition-colors" />
                  </motion.div>
                </div>

                {/* Metadata details (Col 7) */}
                <div className="lg:col-span-7 p-8 md:p-10 lg:p-12 flex flex-col justify-between relative min-h-[360px] lg:min-h-[420px]">
                  
                  {/* Vertically Rotated Status Pill on the side (matches "JOB POSITION" in screenshot) */}
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 rotate-[90deg] origin-center hidden xl:block select-none pointer-events-none">
                    <span className="font-mono text-[9px] font-black tracking-[0.2em] uppercase text-zinc-600 bg-zinc-950 border border-zinc-900 px-3 py-1.5 rounded-lg whitespace-nowrap">
                      STATUS: {project.status}
                    </span>
                  </div>

                  {/* Main specs segment */}
                  <div className="space-y-6 max-w-xl">
                    <div className="space-y-2">
                      <span className="font-mono text-xs md:text-sm font-bold text-[#E63925] tracking-wider block">
                        PROJ // {project.index}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-sans font-black uppercase tracking-tight text-zinc-100 group-hover:text-white transition-colors">
                        {project.title}
                      </h3>
                    </div>

                    <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-light">
                      {project.description}
                    </p>

                    {/* Bullet Accomplishments */}
                    <ul className="space-y-2.5 font-sans text-xs md:text-sm text-zinc-300 font-light pl-2 border-l border-zinc-800">
                      {project.points.map((pt, i) => (
                        <li key={i} className="flex items-start gap-2 leading-relaxed">
                          <span className="text-[#E63925] mt-1.5 block h-1.5 w-1.5 rounded-full shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tech Stack tags & Actions Segment */}
                  <div className="space-y-6 mt-8 max-w-xl pt-6 border-t border-zinc-900">
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 text-[9px] font-mono text-zinc-500 border border-zinc-900 rounded-md bg-zinc-950 select-none"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-4 pt-2">
                      {/* GitHub Button */}
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 font-mono text-[10px] uppercase tracking-wider bg-zinc-950 text-zinc-300 border border-zinc-900 rounded-lg hover:border-zinc-700 hover:text-white transition-all duration-200"
                      >
                        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                        </svg> Code Repo
                      </a>

                      {/* CONDITIONAL Live Deployment Link Button */}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 font-mono text-[10px] uppercase tracking-wider bg-[#E63925] text-white rounded-lg hover:bg-[#F34D3A] transition-all duration-200 shadow-md shadow-[#E63925]/10"
                        >
                          <ExternalLink className="h-3.5 w-3.5" /> Deploy Link
                        </a>
                      )}

                      {/* CONDITIONAL Medium/Article Link Button */}
                      {project.articleUrl && (
                        <a
                          href={project.articleUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 font-mono text-[10px] uppercase tracking-wider bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-lg hover:border-zinc-700 hover:text-white transition-all duration-200"
                        >
                          <FileText className="h-3.5 w-3.5" /> Read Article
                        </a>
                      )}
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* BRACKET BOTTOM HEADER: Giant high-impact layout heading */}
        {/* ========================================================================= */}
        <div className="border-t border-zinc-800 bg-zinc-950/60 py-8 select-none overflow-hidden relative">
          <h2 className="font-sans font-black text-6xl md:text-8xl tracking-[0.22em] text-zinc-900/60 text-center uppercase select-none leading-none">
            PROJECTS
          </h2>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="font-mono text-xs text-zinc-600 uppercase tracking-[0.4em] font-semibold">
              // END OF REGISTER
            </span>
          </div>
        </div>

      </motion.div>
    </section>
  );
}
