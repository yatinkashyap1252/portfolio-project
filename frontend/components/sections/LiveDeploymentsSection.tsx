"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Lock,
  Unlock,
  RefreshCw,
  Info,
  Maximize2
} from "lucide-react";
import { deploymentsData, DeploymentItem } from "@/data/deployments";

export default function LiveDeploymentsSection() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isInteractive, setIsInteractive] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(0); // Used to trigger iframe reloads

  const currentItem = deploymentsData[currentIndex];

  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerDimensions({ width: rect.width, height: rect.height });
      }
    };
    updateDimensions();
    const timer = setTimeout(updateDimensions, 100);
    window.addEventListener("resize", updateDimensions);
    return () => {
      window.removeEventListener("resize", updateDimensions);
      clearTimeout(timer);
    };
  }, [currentIndex]);

  const handleNext = () => {
    setIsInteractive(false);
    setCurrentIndex((prev) => (prev + 1) % deploymentsData.length);
  };

  const handlePrev = () => {
    setIsInteractive(false);
    setCurrentIndex((prev) => (prev - 1 + deploymentsData.length) % deploymentsData.length);
  };

  const handleReload = () => {
    setIframeKey((prev) => prev + 1);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
      },
    }),
  };

  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);

  const paginate = (newDirection: number) => {
    setIsInteractive(false);
    const nextIdx = (currentIndex + newDirection + deploymentsData.length) % deploymentsData.length;
    setCurrentIndex(nextIdx);
    setPage([page + newDirection, newDirection]);
  };

  return (
    <section className="bg-black py-16 px-4 md:px-8 lg:px-16 text-white flex flex-col items-center">
      <div className="w-full max-w-7xl border border-zinc-800 bg-[#0A0A0A] flex flex-col">
        
        {/* ========================================================================= */}
        {/* SECTION HEADER */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-12 border-b border-zinc-800 p-8 md:p-12 items-center bg-zinc-950/60">
          <div className="col-span-12 md:col-span-6 space-y-3">
            <span className="font-mono text-xs text-[#E63925] tracking-widest font-bold block uppercase">
              SECTION 05 / INTERACTIVE PREVIEWS
            </span>
            <h2 className="text-3xl md:text-5xl font-sans font-black tracking-tight uppercase">
              Live Deployments
            </h2>
          </div>
          <div className="col-span-12 md:col-span-6 mt-4 md:mt-0 font-mono text-xs text-zinc-500 tracking-wide leading-relaxed max-w-md">
            Interact directly with fully functional client showcase prototypes. Test layout adaptations, database states, and visual controls.
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CAROUSEL SHELF */}
        {/* ========================================================================= */}
        <div className="p-6 md:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch min-h-[550px]">
          
          {/* LEFT PANEL: Interactive Browser Frame (Col 7) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950 flex flex-col flex-grow shadow-2xl relative">
              
              {/* Browser Window Header Title bar */}
              <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex items-center justify-between select-none">
                
                {/* 3 Window circles (macOS style) */}
                <div className="flex gap-1.5 items-center">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                </div>

                {/* Search Bar / Address bar */}
                <div className="flex-grow max-w-md mx-6">
                  <div className="bg-black/40 border border-zinc-800 rounded-lg py-1 px-3 flex items-center gap-2 text-zinc-400 text-xs font-mono select-all">
                    <Lock className="h-3 w-3 text-zinc-600 shrink-0" />
                    <span className="text-zinc-500">https://</span>
                    <span className="text-zinc-300 truncate">{currentItem.mockUrl}</span>
                  </div>
                </div>

                {/* Actions: Refresh */}
                <div className="flex gap-2">
                  <button
                    onClick={handleReload}
                    className="p-1 hover:bg-zinc-800 rounded text-zinc-500 hover:text-white transition-colors"
                    title="Reload Sandbox Frame"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Iframe content container */}
              <div 
                ref={containerRef}
                className="bg-[#0D0D0D] relative flex-grow min-h-[360px] lg:h-[420px] w-full overflow-hidden"
              >
                <iframe
                  key={iframeKey}
                  src={currentItem.previewUrl}
                  style={
                    currentItem.id === "kinetic-motion" && containerDimensions.width
                      ? {
                          width: "1440px",
                          height: `${containerDimensions.height / (containerDimensions.width / 1440)}px`,
                          transform: `scale(${containerDimensions.width / 1440})`,
                          transformOrigin: "top left",
                          border: "none",
                          position: "absolute",
                          top: 0,
                          left: 0,
                        }
                      : {
                          width: "100%",
                          height: "100%",
                          border: "none",
                        }
                  }
                  className={`transition-all duration-300 bg-zinc-950 ${
                    isInteractive ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-85 blur-[0.5px]"
                  }`}
                  title={currentItem.title}
                />

                {/* Translucent overlay for Tap-To-Interact */}
                <AnimatePresence>
                  {!isInteractive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsInteractive(true)}
                      className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer group hover:bg-black/50 transition-colors"
                    >
                      <motion.div
                        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center gap-3 shadow-2xl max-w-xs text-center mx-4"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 350, damping: 20 }}
                      >
                        <div className="h-12 w-12 rounded-full bg-[#E63925]/10 border border-[#E63925]/30 flex items-center justify-center text-[#E63925]">
                          <Unlock className="h-5 w-5 animate-pulse" />
                        </div>
                        <h4 className="font-sans font-bold text-sm tracking-tight">Click to Interact</h4>
                        <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-wide">
                          Unlock sandbox environment & test features directly
                        </p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Floating "Exit Interactive Mode" button when interactive */}
                {isInteractive && (
                  <div className="absolute bottom-4 right-4 z-20">
                    <button
                      onClick={() => setIsInteractive(false)}
                      className="px-4 py-2 bg-black border border-zinc-800 rounded-lg text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white hover:border-zinc-700 shadow-xl flex items-center gap-2"
                    >
                      <Lock className="h-3 w-3" /> Lock Preview
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Project Specification & Navigation controls (Col 5) */}
          <div className="lg:col-span-5 flex flex-col justify-between p-2">
            
            <div className="space-y-6">
              
              {/* Meta header tag */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#E63925] tracking-widest">
                  LIVE PREVIEW // {currentItem.index}
                </span>
                <span className="font-mono text-[10px] font-black text-zinc-500 bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 uppercase tracking-widest">
                  {currentItem.badgeText}
                </span>
              </div>

              {/* Title & subtitle */}
              <div className="space-y-1">
                <h3 className="text-2xl md:text-3xl font-sans font-black uppercase tracking-tight text-white leading-none">
                  {currentItem.title}
                </h3>
                <p className="font-mono text-[11px] text-zinc-500 font-bold uppercase">
                  // {currentItem.subtitle}
                </p>
              </div>

              {/* Description */}
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-light font-sans">
                {currentItem.description}
              </p>

              {/* Feature accomplishments */}
              <div className="space-y-2">
                <span className="font-mono text-[10px] uppercase text-zinc-500 tracking-wider block">
                  Key Interactive Capabilities:
                </span>
                <ul className="space-y-2.5 pl-2 border-l border-zinc-800 font-sans text-xs text-zinc-300 font-light leading-relaxed">
                  {currentItem.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#E63925] mt-1.5 shrink-0 block h-1.5 w-1.5 rounded-full" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech stack badges */}
              <div className="pt-4 border-t border-zinc-900">
                <div className="flex flex-wrap gap-1.5">
                  {currentItem.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 text-[9px] font-mono text-zinc-500 border border-zinc-900 rounded-md bg-zinc-950 select-none"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Carousel navigation controls footer */}
            <div className="flex items-center justify-between pt-8 border-t border-zinc-900 mt-8">
              
              {/* Pagination Dots */}
              <div className="flex gap-2">
                {deploymentsData.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setIsInteractive(false);
                      setCurrentIndex(idx);
                    }}
                    aria-label={`Go to project slide ${idx + 1}`}
                    aria-current={idx === currentIndex ? "true" : "false"}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex ? "w-6 bg-[#E63925]" : "w-1.5 bg-zinc-800 hover:bg-zinc-600"
                    }`}
                  />
                ))}
              </div>

              {/* Arrow Nav Buttons */}
              <div className="flex gap-2.5">
                <button
                  onClick={() => paginate(-1)}
                  aria-label="Previous project preview"
                  className="p-2 border border-zinc-800 bg-zinc-950 rounded-lg text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors shadow-md"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => paginate(1)}
                  aria-label="Next project preview"
                  className="p-2 border border-zinc-800 bg-zinc-950 rounded-lg text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors shadow-md"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
