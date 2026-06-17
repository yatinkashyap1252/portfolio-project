"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiFetch } from "../../../utils/api";
import { Loader2, Save, User, ArrowUpRight } from "lucide-react";

const heroSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  designation: z.string().min(2, { message: "Designation must be at least 2 characters." }),
  headline: z.string().min(5, { message: "Headline must be at least 5 characters." }),
  shortIntro: z.string().min(10, { message: "Intro must be at least 10 characters." }),
  resumeUrl: z.string().url({ message: "Please enter a valid URL." }).or(z.literal("")),
  profileImageUrl: z.string().url({ message: "Please enter a valid URL." }).or(z.literal("")),
  githubUrl: z.string().url({ message: "Please enter a valid URL." }).or(z.literal("")),
  linkedinUrl: z.string().url({ message: "Please enter a valid URL." }).or(z.literal("")),
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type HeroFormData = z.infer<typeof heroSchema>;

export default function HeroPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<HeroFormData>({
    resolver: zodResolver(heroSchema),
  });

  useEffect(() => {
    const loadHero = async () => {
      try {
        const data = await apiFetch("/cms/hero");
        // Seed form values
        Object.keys(data).forEach((key) => {
          setValue(key as any, data[key] || "");
        });
      } catch (err: any) {
        setStatusMsg({ type: "error", text: err.message || "Failed to load Hero configs." });
      } finally {
        setLoading(false);
      }
    };
    loadHero();
  }, [setValue]);

  const onSubmit = async (data: HeroFormData) => {
    setSaving(true);
    setStatusMsg(null);
    try {
      await apiFetch("/cms/hero", {
        method: "PUT",
        body: JSON.stringify(data),
      });
      setStatusMsg({ type: "success", text: "Hero parameters saved successfully!" });
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to save Hero parameters." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-400 font-mono text-xs gap-3">
        <Loader2 className="animate-spin h-5 w-5 text-[#E63925]" />
        <span>LOADING CONFIGS...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white font-sans">
          Hero Configuration
        </h1>
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-wider">
          Manage header text layout, metadata, and core assets
        </p>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-lg text-xs font-mono border
            ${
              statusMsg.type === "success"
                ? "bg-green-950/40 border-green-900/50 text-green-200"
                : "bg-red-950/40 border-red-900/50 text-red-200"
            }
          `}
        >
          {statusMsg.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              {...register("name")}
              className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white outline-none transition-all
                ${errors.name ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
              `}
            />
            {errors.name && <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{errors.name.message}</p>}
          </div>

          {/* Designation */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Designation / Role</label>
            <input
              type="text"
              {...register("designation")}
              className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white outline-none transition-all
                ${errors.designation ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
              `}
            />
            {errors.designation && <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{errors.designation.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Primary Email</label>
            <input
              type="email"
              {...register("email")}
              className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white outline-none transition-all
                ${errors.email ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
              `}
            />
            {errors.email && <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{errors.email.message}</p>}
          </div>

          {/* Resume Download URL */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Resume Records URL</label>
            <input
              type="text"
              placeholder="https://..."
              {...register("resumeUrl")}
              className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white outline-none transition-all
                ${errors.resumeUrl ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
              `}
            />
            {errors.resumeUrl && <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{errors.resumeUrl.message}</p>}
          </div>

          {/* Profile Image URL */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Profile Image URL</label>
            <input
              type="text"
              placeholder="https://..."
              {...register("profileImageUrl")}
              className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white outline-none transition-all
                ${errors.profileImageUrl ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
              `}
            />
            {errors.profileImageUrl && <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{errors.profileImageUrl.message}</p>}
          </div>

          {/* Github URL */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Github URL</label>
            <input
              type="text"
              placeholder="https://github.com/..."
              {...register("githubUrl")}
              className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white outline-none transition-all
                ${errors.githubUrl ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
              `}
            />
            {errors.githubUrl && <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{errors.githubUrl.message}</p>}
          </div>

          {/* Linkedin URL */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Linkedin URL</label>
            <input
              type="text"
              placeholder="https://linkedin.com/in/..."
              {...register("linkedinUrl")}
              className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white outline-none transition-all
                ${errors.linkedinUrl ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
              `}
            />
            {errors.linkedinUrl && <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{errors.linkedinUrl.message}</p>}
          </div>
        </div>

        {/* Headline */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Hero Headline Copy</label>
          <input
            type="text"
            {...register("headline")}
            className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white outline-none transition-all
              ${errors.headline ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
            `}
          />
          {errors.headline && <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{errors.headline.message}</p>}
        </div>

        {/* Short Intro */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Short Biography Intro</label>
          <textarea
            rows={4}
            {...register("shortIntro")}
            className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white outline-none resize-none transition-all
              ${errors.shortIntro ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
            `}
          />
          {errors.shortIntro && <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{errors.shortIntro.message}</p>}
        </div>

        {/* Action button */}
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-mono text-xs uppercase tracking-widest font-bold rounded-lg transition-colors disabled:bg-zinc-800 disabled:text-zinc-600 cursor-pointer"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Parameters ↗</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
