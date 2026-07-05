import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black flex flex-col justify-center items-center px-6 relative text-white">
      {/* Background grid representation */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-20" />

      <div className="w-full max-w-lg border border-zinc-800 bg-[#0F0F0F] p-8 md:p-12 relative rounded-2xl shadow-2xl z-10 text-center space-y-6">
        {/* Decorative elements */}
        <div className="flex gap-1.5 items-center justify-center select-none">
          <div className="w-2.5 h-2.5 rounded-full bg-[#E63925]" />
          <div className="w-20 h-[1px] bg-zinc-800" />
          <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">// SYSTEM ERROR</span>
          <div className="w-20 h-[1px] bg-zinc-800" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#E63925]" />
        </div>

        <div className="space-y-3">
          <h1 className="text-5xl md:text-6xl font-sans font-black tracking-tight text-[#E63925] uppercase leading-none">
            404
          </h1>
          <h2 className="font-sans font-extrabold text-lg md:text-xl uppercase tracking-wider text-zinc-100">
            Page Not Found
          </h2>
          <p className="font-mono text-[11px] text-zinc-500 uppercase tracking-wider">
            // ERROR_CODE: 0x404_ROUTE_MISMATCH
          </p>
        </div>

        <div className="h-[1px] bg-zinc-900 w-full" />

        <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-light font-sans max-w-sm mx-auto">
          The requested URL path does not exist in Yatin's portfolio environment. Please verify the URL or return to the main console.
        </p>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-mono text-xs uppercase tracking-widest font-bold rounded-lg hover:bg-[#E63925] hover:text-white transition-colors duration-300 shadow-lg"
          >
            Return to Console ↗
          </Link>
        </div>
      </div>
    </main>
  );
}
