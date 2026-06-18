"use client";

import React, { useState, useEffect } from "react";
import { apiFetch } from "../../../utils/api";
import { Loader2, Plus, Trash2, Edit, Save, Award, ExternalLink, X, Upload } from "lucide-react";
import { fileToBase64, compressImage, validateFileSize } from "../../../utils/file";

interface CertificateItem {
  _id: string;
  name: string;
  issuer: string;
  date: string;
  credentialUrl: string;
  imageUrl?: string;
  displayOrder: number;
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [issuer, setIssuer] = useState("");
  const [date, setDate] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!validateFileSize(file, 5)) {
      alert("File size exceeds 5MB limit.");
      return;
    }
    try {
      const base64 = await compressImage(file, 400, 400, 0.85);
      setImageUrl(base64);
    } catch (err) {
      console.error("Error converting file to base64:", err);
    }
  };

  const handleCredentialFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!validateFileSize(file, 5)) {
      alert("File size exceeds 5MB limit.");
      return;
    }
    try {
      const base64 = await fileToBase64(file);
      setCredentialUrl(base64);
    } catch (err) {
      console.error("Error converting file to base64:", err);
    }
  };

  const fetchCertificates = async () => {
    try {
      const data = await apiFetch("/cms/certificates");
      setCertificates(data.sort((a: CertificateItem, b: CertificateItem) => a.displayOrder - b.displayOrder));
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to load certificates." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setIssuer("");
    setDate("");
    setCredentialUrl("");
    setImageUrl("");
    setDisplayOrder(0);
  };

  const handleEditSelect = (cert: CertificateItem) => {
    setEditingId(cert._id);
    setName(cert.name);
    setIssuer(cert.issuer);
    setDate(cert.date);
    setCredentialUrl(cert.credentialUrl);
    setImageUrl(cert.imageUrl || "");
    setDisplayOrder(cert.displayOrder);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !issuer.trim() || !date.trim() || !credentialUrl.trim()) {
      setStatusMsg({ type: "error", text: "Please fill in Certificate Name, Issuer, Date, and Credential URL fields." });
      return;
    }

    setSaving(true);
    setStatusMsg(null);

    const payload = {
      name: name.trim(),
      issuer: issuer.trim(),
      date: date.trim(),
      credentialUrl: credentialUrl.trim(),
      imageUrl: imageUrl.trim() || undefined,
      displayOrder: Number(displayOrder),
    };

    try {
      if (editingId) {
        // Edit mode
        const updated = await apiFetch(`/cms/certificates/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setStatusMsg({ type: "success", text: `Certificate "${updated.name}" updated successfully!` });
      } else {
        // Add mode
        const created = await apiFetch("/cms/certificates", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setStatusMsg({ type: "success", text: `Certificate "${created.name}" added successfully!` });
      }
      resetForm();
      fetchCertificates();
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to save certificate record." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, nameText: string) => {
    if (!confirm(`Are you sure you want to delete the certificate "${nameText}"?`)) return;
    setStatusMsg(null);
    try {
      await apiFetch(`/cms/certificates/${id}`, { method: "DELETE" });
      setStatusMsg({ type: "success", text: `Certificate "${nameText}" deleted.` });
      if (editingId === id) resetForm();
      fetchCertificates();
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to delete certificate." });
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
          Certificates & Credentials
        </h1>
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-wider">
          Manage professional validations, certification links, and credentials
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
        {/* Left: Certificate Cards */}
        <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden self-start">
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-4.5 w-4.5 text-zinc-400" />
              <h2 className="text-xs font-bold font-mono uppercase text-white tracking-wider">
                Credential Catalog
              </h2>
            </div>
            <span className="text-[9px] font-mono text-zinc-500 uppercase">
              {certificates.length} records
            </span>
          </div>

          <div className="divide-y divide-zinc-800/60">
            {certificates.length > 0 ? (
              certificates.map((cert) => (
                <div key={cert._id} className="p-6 hover:bg-zinc-800/10 transition-colors space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-sans font-black text-white text-sm uppercase">
                        {cert.name}
                      </h3>
                      <p className="text-xs font-mono text-[#E63925] uppercase tracking-wider font-semibold">
                        {cert.issuer}
                      </p>
                      <p className="text-[10px] font-mono text-zinc-500 mt-1 uppercase">
                        Issued: {cert.date}
                      </p>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleEditSelect(cert)}
                        className="p-1.5 bg-zinc-950 border border-zinc-850 rounded text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        title="Edit Entry"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cert._id, cert.name)}
                        className="p-1.5 bg-zinc-950 border border-zinc-850 rounded text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete Entry"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {cert.imageUrl && (
                      <img
                        src={cert.imageUrl}
                        alt={cert.name}
                        className="h-10 w-10 object-contain rounded border border-zinc-800 bg-zinc-950"
                        onError={(e) => {
                          // Hide image if fails to load
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    )}

                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 text-[10px] text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 font-mono uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <span>Verification Link</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  {/* Display Order Weight */}
                  <div className="flex justify-end pt-1">
                    <span className="font-mono text-[9px] text-zinc-600 uppercase">
                      Order Weight: {cert.displayOrder}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-zinc-500 font-mono uppercase tracking-widest text-[10px]">
                No certificates in catalog.
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
                {editingId ? "Edit Credential" : "Add Credential"}
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
            {/* Certificate Name */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Certificate Name</label>
              <input
                type="text"
                placeholder="e.g. AWS Certified Solutions Architect"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg font-mono text-xs text-white outline-none"
              />
            </div>

            {/* Issuer */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Issuer / Authority</label>
              <input
                type="text"
                placeholder="e.g. Amazon Web Services"
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg font-mono text-xs text-white outline-none"
              />
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Issue Date</label>
              <input
                type="text"
                placeholder="e.g. May 2024"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg font-mono text-xs text-white outline-none"
              />
            </div>

            {/* Credential URL */}
            <div className="space-y-1.5 font-mono">
              <label className="block text-[10px] text-zinc-500 uppercase tracking-wider">Credential Verification URL / File</label>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="https://... or raw base64 data"
                  value={credentialUrl}
                  onChange={(e) => setCredentialUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg text-xs text-white outline-none"
                />
                <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white px-3 py-1.5 rounded text-[10px] uppercase tracking-wider border border-zinc-700 inline-flex items-center gap-1.5">
                  <Upload className="h-3 w-3" />
                  <span>Upload PDF or Image</span>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    className="hidden"
                    onChange={handleCredentialFileUpload}
                  />
                </label>
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-1.5 font-mono">
              <label className="block text-[10px] text-zinc-500 uppercase tracking-wider">Badge Image URL / Upload (Optional)</label>
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
                    <span>Upload from Gallery</span>
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
                      alt="Badge preview"
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
                  <span>{editingId ? "Save Credential ↗" : "Create Credential ↗"}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
