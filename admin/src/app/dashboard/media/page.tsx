"use client";

import React, { useState } from "react";
import { Loader2, Image as ImageIcon, Globe, FileText, Check, AlertCircle } from "lucide-react";

export default function MediaPage() {
  const [testUrl, setTestUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState<boolean | null>(null);

  const handleTestUrl = (url: string) => {
    setTestUrl(url);
    if (!url.trim()) {
      setIsValidUrl(null);
      return;
    }
    // Basic regex validation for URLs
    try {
      new URL(url);
      setIsValidUrl(true);
    } catch (_) {
      setIsValidUrl(false);
    }
  };

  const platforms = [
    {
      name: "Cloudinary",
      description: "Optimized image and video assets management with automated resizing.",
      url: "https://cloudinary.com",
    },
    {
      name: "Imgur / PostImage",
      description: "Free and fast hosting platforms for quick asset uploads.",
      url: "https://postimages.org",
    },
    {
      name: "Vercel Blob / AWS S3",
      description: "Custom object storages to keep total control over static portfolio media.",
      url: "https://vercel.com/storage/blob",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white font-sans">
          Media Library Guide
        </h1>
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-wider">
          Verify asset URLs, explore third-party content delivery networks, and test rendering
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Render Check & preview */}
        <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8 space-y-6 self-start">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <ImageIcon className="h-4.5 w-4.5 text-zinc-400" />
            <h2 className="text-xs font-bold font-mono uppercase text-white tracking-wider">
              Asset Link Tester & Previewer
            </h2>
          </div>

          <p className="text-xs text-zinc-400 font-mono leading-relaxed">
            Since this CMS relies on CDN and remote hosted image URLs (for performance, lightweight builds, and Atlas integration), you can test any image/asset URL here to verify if it resolves and renders without errors.
          </p>

          <div className="space-y-2.5">
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Paste Remote Asset URL</label>
            <div className="relative">
              <input
                type="text"
                placeholder="https://res.cloudinary.com/..."
                value={testUrl}
                onChange={(e) => handleTestUrl(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg font-mono text-xs text-white outline-none"
              />
              {isValidUrl !== null && (
                <div className="absolute right-3 top-3.5">
                  {isValidUrl ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              )}
            </div>
            {isValidUrl === false && (
              <p className="text-[9px] font-mono text-red-500 uppercase">Please enter a valid remote URL starting with http:// or https://</p>
            )}
          </div>

          {/* Rendering Box */}
          {testUrl && isValidUrl && (
            <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-4 flex flex-col items-center justify-center min-h-[200px] relative overflow-hidden group">
              <img
                src={testUrl}
                alt="Remote asset preview"
                className="max-h-60 max-w-full object-contain rounded border border-zinc-800"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                  const fallback = document.getElementById("err-fallback");
                  if (fallback) fallback.style.display = "flex";
                }}
                onLoad={() => {
                  const fallback = document.getElementById("err-fallback");
                  if (fallback) fallback.style.display = "none";
                }}
              />
              {/* Fallback error container */}
              <div
                id="err-fallback"
                style={{ display: "none" }}
                className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600 gap-2 font-mono text-[10px] uppercase select-none"
              >
                <AlertCircle className="h-6 w-6 text-zinc-700" />
                <span>Failed to load asset. Check CORS or URL path.</span>
              </div>
            </div>
          )}

        </div>

        {/* Right: Storage Recommendations */}
        <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8 space-y-6 self-start">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Globe className="h-4.5 w-4.5 text-zinc-400" />
            <h2 className="text-xs font-bold font-mono uppercase text-white tracking-wider">
              Asset Storage Providers
            </h2>
          </div>

          <div className="space-y-4">
            {platforms.map((p) => (
              <div key={p.name} className="bg-zinc-950/60 border border-zinc-850 p-4 rounded-xl space-y-2.5">
                <span className="font-sans font-bold uppercase tracking-tight text-xs text-white block">
                  {p.name}
                </span>
                <p className="text-[10px] font-mono text-zinc-500 leading-relaxed uppercase">
                  {p.description}
                </p>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[9px] font-mono text-[#E63925] uppercase tracking-wider hover:underline"
                >
                  <span>Visit website ↗</span>
                </a>
              </div>
            ))}
          </div>

          <div className="bg-zinc-950/20 border border-zinc-800 border-dashed rounded-xl p-4 flex gap-2.5 items-start font-mono text-[9px] text-zinc-500 uppercase leading-relaxed">
            <FileText className="h-4.5 w-4.5 text-zinc-600 shrink-0 mt-0.5" />
            <span>
              Tip: When pasting image URLs in Projects or Hero sections, make sure they end with extensions like .png, .jpg, .webp, or are standard CDN resolution paths.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
