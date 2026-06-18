"use client";

import React, { useState, useEffect } from "react";
import { apiFetch } from "../../../utils/api";
import { Loader2, Plus, Trash2, Edit, Save, Sparkles, ExternalLink, X, Upload } from "lucide-react";
import { fileToBase64, compressImage, validateFileSize } from "../../../utils/file";

interface ShowcaseItem {
  _id: string;
  type: "certificate" | "blog" | "article" | "extra-curricular" | "highlight";
  title: string;
  subtitle: string;
  content: string[];
  link: string;
  linkLabel: string;
  badgeText: string;
  bgStyle: "white" | "black" | "red" | "dark" | "split";
  imageUrl?: string;
  displayOrder: number;
}

export default function ShowcasePage() {
  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [type, setType] = useState<ShowcaseItem["type"]>("certificate");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [contentText, setContentText] = useState(""); // One per line
  const [link, setLink] = useState("");
  const [linkLabel, setLinkLabel] = useState("");
  const [badgeText, setBadgeText] = useState("");
  const [bgStyle, setBgStyle] = useState<ShowcaseItem["bgStyle"]>("white");
  const [imageUrl, setImageUrl] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);

  const fetchShowcase = async () => {
    try {
      const data = await apiFetch("/cms/showcase");
      setItems(data.sort((a: ShowcaseItem, b: ShowcaseItem) => a.displayOrder - b.displayOrder));
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to load showcase items." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShowcase();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setType("certificate");
    setTitle("");
    setSubtitle("");
    setContentText("");
    setLink("");
    setLinkLabel("");
    setBadgeText("");
    setBgStyle("white");
    setImageUrl("");
    setDisplayOrder(0);
  };

  const handleEditSelect = (item: ShowcaseItem) => {
    setEditingId(item._id);
    setType(item.type);
    setTitle(item.title);
    setSubtitle(item.subtitle);
    setContentText((item.content || []).join("\n"));
    setLink(item.link);
    setLinkLabel(item.linkLabel);
    setBadgeText(item.badgeText);
    setBgStyle(item.bgStyle);
    setImageUrl(item.imageUrl || "");
    setDisplayOrder(item.displayOrder);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!validateFileSize(file, 5)) {
      alert("File size exceeds 5MB limit.");
      return;
    }
    try {
      const base64 = await compressImage(file, 600, 600, 0.85);
      setImageUrl(base64);
    } catch (err) {
      console.error("Error converting file to base64:", err);
    }
  };

  const handleLinkFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!validateFileSize(file, 5)) {
      alert("File size exceeds 5MB limit.");
      return;
    }
    try {
      // PDF or general file base64 conversion
      const base64 = await fileToBase64(file);
      setLink(base64);
      if (!linkLabel) {
        setLinkLabel("Download File");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subtitle.trim() || !link.trim() || !linkLabel.trim() || !badgeText.trim()) {
      setStatusMsg({
        type: "error",
        text: "Please fill in Title, Subtitle, Link, Link Label, and Badge Text fields.",
      });
      return;
    }

    setSaving(true);
    setStatusMsg(null);

    // Split content items by newline and filter out empty lines
    const content = contentText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const payload = {
      type,
      title: title.trim(),
      subtitle: subtitle.trim(),
      content,
      link: link.trim(),
      linkLabel: linkLabel.trim(),
      badgeText: badgeText.trim(),
      bgStyle,
      imageUrl: imageUrl.trim() || undefined,
      displayOrder: Number(displayOrder),
    };

    try {
      if (editingId) {
        // Edit mode
        const updated = await apiFetch(`/cms/showcase/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setStatusMsg({ type: "success", text: `Showcase item "${updated.title}" updated successfully!` });
      } else {
        // Add mode
        const created = await apiFetch("/cms/showcase", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setStatusMsg({ type: "success", text: `Showcase item "${created.title}" added successfully!` });
      }
      resetForm();
      fetchShowcase();
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to save showcase item." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, titleText: string) => {
    if (!confirm(`Are you sure you want to delete "${titleText}"?`)) return;
    setStatusMsg(null);
    try {
      await apiFetch(`/cms/showcase/${id}`, { method: "DELETE" });
      setStatusMsg({ type: "success", text: `Showcase item "${titleText}" deleted.` });
      if (editingId === id) resetForm();
      fetchShowcase();
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to delete showcase item." });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-400 font-mono text-xs gap-3">
        <Loader2 className="animate-spin h-5 w-5 text-[#E63925]" />
        <span>LOADING SHOWCASE ITEMS...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white font-sans flex items-center gap-2">
          <span>Wall of Fame Showcase</span>
        </h1>
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-wider">
          Manage dynamic certificates, publications, blog highlights, and recommendations
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
        {/* Left: Showcase Catalog */}
        <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden self-start">
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-zinc-400" />
              <h2 className="text-xs font-bold font-mono uppercase text-white tracking-wider">
                Showcase Cards Catalog
              </h2>
            </div>
            <span className="text-[9px] font-mono text-zinc-500 uppercase">
              {items.length} records
            </span>
          </div>

          <div className="divide-y divide-zinc-800/60">
            {items.length > 0 ? (
              items.map((item) => (
                <div key={item._id} className="p-6 hover:bg-zinc-800/10 transition-colors space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-zinc-800 border border-zinc-700 text-[8px] font-mono text-zinc-300 rounded uppercase">
                          {item.type}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[8px] font-mono rounded uppercase border
                            ${
                              item.bgStyle === "white"
                                ? "bg-white text-black border-white"
                                : item.bgStyle === "black"
                                ? "bg-black text-white border-zinc-850"
                                : item.bgStyle === "red"
                                ? "bg-red-950 text-red-300 border-red-900"
                                : item.bgStyle === "dark"
                                ? "bg-zinc-950 text-zinc-300 border-zinc-850"
                                : "bg-gradient-to-r from-white to-black text-zinc-100 border-zinc-700"
                            }
                          `}
                        >
                          {item.bgStyle} Style
                        </span>
                      </div>
                      <h3 className="font-sans font-black text-white text-sm uppercase">
                        {item.title}
                      </h3>
                      <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                        {item.subtitle}
                      </p>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleEditSelect(item)}
                        className="p-1.5 bg-zinc-950 border border-zinc-850 rounded text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        title="Edit Entry"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id, item.title)}
                        className="p-1.5 bg-zinc-950 border border-zinc-850 rounded text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete Entry"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {item.content && item.content.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-zinc-400 font-mono text-[10px]">
                      {item.content.map((bullet, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex items-center justify-between gap-4 pt-2">
                    <div className="flex items-center gap-3">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="h-10 w-10 object-contain rounded border border-zinc-800 bg-zinc-950"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      )}
                      
                      <div className="flex flex-col gap-1">
                        <span className="px-2 py-0.5 bg-zinc-950 border border-zinc-850 text-zinc-400 text-[8px] font-mono rounded w-max uppercase">
                          Badge: {item.badgeText}
                        </span>
                        
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#E63925] hover:underline text-[10px] inline-flex items-center gap-1 font-mono uppercase tracking-wider cursor-pointer"
                        >
                          <span>{item.linkLabel}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>

                    <span className="font-mono text-[9px] text-zinc-600 uppercase">
                      Order Weight: {item.displayOrder}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-zinc-500 font-mono uppercase tracking-widest text-[10px]">
                No showcase items in catalog.
              </div>
            )}
          </div>
        </div>

        {/* Right: Form Editor */}
        <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-xl p-6 self-start space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Plus className="h-4.5 w-4.5 text-zinc-400" />
              <h2 className="text-xs font-bold font-mono uppercase text-white tracking-wider">
                {editingId ? "Edit Showcase Item" : "Add Showcase Item"}
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
            {/* Type */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Showcase Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg font-mono text-xs text-white outline-none"
              >
                <option value="certificate">Certificate</option>
                <option value="blog">Blog Publication</option>
                <option value="article">Technical Article</option>
                <option value="extra-curricular">Extra-Curricular / Awards</option>
                <option value="highlight">Wall of Fame Highlight (Recommendation)</option>
              </select>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Card Title</label>
              <input
                type="text"
                placeholder="e.g. Next.js Advanced Developer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg font-mono text-xs text-white outline-none"
              />
            </div>

            {/* Subtitle */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Card Subtitle</label>
              <input
                type="text"
                placeholder="e.g. Vercel Professional Certification"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg font-mono text-xs text-white outline-none"
              />
            </div>

            {/* Content list */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Content Details (One item per line)
              </label>
              <textarea
                rows={4}
                placeholder="Final Score: 97%&#10;Verified Server Components optimization skills.&#10;Credential ID: VRC-9988"
                value={contentText}
                onChange={(e) => setContentText(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg font-mono text-xs text-white outline-none resize-none"
              />
            </div>

            {/* Link & File Selector */}
            <div className="space-y-1.5 font-mono">
              <label className="block text-[10px] text-zinc-500 uppercase tracking-wider">Link URL or PDF File</label>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="https://... or raw base64 data"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg text-xs text-white outline-none"
                />
                <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white px-3 py-1.5 rounded text-[10px] uppercase tracking-wider border border-zinc-700 inline-flex items-center gap-1.5">
                  <Upload className="h-3 w-3" />
                  <span>Upload PDF or File</span>
                  <input
                    type="file"
                    accept=".pdf,image/*,application/json"
                    className="hidden"
                    onChange={handleLinkFileUpload}
                  />
                </label>
              </div>
            </div>

            {/* Link Label */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Link Action Label</label>
              <input
                type="text"
                placeholder="e.g. View Certificate PDF"
                value={linkLabel}
                onChange={(e) => setLinkLabel(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg font-mono text-xs text-white outline-none"
              />
            </div>

            {/* Badge Text */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Badge Label</label>
              <input
                type="text"
                placeholder="e.g. NEXT.JS"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg font-mono text-xs text-white outline-none"
              />
            </div>

            {/* Background Style */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Visual Card Background Theme</label>
              <select
                value={bgStyle}
                onChange={(e) => setBgStyle(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg font-mono text-xs text-white outline-none"
              >
                <option value="white">White card, dark text</option>
                <option value="black">Pure black card, white border</option>
                <option value="red">Vibrant Red theme card</option>
                <option value="dark">Stealth charcoal dark theme</option>
                <option value="split">Split color visual accent</option>
              </select>
            </div>

            {/* Image Upload for Badge/Card */}
            <div className="space-y-1.5 font-mono">
              <label className="block text-[10px] text-zinc-500 uppercase tracking-wider">Visual Badge Image</label>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="https://... or base64 data"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg text-xs text-white outline-none"
                />
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white px-3 py-1.5 rounded text-[10px] uppercase tracking-wider border border-zinc-700 inline-flex items-center gap-1.5">
                    <Upload className="h-3 w-3" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => setImageUrl("")}
                      className="text-red-500 hover:text-red-400 text-[9px] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                      Clear Image
                    </button>
                  )}
                </div>
                {imageUrl && (
                  <div className="relative h-20 w-32 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center justify-center">
                    <img
                      src={imageUrl}
                      alt="Showcase preview"
                      className="h-full w-full object-contain p-1"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>
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
                  <span>{editingId ? "Save Changes ↗" : "Create Showcase Item ↗"}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
