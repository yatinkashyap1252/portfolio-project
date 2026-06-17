"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { apiFetch } from "../../../utils/api";
import {
  FolderKanban,
  Plus,
  Edit,
  Trash2,
  Copy,
  Star,
  Eye,
  EyeOff,
  Loader2,
  ExternalLink,
  ArrowUpDown,
} from "lucide-react";

interface ProjectItem {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  thumbnailUrl: string;
  isFeatured: boolean;
  isDraft: boolean;
  displayOrder: number;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchProjects = async () => {
    try {
      const data = await apiFetch("/cms/projects");
      setProjects(data);
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to load projects." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleToggleDraft = async (id: string, currentDraft: boolean) => {
    try {
      await apiFetch(`/cms/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify({ isDraft: !currentDraft }),
      });
      setProjects(projects.map((p) => (p._id === id ? { ...p, isDraft: !currentDraft } : p)));
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to update project status." });
    }
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      await apiFetch(`/cms/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify({ isFeatured: !currentFeatured }),
      });
      setProjects(projects.map((p) => (p._id === id ? { ...p, isFeatured: !currentFeatured } : p)));
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to update project attributes." });
    }
  };

  const handleDuplicateProject = async (id: string, title: string) => {
    try {
      setLoading(true);
      await apiFetch(`/cms/projects/${id}/duplicate`, { method: "POST" });
      setStatusMsg({ type: "success", text: `Duplicated "${title}" successfully!` });
      fetchProjects();
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to duplicate project." });
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;
    try {
      await apiFetch(`/cms/projects/${id}`, { method: "DELETE" });
      setProjects(projects.filter((p) => p._id !== id));
      setStatusMsg({ type: "success", text: `Deleted "${title}" successfully.` });
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to delete project." });
    }
  };

  const handleUpdateOrder = async (id: string, newOrder: number) => {
    try {
      await apiFetch(`/cms/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify({ displayOrder: newOrder }),
      });
      setProjects(
        projects
          .map((p) => (p._id === id ? { ...p, displayOrder: newOrder } : p))
          .sort((a, b) => a.displayOrder - b.displayOrder)
      );
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to update sorting order." });
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
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white font-sans">
            Projects Catalog
          </h1>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-wider">
            Draft, publish, reorder, and duplicate showcase repositories
          </p>
        </div>

        <Link
          href="/dashboard/projects/new"
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-mono text-xs uppercase tracking-widest font-bold rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>New Project ↗</span>
        </Link>
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

      {/* Projects List Panel */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-950/40 text-zinc-500 uppercase tracking-wider border-b border-zinc-800 text-[10px]">
                <th className="py-3.5 px-6">Display Order</th>
                <th className="py-3.5 px-6">Project Title</th>
                <th className="py-3.5 px-6 text-center">Featured</th>
                <th className="py-3.5 px-6 text-center">Status</th>
                <th className="py-3.5 px-6">Tech Stack</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <tr key={project._id} className="hover:bg-zinc-800/20 text-zinc-300">
                    {/* Display Order */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={project.displayOrder}
                          onChange={(e) => handleUpdateOrder(project._id, Number(e.target.value))}
                          className="w-12 px-2 py-1 bg-zinc-950 border border-zinc-800 focus:border-zinc-700 text-center rounded text-white"
                        />
                      </div>
                    </td>

                    {/* Title & Links */}
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <span className="font-sans font-bold text-white uppercase text-sm block">
                          {project.title}
                        </span>
                        <div className="flex gap-3 text-[10px] text-zinc-500">
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-white inline-flex items-center gap-1"
                          >
                            <span>Repo</span>
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:text-white inline-flex items-center gap-1"
                            >
                              <span>Live</span>
                              <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleToggleFeatured(project._id, project.isFeatured)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer
                          ${
                            project.isFeatured
                              ? "bg-amber-950/30 border-amber-900/40 text-amber-400"
                              : "bg-zinc-950 border-zinc-850 text-zinc-600 hover:text-zinc-400"
                          }
                        `}
                        title={project.isFeatured ? "Featured item" : "Set featured"}
                      >
                        <Star className="h-4 w-4" fill={project.isFeatured ? "currentColor" : "none"} />
                      </button>
                    </td>

                    {/* Draft/Publish Toggle */}
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleToggleDraft(project._id, project.isDraft)}
                        className={`px-2.5 py-1 rounded text-[9px] uppercase tracking-wider font-bold border transition-all cursor-pointer
                          ${
                            project.isDraft
                              ? "bg-zinc-950 border-zinc-850 text-zinc-500"
                              : "bg-[#E63925]/10 border-[#E63925]/30 text-[#E63925]"
                          }
                        `}
                      >
                        {project.isDraft ? "DRAFT" : "PUBLISHED"}
                      </button>
                    </td>

                    {/* Tech tags */}
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1.5 max-w-xs">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="bg-zinc-950 border border-zinc-850 px-2 py-0.5 rounded text-[9px] uppercase text-zinc-400"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="text-[9px] text-zinc-600 font-mono">
                            +{project.technologies.length - 3} MORE
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDuplicateProject(project._id, project.title)}
                          className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-850 text-zinc-400 hover:text-white transition-all cursor-pointer"
                          title="Duplicate project"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>

                        <Link
                          href={`/dashboard/projects/edit/${project._id}`}
                          className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-850 text-zinc-400 hover:text-white transition-all cursor-pointer"
                          title="Edit project"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Link>

                        <button
                          onClick={() => handleDeleteProject(project._id, project.title)}
                          className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-850 text-zinc-500 hover:text-red-400 transition-all cursor-pointer"
                          title="Delete project"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-500 uppercase tracking-widest text-[10px]">
                    No project records in catalog.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
