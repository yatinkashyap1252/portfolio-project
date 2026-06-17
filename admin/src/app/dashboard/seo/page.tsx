"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiFetch } from "../../../utils/api";
import { Loader2, Save, Globe } from "lucide-react";

const seoSchema = z.object({
  metaTitle: z.string().min(2, { message: "Title must be at least 2 characters." }),
  metaDescription: z.string().min(10, { message: "Description must be at least 10 characters." }),
  keywordsInput: z.string().min(2, { message: "Enter keywords separated by commas." }),
  ogImageUrl: z.string().url({ message: "Please enter a valid URL." }).or(z.literal("")),
});

type SEOFormData = z.infer<typeof seoSchema>;

export default function SEOPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SEOFormData>({
    resolver: zodResolver(seoSchema),
  });

  useEffect(() => {
    const loadSEO = async () => {
      try {
        const data = await apiFetch("/cms/seo");
        if (data) {
          setValue("metaTitle", data.metaTitle || "");
          setValue("metaDescription", data.metaDescription || "");
          setValue("keywordsInput", (data.keywords || []).join(", "));
          setValue("ogImageUrl", data.ogImageUrl || "");
        }
      } catch (err: any) {
        setStatusMsg({ type: "error", text: err.message || "Failed to load SEO configs." });
      } finally {
        setLoading(false);
      }
    };
    loadSEO();
  }, [setValue]);

  const onSubmit = async (data: SEOFormData) => {
    setSaving(true);
    setStatusMsg(null);

    const keywords = data.keywordsInput
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    const payload = {
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      keywords,
      ogImageUrl: data.ogImageUrl || undefined,
    };

    try {
      await apiFetch("/cms/seo", {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      setStatusMsg({ type: "success", text: "SEO metadata saved successfully!" });
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to save SEO metadata." });
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
          SEO Management
        </h1>
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-wider">
          Configure search metadata headers, keywords, indexing targets, and OpenGraph visuals
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
        <div className="space-y-6">
          {/* Meta Title */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Meta Page Title</label>
            <input
              type="text"
              placeholder="e.g. John Doe - Senior Full Stack Engineer"
              {...register("metaTitle")}
              className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white outline-none transition-all
                ${errors.metaTitle ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
              `}
            />
            {errors.metaTitle && <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{errors.metaTitle.message}</p>}
          </div>

          {/* Keywords */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Search Keywords (Comma Separated)</label>
            <input
              type="text"
              placeholder="React, Next.js, Portfolio, Node, Web Developer..."
              {...register("keywordsInput")}
              className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white outline-none transition-all
                ${errors.keywordsInput ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
              `}
            />
            {errors.keywordsInput && <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{errors.keywordsInput.message}</p>}
          </div>

          {/* OpenGraph Image URL */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">OpenGraph Image URL (Social Share Preview)</label>
            <input
              type="text"
              placeholder="https://..."
              {...register("ogImageUrl")}
              className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white outline-none transition-all
                ${errors.ogImageUrl ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
              `}
            />
            {errors.ogImageUrl && <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{errors.ogImageUrl.message}</p>}
          </div>

          {/* Meta Description */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Meta Description copy</label>
            <textarea
              rows={4}
              placeholder="Provide a search index summary (between 120-160 characters is recommended)..."
              {...register("metaDescription")}
              className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white outline-none resize-none transition-all
                ${errors.metaDescription ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
              `}
            />
            {errors.metaDescription && <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{errors.metaDescription.message}</p>}
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
              <span>Saving SEO Parameters...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save seo settings ↗</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
