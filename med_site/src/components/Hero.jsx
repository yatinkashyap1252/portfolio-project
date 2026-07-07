import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Calendar, ArrowRight, Activity } from 'lucide-react';
import heroDoctor from '../assets/hero_doctor.png';

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // Premium easeOutExpo
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const floatVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const scrollToSection = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen pt-28 md:pt-36 flex items-center bg-accent-50/50 overflow-hidden">
      {/* Dynamic light glowing overlays */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-brand-100/30 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] rounded-full bg-accent-100/40 blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center z-10">
        {/* Left Text Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 flex flex-col items-start text-left"
        >
          {/* Accent Trust Banner */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200/50 text-brand-600 font-semibold text-xs md:text-sm tracking-wide mb-6 shadow-xs"
          >
            <ShieldCheck size={16} className="text-accent-500 stroke-[2.5]" />
            <span>World-Class Medical Care in Your Neighborhood</span>
          </motion.div>

          {/* Premium Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-serif text-brand-950 font-bold leading-[1.1] mb-6"
          >
            Empowering Your Health, <br />
            <span className="text-brand-500 font-normal italic">Elevating Your Life.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg text-slate-luxury-900/70 max-w-xl mb-8 leading-relaxed font-sans"
          >
            Novara Health brings world-class medical experts, groundbreaking preventive technology, and patient-first care together. Experience private medicine tailored entirely to you.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <button
              onClick={() => scrollToSection('#booking')}
              className="px-8 py-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-base shadow-lg shadow-brand-500/15 hover:shadow-brand-500/35 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Calendar size={18} />
              <span>Book Appointment</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <button
              onClick={() => scrollToSection('#services')}
              className="px-8 py-4 rounded-xl bg-white hover:bg-brand-50 text-brand-700 border border-brand-200 hover:border-brand-300 font-semibold text-base shadow-xs hover:shadow-md transition-all duration-300 text-center cursor-pointer"
            >
              Explore Services
            </button>
          </motion.div>

          {/* Minimal stats highlights */}
          <motion.div
            variants={itemVariants}
            className="flex gap-8 mt-12 border-t border-brand-100 pt-8 w-full max-w-lg"
          >
            <div>
              <span className="block text-2xl md:text-3xl font-serif font-bold text-brand-700">99%</span>
              <span className="text-xs text-slate-luxury-900/60 font-semibold tracking-wider uppercase">Patient Satisfaction</span>
            </div>
            <div className="border-l border-brand-100 pl-8">
              <span className="block text-2xl md:text-3xl font-serif font-bold text-brand-700">15+</span>
              <span className="text-xs text-slate-luxury-900/60 font-semibold tracking-wider uppercase">Medical Specialties</span>
            </div>
            <div className="border-l border-brand-100 pl-8">
              <span className="block text-2xl md:text-3xl font-serif font-bold text-brand-700">100k+</span>
              <span className="text-xs text-slate-luxury-900/60 font-semibold tracking-wider uppercase">Happy Patients</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Visual Image */}
        <div className="lg:col-span-5 relative flex justify-center items-center h-full">
          {/* Circular grid design behind image */}
          <div className="absolute w-[110%] h-[110%] rounded-full border border-brand-100/80 -z-10" />
          <div className="absolute w-[95%] h-[95%] rounded-full border border-brand-200/50 -z-10" />

          {/* Main Doctor Image Frame */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            className="relative w-full max-w-sm md:max-w-md aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white shadow-brand-700/10"
          >
            <img
              src={heroDoctor}
              alt="Specialist Medical Doctor"
              className="w-full h-full object-cover"
            />
            {/* Subtle premium gradient overlay on image */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/20 via-transparent to-transparent" />
          </motion.div>

          {/* Floating Premium Badges */}
          <motion.div
            variants={floatVariants}
            animate="animate"
            className="absolute top-12 -left-4 md:-left-8 glass-card rounded-2xl p-4 shadow-xl border border-brand-100 flex items-center gap-3.5 max-w-[200px]"
          >
            <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center text-accent-600">
              <Activity size={20} className="animate-pulse" />
            </div>
            <div>
              <span className="block font-bold text-xs text-brand-800 tracking-wide uppercase">Top Healthcare</span>
              <span className="text-[10px] text-slate-luxury-900/50 font-semibold">Award Winner 2026</span>
            </div>
          </motion.div>

          <motion.div
            animate={{
              y: [0, 8, 0],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute bottom-12 -right-4 md:-right-8 bg-brand-500 text-white rounded-2xl p-4 shadow-xl flex items-center gap-3.5 max-w-[190px]"
          >
            <div className="flex flex-col">
              <span className="text-xs text-white/70 font-medium leading-none uppercase">Emergency Care</span>
              <span className="text-sm font-bold mt-1">24/7 Hotline</span>
              <span className="text-xs font-semibold text-accent-100 mt-0.5">+1 (800) NOVARA-H</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
