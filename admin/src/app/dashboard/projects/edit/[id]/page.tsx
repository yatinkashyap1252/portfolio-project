"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useParams } from "next/navigation";
import { apiFetch } from "../../../../../utils/api";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

const projectSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  techInput: z.string().min(2, { message: "Enter technologies separated by commas." }),
  githubUrl: z.string().url({ message: "Please enter a valid Github URL." }),
  liveUrl: z.string().url({ message: "Please enter a valid URL." }).or(z.literal("")),
  thumbnailUrl: z.string().url({ message: "Please enter a valid URL." }).or(z.literal("")),
  isFeatured: z.boolean(),
  isDraft: z.boolean(),
  displayOrder: z.number(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      isFeatured: false,
      isDraft: true,
      displayOrder: 0,
    },
  });

  useEffect(() => {
    if (!id) return;
    const loadProject = async () => {
      try {
        const data = await apiFetch(`/cms/projects/${id}`);
        setValue("title", data.title || "");
        setValue("description", data.description || "");
        setValue("techInput", (data.technologies || []).join(", "));
        setValue("githubUrl", data.githubUrl || "");
        setValue("liveUrl", data.liveUrl || "");
        setValue("thumbnailUrl", data.thumbnailUrl || "");
        setValue("isFeatured", !!data.isFeatured);
        setValue("isDraft", !!data.isDraft);
        setValue("displayOrder", data.displayOrder || 0);
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to load project details.");
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [id, setValue]);

  const onSubmit = async (data: ProjectFormData) => {
    setSaving(true);
    setErrorMsg(null);
    try {
      const technologies = data.techInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const payload = {
        title: data.title,
        description: data.description,
        technologies,
        githubUrl: data.githubUrl,
        liveUrl: data.liveUrl || undefined,
        thumbnailUrl: data.thumbnailUrl,
        isFeatured: data.isFeatured,
        isDraft: data.isDraft,
        displayOrder: data.displayOrder,
      };

      await apiFetch(`/cms/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      router.push("/dashboard/projects");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update project.");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-400 font-mono text-xs gap-3">
        <Loader2 className="animate-spin h-5 w-5 text-[#E63925]" />
        <span>LOADING PROJECT DETAILS...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header bar */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/projects"
          className="p-2 border border-zinc-800 hover:border-zinc-700 bg-zinc-900 rounded-lg text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white font-sans">
            Edit Project
          </h1>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-wider">
            Modify repository settings and portfolio visuals
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-950/40 border border-red-900/50 rounded-lg text-red-200 text-xs font-mono">
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Project Title</label>
            <input
              type="text"
              placeholder="e.g. Finance Dashboard"
              {...register("title")}
              className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white outline-none transition-all
                ${errors.title ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
              `}
            />
            {errors.title && <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{errors.title.message}</p>}
          </div>

          {/* Tech stack */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Technologies (Comma Separated)</label>
            <input
              type="text"
              placeholder="React, Typescript, Node, Express..."
              {...register("techInput")}
              className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white outline-none transition-all
                ${errors.techInput ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
              `}
            />
            {errors.techInput && <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{errors.techInput.message}</p>}
          </div>

          {/* GitHub URL */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Github Repository URL</label>
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

          {/* Live Deployment URL */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Live Deploy URL (Optional)</label>
            <input
              type="text"
              placeholder="https://..."
              {...register("liveUrl")}
              className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white outline-none transition-all
                ${errors.liveUrl ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
              `}
            />
            {errors.liveUrl && <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{errors.liveUrl.message}</p>}
          </div>

          {/* Thumbnail URL */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Thumbnail Image URL</label>
            <input
              type="text"
              placeholder="https://..."
              {...register("thumbnailUrl")}
              className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white outline-none transition-all
                ${errors.thumbnailUrl ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
              `}
            />
            {errors.thumbnailUrl && <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{errors.thumbnailUrl.message}</p>}
          </div>

          {/* Display Order */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Display Order</label>
            <input
              type="number"
              placeholder="0"
              {...register("displayOrder", { valueAsNumber: true })}
              className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white outline-none transition-all
                ${errors.displayOrder ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
              `}
            />
            {errors.displayOrder && <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{errors.displayOrder.message}</p>}
          </div>

          {/* Attributes: Featured & Draft */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 flex flex-col justify-center">
              <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2">Visibility Settings</span>
              <div className="flex items-center gap-6">
                {/* Draft */}
                <label className="flex items-center gap-2 font-mono text-xs text-zinc-300 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("isDraft")}
                    className="h-4 w-4 rounded bg-zinc-950 border-zinc-800 text-[#E63925] focus:ring-0 cursor-pointer"
                  />
                  <span>Save as Draft</span>
                </label>
                
                {/* Featured */}
                <label className="flex items-center gap-2 font-mono text-xs text-zinc-300 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("isFeatured")}
                    className="h-4 w-4 rounded bg-zinc-950 border-zinc-800 text-[#E63925] focus:ring-0 cursor-pointer"
                  />
                  <span>Featured Item</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Project Description</label>
          <textarea
            rows={5}
            placeholder="Write a clear description of the project parameters, dependencies, and layout structures..."
            {...register("description")}
            className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white outline-none resize-none transition-all
              ${errors.description ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
            `}
          />
          {errors.description && <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{errors.description.message}</p>}
        </div>

        {/* Submit button */}
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
              <span>Save Changes ↗</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
