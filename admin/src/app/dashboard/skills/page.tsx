"use client";

import React, { useState, useEffect } from "react";

import { apiFetch } from "../../../utils/api";
import { Loader2, Plus, Trash2, Library, Sparkles, AlertCircle, Edit, Save, X } from "lucide-react";

interface SkillItem {
  _id: string;
  name: string;
  category: string;
  proficiency: number;
}

interface SkillCategoryItem {
  _id: string;
  id: string;
  title: string;
  metric: string;
  description: string;
  visualizerType: "wave" | "matrix" | "nodes" | "gauge";
  displayOrder: number;
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [categories, setCategories] = useState<SkillCategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Single Skill Form state
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("frontend");
  const [newProficiency, setNewProficiency] = useState(80);

  // Bulk Skills Form state
  const [bulkInput, setBulkInput] = useState("");
  const [bulkCategory, setBulkCategory] = useState("frontend");
  const [bulkProficiency, setBulkProficiency] = useState(80);

  // Skill Category Form State
  const [catEditingId, setCatEditingId] = useState<string | null>(null);
  const [catId, setCatId] = useState("");
  const [catTitle, setCatTitle] = useState("");
  const [catMetric, setCatMetric] = useState("");
  const [catDescription, setCatDescription] = useState("");
  const [catVisualizer, setCatVisualizer] = useState<"wave" | "matrix" | "nodes" | "gauge">("wave");
  const [catDisplayOrder, setCatDisplayOrder] = useState(0);

  const fetchSkillsAndCategories = async () => {
    try {
      const [skillsData, categoriesData] = await Promise.all([
        apiFetch("/cms/skills"),
        apiFetch("/cms/categories"),
      ]);
      setSkills(skillsData);
      setCategories(categoriesData);
      if (categoriesData.length > 0) {
        setNewCategory(categoriesData[0].id);
        setBulkCategory(categoriesData[0].id);
      }
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to fetch skills and categories." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillsAndCategories();
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
      fetchSkillsAndCategories(); // Reload full list
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

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catId.trim() || !catTitle.trim() || !catMetric.trim() || !catDescription.trim()) {
      setStatusMsg({ type: "error", text: "Please fill in all category fields." });
      return;
    }
    setSaving(true);
    setStatusMsg(null);

    const payload = {
      id: catId.trim().toLowerCase(),
      title: catTitle.trim(),
      metric: catMetric.trim(),
      description: catDescription.trim(),
      visualizerType: catVisualizer,
      displayOrder: Number(catDisplayOrder),
    };

    try {
      if (catEditingId) {
        const updated = await apiFetch(`/cms/categories/${catEditingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setCategories(categories.map((c) => (c._id === catEditingId ? updated : c)));
        setStatusMsg({ type: "success", text: `Category "${updated.title}" updated successfully.` });
      } else {
        const created = await apiFetch("/cms/categories", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setCategories([...categories, created]);
        setStatusMsg({ type: "success", text: `Category "${created.title}" added successfully.` });
      }
      resetCategoryForm();
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to save skill category." });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the category "${title}"? This will not delete the skills under it, but they will be grouped under 'other'.`)) return;
    setStatusMsg(null);
    try {
      await apiFetch(`/cms/categories/${id}`, { method: "DELETE" });
      setCategories(categories.filter((c) => c._id !== id));
      setStatusMsg({ type: "success", text: `Category "${title}" deleted.` });
      if (catEditingId === id) resetCategoryForm();
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to delete category." });
    }
  };

  const resetCategoryForm = () => {
    setCatEditingId(null);
    setCatId("");
    setCatTitle("");
    setCatMetric("");
    setCatDescription("");
    setCatVisualizer("wave");
    setCatDisplayOrder(0);
  };

  const selectCategoryForEdit = (cat: SkillCategoryItem) => {
    setCatEditingId(cat._id);
    setCatId(cat.id);
    setCatTitle(cat.title);
    setCatMetric(cat.metric);
    setCatDescription(cat.description);
    setCatVisualizer(cat.visualizerType);
    setCatDisplayOrder(cat.displayOrder);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-400 font-mono text-xs gap-3">
        <Loader2 className="animate-spin h-5 w-5 text-[#E63925]" />
        <span>LOADING CONFIGS...</span>
      </div>
    );
  }

  const groupedSkills: Record<string, SkillItem[]> = {};
  
  // Initialize lists for each category
  categories.forEach((cat) => {
    groupedSkills[cat.id] = [];
  });
  groupedSkills["other"] = [];

  // Group skills into categories
  skills.forEach((skill) => {
    const catId = skill.category || "other";
    if (groupedSkills[catId] !== undefined) {
      groupedSkills[catId].push(skill);
    } else {
      groupedSkills["other"].push(skill);
    }
  });

