"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiFetch } from "../../../utils/api";
import { Loader2, Save, FileText } from "lucide-react";

const aboutSchema = z.object({
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  experienceYears: z.number().min(0, { message: "Experience years must be positive." }),
  location: z.string().min(2, { message: "Location must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  highlightsInput: z.string().min(2, { message: "Highlights must be separated by commas." }),
  signatureUrl: z.string().url({ message: "Please enter a valid URL." }).or(z.literal("")),
  recruiterMessage: z.string().min(10, { message: "Recruiter message must be at least 10 characters." }),
});

type AboutFormData = z.infer<typeof aboutSchema>;

export default function AboutPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AboutFormData>({
    resolver: zodResolver(aboutSchema),
  });

  useEffect(() => {
    const loadAbout = async () => {
      try {
        const data = await apiFetch("/cms/about");
        // Seed form values
        setValue("description", data.description || "");
        setValue("experienceYears", data.experienceYears || 0);
        setValue("location", data.location || "");
        setValue("email", data.email || "");
        setValue("signatureUrl", data.signatureUrl || "");
        setValue("recruiterMessage", data.recruiterMessage || "");
        
        // Map arrays to comma separated values
        if (data.highlights && Array.isArray(data.highlights)) {
          setValue("highlightsInput", data.highlights.join(", "));
        } else {
          setValue("highlightsInput", "");
        }
      } catch (err: any) {
        setStatusMsg({ type: "error", text: err.message || "Failed to load About parameters." });
      } finally {
        setLoading(false);
      }
    };
    loadAbout();
  }, [setValue]);

  const onSubmit = async (data: AboutFormData) => {
    setSaving(true);
    setStatusMsg(null);
    try {
      // Split highlights
      const highlights = data.highlightsInput
        .split(",")
        .map((h) => h.trim())
        .filter((h) => h.length > 0);

      const payload = {
        description: data.description,
        experienceYears: data.experienceYears,
        location: data.location,
        email: data.email,
        highlights,
        signatureUrl: data.signatureUrl,
        recruiterMessage: data.recruiterMessage,
      };

      await apiFetch("/cms/about", {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      setStatusMsg({ type: "success", text: "About parameters saved successfully!" });
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to save About parameters." });
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
          About Configuration
        </h1>
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-wider">
          Manage experience summaries, locations, cursive signature, and highlights
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
          {/* Experience Years */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Years of Experience</label>
            <input
              type="number"
              {...register("experienceYears", { valueAsNumber: true })}
              className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white outline-none transition-all
                ${errors.experienceYears ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
              `}
            />
            {errors.experienceYears && <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{errors.experienceYears.message}</p>}
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Location (Address)</label>
            <input
              type="text"
              {...register("location")}
              className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white outline-none transition-all
                ${errors.location ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
              `}
            />
            {errors.location && <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{errors.location.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              {...register("email")}
              className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white outline-none transition-all
                ${errors.email ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
              `}
            />
            {errors.email && <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{errors.email.message}</p>}
          </div>

          {/* Cursive Signature URL */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Cursive Signature Image URL</label>
            <input
              type="text"
              placeholder="https://..."
              {...register("signatureUrl")}
              className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white outline-none transition-all
                ${errors.signatureUrl ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
              `}
            />
            {errors.signatureUrl && <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{errors.signatureUrl.message}</p>}
          </div>
        </div>

        {/* Highlights */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Highlights Tags (Comma Separated)</label>
          <input
            type="text"
            placeholder="React Expert, Node Specialist, AWS Certified..."
            {...register("highlightsInput")}
            className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white outline-none transition-all
              ${errors.highlightsInput ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
            `}
          />
          {errors.highlightsInput && <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{errors.highlightsInput.message}</p>}
        </div>

        {/* Biography description */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Biography Description</label>
          <textarea
            rows={5}
            {...register("description")}
            className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white outline-none resize-none transition-all
              ${errors.description ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
            `}
          />
          {errors.description && <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{errors.description.message}</p>}
        </div>

        {/* Recruiter Message */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Recruiter Greeting Message</label>
          <textarea
            rows={3}
            {...register("recruiterMessage")}
            className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white outline-none resize-none transition-all
              ${errors.recruiterMessage ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
            `}
          />
          {errors.recruiterMessage && <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{errors.recruiterMessage.message}</p>}
        </div>

        {/* Save button */}
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
