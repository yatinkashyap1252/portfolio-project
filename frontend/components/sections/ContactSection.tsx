"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Mail, Send, FileText } from "lucide-react";
import { heroData } from "@/data/hero";
import { fetchAPI } from "@/lib/api";

// =========================================================================
// ZOD SCHEMA DEFINITION
// =========================================================================

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(3, { message: "Subject must be at least 3 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactSection() {
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [email, setEmail] = useState(heroData.email);
  const [resumeUrl, setResumeUrl] = useState("/resume.pdf");

  useEffect(() => {
    async function loadContactAndHero() {
      try {
        const contact = await fetchAPI<any>("/cms/contact");
        if (contact && contact.email) {
          setEmail(contact.email);
        }
        const hero = await fetchAPI<any>("/cms/hero");
        if (hero && hero.resumeUrl) {
          setResumeUrl(hero.resumeUrl);
        }
      } catch (err) {
        console.error("Error loading contact and hero details:", err);
      }
    }
    loadContactAndHero();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitError(null);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const response = await fetch(`${baseUrl}/cms/contact/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || "Failed to send message.");
      }

      console.log("Form Submitted Successfully:", resData);
      setIsSubmitSuccess(true);
      reset();
    } catch (err: any) {
      console.error("Error submitting contact form:", err);
      setSubmitError(err.message || "Failed to connect to backend server. Please verify if it is running.");
    }
  };

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
    hidden: { opacity: 0, y: 25 },
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
        className="w-full max-w-7xl border border-zinc-800 bg-[#0A0A0A] grid grid-cols-1 lg:grid-cols-12"
      >
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Section Description & Download CTA (Span 5) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-zinc-800 flex flex-col justify-between min-h-[380px] lg:min-h-[500px] relative overflow-hidden">
          
          {/* Concentric Circle Arches (Direct theme-cohesive quote from screenshot) */}
          <svg className="absolute bottom-[-30px] right-[-30px] w-64 h-64 pointer-events-none opacity-20">
            <circle cx="160" cy="160" r="130" fill="none" className="stroke-zinc-700 stroke-[1.5]" />
            <circle cx="160" cy="160" r="100" fill="none" className="stroke-zinc-700 stroke-[1.5]" />
            <circle cx="160" cy="160" r="70" fill="none" className="stroke-zinc-700 stroke-[1.5]" />
            <circle cx="160" cy="160" r="40" fill="none" className="stroke-[#E63925] stroke-[1.5]" />
          </svg>

          {/* Dynamic Left Margin rotated address text */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 rotate-[-90deg] origin-left hidden xl:block select-none pointer-events-none font-mono text-[9px] text-zinc-600 tracking-[0.25em] uppercase whitespace-nowrap">
            {email} // DIRECT MAIL CHANNEL
          </div>

          <motion.div variants={itemVariants} className="space-y-6 relative z-10 pl-0 xl:pl-6">
            <div className="w-16 h-3 bg-white" />
            <span className="font-mono text-xs text-[#E63925] tracking-widest font-bold block uppercase">
              SECTION 07 / GET IN TOUCH
            </span>
            <h2 className="text-3xl md:text-5xl font-sans font-black tracking-tight uppercase leading-[1.05]">
              Leave A <br /> Message.
            </h2>
            <p className="text-zinc-400 text-xs md:text-sm font-light leading-relaxed max-w-sm">
              Have a position in mind or want to discuss a custom project? Fill out the form, or download my current resume records below.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="relative z-10 pt-8 pl-0 xl:pl-6">
            {/* Download Resume pill button matching theme */}
            <a
              href={resumeUrl}
              download="resume"
              className="inline-flex items-center justify-between gap-6 px-6 py-4 rounded-full bg-[#E63925] text-white font-mono text-xs uppercase tracking-widest hover:bg-[#F34D3A] transition-all duration-300 shadow-md shadow-[#E63925]/20 group w-full max-w-[280px]"
            >
              <span className="flex items-center gap-2">
                <FileText className="h-4.5 w-4.5" />
                Download Resume
              </span>
              <motion.div
                whileHover={{ rotate: 45, scale: 1.15 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ArrowUpRight className="h-4.5 w-4.5 text-white" />
              </motion.div>
            </a>
          </motion.div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Validated Contact Form Card (Span 7) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center min-h-[500px] relative overflow-hidden bg-zinc-950/10">
          
          {/* Subtle graph-paper grid lines (Theme-cohesive notebook reference) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-5">
            <defs>
              <pattern id="contact-notebook-lines" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" className="stroke-zinc-700 stroke-[0.8]" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#contact-notebook-lines)" />
          </svg>

          <AnimatePresence mode="wait">
            {!isSubmitSuccess ? (
              <motion.form
                key="contact-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 relative z-10"
              >
                {/* Row: Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="block font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
                      Your Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Yatin Kashyap"
                      {...register("name")}
                      className={`w-full px-4 py-3 bg-[#0E0E0E] border rounded-lg font-mono text-xs text-white placeholder-zinc-700 transition-all duration-200 outline-none
                        ${errors.name ? "border-[#E63925] focus:ring-1 focus:ring-[#E63925]/30" : "border-zinc-900 focus:border-[#E63925]/80"}
                      `}
                    />
                    {errors.name && (
                      <p className="font-mono text-[9px] text-[#E63925] uppercase tracking-wider">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
                      Your Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      {...register("email")}
                      className={`w-full px-4 py-3 bg-[#0E0E0E] border rounded-lg font-mono text-xs text-white placeholder-zinc-700 transition-all duration-200 outline-none
                        ${errors.email ? "border-[#E63925] focus:ring-1 focus:ring-[#E63925]/30" : "border-zinc-900 focus:border-[#E63925]/80"}
                      `}
                    />
                    {errors.email && (
                      <p className="font-mono text-[9px] text-[#E63925] uppercase tracking-wider">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                {/* Subject field */}
                <div className="space-y-2">
                  <label htmlFor="subject" className="block font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
                    Inquiry Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="Project proposal or Fulltime recruitment offer..."
                    {...register("subject")}
                    className={`w-full px-4 py-3 bg-[#0E0E0E] border rounded-lg font-mono text-xs text-white placeholder-zinc-700 transition-all duration-200 outline-none
                      ${errors.subject ? "border-[#E63925] focus:ring-1 focus:ring-[#E63925]/30" : "border-zinc-900 focus:border-[#E63925]/80"}
                    `}
                  />
                  {errors.subject && (
                    <p className="font-mono text-[9px] text-[#E63925] uppercase tracking-wider">{errors.subject.message}</p>
                  )}
                </div>

                {/* Message field */}
                <div className="space-y-2">
                  <label htmlFor="message" className="block font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
                    Detailed Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Describe your inquiry details..."
                    {...register("message")}
                    className={`w-full px-4 py-3 bg-[#0E0E0E] border rounded-lg font-mono text-xs text-white placeholder-zinc-700 transition-all duration-200 outline-none resize-none
                      ${errors.message ? "border-[#E63925] focus:ring-1 focus:ring-[#E63925]/30" : "border-zinc-900 focus:border-[#E63925]/80"}
                    `}
                  />
                  {errors.message && (
                    <p className="font-mono text-[9px] text-[#E63925] uppercase tracking-wider">{errors.message.message}</p>
                  )}
                </div>

                {submitError && (
                  <p className="font-mono text-xs text-[#E63925] uppercase tracking-wider text-center border border-[#E63925]/30 bg-[#E63925]/5 py-2.5 rounded-lg">
                    {submitError}
                  </p>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-white text-black font-mono text-xs uppercase tracking-widest font-bold rounded-lg hover:bg-[#E63925] hover:text-white transition-colors duration-300 disabled:bg-zinc-800 disabled:text-zinc-600 group"
                >
                  {isSubmitting ? (
                    <span className="h-4.5 w-4.5 border-2 border-zinc-500 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send Message ↗</span>
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              // ANIMATED SUCCESS SCREEN
              <motion.div
                key="success-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-center p-8 relative z-10 space-y-6"
              >
                <div className="h-16 w-16 rounded-full bg-[#E63925]/10 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-[#E63925]" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-wide">
                    MESSAGE RECEIVED
                  </h3>
                  <p className="text-zinc-400 text-xs md:text-sm max-w-sm leading-relaxed font-light">
                    Thank you for reaching out! Your email has been simulated and processed. I will review your message and reply shortly.
                  </p>
                </div>

                <button
                  onClick={() => setIsSubmitSuccess(false)}
                  className="px-6 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-mono text-[10px] uppercase tracking-wider rounded-lg transition-all"
                >
                  Send Another Message
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
