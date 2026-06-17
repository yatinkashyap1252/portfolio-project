"use client";

import React, { useState, useEffect } from "react";
import { apiFetch } from "../../../utils/api";
import { Loader2, Plus, Trash2, Library, Sparkles, AlertCircle } from "lucide-react";

interface SkillItem {
  _id: string;
  name: string;
  category: "frontend" | "backend" | "state" | "devops" | "other";
  proficiency: number;
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Single Skill Form state
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<"frontend" | "backend" | "state" | "devops" | "other">("frontend");
  const [newProficiency, setNewProficiency] = useState(80);

  // Bulk Skills Form state
  const [bulkInput, setBulkInput] = useState("");
  const [bulkCategory, setBulkCategory] = useState<"frontend" | "backend" | "state" | "devops" | "other">("frontend");
  const [bulkProficiency, setBulkProficiency] = useState(80);

  const fetchSkills = async () => {
    try {
      const data = await apiFetch("/cms/skills");
      setSkills(data);
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to fetch skills." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleAddSingleSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setSaving(true);
    setStatusMsg(null);

    try {
      const added = await apiFetch("/cms/skills", {
        method: "POST",
        body: JSON.stringify({
          name: newName.trim(),
          category: newCategory,
          proficiency: newProficiency,
          displayOrder: skills.length + 1,
        }),
      });
      setSkills([...skills, added]);
      setNewName("");
      setStatusMsg({ type: "success", text: `Skill "${added.name}" added successfully!` });
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to add skill." });
    } finally {
      setSaving(false);
    }
  };

  const handleAddBulkSkills = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkInput.trim()) return;
    setSaving(true);
    setStatusMsg(null);

    const parsedNames = bulkInput
      .split("\n")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    if (parsedNames.length === 0) {
      setSaving(false);
      return;
    }

    const payload = parsedNames.map((name) => ({
      name,
      category: bulkCategory,
      proficiency: bulkProficiency,
    }));

    try {
      const res = await apiFetch("/cms/skills/bulk", {
        method: "POST",
        body: JSON.stringify({ skills: payload }),
      });
      setStatusMsg({ type: "success", text: res.message || `Successfully created ${res.created?.length} skills.` });
      setBulkInput("");
      fetchSkills(); // Reload full list
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to load bulk skills." });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSkill = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the skill "${name}"?`)) return;
    setStatusMsg(null);

    try {
      await apiFetch(`/cms/skills/${id}`, { method: "DELETE" });
      setSkills(skills.filter((s) => s._id !== id));
      setStatusMsg({ type: "success", text: `Skill "${name}" deleted successfully.` });
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to delete skill." });
    }
  };

