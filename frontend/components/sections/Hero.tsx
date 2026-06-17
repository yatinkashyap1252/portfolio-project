"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { heroData } from "@/data/hero";
import { fetchAPI } from "@/lib/api";

export default function Hero() {
  const [data, setData] = useState(heroData);

  useEffect(() => {
    async function loadHero() {
      const hero = await fetchAPI<any>("/cms/hero");
      const contact = await fetchAPI<any>("/cms/contact");

      if (hero) {
        setData((prev) => ({
          ...prev,
          name: hero.name || prev.name,
          role: hero.designation || prev.role,
          image: hero.profileImageUrl || prev.image,
          email: hero.email || prev.email,
        }));
      }
      if (contact) {
        setData((prev) => ({
          ...prev,
          phone: contact.phone || prev.phone,
          email: contact.email || prev.email,
          website: contact.linkedinUrl ? contact.linkedinUrl : prev.website,
        }));
      }
    }
    loadHero();
  }, []);

  const firstName = data.name.split(" ")[0] || data.name;
  const lastName = data.name.split(" ").slice(1).join(" ") || "";
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
        when: "beforeChildren" as const,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  const lineVariants = {
    hidden: { width: 0 },
    visible: {
      width: "100%",
      transition: { duration: 0.8, ease: "easeInOut" as const },
    },
  };

  return (
    <section className="bg-black py-12 px-4 md:px-8 lg:px-16 flex items-center justify-center min-h-screen">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-12 border border-zinc-800 bg-[#0F0F0F] overflow-hidden"
      >
        {/* LEFT COLUMN: Contact & Get In Touch (Col Span 4) */}
        <div className="md:col-span-4 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-800 text-white min-h-[380px] md:min-h-[500px]">
          {/* Top segment */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Bold white horizontal bar */}
            <div className="w-16 h-3 bg-white" />
            <h1 className="text-4xl md:text-5xl font-sans font-black tracking-tight leading-[1.1] uppercase">
              Get In <br /> Touch!
            </h1>
          </motion.div>

          {/* Bottom segment: Contact Underlines */}
          <motion.div variants={itemVariants} className="space-y-4 font-mono text-sm tracking-wider text-zinc-300">
            {/* Website Row */}
            <div className="space-y-2 group cursor-pointer">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-bold">W</span>
                <span className="text-white hover:text-red-500 transition-colors duration-200">
                  {data.website}
                </span>
              </div>
              <motion.div
                variants={lineVariants}
                className="h-[1px] bg-zinc-800 group-hover:bg-red-500/50 transition-colors"
              />
            </div>

            {/* Email Row */}
            <div className="space-y-2 group cursor-pointer">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-bold">E</span>
                <span className="text-white hover:text-red-500 transition-colors duration-200">
                  {data.email}
                </span>
              </div>
              <motion.div
                variants={lineVariants}
                className="h-[1px] bg-zinc-800 group-hover:bg-red-500/50 transition-colors"
              />
            </div>

            {/* Phone Row */}
            <div className="space-y-2 group cursor-pointer">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-bold">P</span>
                <span className="text-white hover:text-red-500 transition-colors duration-200">
                  {data.phone}
                </span>
              </div>
              <motion.div
                variants={lineVariants}
                className="h-[1px] bg-zinc-800 group-hover:bg-red-500/50 transition-colors"
              />
            </div>
          </motion.div>
        </div>

        {/* MIDDLE COLUMN: Red Name Block (Col Span 5) */}
        <div className="md:col-span-5 bg-[#E63925] p-8 flex flex-col justify-between relative min-h-[380px] md:min-h-[500px]">
          {/* Top-Right Arrow button */}
          <motion.div
            variants={itemVariants}
            className="absolute top-0 right-0 w-16 h-16 bg-[#8E8E8E] hover:bg-[#A6A6A6] transition-colors duration-200 cursor-pointer flex items-center justify-center group"
          >
            <motion.div
              whileHover={{ scale: 1.15, rotate: 45 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ArrowUpRight className="h-8 w-8 text-black" />
            </motion.div>
          </motion.div>

          {/* Spacer to force name to bottom */}
          <div className="h-16" />

          {/* Text contents */}
          <motion.div variants={itemVariants} className="space-y-4 text-white">
            <span className="block font-mono text-xs md:text-sm font-bold tracking-[0.2em] text-white/80">
              {data.role}
            </span>
            <h2 className="text-5xl lg:text-7xl font-sans font-black tracking-tight leading-[0.85] uppercase">
              {firstName}
              {lastName && <><br />{lastName}</>}
            </h2>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Profile Photo (Col Span 3) */}
        <div className="md:col-span-3 relative min-h-[400px] md:min-h-[500px] overflow-hidden border-t md:border-t-0 border-zinc-800">
          <Image
            src={data.image}
            alt={data.name}
            fill
            sizes="(max-w-768px) 100vw, 25vw"
            priority={true}
            loading="eager"
            className="object-cover grayscale contrast-[1.15] brightness-[0.95] hover:grayscale-0 hover:scale-105 transition-all duration-700 ease-out"
          />
          {/* Overlay to merge photo styled with border */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>
      </motion.div>
    </section>
  );
}