  // Remove other category if it is empty to keep catalog clean
  if (groupedSkills["other"].length === 0) {
    delete groupedSkills["other"];
  }

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
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg font-mono text-xs text-white outline-none cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.title}</option>
                  ))}
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
                  onChange={(e) => setBulkCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg font-mono text-xs text-white outline-none cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.title}</option>
                  ))}
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
          {Object.keys(groupedSkills).map((catName) => {
            const list = groupedSkills[catName];
            const catItem = categories.find((c) => c.id === catName);
            const titleText = catItem ? catItem.title : (catName === "other" ? "Other Skills" : catName.toUpperCase());

            return (
              <div key={catName} className="space-y-4">
                <div className="bg-zinc-950 px-3 py-1.5 border border-zinc-850 rounded-lg flex items-center justify-between">
                  <span className="font-mono text-[10px] font-black uppercase tracking-wider text-[#E63925] truncate max-w-[150px]">
                    {titleText}
                  </span>
                  <span className="font-mono text-[9px] text-zinc-500 shrink-0">{list?.length || 0} items</span>
                </div>

                <div className="space-y-2">
                  {list && list.length > 0 ? (
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
                            max="100; "
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

      {/* Skills Categories Manager Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 mb-6">
          <Library className="h-4.5 w-4.5 text-zinc-400" />
          <h2 className="text-xs font-bold font-mono uppercase text-white tracking-wider">
            Skills Categories Manager
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Categories Catalog */}
          <div className="lg:col-span-7 bg-zinc-950 border border-zinc-850 rounded-xl divide-y divide-zinc-850 self-start">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <div key={cat._id} className="p-4 hover:bg-zinc-900/40 transition-colors flex justify-between items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-sans font-bold text-xs text-white uppercase">{cat.title}</span>
                      <span className="font-mono text-[8px] bg-zinc-800 border border-zinc-700 text-zinc-400 px-1.5 py-0.5 rounded uppercase">
                        {cat.id}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wide">
                      Metric: {cat.metric} | Visualizer: {cat.visualizerType}
                    </p>
                    <p className="text-[10px] text-zinc-400 font-light truncate max-w-sm">
                      {cat.description}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => selectCategoryForEdit(cat)}
                      className="p-1.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      title="Edit Category"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat._id, cat.title)}
                      className="p-1.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-zinc-500 font-mono uppercase tracking-widest text-[9px]">
                No custom categories configured.
              </div>
            )}
          </div>

          {/* Right: Category Editor Form */}
          <div className="lg:col-span-5 bg-zinc-950 border border-zinc-850 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
              <span className="text-[10px] font-bold font-mono text-white uppercase tracking-wider">
                {catEditingId ? "Edit Skill Category" : "Add Skill Category"}
              </span>
              {catEditingId && (
                <button
                  onClick={resetCategoryForm}
                  className="text-zinc-500 hover:text-white flex items-center gap-1 font-mono text-[8px] uppercase cursor-pointer"
                >
                  <X className="h-3 w-3" />
                  <span>Cancel</span>
                </button>
              )}
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[8px] font-mono text-zinc-500 uppercase tracking-wider">Category Key (ID)</label>
                  <input
                    type="text"
                    placeholder="e.g. mobile"
                    value={catId}
                    onChange={(e) => setCatId(e.target.value)}
                    disabled={!!catEditingId}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-850 focus:border-zinc-700 rounded-lg font-mono text-xs text-white outline-none disabled:opacity-50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[8px] font-mono text-zinc-500 uppercase tracking-wider">Category Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Mobile Apps"
                    value={catTitle}
                    onChange={(e) => setCatTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-850 focus:border-zinc-700 rounded-lg font-mono text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[8px] font-mono text-zinc-500 uppercase tracking-wider">Category Metric Title</label>
                <input
                  type="text"
                  placeholder="e.g. 90% Native Performance"
                  value={catMetric}
                  onChange={(e) => setCatMetric(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-850 focus:border-zinc-700 rounded-lg font-mono text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[8px] font-mono text-zinc-500 uppercase tracking-wider">Visualizer Style</label>
                <select
                  value={catVisualizer}
                  onChange={(e) => setCatVisualizer(e.target.value as any)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-850 focus:border-zinc-700 rounded-lg font-mono text-xs text-white outline-none cursor-pointer"
                >
                  <option value="wave">Wave (Sine Radar waves)</option>
                  <option value="matrix">Matrix (Dot-matrix Line Graph)</option>
                  <option value="nodes">Nodes (Interactive Network Mesh)</option>
                  <option value="gauge">Gauge (Speedometer Dial)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[8px] font-mono text-zinc-500 uppercase tracking-wider">Display Order Weight</label>
                <input
                  type="number"
                  placeholder="0"
                  value={catDisplayOrder}
                  onChange={(e) => setCatDisplayOrder(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-850 focus:border-zinc-700 rounded-lg font-mono text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[8px] font-mono text-zinc-500 uppercase tracking-wider">Description</label>
                <textarea
                  rows={2}
                  placeholder="Summarize expertise in this area..."
                  value={catDescription}
                  onChange={(e) => setCatDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-850 focus:border-zinc-700 rounded-lg font-mono text-xs text-white outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-1.5 py-2 bg-[#E63925] hover:bg-red-600 text-white font-mono text-xs uppercase tracking-widest font-bold rounded-lg transition-colors disabled:bg-zinc-850 disabled:text-zinc-600 cursor-pointer"
              >
                {saving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" />
                    <span>{catEditingId ? "Save Category ↗" : "Add Category ↗"}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