  const updateProficiencyInline = async (id: string, newVal: number) => {
    if (newVal < 0 || newVal > 100) return;
    try {
      await apiFetch(`/cms/skills/${id}`, {
        method: "PUT",
        body: JSON.stringify({ proficiency: newVal }),
      });
      setSkills(skills.map((s) => (s._id === id ? { ...s, proficiency: newVal } : s)));
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to update proficiency." });
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

  const groupedSkills = {
    frontend: skills.filter((s) => s.category === "frontend"),
    backend: skills.filter((s) => s.category === "backend"),
    state: skills.filter((s) => s.category === "state"),
    devops: skills.filter((s) => s.category === "devops"),
    other: skills.filter((s) => s.category === "other"),
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white font-sans">
          Technical Skills
        </h1>
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-wider">
          Create, catalog, and modify proficiencies for technical assets
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

      {/* Creation Grid: Single Add vs. Bulk Add */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Single Skill Entry Card */}
        <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Plus className="h-4.5 w-4.5 text-zinc-400" />
            <h2 className="text-xs font-bold font-mono uppercase text-white tracking-wider">
              Single Skill Entry
            </h2>
          </div>

          <form onSubmit={handleAddSingleSkill} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Skill Name</label>
              <input
                type="text"
                placeholder="e.g. Next.js"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg font-mono text-xs text-white outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg font-mono text-xs text-white outline-none cursor-pointer"
                >
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="state">State & Validation</option>
                  <option value="devops">DevOps</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Proficiency ({newProficiency}%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newProficiency}
                  onChange={(e) => setNewProficiency(Number(e.target.value))}
                  className="w-full accent-[#E63925] cursor-pointer py-3"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving || !newName.trim()}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-mono text-xs uppercase tracking-widest font-bold rounded-lg transition-colors disabled:bg-zinc-800 disabled:text-zinc-600 cursor-pointer"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Add Skill ↗</span>}
            </button>
          </form>
        </div>

        {/* Right: Bulk Skills entry */}
        <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Sparkles className="h-4.5 w-4.5 text-zinc-400" />
            <h2 className="text-xs font-bold font-mono uppercase text-white tracking-wider">
              Bulk Fast-Entry System
            </h2>
          </div>

          <form onSubmit={handleAddBulkSkills} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Paste Skill Names (One per line)
              </label>
              <textarea
                rows={3}
                placeholder={"React\nTypeScript\nTailwind\nNext.js"}
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg font-mono text-xs text-white outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Default Category</label>
                <select
                  value={bulkCategory}
                  onChange={(e) => setBulkCategory(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg font-mono text-xs text-white outline-none cursor-pointer"
                >
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="state">State & Validation</option>
                  <option value="devops">DevOps</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  Default Proficiency ({bulkProficiency}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={bulkProficiency}
                  onChange={(e) => setBulkProficiency(Number(e.target.value))}
                  className="w-full accent-[#E63925] cursor-pointer py-3"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving || !bulkInput.trim()}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#E63925] hover:bg-red-600 text-white font-mono text-xs uppercase tracking-widest font-bold rounded-lg transition-colors disabled:bg-zinc-800 disabled:text-zinc-600 cursor-pointer"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Bulk Add Skills ↗</span>}
            </button>
          </form>
        </div>
      </div>

      {/* Skills Grouping categories */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 mb-6">
          <Library className="h-4.5 w-4.5 text-zinc-400" />
          <h2 className="text-xs font-bold font-mono uppercase text-white tracking-wider">
            Active Catalog entries
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {(Object.keys(groupedSkills) as Array<keyof typeof groupedSkills>).map((catName) => {
            const list = groupedSkills[catName];
            return (
              <div key={catName} className="space-y-4">
                <div className="bg-zinc-950 px-3 py-1.5 border border-zinc-850 rounded-lg flex items-center justify-between">
                  <span className="font-mono text-[10px] font-black uppercase tracking-wider text-[#E63925]">
                    {catName}
                  </span>
                  <span className="font-mono text-[9px] text-zinc-500">{list.length} items</span>
                </div>

                <div className="space-y-2">
                  {list.length > 0 ? (
                    list.map((skill) => (
                      <div
                        key={skill._id}
                        className="bg-zinc-950/40 border border-zinc-800/60 rounded-lg p-3 flex flex-col justify-between gap-2 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs text-white uppercase font-bold">{skill.name}</span>
                          <button
                            onClick={() => handleDeleteSkill(skill._id, skill.name)}
                            className="text-zinc-600 hover:text-red-400 transition-colors p-1 cursor-pointer"
                            title="Delete entry"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Slider for inline proficiency adjustments */}
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={skill.proficiency}
                            onChange={(e) => updateProficiencyInline(skill._id, Number(e.target.value))}
                            className="w-full accent-zinc-500 h-1 cursor-pointer"
                          />
                          <span className="font-mono text-[9px] text-zinc-500 shrink-0 w-8 text-right select-none">
                            {skill.proficiency}%
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-2 p-3 text-zinc-600 font-mono text-[9px] uppercase tracking-wider select-none bg-zinc-950/20 border border-zinc-900 border-dashed rounded-lg">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span>Empty category</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
