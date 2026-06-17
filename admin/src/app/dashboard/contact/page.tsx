"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiFetch } from "../../../utils/api";
import { Loader2, Save, Mail, Phone, MapPin, Globe } from "lucide-react";

const contactSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().or(z.literal("")),
  location: z.string().min(2, { message: "Location must be at least 2 characters." }),
  githubUrl: z.string().url({ message: "Please enter a valid URL." }).or(z.literal("")),
  linkedinUrl: z.string().url({ message: "Please enter a valid URL." }).or(z.literal("")),
  twitterUrl: z.string().url({ message: "Please enter a valid URL." }).or(z.literal("")),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  useEffect(() => {
    const loadContact = async () => {
      try {
        const data = await apiFetch("/cms/contact");
        if (data) {
          Object.keys(data).forEach((key) => {
            setValue(key as any, data[key] || "");
          });
        }
      } catch (err: any) {
        setStatusMsg({ type: "error", text: err.message || "Failed to load contact info." });
      } finally {
        setLoading(false);
      }
    };
    loadContact();
  }, [setValue]);

  const onSubmit = async (data: ContactFormData) => {
    setSaving(true);
    setStatusMsg(null);
    try {
      await apiFetch("/cms/contact", {
        method: "PUT",
        body: JSON.stringify(data),
      });
      setStatusMsg({ type: "success", text: "Contact coordinates saved successfully!" });
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to save contact coordinates." });
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
          Contact Info
        </h1>
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-wider">
          Manage coordinates, physical locations, and primary networking URLs
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
          {/* Email */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              <Mail className="h-3.5 w-3.5" />
              <span>Primary Email</span>
            </label>
            <input
              type="email"
              {...register("email")}
              className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white outline-none transition-all
                ${errors.email ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
              `}
            />
            {errors.email && <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              <Phone className="h-3.5 w-3.5" />
              <span>Phone Number (Optional)</span>
            </label>
            <input
              type="text"
              {...register("phone")}
              className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white outline-none transition-all
                ${errors.phone ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
              `}
            />
            {errors.phone && <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{errors.phone.message}</p>}
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              <MapPin className="h-3.5 w-3.5" />
              <span>Location / Address</span>
            </label>
            <input
              type="text"
              {...register("location")}
              className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white outline-none transition-all
                ${errors.location ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
              `}
            />
            {errors.location && <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{errors.location.message}</p>}
          </div>

          {/* GitHub URL */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              <Globe className="h-3.5 w-3.5" />
              <span>Github URL</span>
            </label>
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

          {/* LinkedIn URL */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              <Globe className="h-3.5 w-3.5" />
              <span>Linkedin URL</span>
            </label>
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

          {/* Twitter URL */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              <Globe className="h-3.5 w-3.5" />
              <span>Twitter URL</span>
            </label>
            <input
              type="text"
              placeholder="https://twitter.com/..."
              {...register("twitterUrl")}
              className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white outline-none transition-all
                ${errors.twitterUrl ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
              `}
            />
            {errors.twitterUrl && <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{errors.twitterUrl.message}</p>}
          </div>
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
              <span>Saving Coordinates...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save coordinates ↗</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
