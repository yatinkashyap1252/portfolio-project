"use client";

import React, { useState, useEffect } from "react";
import { apiFetch } from "../../../utils/api";
import { Loader2, Plus, Trash2, Edit, Save, GraduationCap, X } from "lucide-react";

interface EducationItem {
  _id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  grade?: string;
  displayOrder: number;
}

export default function EducationPage() {
  const [educationList, setEducationList] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [grade, setGrade] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);

  const fetchEducation = async () => {
    try {
      const data = await apiFetch("/cms/education");
      setEducationList(data.sort((a: EducationItem, b: EducationItem) => a.displayOrder - b.displayOrder));
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to load education." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setInstitution("");
    setDegree("");
    setStartDate("");
    setEndDate("");
    setGrade("");
    setDisplayOrder(0);
  };

  const handleEditSelect = (edu: EducationItem) => {
    setEditingId(edu._id);
    setInstitution(edu.institution);
    setDegree(edu.degree);
    setStartDate(edu.startDate);
    setEndDate(edu.endDate);
    setGrade(edu.grade || "");
    setDisplayOrder(edu.displayOrder);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution.trim() || !degree.trim() || !startDate.trim() || !endDate.trim()) {
      setStatusMsg({ type: "error", text: "Please fill in Institution, Degree, Start Date, and End Date fields." });
      return;
    }

    setSaving(true);
    setStatusMsg(null);

    const payload = {
      institution: institution.trim(),
      degree: degree.trim(),
      startDate: startDate.trim(),
      endDate: endDate.trim(),
      grade: grade.trim() || undefined,
      displayOrder: Number(displayOrder),
    };

    try {
      if (editingId) {
        // Edit mode
        const updated = await apiFetch(`/cms/education/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setStatusMsg({ type: "success", text: `Education at "${updated.institution}" updated successfully!` });
      } else {
        // Add mode
        const created = await apiFetch("/cms/education", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setStatusMsg({ type: "success", text: `Education at "${created.institution}" added successfully!` });
      }
      resetForm();
      fetchEducation();
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to save education record." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, inst: string) => {
    if (!confirm(`Are you sure you want to delete the education record for "${inst}"?`)) return;
    setStatusMsg(null);
    try {
      await apiFetch(`/cms/education/${id}`, { method: "DELETE" });
      setStatusMsg({ type: "success", text: `Education record for "${inst}" deleted.` });
      if (editingId === id) resetForm();
      fetchEducation();
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to delete education record." });
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
          Education Records
        </h1>
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-wider">
          Manage academic history, institutional degrees, durations, and grades
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
        {/* Left: Education List cards */}
        <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden self-start">
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4.5 w-4.5 text-zinc-400" />
              <h2 className="text-xs font-bold font-mono uppercase text-white tracking-wider">
                Academic Blocks
              </h2>
            </div>
            <span className="text-[9px] font-mono text-zinc-500 uppercase">
              {educationList.length} records
            </span>
          </div>

          <div className="divide-y divide-zinc-800/60">
            {educationList.length > 0 ? (
              educationList.map((edu) => (
                <div key={edu._id} className="p-6 hover:bg-zinc-800/10 transition-colors space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-sans font-black text-white text-sm uppercase">
                        {edu.degree}
                      </h3>
                      <p className="text-xs font-mono text-[#E63925] uppercase tracking-wider font-semibold">
                        {edu.institution}
                      </p>
                      <p className="text-[10px] font-mono text-zinc-500 mt-1 uppercase">
                        {edu.startDate} – {edu.endDate}
                      </p>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleEditSelect(edu)}
                        className="p-1.5 bg-zinc-950 border border-zinc-850 rounded text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        title="Edit Record"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(edu._id, edu.institution)}
                        className="p-1.5 bg-zinc-950 border border-zinc-850 rounded text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete Record"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {edu.grade && (
                    <div className="bg-zinc-950 border border-zinc-850/50 px-3 py-1.5 rounded-lg inline-flex items-center gap-2">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase">Grade / Performance:</span>
                      <span className="text-xs font-mono font-bold text-white uppercase">{edu.grade}</span>
                    </div>
                  )}

                  {/* Display Order Weight */}
                  <div className="flex justify-end pt-1">
                    <span className="font-mono text-[9px] text-zinc-600 uppercase">
                      Order Weight: {edu.displayOrder}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-zinc-500 font-mono uppercase tracking-widest text-[10px]">
                No academic records in catalog.
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
                {editingId ? "Edit Block" : "Add Block"}
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
            {/* Institution */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Institution Name</label>
              <input
                type="text"
                placeholder="e.g. Stanford University"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg font-mono text-xs text-white outline-none"
              />
            </div>

            {/* Degree */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Degree / Field of Study</label>
              <input
                type="text"
                placeholder="e.g. Bachelor of Science in CS"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg font-mono text-xs text-white outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Start Date */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Start Date</label>
                <input
                  type="text"
                  placeholder="e.g. 2020"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg font-mono text-xs text-white outline-none"
                />
              </div>

              {/* End Date */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">End Date (or Expected)</label>
                <input
                  type="text"
                  placeholder="e.g. 2024"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg font-mono text-xs text-white outline-none"
                />
              </div>
            </div>

            {/* Grade */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Grade / GPA (Optional)</label>
              <input
                type="text"
                placeholder="e.g. GPA 3.9 / 4.0"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
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
                  <span>{editingId ? "Save Block ↗" : "Create Block ↗"}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
