"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiFetch } from "../../../utils/api";
import { Loader2, Save, FileText, Upload, X, Edit3, Trash2 } from "lucide-react";
import { fileToBase64, compressImage, validateFileSize } from "../../../utils/file";

const fileOrUrlSchema = z.string().refine((val) => {
  if (val === "") return true;
  if (val.startsWith("/") || val.startsWith("data:")) return true;
  try {
    new URL(val);
    return true;
  } catch (_) {
    return false;
  }
}, { message: "Must be a valid URL or uploaded file." });

const aboutSchema = z.object({
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  experienceYears: z.number().min(0, { message: "Experience years must be positive." }),
  location: z.string().min(2, { message: "Location must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  highlightsInput: z.string().min(2, { message: "Highlights must be separated by commas." }),
  signatureUrl: fileOrUrlSchema,
  recruiterMessage: z.string().min(10, { message: "Recruiter message must be at least 10 characters." }),
});

type AboutFormData = z.infer<typeof aboutSchema>;


export default function AboutPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureMode, setSignatureMode] = useState<"draw" | "upload" | "none">("none");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AboutFormData>({
    resolver: zodResolver(aboutSchema),
  });

  const signatureUrl = watch("signatureUrl");

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = "#FFFFFF"; // Drawing white signature on dark bg
    ctx.lineWidth = 3.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  };

  const startDrawingTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const drawTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 3.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    saveCanvasSignature();
  };

  const saveCanvasSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    setValue("signatureUrl", dataUrl);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setValue("signatureUrl", "");
  };

  const handleSignatureFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!validateFileSize(file, 5)) {
      alert("File size exceeds 5MB limit.");
      return;
    }
    try {
      const base64 = await compressImage(file, 600, 300, 0.8);
      setValue("signatureUrl", base64);
    } catch (err) {
      console.error("Error converting file to base64:", err);
    }
  };


  useEffect(() => {
    const loadAbout = async () => {
      try {
        const data = await apiFetch("/cms/about");
        // Seed form values
        setValue("description", data.description || "");
        setValue("experienceYears", data.experienceYears || 0);
        setValue("location", data.location || "");
        setValue("email", data.email || "");
        setValue("signatureUrl", data.signatureUrl || "");
        setValue("recruiterMessage", data.recruiterMessage || "");
        
        // Map arrays to comma separated values
        if (data.highlights && Array.isArray(data.highlights)) {
          setValue("highlightsInput", data.highlights.join(", "));
        } else {
          setValue("highlightsInput", "");
        }
      } catch (err: any) {
        setStatusMsg({ type: "error", text: err.message || "Failed to load About parameters." });
      } finally {
        setLoading(false);
      }
    };
    loadAbout();
  }, [setValue]);

  const onSubmit = async (data: AboutFormData) => {
    setSaving(true);
    setStatusMsg(null);
    try {
      // Split highlights
      const highlights = data.highlightsInput
        .split(",")
        .map((h) => h.trim())
        .filter((h) => h.length > 0);

      const payload = {
        description: data.description,
        experienceYears: data.experienceYears,
        location: data.location,
        email: data.email,
        highlights,
        signatureUrl: data.signatureUrl,
        recruiterMessage: data.recruiterMessage,
      };

      await apiFetch("/cms/about", {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      setStatusMsg({ type: "success", text: "About parameters saved successfully!" });
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to save About parameters." });
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
          About Configuration
        </h1>
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-wider">
          Manage experience summaries, locations, cursive signature, and highlights
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
          {/* Experience Years */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Years of Experience</label>
            <input
              type="number"
              {...register("experienceYears", { valueAsNumber: true })}
              className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white outline-none transition-all
                ${errors.experienceYears ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
              `}
            />
            {errors.experienceYears && <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{errors.experienceYears.message}</p>}
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Location (Address)</label>
            <input
              type="text"
              {...register("location")}
              className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white outline-none transition-all
                ${errors.location ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
              `}
            />
            {errors.location && <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{errors.location.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              {...register("email")}
              className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white outline-none transition-all
                ${errors.email ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
              `}
            />
            {errors.email && <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{errors.email.message}</p>}
          </div>

          {/* Cursive Signature */}
          <div className="space-y-2 col-span-1 md:col-span-2">
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Cursive Signature</label>
            
            <div className="space-y-3">
              {/* Option Tabs */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSignatureMode("draw")}
                  className={`px-3 py-1.5 border rounded font-mono text-[9px] uppercase tracking-wider transition-colors
                    ${signatureMode === "draw" ? "bg-[#E63925] border-[#E63925] text-white" : "bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-white"}
                  `}
                >
                  Draw Signature
                </button>
                <button
                  type="button"
                  onClick={() => setSignatureMode("upload")}
                  className={`px-3 py-1.5 border rounded font-mono text-[9px] uppercase tracking-wider transition-colors
                    ${signatureMode === "upload" ? "bg-[#E63925] border-[#E63925] text-white" : "bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-white"}
                  `}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setSignatureMode("none")}
                  className={`px-3 py-1.5 border rounded font-mono text-[9px] uppercase tracking-wider transition-colors
                    ${signatureMode === "none" ? "bg-[#E63925] border-[#E63925] text-white" : "bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-white"}
                  `}
                >
                  Paste URL / Raw
                </button>
              </div>

              {/* DRAW MODE CANVAS */}
              {signatureMode === "draw" && (
                <div className="space-y-2">
                  <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 flex flex-col items-center">
                    <canvas
                      ref={canvasRef}
                      width={400}
                      height={150}
                      className="bg-zinc-900 border border-dashed border-zinc-800 rounded cursor-crosshair max-w-full"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawingTouch}
                      onTouchMove={drawTouch}
                      onTouchEnd={stopDrawing}
                    />
                    <div className="flex justify-between w-full max-w-[400px] mt-2">
                      <span className="text-[8px] font-mono text-zinc-600 uppercase select-none">// DRAW HERE (WHITE INK)</span>
                      <button
                        type="button"
                        onClick={clearCanvas}
                        className="text-red-500 hover:text-red-400 font-mono text-[9px] uppercase tracking-wider inline-flex items-center gap-1.5"
                      >
                        <Trash2 className="h-3 w-3" />
                        Clear Canvas
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* UPLOAD FILE INPUT */}
              {signatureMode === "upload" && (
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white px-3 py-1.5 rounded font-mono text-[10px] uppercase tracking-wider border border-zinc-700 inline-flex items-center gap-1.5">
                    <Upload className="h-3 w-3" />
                    <span>Upload Signature Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleSignatureFileChange}
                    />
                  </label>
                  {signatureUrl && (
                    <button
                      type="button"
                      onClick={() => setValue("signatureUrl", "")}
                      className="text-red-500 hover:text-red-400 font-mono text-[9px] uppercase tracking-wider flex items-center gap-1"
                    >
                      <X className="h-3 w-3" />
                      Clear Image
                    </button>
                  )}
                </div>
              )}

              {/* RAW URL FIELD (DEFAULT OR FALLBACK) */}
              {signatureMode === "none" && (
                <input
                  type="text"
                  placeholder="Paste URL or base64 data..."
                  {...register("signatureUrl")}
                  className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white outline-none transition-all
                    ${errors.signatureUrl ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
                  `}
                />
              )}

              {/* PREVIEW CONTAINER */}
              {signatureUrl && (
                <div className="space-y-1">
                  <span className="block text-[8px] font-mono text-zinc-600 uppercase">Current Signature Preview</span>
                  <div className="h-16 w-40 rounded border border-zinc-800 bg-zinc-950 flex items-center justify-center p-2 relative">
                    <img
                      src={signatureUrl}
                      alt="Signature preview"
                      className="h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setValue("signatureUrl", "")}
                      className="absolute top-1 right-1 p-0.5 bg-red-950 border border-red-900 rounded text-red-400 hover:text-red-300 transition-colors"
                      title="Clear signature data"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
            {errors.signatureUrl && <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{errors.signatureUrl.message}</p>}
          </div>

        </div>

        {/* Highlights */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Highlights Tags (Comma Separated)</label>
          <input
            type="text"
            placeholder="React Expert, Node Specialist, AWS Certified..."
            {...register("highlightsInput")}
            className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white outline-none transition-all
              ${errors.highlightsInput ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
            `}
          />
          {errors.highlightsInput && <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{errors.highlightsInput.message}</p>}
        </div>

        {/* Biography description */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Biography Description</label>
          <textarea
            rows={5}
            {...register("description")}
            className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white outline-none resize-none transition-all
              ${errors.description ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
            `}
          />
          {errors.description && <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{errors.description.message}</p>}
        </div>

        {/* Recruiter Message */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Recruiter Greeting Message</label>
          <textarea
            rows={3}
            {...register("recruiterMessage")}
            className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg font-mono text-xs text-white outline-none resize-none transition-all
              ${errors.recruiterMessage ? "border-red-900 focus:ring-1 focus:ring-red-900/50" : "border-zinc-800 focus:border-zinc-700"}
            `}
          />
          {errors.recruiterMessage && <p className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{errors.recruiterMessage.message}</p>}
        </div>

        {/* Save button */}
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
              <span>Save Parameters ↗</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
