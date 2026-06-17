"use client";

import React, { useState, useEffect } from "react";
import { apiFetch } from "../../../utils/api";
import { Loader2, Plus, Trash2, Edit, Save, CalendarDays, RefreshCw, X } from "lucide-react";

interface ExperienceItem {
  _id: string;
  companyName: string;
  position: string;
  duration: string;
  description: string[];
  skillsUsed: string[];
  displayOrder: number;
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [position, setPosition] = useState("");
  const [duration, setDuration] = useState("");
  const [descInput, setDescInput] = useState(""); // newline separated
  const [skillsInput, setSkillsInput] = useState(""); // comma separated
  const [displayOrder, setDisplayOrder] = useState(0);

  const fetchExperiences = async () => {
    try {
      const data = await apiFetch("/cms/experience");
      setExperiences(data.sort((a: ExperienceItem, b: ExperienceItem) => a.displayOrder - b.displayOrder));
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to load experiences." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setCompanyName("");
    setPosition("");
    setDuration("");
    setDescInput("");
    setSkillsInput("");
    setDisplayOrder(0);
  };

  const handleEditSelect = (exp: ExperienceItem) => {
    setEditingId(exp._id);
    setCompanyName(exp.companyName);
    setPosition(exp.position);
    setDuration(exp.duration);
    setDescInput(exp.description.join("\n"));
    setSkillsInput(exp.skillsUsed.join(", "));
    setDisplayOrder(exp.displayOrder);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !position.trim() || !duration.trim()) {
      setStatusMsg({ type: "error", text: "Please fill in Company, Position, and Duration fields." });
      return;
    }

    setSaving(true);
    setStatusMsg(null);

    const description = descInput
      .split("\n")
      .map((d) => d.trim())
      .filter((d) => d.length > 0);

    const skillsUsed = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const payload = {
      companyName: companyName.trim(),
      position: position.trim(),
      duration: duration.trim(),
      description,
      skillsUsed,
      displayOrder: Number(displayOrder),
    };

    try {
      if (editingId) {
        // Edit mode
        const updated = await apiFetch(`/cms/experience/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setStatusMsg({ type: "success", text: `Experience at "${updated.companyName}" updated successfully!` });
      } else {
        // Add mode
        const created = await apiFetch("/cms/experience", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setStatusMsg({ type: "success", text: `Experience at "${created.companyName}" added successfully!` });
      }
      resetForm();
      fetchExperiences();
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to save experience entry." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, company: string) => {
    if (!confirm(`Are you sure you want to delete the experience at "${company}"?`)) return;
    setStatusMsg(null);
    try {
      await apiFetch(`/cms/experience/${id}`, { method: "DELETE" });
      setStatusMsg({ type: "success", text: `Experience at "${company}" deleted.` });
      if (editingId === id) resetForm();
      fetchExperiences();
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to delete experience." });
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
          Experience Manager
        </h1>
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-wider">
          Configure work timeline nodes, company positions, and technical contributions
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Experiences List Table */}
        <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden self-start">
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4.5 w-4.5 text-zinc-400" />
              <h2 className="text-xs font-bold font-mono uppercase text-white tracking-wider">
                Timeline Nodes
              </h2>
            </div>
            <span className="text-[9px] font-mono text-zinc-500 uppercase">
              {experiences.length} records
            </span>
          </div>

          <div className="divide-y divide-zinc-800/60">
            {experiences.length > 0 ? (
              experiences.map((exp) => (
                <div key={exp._id} className="p-6 hover:bg-zinc-800/10 transition-colors space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-sans font-black text-white text-sm uppercase">
                        {exp.position}
                      </h3>
                      <p className="text-xs font-mono text-[#E63925] uppercase tracking-wider font-semibold">
                        {exp.companyName}
                      </p>
                      <p className="text-[10px] font-mono text-zinc-500 mt-1 uppercase">
                        {exp.duration}
                      </p>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleEditSelect(exp)}
                        className="p-1.5 bg-zinc-950 border border-zinc-850 rounded text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        title="Edit Entry"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(exp._id, exp.companyName)}
                        className="p-1.5 bg-zinc-950 border border-zinc-850 rounded text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete Entry"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Descriptions */}
                  <ul className="list-disc list-inside space-y-1 font-sans text-xs text-zinc-400">
                    {exp.description.map((bullet, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {bullet}
                      </li>
                    ))}
                  </ul>

                  {/* Skills tags */}
                  {exp.skillsUsed && exp.skillsUsed.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {exp.skillsUsed.map((skill) => (
                        <span
                          key={skill}
                          className="bg-zinc-950 border border-zinc-850 px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-mono text-zinc-400"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Display Order badge */}
                  <div className="flex justify-end pt-1">
                    <span className="font-mono text-[9px] text-zinc-600 uppercase">
                      Order Weight: {exp.displayOrder}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-zinc-500 font-mono uppercase tracking-widest text-[10px]">
                No experience timeline records in catalog.
              </div>
            )}
          </div>
        </div>

        {/* Right: Form Editor (Inline Add/Edit) */}
        <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-xl p-6 self-start space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Plus className="h-4.5 w-4.5 text-zinc-400" />
              <h2 className="text-xs font-bold font-mono uppercase text-white tracking-wider">
                {editingId ? "Edit Node" : "Add Node"}
              </h2>
            </div>
            {editingId && (
              <button
                onClick={resetForm}
                className="text-zinc-500 hover:text-white flex items-center gap-1 font-mono text-[10px] uppercase cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
                <span>Cancel</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Company Name */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Company Name</label>
              <input
                type="text"
                placeholder="e.g. Google"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg font-mono text-xs text-white outline-none"
              />
            </div>

            {/* Position */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Job Title / Position</label>
              <input
                type="text"
                placeholder="e.g. Senior Software Engineer"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg font-mono text-xs text-white outline-none"
              />
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Duration / Date Range</label>
              <input
                type="text"
                placeholder="e.g. Jun 2024 - Present"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg font-mono text-xs text-white outline-none"
              />
            </div>

            {/* Display Order */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Display Order (Sorting)</label>
              <input
                type="number"
                placeholder="0"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg font-mono text-xs text-white outline-none"
              />
            </div>

            {/* Skills Used */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Technologies (Comma Separated)</label>
              <input
                type="text"
                placeholder="React, Next.js, TypeScript..."
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg font-mono text-xs text-white outline-none"
              />
            </div>

            {/* Description (bullet points) */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Bullet Points (One per line)
              </label>
              <textarea
                rows={6}
                placeholder={"Designed microservices structures.\nOptimized backend pipeline database fetches."}
                value={descInput}
                onChange={(e) => setDescInput(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg font-mono text-xs text-white outline-none resize-none"
              />
            </div>

            {/* Action button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-mono text-xs uppercase tracking-widest font-bold rounded-lg transition-colors disabled:bg-zinc-800 disabled:text-zinc-600 cursor-pointer"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{editingId ? "Save Node ↗" : "Create Node ↗"}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
